import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const WIDTH = Dimensions.get("window").width;

const HealthIndicator = ({ health }) => {
  return (
    <View style={styles.container}>
      <View style={styles.inner}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: "#000000",
    borderWidth: 5,
    width: WIDTH - 100,
    alignSelf: "center"
  },
  inner: {
    backgroundColor: "green",
    height: 10,
    width: WIDTH - 100 - 10
  }
});

export default HealthIndicator;
