import React from "react";
import { View, TextInput, StyleSheet, Dimensions } from "react-native";

const WIDTH = Dimensions.get("window").width;

const ValueInputter = () => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        autoCorrect={false}
        placeholder="Enter Function or Value"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    borderColor: "#000000",
    borderWidth: 3,
    marginHorizontal: 15
  },
  input: {
    fontFamily: "pixel",
    fontSize: 10,
    height: 50,
    width: WIDTH - 100
  }
});

export default ValueInputter;
