import React from "react";
import { View, Text, Alert, Image, Linking } from "react-native";
import * as Location from "expo-location";
import { Button, Overlay } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import MapView from "./MapView";
import { AppState } from "react-native";

import { APP_SESSION, WS_URL, showAlert } from "../../utils";

let getLocationLoop = null;

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

  const [sosSignal, setSosSignal] = React.useState({
    triggered: false,
    userLatLon: "0,0",
    userFromDB: {},
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

  const getLocation = async () => {
    Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      enableHighAccuracy: true,
      timeInterval: 5,
    }).then((location) => {
      console.log(Date.now(), location);
      setLocation({
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      });
      sendCurrentLocation(location.coords.latitude, location.coords.longitude);
    });
  };

  const startWs = () => {
    wsRef.current = new WebSocket(WS_URL + APP_SESSION._id);
    wsRef.current.onmessage = (message) => {
      // console.log(message.data);

      const msg = JSON.parse(message.data);

      console.log(msg);

      if (msg.type == "emergency") {
        setSosSignal({
          triggered: true,
          userLatLon: msg.userLatLon,
          userFromDB: msg.userFromDB,
        });
      }
    };
  };

  const stopWs = () => {
    wsRef?.current?.close();
  };

  const sendCurrentLocation = (lat, lon) => {
    try {
      if (
        lat != null &&
        lon != null &&
        wsRef.current?.readyState !== WebSocket.CLOSED
      ) {
        wsRef.current?.send(`myLoc$${lat},${lon}`);
      }
    } catch (error) {
      console.log(error);
    }

    // call api here to send sos
  };

  React.useEffect(() => {
    getPermission();
    if (focus) {
      console.log("starting getLocationLoop");
      startWs();
      getLocation();
      getLocationLoop = setInterval(() => {
        getLocation();
      }, 3000);
    } else {
      console.log("clearing getLocationLoop");
      stopWs();
      clearInterval(getLocationLoop);
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

          <Overlay isVisible={sosSignal.triggered}>
            <View style={{ paddingVertical: 25, paddingHorizontal: 60 }}>
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
                SOS is Requested
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
                Name: {sosSignal.userFromDB?.fullname}
                {"\n"}
                Phone No: {sosSignal.userFromDB?.phoneNo}
                {"\n"}
                Blood Group: {sosSignal.userFromDB?.bloodGroup}
              </Text>

              <Button
                size="lg"
                titleStyle={{ fontSize: 22 }}
                buttonStyle={{
                  backgroundColor: "#8E44AD",
                }}
                onPress={() =>
                  Linking.openURL(
                    `https://maps.google.com/?q=${sosSignal.userLatLon}`
                  ).catch(console.log)
                }
              >
                OPEN IN MAP
              </Button>

              <Button
                size="lg"
                titleStyle={{ fontSize: 22 }}
                buttonStyle={{
                  backgroundColor: "#28B463",
                  marginTop: 10,
                }}
                onPress={() =>
                  setSosSignal({
                    triggered: false,
                    userLatLon: "0,0",
                    userFromDB: {},
                  })
                }
              >
                MARK DONE
              </Button>
            </View>
          </Overlay>

          <MapView location={location} />

          {!sosSignal.triggered && (
            <View
              style={{
                height: "30%",
                borderTopColor: '#34495E',
                borderTopWidth: 2
              }}
            >
              <Text
                style={{ textAlign: "center", fontSize: 22, marginTop: 25 }}
              >
                Waiting for any SOS..
              </Text>

              <Image
                style={{
                  width: "100%",
                  height: 100,
                  marginTop: 25,
                  resizeMode: "contain",
                }}
                source={require("../../assets/spin.gif")}
                resizeMode={"contain"}
              />
              {/* <ActivityIndicator
              style={{
                marginTop: 25,
              }}
              size="large"
              color="#0000ff"
            /> */}
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
