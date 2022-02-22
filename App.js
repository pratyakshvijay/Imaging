import * as React from "react";
import Home from "./app/screens/home";
import CategoryImages from "./app/screens/categoryImages";
import { Images } from "./app/screens/categoryImages";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button } from "react-native";

const Stack = createNativeStackNavigator();

function App() {
  let color = "blue";
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#7b9671",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Home Screen"
          component={Home}
          options={{
            headerStyle: {
              backgroundColor: "#7b9671",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Category Screen"
          component={CategoryImages}
          options={({ route }) => ({ title: route.params.title })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
