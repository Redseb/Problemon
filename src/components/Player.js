import React from "react";
import { View, Text, StyleSheet } from "react-native";
//Import Character Components
import HealthIndicator from "./Player/HealthIndicator";

const Player = ({ func, health, index }) => {
  return (
    <View style={styles.container}>
      <Text style={index === "P1" ? styles.funcStyle1 : styles.funcStyle2}>
        {func}
      </Text>
      <HealthIndicator health={health} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 20
  },
  funcStyle1: {
    fontFamily: "pixel",
    fontSize: 20,
    marginBottom: 20,
    alignSelf: "flex-start"
  },
  funcStyle2: {
    fontFamily: "pixel",
    fontSize: 20,
    marginBottom: 20,
    alignSelf: "flex-end"
  }
});

export default Player;
