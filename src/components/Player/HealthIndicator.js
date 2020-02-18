import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const WIDTH = Dimensions.get("window").width;

const HealthIndicator = ({ health }) => {
  let color = "green";
  if (health <= 500 && health >= 25) {
    color = "yellow";
  } else if (health < 250) {
    color = "red";
  }
  return (
    <View>
      <View style={styles.borderHealthBar}>
        <View
          style={{
            width: (health / 1000) * (WIDTH - 110),
            backgroundColor: color,
            height: 10
          }}
        ></View>
      </View>
      <Text style={styles.text}>{health} / 1000</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  borderHealthBar: {
    borderColor: "#000000",
    borderWidth: 5,
    width: WIDTH - 100,
    alignSelf: "center"
  },
  text: {
    fontFamily: "pixel",
    fontSize: 10,
    alignSelf: "center"
  }
});

export default HealthIndicator;
