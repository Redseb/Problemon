import React, { useState } from "react";
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
  const [healthP2, setHealthP2] = useState(100);
  const [funcP2, setFuncP2] = useState("x^2"); //TODO: RANDOMIZE STARTING FUNCTIONS
  const [healthP1, setHealthP1] = useState(100);
  const [funcP1, setFuncP1] = useState("20x");

  return (
    <View style={styles.container}>
      <Player func={funcP2} health={healthP2} />
      <Player func={funcP1} health={healthP1} />
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
