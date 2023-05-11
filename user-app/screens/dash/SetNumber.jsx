import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input } from "@rneui/base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showAlert } from "../../utils";
import * as SMS from "expo-sms";

export default function SetNumber() {
  const [number1, setNumber1] = React.useState("");
  const [number2, setNumber2] = React.useState("");
  const [number3, setNumber3] = React.useState("");

  const onSubmit = async () => {
    await AsyncStorage.setItem("number1", number1);
    await AsyncStorage.setItem("number2", number2);
    await AsyncStorage.setItem("number3", number3);
    showAlert("Success", "Numbers saved successfully");
  };

  React.useEffect(() => {
    (async () => {
      const number1 = await AsyncStorage.getItem("number1");
      const number2 = await AsyncStorage.getItem("number2");
      const number3 = await AsyncStorage.getItem("number3");
      setNumber1(number1);
      setNumber2(number2);
      setNumber3(number3);
    })();
  }, []);

  const sms = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      const myArr = [];
      if (number1) {
        myArr.push(number1);
      }
      if (number2) {
        myArr.push(number2);
      }
      if (number3) {
        myArr.push(number3);
      }

      await SMS.sendSMSAsync(
        myArr,
        "Hello, this is an test emergency message from accishield app."
      );
    } else {
      showAlert("Error", "SMS is not available on this device");
    }
  };

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <SafeAreaView style={{ height: "100%", flex: 1, paddingTop: -35 }}>
        <View
          style={{
            flex: 1,
            height: "100%",
            paddingVertical: 10,
            marginHorizontal: 25,
            marginTop: 35,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 10,
              marginTop: 0,
            }}
          >
            Enter Emergancy Contacts:{" "}
          </Text>
          <Input
            placeholder="Enter Number 1"
            value={number1}
            onChangeText={(text) => setNumber1(text)}
            keyboardType="numeric"
            inputStyle={{
              borderWidth: 1,
              paddingVertical: 10,
              paddingHorizontal: 25,
              borderRadius: 10,
              marginTop: 10,
            }}
          />
          <Input
            placeholder="Enter Number 2"
            value={number2}
            onChangeText={(text) => setNumber2(text)}
            keyboardType="numeric"
            inputStyle={{
              borderWidth: 1,
              paddingVertical: 10,
              paddingHorizontal: 25,
              borderRadius: 10,
              marginTop: 10,
            }}
          />
          <Input
            placeholder="Enter Number 3"
            value={number3}
            onChangeText={(text) => setNumber3(text)}
            keyboardType="numeric"
            inputStyle={{
              borderWidth: 1,
              paddingVertical: 10,
              paddingHorizontal: 25,
              borderRadius: 10,
              marginTop: 10,
            }}
          />

          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginBottom: 10,
              marginTop: 0,
            }}
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
            Save Numbers
          </Button>
          <Button
            size="sm"
            titleStyle={{ fontWeight: "bold", fontSize: 22 }}
            buttonStyle={{
              backgroundColor: "#27AE60",
              borderRadius: 5,
              marginTop: 25,
            }}
            onPress={sms}
          >
            Send SMS
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
