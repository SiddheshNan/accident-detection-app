import React from "react";
import { View, Text, ScrollView, ImageBackground } from "react-native";
import { Button, Header as HeaderRNE, Card, Input } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import {
  API_URL,
  showAlert,
  APP_SESSION,
  getLogin,
  saveLogin,
} from "../../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserLogin({ navigation }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  React.useEffect(() => {
    (async () => {
      const jsonValue = await AsyncStorage.getItem("@app_login");

      console.log("jsonValue", jsonValue);

      if (jsonValue == null) {
        return;
      }

      const { username: myN, password: myP } = JSON.parse(jsonValue);

      axios
        .post(`${API_URL}/user/login`, {
          username: myN,
          password: myP,
        })
        .then(async (response) => {
          if (response?.data?.msg === "ok") {
            showAlert("Success", "User Logged In Successfully!");
            APP_SESSION.username = myN;
            APP_SESSION._id = response.data.user._id;

            await AsyncStorage.setItem(
              "@app_login",
              JSON.stringify({
                username: myN,
                password: myP,
              })
            );

            navigation.navigate("Drawer", { screen: "Dashboard" });
          } else throw new Error("Something went wrong");
        })
        .catch((error) => {
          console.log(error);
          showAlert(
            "ERROR",
            error?.response?.data?.error || "Something went wrong"
          );
        });
    })();
  }, []);

  const onSubmit = (myN, myP) => {
    axios
      .post(`${API_URL}/user/login`, {
        username: myN,
        password: myP,
      })
      .then(async (response) => {
        if (response?.data?.msg === "ok") {
          showAlert("Success", "User Logged In Successfully!");
          APP_SESSION.username = myN;
          APP_SESSION._id = response.data.user._id;

          await AsyncStorage.setItem(
            "@app_login",
            JSON.stringify({
              username: myN,
              password: myP,
            })
          );

          navigation.navigate("Drawer", { screen: "Dashboard" });
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
      <HeaderRNE
        elevated={0}
        backgroundColor="#E67E22"
        centerComponent={{
          text: "User Login",
          style: {
            color: "white",
            fontSize: 21,
            fontWeight: "bold",
            marginTop: 5,
            marginBottom: 5,
          },
        }}
      />

      <SafeAreaView style={{ height: "100%", flex: 1, paddingTop: -40 }}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1527769929977-c341ee9f2033?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
          }}
          resizeMode="cover"
          style={{ height: "100%" }}
        >
          <ScrollView>
            <View style={{ flex: 1, height: "100%", marginTop: 80 }}>
              <Card
                containerStyle={{
                  padding: 20,
                  borderRadius: 15,
                  backgroundColor: "rgba(60, 65, 87, 0.75)",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 9,
                  },
                  shadowOpacity: 0.48,
                  shadowRadius: 11.95,

                  elevation: 18,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    marginBottom: 20,
                    fontSize: 25,
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  {"\n"} Please enter login {"\n"}credentials 🔒{"\n"}
                </Text>

                <Input
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                  inputStyle={{ color: "white" }}
                  autoCapitalize="none"
                />
                <Input
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={true}
                  inputStyle={{color:'white'}}
                />

                <Button
                  size="sm"
                  titleStyle={{ fontWeight: "bold", fontSize: 22 }}
                  buttonStyle={{
                    backgroundColor: "#27AE60",
                    borderRadius: 5,
                    marginTop: 10,
                    marginBottom: 25
                  }}
                  onPress={() => onSubmit(username, password)}
                >
                  Login
                </Button>
              </Card>
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
}
