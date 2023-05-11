import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from "react-native";
import { Button, Header as HeaderRNE, Image } from "@rneui/themed";
import { Card, Input } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { normalize } from "../utils";

const HomeScreen = ({ navigation }) => {
  React.useEffect(() => {
    (async () => {
      const jsonValue = await AsyncStorage.getItem("@app_login");

      if (jsonValue == null) {
        return;
      } else {
        navigation.navigate("ResponderLogin");
      }
    })();
  }, []);

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <HeaderRNE
        elevated={0}
        backgroundColor="#27AE60"
        centerComponent={{
          text: "Accishield App",
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
            uri: "https://images.unsplash.com/photo-1579037005241-a79202c7e9fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
          }}
          resizeMode="cover"
          style={{ height: "100%" }}
        >
          <ScrollView>
            <View style={{ flex: 1, height: "100%", marginTop: "25%" }}>
              <Card
                containerStyle={{
                  padding: 20,
                  borderRadius: 15,
                  backgroundColor: "rgba(60, 65, 87, 0.6)",
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
                    color: "white",
                    fontSize: 25,
                    marginTop: 23,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Hello Responder! 👋{"\n"}
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    {"\n"}Welcome to Accishield App 🚑
                  </Text>
                </Text>

                {/* <Image
                  style={{ width: "100%", height: 150, resizeMode: "contain" }}
                  source={require("../assets/logo-ap.png")}
                  resizeMode={"contain"}
                /> */}
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    marginTop: 10,
                  }}
                >
                  <Button
                    title={"Go to Login"}
                    size="lg"
                    titleStyle={styles.btnText}
                    buttonStyle={styles.buttons}
                    containerStyle={styles.btnContainer}
                    onPress={() => {
                      navigation.navigate("ResponderLogin");
                    }}
                  />
                  <Button
                    title={"Go to Signup"}
                    size="lg"
                    titleStyle={styles.btnText}
                    buttonStyle={styles.buttons}
                    containerStyle={styles.btnContainer}
                    onPress={() => {
                      navigation.navigate("ResponderRegister");
                    }}
                  />
                </View>

                <Text
                  style={{
                    color: "white",
                    fontSize: 15,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {"\n"} 🎓 App by Students of Sipna COET, Amt.
                </Text>
              </Card>
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  buttons: {
    backgroundColor: "#27AE60",
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 14,
  },
  btnContainer: {
    width: "75%",
    marginTop: 30,
  },
  btnText: {
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default HomeScreen;
