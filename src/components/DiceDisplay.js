import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const DiceDisplay = ({
  invisibility,
  diceStatus,
  setDiceStatus,
  setDiceResult,
  diceResult
}) => {
  const numDiceGif = require("../../assets/images/diceNumGif.gif");
  const numDice1 = require("../../assets/images/d1.png");

  const [isRolling, setIsRolling] = useState(true);
  const [diceImage, setDiceImage] = useState(numDiceGif);
  const [subtitle, setSubtitle] = useState("Dice");

  useEffect(() => {
    if (isRolling) {
      if (diceStatus == 1) {
        setSubtitle("Rolling Type of Problem...");
        setDiceImage(numDiceGif);
      } else {
        setSubtitle("Rolling Number...");
        setDiceImage(numDice1);
      }
    } else {
      setSubtitle(diceResult);
    }
  }, []);

  if (invisibility === true) {
    return null;
  } else {
    if (isRolling) {
      setTimeout(() => {
        setDiceResult(Math.floor(Math.random() * 6));
        setDiceImage(numDice1);
        setIsRolling(false);
      }, 1000);
    }
    return (
      <View style={styles.container}>
        <Image source={diceImage} style={styles.image} />
        <Text>{subtitle}</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignSelf: "center"
  },
  image: {
    height: 50,
    width: 50,
    alignSelf: "center"
  }
});

export default DiceDisplay;
