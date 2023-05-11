import React from "react";
import { View, Text, ScrollView, ImageBackground } from "react-native";
import { Button, Header as HeaderRNE, Card, Input } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { API_URL, showAlert } from "../../utils";

export default function UserRegister({ navigation }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullname, setFullname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phoneNo, setPhoneNo] = React.useState("");
  const [bloodGroup, setBloodGroup] = React.useState("");

  const onSubmit = () => {
    axios
      .post(`${API_URL}/user/signup`, {
        username,
        password,
        fullname,
        email,
        phoneNo,
        bloodGroup,
      })
      .then((response) => {
        if (response?.data?.msg === "ok") {
          showAlert(
            "Success",
            "User Registered Successfully!\n\nPlease Login Now..."
          );
          navigation.navigate("UserLogin");
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
          text: "User Signup",
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
            <View style={{ flex: 1, height: "100%", marginTop: 15 }}>
              <Card containerStyle={{ padding: 35, borderRadius: 15 }}>
                <Text
                  style={{
                    textAlign: "center",
                    marginBottom: 30,
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Please Enter Your Details
                </Text>
                <Input
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
                <Input
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={true}
                />
                <Input
                  placeholder="Full Name"
                  value={fullname}
                  onChangeText={setFullname}
                />
                <Input
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />

                <Input
                  placeholder="Phone"
                  value={phoneNo}
                  onChangeText={setPhoneNo}
                  keyboardType="numeric"
                />
                <Input
                  placeholder="Blood Group"
                  value={bloodGroup}
                  onChangeText={setBloodGroup}
                />

                <Button
                  size="sm"
                  titleStyle={{ fontWeight: "bold", fontSize: 22 }}
                  buttonStyle={{
                    backgroundColor: "#27AE60",
                    borderRadius: 5,
                    marginTop: 10,
                  }}
                  onPress={onSubmit}
                >
                  Create Account
                </Button>
              </Card>
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
}
