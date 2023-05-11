import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Icon } from "@rneui/themed";
import Dashboard from "./Dashboard";
import History from "./History";
import ChangePassword from "./ChangePassword";
import SetNumber from "./SetNumber";
import Logout from "./Logout";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, Text } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { APP_SESSION } from "../../utils";

const Drawer = createDrawerNavigator();

const DrawNav = () => {
  const [username, setUsername] = React.useState("");

  React.useEffect(() => {
    setUsername(APP_SESSION.username);
  }, []);
  return (
    <Drawer.Navigator
      drawerContent={(props) => {
        return (
          <SafeAreaView style={{ flex: 1 }}>
            <View
              style={{
                height: 145,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={{
                  uri: "https://i.imgur.com/yRtP35W.png",
                }}
                width={"100%"}
                height={150}
                // resizeMode="contain"
              />
            </View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                padding: 20,
                borderBottomColor: "gray",
                borderBottomWidth: 2,
                marginBottom: 25,
              }}
            >
              Hello, {username}
            </Text>
            <DrawerItemList {...props} />
          </SafeAreaView>
        );
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          title: "Dashboard",
          drawerIcon: ({ focused, size }) => (
            <Icon
              name="home"
              size={size}
              color={focused ? "#3498DB" : "#ccc"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="History"
        component={History}
        options={{
          title: "History",
          drawerIcon: ({ focused, size }) => (
            <Icon
              name="history"
              size={size}
              color={focused ? "#3498DB" : "#ccc"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="SetNumber"
        component={SetNumber}
        options={{
          title: "Set Emergancy Number",
          drawerIcon: ({ focused, size }) => (
            <Icon
              name="list-number"
              type="foundation"
              size={size}
              color={focused ? "#3498DB" : "#ccc"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          title: "Change Password",
          drawerIcon: ({ focused, size }) => (
            <Icon
              name="key"
              type="entypo"
              size={size}
              color={focused ? "#3498DB" : "#ccc"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Logout"
        component={Logout}
        options={{
          title: "Logout",
          drawerIcon: ({ focused, size }) => (
            <Icon
              name="lock"
              type="FontAwesome5"
              size={size}
              color={focused ? "#3498DB" : "#ccc"}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawNav;
