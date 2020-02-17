import React, { useState, useEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Keyboard
} from "react-native";
//Components
import Player from "../components/Player";
import ValueInputter from "../components/Player/ValueInputter";
//Utils
import { damageHealth } from "../util/playerFunctions";

const WIDTH = Dimensions.get("window").width;
const BattleScreen = ({ navigation }) => {
  const [gameOver, setGameOver] = useState(false);
  const [healthP2, setHealthP2] = useState(100);
  const [funcP2, setFuncP2] = useState("x^2"); //TODO: RANDOMIZE STARTING FUNCTIONS
  const [healthP1, setHealthP1] = useState(100);
  const [funcP1, setFuncP1] = useState("20x"); //TODO: RANDOMIZE STARTING FUNCTIONS
  // Testing;
  //   useEffect(() => {
  //     damageHealth(healthP1, setHealthP1, 15);
  //     setGameOver(true);
  //   }, []);
  if (gameOver) {
    alert("Game Over!");
    navigation.navigate("Title");
  }
  return (
    <View style={styles.container}>
      <Player func={funcP2} health={healthP2} index={"P2"} />
      <KeyboardAvoidingView behavior="padding">
        <Player func={funcP1} health={healthP1} index={"P1"} />
        <ValueInputter />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between"
  }
});

export default BattleScreen;
