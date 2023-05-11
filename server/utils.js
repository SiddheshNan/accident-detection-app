function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

function distance(position1, position2) {
  var lat1 = position1.latitude;
  var lat2 = position2.latitude;
  var lon1 = position1.longitude;
  var lon2 = position2.longitude;
  var R = 6371000; // metres
  var φ1 = degrees_to_radians(lat1);
  var φ2 = degrees_to_radians(lat2);
  var Δφ = degrees_to_radians(lat2 - lat1);
  var Δλ = degrees_to_radians(lon2 - lon1);

  var a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  var d = R * c;
  return d;
}

module.exports = {
  makeid,
  distance,
};
