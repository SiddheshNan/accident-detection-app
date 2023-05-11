import React from "react";
import { View, Text, ScrollView, ImageBackground, Image } from "react-native";
import { Button, Header as HeaderRNE, Card, Input } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { API_URL, showAlert } from "../../utils";
import * as ImagePicker from "expo-image-picker";

export default function ResponderRegister({ navigation }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullname, setFullname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phoneNo, setPhoneNo] = React.useState("");
  const [bloodGroup, setBloodGroup] = React.useState("");
  const [vehicleNo, setVehicleNo] = React.useState("");

  const [licenseImg, setLicenseImg] = React.useState(null);
  const [aadharImg, setAadharImg] = React.useState(null);
  const [photoidImg, setPhotoidImg] = React.useState(null);

  const pickImage = async (setFunction) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 0.8,
    });

 
    if (!result.canceled) {
      setFunction(result.assets[0]);
    }
  };

  const getVals = (item) => {
    let filename = item.uri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    return {
      uri: item.uri,
      name: filename,
      type: type,
    };
  };

  const onSubmit = () => {
    let formData = new FormData();

    formData.append("username", username);
    formData.append("password", password);
    formData.append("fullname", fullname);
    formData.append("email", email);
    formData.append("phoneNo", phoneNo);
    formData.append("bloodGroup", bloodGroup);
    formData.append("vehicleNo", vehicleNo);

    formData.append("licenseImg", getVals(licenseImg));
    formData.append("aadharImg", getVals(aadharImg));
    formData.append("photoidImg", getVals(photoidImg));

    // console.log(formData);

    axios
      .post(`${API_URL}/responder/signup`, formData, {
        headers: {
          // Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response?.data?.msg === "ok") {
          showAlert(
            "Success",
            "Responder Registered Successfully!\n\nPlease Login Now..."
          );
          // navigation.navigate("ResponderLogin");
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
          text: "Responder Signup",
          style: {
            color: "white",
            fontSize: 20,
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
              <Card
                containerStyle={{
                  padding: 20,
                  borderRadius: 15,
                  // backgroundColor: "rgba(60, 65, 87, 0.6)",
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
                    marginBottom: 30,
                    fontSize: 25,
                    fontWeight: "bold",

                    // color: 'white'
                  }}
                >
                  {"\n"}Please Enter Your Details
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
                <Input
                  placeholder="Vehicle No"
                  value={vehicleNo}
                  onChangeText={setVehicleNo}
                  autoCapitalize="none"
                />

                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "grey",
                    padding: 8,
                    margin: 8,
                    borderRadius: 10,
                  }}
                >
                  <Button
                    title="Select License Image"
                    onPress={() => pickImage(setLicenseImg)}
                  />
                  {licenseImg && (
                    <Image
                      source={{ uri: licenseImg.uri }}
                      style={{
                        width: 200,
                        height: 200,
                        margin: 10,
                      }}
                    />
                  )}
                </View>

                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "grey",
                    padding: 8,
                    margin: 8,
                    borderRadius: 10,
                  }}
                >
                  <Button
                    title="Select Aadhar Image"
                    onPress={() => pickImage(setAadharImg)}
                  />
                  {aadharImg && (
                    <Image
                      source={{ uri: aadharImg.uri }}
                      style={{
                        width: 200,
                        height: 200,
                        margin: 10,
                      }}
                    />
                  )}
                </View>

                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "grey",
                    padding: 8,
                    margin: 8,
                    borderRadius: 10,
                  }}
                >
                  <Button
                    title="Select Photo ID Image"
                    onPress={() => pickImage(setPhotoidImg)}
                  />
                  {photoidImg && (
                    <Image
                      source={{ uri: photoidImg.uri }}
                      style={{
                        width: 200,
                        height: 200,
                        margin: 10,
                      }}
                    />
                  )}
                </View>

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
