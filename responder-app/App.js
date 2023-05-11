import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider } from "@rneui/themed";
import { SafeAreaProvider } from "react-native-safe-area-context";

import StartPage from "./screens/StartPage";
import ResponderLogin from "./screens/auth/ResponderLogin";
import ResponderRegister from "./screens/auth/ResponderRegister";
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
              name="ResponderLogin"
              component={ResponderLogin}
              options={{ animation: "default" }}
            />

            <Stack.Screen
              name="ResponderRegister"
              component={ResponderRegister}
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
