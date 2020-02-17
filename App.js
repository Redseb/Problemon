import React, { useEffect, useState } from "react";
import { View } from "react-native";
import * as Font from "expo-font";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
//Screens
import TitleScreen from "./src/screens/TitleScreen";
import BattleScreen from "./src/screens/BattleScreen";
import LoadingScreen from "./src/screens/LoadingScreen";

//Create Navigator
const navigator = createStackNavigator(
  {
    Title: {
      screen: TitleScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    Battle: {
      screen: BattleScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    Loading: {
      screen: LoadingScreen,
      navigationOptions: {
        headerShown: false
      }
    }
  },
  {
    initialRouteName: "Title",
    options: {
      headerMode: "none"
    }
  }
);
const App = createAppContainer(navigator);
export default () => {
  //Load Fonts
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        pixel: require("./assets/fonts/PixelFJVerdana12pt.ttf")
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (fontsLoaded) {
    return <App />;
  } else {
    return <LoadingScreen />;
  }
};
