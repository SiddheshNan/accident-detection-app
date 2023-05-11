import React from "react";
import { View, ScrollView, ImageBackground } from "react-native";
import { Button, Card, Input } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { showAlert, APP_SESSION, API_URL } from "../../utils";
import axios from "axios";

export default function ChanePassScreen({ navigation }) {
  const [oldPassword, setOldPassword] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rePassword, setRePassword] = React.useState("");

  const onSubmit = () => {
    if (password !== rePassword) {
      showAlert("Error", "Both Password doesn't match, Check again");
      return;
    }

    axios
      .post(`${API_URL}/responder/changePassword`, {
        _id: APP_SESSION._id,
        oldPassword,
        newPassword: password,
      })
      .then((response) => {
        if (response?.data?.msg === "ok") {
          showAlert("Success", "Password Changed Successfully!");
          navigation.navigate("Drawer", { screen: "ResponderDashboard" });
        } else throw new Error("Something went wrong");
      })
      .catch((error) => {
        console.log(error);
        showAlert(
          "ERROR",
          error?.response?.data?.error || "Something went wrong"
        );
      });
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
          <ScrollView>
            <View style={{ flex: 1, height: "100%", marginTop: 80 }}>
              <Card containerStyle={{ padding: 35, borderRadius: 15 }}>
                <Input
                  placeholder="Enter Old Password"
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  secureTextEntry={true}
                />

                <Input
                  placeholder="Enter New Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={true}
                />
                <Input
                  placeholder="Re-Enter New Password"
                  value={rePassword}
                  onChangeText={setRePassword}
                  secureTextEntry={true}
                />

                <Button
                  size="sm"
                  titleStyle={{ fontWeight: "bold", fontSize: 22 }}
                  buttonStyle={{
                    backgroundColor: "#27AE60",
                    borderRadius: 5,
                    marginTop: 15,
                  }}
                  onPress={onSubmit}
                >
                  Submit
                </Button>
              </Card>
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
}
