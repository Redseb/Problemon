import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";

const WIDTH = Dimensions.get("window").width;

const TitleScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.textTitle}>PROBLEMON</Text>
        <Text style={styles.text}>
          A Game created in 24 hours by Abdullah, Maxim, and Miko
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("Battle");
        }}
      >
        <Text style={styles.buttonText}>START</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
    justifyContent: "space-evenly"
  },
  textTitle: {
    color: "#000000",
    alignSelf: "center",
    fontFamily: "pixel",
    fontSize: 20,
    margin: 10
  },
  text: {
    color: "#000000",
    alignSelf: "center",
    fontFamily: "pixel",
    fontSize: 10,
    textAlign: "center"
  },
  button: {
    borderRadius: 10,
    width: WIDTH - 200,
    paddingVertical: 20,
    backgroundColor: "#000000",
    alignSelf: "center",
    justifyContent: "center"
  },
  buttonText: {
    alignSelf: "center",
    color: "#ffffff",
    fontFamily: "pixel"
  }
});

export default TitleScreen;
