import React from "react";
import { View, Text, ImageBackground } from "react-native";
import { Button, Card } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { APP_SESSION, deleteLogin } from "../../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Logout({ navigation }) {
  const doLogout = () => {
    APP_SESSION._id = "";
    APP_SESSION.username = "";

    AsyncStorage.removeItem("@app_login");
    navigation.navigate("StartPage");
  };
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
          <View style={{ flex: 1, height: "100%", marginTop: 80 }}>
            <Card containerStyle={{ padding: 35, borderRadius: 15 }}>
              <Text
                style={{
                  textAlign: "center",
                  marginBottom: 20,
                  fontSize: 25,
                  fontWeight: "bold",
                }}
              >
                Do you want to logout?
              </Text>

              <Button
                size="sm"
                titleStyle={{ fontWeight: "bold", fontSize: 22 }}
                buttonStyle={{
                  backgroundColor: "#E74C3C",
                  borderRadius: 5,
                  marginTop: 10,
                }}
                onPress={doLogout}
              >
                Logout
              </Button>
            </Card>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
}
