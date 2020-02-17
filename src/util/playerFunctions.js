import {
  compareDerivative,
  derivativeOf,
  compareCalculation,
  calculate,
  integralOf,
  compareIntegrals
} from "../util/derivatives";
import { showMessage } from "react-native-flash-message";
export const damageHealth = (health, setHealth, damage, setGameOver) => {
  console.log("New Health", health - damage);
  setHealth(health - Math.abs(damage));
  if (health <= 0) {
    console.log("health <= 0");
    alert("Gameover");
    setGameOver(true);
  }
};

export const checkAnswer = (
  type,
  num,
  funcP2,
  setFuncP2,
  funcP1,
  setFuncP1,
  healthP1,
  setHealthP1,
  healthP2,
  setHealthP2,
  isAwaitingInput,
  setIsAwaitingInput,
  isRolling,
  setIsRolling,
  setGameOver,
  answer
) => {
  switch (type) {
    case 1:
      console.log("Derivative check");
      console.log(
        `compare question: ${funcP2} with answer: ${answer}`,
        compareDerivative(answer, funcP2)
      );
      if (compareDerivative(answer, funcP2) == true) {
        setFuncP2(derivativeOf(funcP2));
        showMessage({
          message: "Correct Derivative!",
          backgroundColor: "#5a70e0"
        });
      } else {
        setFuncP1(derivativeOf(funcP1));
        showMessage({
          message: "Incorrect Derivative!",
          backgroundColor: "#a93331"
        });
      }
      break;
    case 2:
      console.log("Integral check");
      console.log(
        `compare question: ${funcP2} with answer: ${answer}`,
        compareIntegrals(answer, funcP2)
      );
      if (compareIntegrals(answer, funcP2) == true) {
        setFuncP1(integralOf(funcP1));
        showMessage({
          message: "Correct Integral!",
          backgroundColor: "#5a70e0"
        });
      } else {
        setFuncP2(integralOf(funcP2));
        showMessage({
          message: "Incorrect Integral!",
          backgroundColor: "#a93331"
        });
      }
      break;
    default:
      console.log("Calculate check");
      console.log(
        `compare calculation: ${funcP2} at x = ${num} with answer: ${answer}`,
        compareCalculation(answer, funcP2, num)
      );
      if (compareCalculation(answer, funcP2, num) == true) {
        damageHealth(healthP2, setHealthP2, calculate(funcP2, num));
        showMessage({
          message: "Correct Calculation!",
          backgroundColor: "#5a70e0"
        });
      } else {
        damageHealth(healthP1, setHealthP1, calculate(funcP2, num));
        showMessage({
          message: "Incorrect Calculation!",
          backgroundColor: "#a93331"
        });
      }
      break;
  }
  //REROLL DICE
  setIsAwaitingInput(true);
  setIsRolling(true);
};
