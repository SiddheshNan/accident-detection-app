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
        navigation.navigate("UserLogin");
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
            uri: "https://images.unsplash.com/photo-1549927681-0b673b8243ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
          }}
          resizeMode="cover"
          style={{ height: "100%" }}
        >
          <ScrollView>
            <View style={{ flex: 1, height: "100%", marginTop: "20%" }}>
              <Card
                 containerStyle={{
                  padding: 20,
                  borderRadius: 15,
                  backgroundColor: "rgba(60, 60, 85, 0.8)",
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
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {"\n"}Hello User! 👋{"\n"}
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    {"\n"}Welcome to Accishield App 🚑
                  </Text>
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    marginTop: 10,
                    marginBottom: 10
                  }}
                >
                  <Button
                    title={"Go to Login"}
                    size="lg"
                    titleStyle={styles.btnText}
                    buttonStyle={styles.buttons}
                    containerStyle={styles.btnContainer}
                    onPress={() => {
                      navigation.navigate("UserLogin");
                    }}
                  />
                  <Button
                    title={"Go to Signup"}
                    size="lg"
                    titleStyle={styles.btnText}
                    buttonStyle={styles.buttons}
                    containerStyle={styles.btnContainer}
                    onPress={() => {
                      navigation.navigate("UserRegister");
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
