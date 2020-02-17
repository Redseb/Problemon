import React, { useState, useEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
//Components
import Player from "../components/Player";
import ValueInputter from "../components/Player/ValueInputter";
import DiceDisplay from "../components/DiceDisplay";
//Utils
import { damageHealth } from "../util/playerFunctions";
import { showMessage } from "react-native-flash-message";

const WIDTH = Dimensions.get("window").width;
const BattleScreen = ({ navigation }) => {
  //Game State
  const [gameOver, setGameOver] = useState(false);
  const [isAwaitingInput, setIsAwaitingInput] = useState(true);
  console.log("isAwaitingInput...", isAwaitingInput);
  //Dice State
  const [diceStatusType, setDiceStatusType] = useState(1); //1: (calc, derivative, integrate) 2:(1,2,3,4,5,6)
  const [diceResultType, setDiceResultType] = useState(0);
  const [diceStatusNum, setDiceStatusNum] = useState(2); //1: (calc, derivative, integrate) 2:(1,2,3,4,5,6)
  const [diceResultNum, setDiceResultNum] = useState(0);
  const [isRolling, setIsRolling] = useState(isAwaitingInput);

  //Player State
  const [healthP2, setHealthP2] = useState(100);
  const [funcP2, setFuncP2] = useState("3x^2"); //TODO: RANDOMIZE STARTING FUNCTIONS
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
      <View style={styles.diceContainer}>
        <DiceDisplay
          isAwaitingInput={isAwaitingInput}
          diceStatus={diceStatusType}
          setDiceStatus={setDiceStatusType}
          setDiceResult={setDiceResultType}
          diceResult={diceResultType}
          setIsAwaitingInput={setIsAwaitingInput}
          isRolling={isRolling}
          setIsRolling={setIsRolling}
        />
        <DiceDisplay
          isAwaitingInput={isAwaitingInput}
          diceStatus={diceStatusNum}
          setDiceStatus={setDiceStatusNum}
          setDiceResult={setDiceResultNum}
          diceResult={diceResultNum}
          setIsAwaitingInput={setIsAwaitingInput}
          isRolling={isRolling}
          setIsRolling={setIsRolling}
        />
      </View>
      <KeyboardAvoidingView behavior="padding">
        <ValueInputter
          diceResultType={diceResultType}
          diceResultNum={diceResultNum}
          funcP2={funcP2}
          setFuncP2={setFuncP2}
          funcP1={funcP1}
          setFuncP1={setFuncP1}
          healthP1={healthP1}
          healthP2={healthP2}
          setHealthP1={setHealthP1}
          setHealthP2={setHealthP2}
          isAwaitingInput={isAwaitingInput}
          setIsAwaitingInput={setIsAwaitingInput}
          isRolling={isRolling}
          setIsRolling={setIsRolling}
        />
        <Player func={funcP1} health={healthP1} index={"P1"} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between"
  },
  diceContainer: {
    flexDirection: "column"
  }
});

export default BattleScreen;
