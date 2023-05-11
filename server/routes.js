const express = require("express");
const app = express.Router();
const User = require("./models/User");
const Responder = require("./models/Responder");
const History = require("./models/History");
let { userWs, responderWs } = require("./store");
const { makeid, distance } = require("./utils");
const logger = require("./logger");
const fs = require("fs");

app.post("/user/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ msg: "ok" });
  } catch (error) {
    res.status(500).json({ error: `${error.name} - ${error.message}` });
  }
});

app.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) return res.status(404).json({ error: "User not found" });

    if (req.body.password !== user.password)
      return res.status(401).json({ error: "Incorret Password" });

    res.json({ msg: "ok", user });
  } catch (error) {
    res.status(500).json({ error: `${error.name} - ${error.message}` });
  }
});

app.get("/user/history", async (req, res) => {
  try {
    const history = await History.find({ userId: req.query._id })
      .sort("-addedAt")
      .populate("responderId");
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: `${error.name} - ${error.message}` });
  }
});

app.post("/user/changePassword", async (req, res) => {
  try {
    const user = await User.findById(req.body._id);

    if (req.body.oldPassword !== user.password)
      return res.status(401).json({ error: "Incorret Password" });

    await User.findByIdAndUpdate(
      { _id: req.body._id },
      { password: req.body.newPassword }
    );

    res.json({ msg: "ok" });
  } catch (error) {
    res.status(500).json({ error: `${error.name} - ${error.message}` });
  }
});

app.get("/user/sosButton", async (req, res) => {
  try {
    const userId = req.query._id;

    logger.info("sos button pressed! userId:", userId);

    if (userId in userWs) {
      logger.info("user ws found! userId:", userId);
      const myWs1 = userWs[userId];
      myWs1.send("btn-pressed");
    }

    res.send("ok");
  } catch (error) {
    res.status(500).json({ error: `${error.name} - ${error.message}` });
  }
});

//------------------------------------

app.post("/responder/signup", async (req, res) => {
  try {
    const { photoidImg, aadharImg, licenseImg } = req.files;

    const dt = Date.now();
    photoidImg.mv(
      __dirname + "/uploads/" + dt + "-photoid-" + photoidImg.name,
      (err) => {
        if (err) {
          throw err;
        }
      }
    );

    licenseImg.mv(
      __dirname + "/uploads/" + dt + "-license-" + licenseImg.name,
      (err) => {
        if (err) {
          throw err;
        }
      }
    );

    aadharImg.mv(
      __dirname + "/uploads/" + dt + "-aadhar-" + aadharImg.name,
      (err) => {
        if (err) {
          throw err;
        }
      }
    );

    const responder = new Responder({
      ...req.body,
      photoidImg: dt + "-photoid-" + photoidImg.name,
      licenseImg: dt + "-license-" + licenseImg.name,
      aadharImg: dt + "-aadhar-" + aadharImg.name,
    });

    await responder.save();
    res.json({ msg: "ok" });
  } catch (error) {
    res.status(500).json({ error: `${error.name} - ${error.message}` });
  }
});

// app.get("/admin-page", async (req, res) => {
//   fs.readFile(__dirname + "/public/admin-page.html", "utf8", (err, text) => {
//     res.send(text);
//   });
// });

app.post("/responder/login", async (req, res) => {
  try {
    const responder = await Responder.findOne({ username: req.body.username });

    if (!responder)
      return res.status(404).json({ error: "responder not found" });

    if (req.body.password !== responder.password)
      return res.status(401).json({ error: "Incorret Password" });

    res.json({ msg: "ok", responder });
  } catch (error) {
    res.status(500).json({ error: `${error.name} - ${error.message}` });
  }
});

app.get("/responder-list", async (req, res) => {
  try {
    const responders = await Responder.find({}).select("-password");
    res.json(responders);
  } catch (error) {
    res.status(500).json({ error: `${error.name} - ${error.message}` });
  }
});

app.get("/responder/history", async (req, res) => {
  try {
    const history = await History.find({ responderId: req.query._id })
      .sort("-addedAt")
      .populate("userId");

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: `${error.name} - ${error.message}` });
  }
});

app.post("/responder/changePassword", async (req, res) => {
  try {
    const responder = await Responder.findById(req.body._id);

    if (req.body.oldPassword !== responder.password)
      return res.status(401).json({ error: "Incorret Password" });

    await Responder.findByIdAndUpdate(
      { _id: req.body._id },
      { password: req.body.newPassword }
    );

    res.json({ msg: "ok" });
  } catch (error) {
    res.status(500).json({ error: `${error.name} - ${error.message}` });
  }
});

// -----------------------------

app.ws("/user/dashboard", (ws, req) => {
  const userId = req.query._id;

  logger.debug("user ws connected!", userId);

  if (userId in userWs) {
    delete userWs[userId];
  }

  userWs[userId] = ws;

  ws.on("close", () => {
    delete userWs[userId];
    logger.debug("user ws disconnected!", userId);
  });

  ws.on("message", async (msg) => {
    try {
      if (msg.startsWith("sendSos")) {
        logger.debug("EMERGENCY called! userId:", userId);

        console.log(Object.keys(responderWs));

        const [userLat, userLon] = msg.split("$")[1].split(",");

        let reponderIdForDb = null;

        if (!Object.keys(responderWs).length) {
          ws.send("responder-not-available");
        } else if (Object.keys(responderWs).length === 1) {
          let [firstResponderId, firstResponderWs] =
            Object.entries(responderWs)[0];

          reponderIdForDb = firstResponderId;

          User.findById(userId).then((userFromDB) => {
            firstResponderWs.send(
              JSON.stringify({
                type: "emergency",
                userLatLon: msg.split("$")[1],
                userFromDB,
              })
            );
          });

          Responder.findById(reponderIdForDb).then((responderFromDb) => {
            // this is user WS
            ws.send(
              `responder-notified^${JSON.stringify({
                responderLatLon: firstResponderWs.myLoc,
                responderFromDb,
              })}`
            );
          });
        } else {
          let [closestResponderId, closestResponderWs] =
            Object.entries(responderWs)[0];

          reponderIdForDb = closestResponderId;

          let [_tmp_lat, _tmp_lon] = closestResponderWs.myLoc.split(",");

          let closestResponderDistance = distance(
            { latitude: userLat, longitude: userLon },
            { latitude: _tmp_lat, longitude: _tmp_lon }
          );

          for (const [__responderId, __responderWs] of Object.entries(
            responderWs
          )) {
            const [resLat, resLon] = __responderWs.myLoc.split(",");

            const computed_distance = distance(
              { latitude: userLat, longitude: userLon },
              { latitude: resLat, longitude: resLon }
            );

            logger.debug(
              ` ${__responderId} \t ${computed_distance} \t ${closestResponderDistance})`
            );

            logger.debug(`-----`);

            if (computed_distance < closestResponderDistance) {
              console.log(
                "closest responder changed!",
                computed_distance,
                closestResponderDistance,
                "this:",
                __responderId
              );
              closestResponderId = __responderId;
              closestResponderWs = __responderWs;

              reponderIdForDb = __responderId;

              closestResponderDistance = computed_distance;
            }
          }

          User.findById(userId).then((userFromDB) => {
            closestResponderWs.send(
              JSON.stringify({
                type: "emergency",
                userLatLon: msg.split("$")[1],
                userFromDB,
              })
            );
          });

          Responder.findById(reponderIdForDb).then((responderFromDb) => {
            // this is user ws
            ws.send(
              `responder-notified^${JSON.stringify({
                responderLatLon: closestResponderWs.myLoc,
                responderFromDb,
              })}`
            );
          });
        }

        const history = new History({
          userId: userId,
          responderId: reponderIdForDb,
          accidentLocation: msg.split("$")[1],
        });
        history.save();

        // call responder here
      }
    } catch (error) {
      logger.error(error);
    }
  });
});

app.ws("/responder/dashboard", (ws, req) => {
  const responderId = req.query._id;

  logger.debug("responder ws connected!", responderId);
  ws.myLoc = "0,0";

  if (responderId in responderWs) {
    delete responderWs[responderId];
  }
  responderWs[responderId] = ws;

  ws.on("close", () => {
    logger.debug("responder ws disconnected!", responderId);
    delete responderWs[responderId];
  });

  ws.on("message", (msg) => {
    try {
      if (msg.startsWith("myLoc")) {
        const latlon = msg.split("$")[1];
        if (latlon.startsWith("null")) return;

        responderWs[responderId].myLoc = latlon;

        // logger.debug(`responder location updated! ${latlon}`);
      }
    } catch (error) {
      logger.error(error);
    }
  });
});

module.exports = app;
