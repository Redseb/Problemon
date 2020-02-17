function derivativeOf(expression) {
  if (!expression.includes("x")) {
    return "0";
  }

  const xToPowerReg = new RegExp(
    "([?\\+ | ?-]\\s*)*([0-9]+)*x\\^*([0-9]+)*",
    "g"
  );

  var coefs = [];
  var C = 0;

  var powers = [];
  var P = 0;

  var signs = [];
  var S = 0;

  var matched;
  while ((matched = xToPowerReg.exec(expression)) != null) {
    coefs[C++] = matched[2];
    powers[P++] = matched[3];
    signs[S++] = matched[1];
  }

  const derivedX = deriveX(coefs, powers);

  var answer = derivedX[0];

  for (let i = 1; i < derivedX.length; i++) {
    answer = answer + signs[i] + derivedX[i];
  }

  answer = answer.toString().replace(/\s/g, "");

  return answer;
}

function deriveX(coefs, powers) {
  for (let i = 0; i < powers.length; i++) {
    if (coefs[i] == null) {
      coefs[i] = 1;
    }
    if (powers[i] == null) {
      powers[i] = 1;
    }
  }

  var derivedXs = [];

  for (let i = 0; i < powers.length; i++) {
    var derivedPower = powers[i] - 1;
    var derivedCoef = coefs[i] * powers[i];
    if (derivedPower == 0) {
      derivedXs[i] = derivedCoef;
    } else if (derivedPower == 1) {
      derivedXs[i] = derivedCoef + "x";
    } else derivedXs[i] = derivedCoef + "x^" + derivedPower;
  }

  return derivedXs;
}

function calculate(expression, value) {
  const expWithXsReg = new RegExp("([?\\+ | ?-]\\s*)*(\\d+)*x\\^*(\\d+)*", "g");

  var matched;

  var coefs = [];
  var C = 0;

  var powers = [];
  var P = 0;

  var signs = [];
  var S = 0;

  var expressionNumbersOnly = expression;

  while ((matched = expWithXsReg.exec(expression)) != null) {
    if (matched[1] == undefined) {
      signs[S++] = "+";
    } else {
      signs[S++] = matched[1];
    }

    if (matched[2] == null) {
      coefs[C++] = 1;
    } else coefs[C++] = matched[2];

    if (matched[3] == null) {
      powers[P++] = 1;
    } else powers[P++] = matched[3];
  }

  expressionNumbersOnly = expressionNumbersOnly.replace(
    /([?\+ | ?-]\s*)*(\d+)*x\^*(\d+)*/g,
    ""
  );

  var signsConsts = [];
  var SC = 0;

  var numbers = [];
  var N = 0;

  const constReg = new RegExp("([?\\+ | ?-]\\s*)*(\\d+)", "g");

  while ((matched = constReg.exec(expressionNumbersOnly)) != null) {
    console.log(matched[1] + matched[2]);

    if (matched[1] == null) {
      signsConsts[SC++] = "+";
    } else signsConsts[SC++] = matched[1];

    numbers[N++] = matched[2];
  }

  var answer = 0;

  for (let i = 0; i < coefs.length; i++) {
    const unit = coefs[i] * Math.pow(value, powers[i]);

    if (signs[i] == "+") {
      console.log(signs[i]);
      answer = answer + unit;
    } else {
      console.log(signs[i]);
      answer = answer - unit;
    }
  }

  for (let i = 0; i < numbers.length; i++) {
    if (signsConsts == "+") {
      answer += numbers[i];
    } else answer -= numbers[i];
  }

  console.log(answer);
}

function compareDerivative(userAnswer, func) {
  const correctDer = derivativeOf(func);
  console.log("Correct Der", correctDer);

  if (userAnswer == correctDer) {
    return true;
  } else return false;
}

function compareCalculation(userAnswer, func, value) {
  const correctCalculation = calculate(func, value);
  console.log("CorrectCalc", correctCalculation); //UNDEFINED
  if (userAnswer == correctCalculation) {
    return true;
  } else return false;
}

module.exports.derivativeOf = derivativeOf;
module.exports.calculate = calculate;
module.exports.compareDerivative = compareDerivative;
module.exports.compareCalculation = compareCalculation;
