import React from "react";
import { View, Text, Alert, Linking } from "react-native";
import * as Location from "expo-location";
import { Button, Overlay } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import MapView from "./MapView";
import { APP_SESSION, WS_URL, showAlert } from "../../utils";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SMS from "expo-sms";

let sosLoop = null;
let isTriggered = false;
let getLocLoop = null;

const TIME = 10;

export default function DashScreen() {
  const focus = useIsFocused();
  const wsRef = React.useRef(null);

  const appState = React.useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = React.useState(
    appState.current
  );

  const [location, setLocation] = React.useState({
    lat: null,
    lon: null,
  });

  const [sos, setSos] = React.useState({
    triggered: false,
    timeLeft: 0,
  });

  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        startWs();
        console.log("App has come to the foreground!");
      }

      if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        stopWs();
        console.log("App going background");
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      // console.log("AppState1", appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  React.useEffect(() => {
    isTriggered = sos.triggered;
  }, [sos.triggered]);

  const getPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setIsGranted(false);
      Alert.alert("Error", "Please give location permission", [
        {
          text: "OK",
          onPress: () => {},
          style: "cancel",
        },
      ]);
    }
  };

  const sendTheSms = async () => {
    const number1 = await AsyncStorage.getItem("number1");
    const number2 = await AsyncStorage.getItem("number2");
    const number3 = await AsyncStorage.getItem("number3");
    const myArr = [];
    if (number1) {
      myArr.push(number1);
    }
    if (number2) {
      myArr.push(number2);
    }
    if (number3) {
      myArr.push(number3);
    }
    if (myArr.length) {
      console.log("sending sms to: ", myArr);
      await SMS.sendSMSAsync(
        myArr,
        `SOS Alert! Emergancy Requested. My location is: https://maps.google.com/?q=${location.lat},${location.lon}`
      );
    }
  };

  const getLocation = async () => {
    Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      enableHighAccuracy: true,
      timeInterval: 5,
    }).then((location) => {
      console.log("location: ", location);
      setLocation({
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      });
    });
  };

  const startWs = () => {
    wsRef.current = new WebSocket(WS_URL + APP_SESSION._id);
    wsRef.current.onmessage = (message) => {
      console.log("DATA R:", message.data);
      if (message.data == "btn-pressed" && !isTriggered) {
        console.log("here 11111");
        triggerSos();
      } else {
        console.log(message);

        if (message.data.startsWith("responder-not-available")) {
          return showAlert("ALERT", "No Responder is available at the moment.");
        } else if (message.data.startsWith("responder-notified")) {
          const myMsg = message.data.split("^");

          const msgJson = JSON.parse(myMsg[1]);

          Alert.alert(
            "ALERT",
            `The Responder is on the way.\n\nPlease stay calm and wait for the Responder to arrive. 
              \n\nName: ${msgJson.responderFromDb.fullname}
              \nVehicle No: ${msgJson.responderFromDb.vehicleNo}
              \nPhone No: ${msgJson.responderFromDb.phoneNo}
        `,
            [
              {
                text: "View Responder Location",
                onPress: () =>
                  Linking.openURL(
                    `https://maps.google.com/?q=${msgJson.responderLatLon}`
                  ).catch(console.log),
              },
              { text: "Close", onPress: () => {} },
            ]
          );
        }
      }
    };
  };
  const stopWs = () => {
    wsRef.current.close();
  };

  const sendSos = () => {
    console.log(`sendSos$${location.lat},${location.lon}`);
    wsRef.current.send(`sendSos$${location.lat},${location.lon}`);
    console.log("Hi");
    sendTheSms();
    // call api here to send sos
  };

  const triggerSos = () => {
    console.log("triggering sos");
    setSos({
      triggered: true,
      timeLeft: TIME,
    });

    let time = TIME;

    sosLoop = setInterval(() => {
      if (isTriggered) {
        setSos({
          triggered: true,
          timeLeft: time,
        });
        time -= 1;

        if (time == -1) {
          clearInterval(sosLoop);
          setSos({
            triggered: false,
            timeLeft: 0,
          });

          sendSos();
        }
      } else {
      }
    }, 1000);
  };

  const cancelSos = () => {
    console.log("canceling sos");
    clearInterval(sosLoop);
    sosLoop = null;
    setSos({
      triggered: false,
      timeLeft: 0,
    });
  };

  React.useEffect(() => {
    getPermission();

    if (focus) {
      console.log("starting interval");
      startWs();
      getLocation();
      getLocLoop = setInterval(() => getLocation(), 5000);
    } else {
      console.log("clearing interval");
      stopWs();
      clearInterval(getLocLoop);
    }
  }, [focus]);

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <SafeAreaView style={{ height: "100%", flex: 1, paddingTop: -35 }}>
        <View style={{ flex: 1, height: "100%" }}>
          {location.lat == null ? (
            <Text style={{ textAlign: "center" }}>Loading...</Text>
          ) : (
            <Text style={{ textAlign: "center" }}>
              Lat: {location.lat} | Lon: {location.lon}
            </Text>
          )}

          <Overlay isVisible={sos.triggered}>
            <View style={{ paddingVertical: 25, paddingHorizontal: 50 }}>
              <Text
                style={{
                  color: "red",
                  fontSize: 25,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                WARNING!!
              </Text>

              <Text
                style={{
                  color: "#34495E",
                  fontSize: 20,
                  marginTop: 5,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                SOS is Triggered
              </Text>

              <Text
                style={{
                  color: "#5D6D7E",
                  fontSize: 20,
                  marginVertical: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Time Left: {sos.timeLeft} Sec
              </Text>

              <Text
                style={{
                  color: "#566573",
                  fontSize: 15,
                  marginTop: 5,
                  marginBottom: 5,
                  textAlign: "center",
                }}
              >
                Press 'CANCEL' to Abort the SOS
              </Text>

              <Button
                size="lg"
                titleStyle={{ fontSize: 22 }}
                buttonStyle={{
                  backgroundColor: "#E74C3C",
                }}
                onPress={() => cancelSos()}
              >
                CANCEL
              </Button>
            </View>
          </Overlay>

          <MapView location={location} />
        </View>
        <View style={{ height: 55 }}>
          <Button
            size="lg"
            titleStyle={{ fontSize: 22 }}
            buttonStyle={{
              backgroundColor: "#27AE60",
            }}
            onPress={() =>
              Alert.alert(
                "WARNING",
                "This will send your location to the nearest responder.\n\nARE YOU SURE ?",
                [
                  {
                    text: "Yes",
                    style: "destructive",
                    onPress: () => {
                      triggerSos();
                    },
                  },
                  {
                    text: "No",
                    style: "cancel",
                  },
                ]
              )
            }
          >
            Request Emergency
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
