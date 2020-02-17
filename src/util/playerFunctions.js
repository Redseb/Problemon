import {
  compareDerivative,
  derivativeOf,
  compareCalculation,
  calculate
} from "../util/derivatives";
export const damageHealth = (health, setHealth, damage) => {
  console.log("New Health", health - damage);
  setHealth(health - damage);
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
      } else {
        setFuncP1(derivativeOf(funcP1));
      }
      break;
    case 2:
      console.log("Integral check");
      break;
    default:
      console.log("Calculate check");
      console.log(
        `compare calculation: ${funcP2} at x = ${num} with answer: ${answer}`,
        compareCalculation(answer, funcP2, num)
      );
      if (compareCalculation(answer, funcP2, num) == true) {
        damageHealth(healthP2, setHealthP2, calculate(funcP2, num));
      } else {
        damageHealth(healthP1, setHealthP1, calculate(funcP2, num));
      }
      break;
  }
};
