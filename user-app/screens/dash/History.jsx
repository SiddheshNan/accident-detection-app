import React from "react";
import { View, Text, ScrollView, Linking, ImageBackground } from "react-native";
import { Button, Card } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { APP_SESSION, API_URL, showAlert, createLocalTime } from "../../utils";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";
function HisComp({ item }) {
  return (
    <View
      style={{
        borderWidth: 1,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 15,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          fontWeight: "bold",
          lineHeight: 23,
          marginBottom: 10,
        }}
      >
        Latitude: {item.accidentLocation.split(",")[0]} {"\n"}
        Longitude: {item.accidentLocation.split(",")[1]} {"\n"}
        Time: {createLocalTime(item.addedAt)}
        {"\n\n"}
        Responder Info:{"\n"}
        Name: {item.responderId?.fullname || "N/A"}
        {"\n"}
        Phone No: {item.responderId?.phoneNo || "N/A"}
        {"\n"}
        Vehicle No: {item.responderId?.vehicleNo || "N/A"}
        {"\n"}
        Email: {item.responderId?.email || "N/A"}
        {"\n"}
        Blood Group: {item.responderId?.bloodGroup || "N/A"}
      </Text>
      <Button
        size="sm"
        onPress={() =>
          Linking.openURL(
            "https://maps.google.com/?q=" + item.accidentLocation
          ).catch(console.log)
        }
        title={"Open on Map"}
      ></Button>
    </View>
  );
}

export default function HistoryScreen() {
  const [state, setData] = React.useState([]);
  const focus = useIsFocused();

  const getData = () => {
    axios
      .get(API_URL + "/user/history?_id=" + APP_SESSION._id)
      .then(function (response) {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
        showAlert(
          "ERROR",
          error?.response?.data?.error || "Something went wrong"
        );
      });
  };

  React.useEffect(() => {
    if (focus) {
      getData();
    }
  }, [focus]);

  React.useEffect(() => {
    getData();
  }, []);
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <SafeAreaView style={{ height: "100%", flex: 1, paddingTop: -40 }}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=872&q=80",
          }}
          resizeMode="cover"
          style={{ height: "100%" }}
        >
          <ScrollView>
            <View style={{ flex: 1, height: "100%" }}>
              <Card containerStyle={{ padding: 35, borderRadius: 15 }}>
                <Text
                  style={{
                    textAlign: "center",
                    marginBottom: 20,
                    fontSize: 23,
                    fontWeight: "bold",
                  }}
                >
                  🕒 SOS History
                </Text>

                {state.map((item, index) => (
                  <HisComp key={index} item={item} />
                ))}
                {state.length === 0 && (
                  <Text
                    style={{
                      textAlign: "center",
                      marginBottom: 15,
                      fontSize: 15,
                      fontWeight: "bold",
                    }}
                  >
                    No History Found!
                  </Text>
                )}
              </Card>
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
}
