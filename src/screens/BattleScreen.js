import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import Player from "../components/Player";

const WIDTH = Dimensions.get("window").width;
const BattleScreen = () => {
  return (
    <View style={styles.container}>
      <Player func={"x^2"} health={70} />
      <Player func={"20x"} health={20} />
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
