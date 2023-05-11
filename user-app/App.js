import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider } from "@rneui/themed";
import { SafeAreaProvider } from "react-native-safe-area-context";

import StartPage from "./screens/StartPage";
import UserLogin from "./screens/auth/UserLogin";
import UserRegister from "./screens/auth/UserRegister";
import Drawer from "./screens/dash/Drawer";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="StartPage"
          >
            <Stack.Screen
              name="StartPage"
              component={StartPage}
              options={{ animation: "default" }}
            />

            <Stack.Screen
              name="UserLogin"
              component={UserLogin}
              options={{ animation: "default" }}
            />

            <Stack.Screen
              name="UserRegister"
              component={UserRegister}
              options={{ animation: "default" }}
            />

            <Stack.Screen
              name="Drawer"
              component={Drawer}
              options={{ animation: "default" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
