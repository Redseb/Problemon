import React from "react";
import { View, Text, StyleSheet } from "react-native";
//Import Character Components
import HealthIndicator from "./Player/HealthIndicator";

const Player = ({ func, health }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.funcStyle}>{func}</Text>
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
  funcStyle: {
    fontFamily: "pixel",
    fontSize: 20,
    marginBottom: 20
  }
});

export default Player;
