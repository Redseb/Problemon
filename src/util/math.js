const extractXReg = /\s*([\+|-]*)\s*(\d+\.\d+|\d+)*x\^*(\d+)*\s*/g;
const extractNumberReg = /\s*([\+|-]*)\s*(\d+\.\d+|\d+)\s*/g;

/**
 * Takes an expression written in such a way: (x^2 + 4x^4 - 12)
 * and looks for the derivative of it using additional functions such as:
 * 1. getPolynomialWithX(expression) {}
 * 2. derive()
 */

function derivativeOf(expression) {
  if (!expression.includes("x")) {
    return "0";
  }

  return derive(expression);
}

function derive(expression) {
  let polynomials = getPolynomialWithX(expression);
  let coefs = polynomials.cObj.coef;
  let powers = polynomials.pObj.powers;
  let signs = polynomials.sObj.signs;

  let derivedExpressionArray = [];
  let derivedPower = "";
  let derivedCoef = "";

  for (let i = 0; i < coefs.length; i++) {
    derivedPower = powers[i] - 1;
    derivedCoef = coefs[i] * powers[i];

    switch (derivedPower) {
      case 0:
        derivedExpressionArray[i] = signs[i] + derivedCoef;
        break;
      case 1:
        if (derivedCoef == 1) {
          derivedExpressionArray[i] = signs[i] + "x";
        } else derivedExpressionArray[i] = signs[i] + derivedCoef + "x";
        break;
      default:
        derivedExpressionArray[i] =
          signs[i] + derivedCoef + "x^" + derivedPower;
    }
  }

  let derivedExpression = "";
  for (let i = 0; i < derivedExpressionArray.length; i++) {
    derivedExpression += derivedExpressionArray[i];
  }

  return derivedExpression.replace(/^\+/m, "");
}

/**
 * Takes an expression written in such a way: (x^2 + 4x^4 - 12)
 * and looks for x's with a power and ordinary numbers through out two
 * separate functions: getPolynomialWithX and getNumbers
 */

function calculate(expression, value) {
  let xExtractor = getPolynomialWithX(expression);
  let signsOfX = xExtractor.sObj.signs; // passes no sign as ''
  let coefsOfX = xExtractor.cObj.coef;
  let powersOfX = xExtractor.pObj.powers;

  let answer = 0;
  let unit = 0;

  for (let i = 0; i < coefsOfX.length; i++) {
    unit = Number(coefsOfX[i] * Math.pow(value, powersOfX[i]));
    if (signsOfX[i].toString() == "+" || signsOfX[i] == "") {
      answer += unit;
    } else if (signsOfX[i].toString() == "-") {
      answer -= unit;
    } else throw new Error("Misread sign of x");
  }

  let numberExtractor = getNumbers(expression);
  let numbers = numberExtractor.nObj.numbers;
  let signOfNumber = numberExtractor.sObj.signs; // passes no sign as ''

  for (let i = 0; i < numbers.length; i++) {
    if (signOfNumber[i].toString() == "+" || signOfNumber[i].toString() == "") {
      answer += Number(numbers[i]);
    } else if (signOfNumber[i].toString() == "-") {
      answer -= Number(numbers[i]);
    } else throw new Error("Misread sign of the number" + numbers[i]);
  }

  return answer.toString();
}

/**
 * Takes an expression written in such a way: (x^2 + 4x^4 - 12)
 * and looks for x's with a power and ordinary numbers through out two
 * separate functions: getPolynomialWithX and getNumbers
 * and returns indefinite integral as the answer
 */

function integralOf(expression) {
  // WORKING ON X's

  let xExtractor = getPolynomialWithX(expression);
  let coefsOfX = xExtractor.cObj.coef;
  let powersOfX = xExtractor.pObj.powers;
  let signsOfX = xExtractor.sObj.signs; // passes no sign as ''

  let integratedExpression = "";
  let integratedPower;
  let integratedUnit;
  for (let i = 0; i < powersOfX.length; i++) {
    integratedPower = Number(powersOfX[i]) + 1;
    let integratedCoef = Number((coefsOfX[i] / integratedPower).toFixed(2));
    if (integratedCoef == 1) {
      integratedCoef = "";
    }
    integratedUnit = signsOfX[i] + integratedCoef + "x^" + integratedPower;
    integratedExpression += integratedUnit;
  }

  let answer = integratedExpression;

  // WORKING ON NUMBERS

  let numberExtractor = getNumbers(expression);
  let numbers = numberExtractor.nObj.numbers;
  let signsOfNumbers = numberExtractor.sObj.signs;
  for (let i = 0; i < numbers.length; i++) {
    let integralOfConst = signsOfNumbers[i] + numbers[i] + "x";
    answer += integralOfConst;
  }

  return answer.toString().replace(/\s/g, "");
}

// HELPERS

function processQuotients(expression) {
  const regForQuotients = /(\d+)\/(\d+)/g;

  let numerators = [];
  let N = 0;
  let denominators = [];
  let D = 0;
  let match;
  while ((match = regForQuotients.exec(expression)) != null) {
    numerators[N++] = match[1];
    denominators[D++] = match[2];
  }

  let decimals = [];
  for (let i = 0; i < numerators.length; i++) {
    decimals[i] = Number(numerators[i] / denominators[i]).toFixed(2);
    expression = expression.replace(
      numerators[i] + "/" + denominators[i],
      decimals[i]
    );
  }

  return expression;
}
function getPolynomialWithX(expression) {
  let cObj = {
    coef: [],
    c: 0
  };

  let pObj = {
    powers: [],
    p: 0
  };

  let sObj = {
    signs: [],
    s: 0
  };

  expression = processQuotients(expression);

  let match;
  while ((match = extractXReg.exec(expression)) != null) {
    if (match[1] == null) {
      sObj.signs[sObj.s++] = "";
    } else sObj.signs[sObj.s++] = match[1];

    if (match[2] == null) {
      cObj.coef[cObj.c++] = 1;
    } else cObj.coef[cObj.c++] = match[2];
    if (match[3] == null) {
      pObj.powers[pObj.p++] = 1;
    } else pObj.powers[pObj.p++] = match[3];
  }

  return {
    cObj: cObj,
    pObj: pObj,
    sObj: sObj
  };
}
function getNumbers(expression) {
  expression = processQuotients(expression);

  let numbersInExpression = expression.replace(extractXReg, "");

  let sObj = { signs: [], s: 0 };
  let nObj = { numbers: [], n: 0 };

  let match;

  while ((match = extractNumberReg.exec(numbersInExpression)) != null) {
    if (match[1] == null) {
      sObj.signs[sObj.s++] = "";
    } else sObj.signs[sObj.s++] = match[1];

    nObj.numbers[nObj.n++] = match[2];
  }

  return { sObj: sObj, nObj: nObj };
}

function simplify(expression) {
  let xExtractor = getPolynomialWithX(expression);
  let coefsOfX = xExtractor.cObj.coef;
  let powersOfX = xExtractor.pObj.powers;
  let signsOfX = xExtractor.sObj.signs;

  let numberExtractor = getNumbers(expression);
  let numbers = numberExtractor.nObj.numbers;
  let signsOfNumbers = numberExtractor.sObj.signs; // passes no sign as ''

  signsOfX = turnNullToPlus(signsOfX);
  signsOfNumbers = turnNullToPlus(signsOfNumbers);

  let simplifiedX = sumUpX(signsOfX, coefsOfX, powersOfX);
  let simplifiedNumber = 0;

  for (let i = 0; i < numbers.length; i++) {
    if (signsOfNumbers[i] == "+") {
      simplifiedNumber += Number(numbers[i]);
    } else simplifiedNumber -= Number(numbers[i]);
  }

  let simplification = simplifiedX;

  if (simplifiedNumber > 0) {
    simplification += "+" + simplifiedNumber;
  } else if (simplifiedNumber < 0) {
    simplification += simplifiedNumber;
  }

  return simplification.replace(/^\+/, "");
}

function turnNullToPlus(signs) {
  for (let i = 0; i < signs.length; i++) {
    if (signs[i] == "") signs[i] = "+";
  }
  return signs;
}

function theSamePower(pow1, pow2) {
  if (pow1 == pow2) return true;
  else return false;
}

function getSamePowers(powersOfX) {
  let equalPowersPositions = [];
  let EPP = 0;
  let equalPowers = [];
  let EP = 0;

  for (let i = 0; i < powersOfX.length; i++) {
    let notChecked = true;
    for (let k = 0; k < equalPowersPositions.length; k++) {
      for (let l = 0; l < equalPowersPositions[k].length; l++) {
        if (i == equalPowersPositions[k][l]) {
          notChecked = false;
          break;
        }
      }
    }

    let haveTheSamePowers = false;
    let powersCollector = [];
    let PC = 1;
    if (notChecked) {
      for (let j = i + 1; j < powersOfX.length; j++) {
        if (theSamePower(powersOfX[i], powersOfX[j])) {
          powersCollector[PC++] = j;
          haveTheSamePowers = true;
        }
      }
      if (haveTheSamePowers) {
        powersCollector[0] = i;
        equalPowersPositions[EPP++] = powersCollector;
        equalPowers[EP++] = powersOfX[i];
      }
    }
  }

  return {
    equalPowersPositions: equalPowersPositions, // returns 2D array
    equalPowers: equalPowers
  };
}

function sumUpX(signsOfX, coefsOfX, powersOfX) {
  let powersProcessor = getSamePowers(powersOfX);
  let samePowersPositions = powersProcessor.equalPowersPositions; // 2D array
  let powers = powersProcessor.equalPowers;

  let sumedUpCoef = 0;

  let simplified = "";

  for (let i = 0; i < samePowersPositions.length; i++) {
    for (let j = 0; j < samePowersPositions[i].length; j++) {
      if (signsOfX[samePowersPositions[i][j]] == "+") {
        sumedUpCoef += Number(coefsOfX[samePowersPositions[i][j]]);
      } else sumedUpCoef -= Number(coefsOfX[samePowersPositions[i][j]]);
    }

    let sumedUpCoefIsZero = false;
    if (sumedUpCoef == 0) sumedUpCoefIsZero = true;

    if (!sumedUpCoefIsZero) {
      let coefWithSign = "";

      if (sumedUpCoef > 0) {
        if (sumedUpCoef == 1) {
          coefWithSign = "+";
        } else coefWithSign = "+" + sumedUpCoef;
      } else if (sumedUpCoef == -1) {
        coefWithSign = "-";
      } else coefWithSign = sumedUpCoef;

      if (powers[i] == 1) {
        simplified += coefWithSign + "x";
      } else simplified += coefWithSign + "x^" + powers[i];
    }

    sumedUpCoef = 0;
  }

  let repetitiveCoefsPosition = [];
  let RC = 0;
  for (let i = 0; i < samePowersPositions.length; i++) {
    for (let j = 0; j < samePowersPositions[i].length; j++) {
      repetitiveCoefsPosition[RC++] = samePowersPositions[i][j];
    }
  }

  let singleCoefsPosition = [];
  let SC = 0;
  for (let i = 0; i < coefsOfX.length; i++) {
    let notProcessed = true;
    for (let j = 0; j < repetitiveCoefsPosition.length; j++) {
      if (i == repetitiveCoefsPosition[j]) {
        notProcessed = false;
        break;
      }
    }
    if (notProcessed) {
      singleCoefsPosition[SC++] = i;
    }
  }
  let positionNumber = "";
  for (let i = 0; i < singleCoefsPosition.length; i++) {
    positionNumber = singleCoefsPosition[i];
    if (coefsOfX[positionNumber] == 1) {
      coefsOfX[positionNumber] = "";
    }
    if (powersOfX[positionNumber] == 1) {
      simplified += signsOfX[positionNumber] + coefsOfX[positionNumber] + "x";
    } else
      simplified +=
        signsOfX[positionNumber] +
        coefsOfX[positionNumber] +
        "x^" +
        powersOfX[positionNumber];
  }

  return simplified;
}

function compareDerivatives(userAnswer, func) {
  const correctDerivative = derivativeOf(func);
  if (compare(userAnswer, correctDerivative)) {
    return true;
  } else return false;
}

function compareCalculations(userAnswer, func, value) {
  const correctCalculation = calculate(func, value);
  if (userAnswer == correctCalculation) {
    return true;
  } else return false;
}

function compareIntegrals(userAnswer, func) {
  const correctIntegral = integralOf(func);
  if (compare(userAnswer, correctIntegral)) {
    return true;
  } else return false;
}

// COMPARE HELPERS

function compare(userAnswer, correctAnswer) {
  userAnswer = simplify(userAnswer);
  correctAnswer = simplify(correctAnswer);

  console.log(userAnswer + "|" + correctAnswer);

  // processing number written by user
  let numberOfUser =
    getNumbers(userAnswer).sObj.signs[0] +
    getNumbers(userAnswer).nObj.numbers[0];
  let correctNumber =
    getNumbers(correctAnswer).sObj.signs[0] +
    getNumbers(correctAnswer).nObj.numbers[0];

  if (isNaN(numberOfUser)) numberOfUser = 0;
  if (isNaN(correctNumber)) correctNumber = 0;
  if (numberOfUser != correctNumber) {
    return false;
  }
  //

  const usersExpressionX = processExpressionForCompare(userAnswer);
  const correctExpressionX = processExpressionForCompare(correctAnswer);
  if (usersExpressionX.length != correctExpressionX.length) return false;

  let expressionsAreEqual = false;

  let numberOfElementsRemaining = usersExpressionX.length;
  for (let i = 0; i < usersExpressionX.length; i++) {
    for (let j = 0; j < correctExpressionX.length; j++) {
      if (usersExpressionX[i] == correctExpressionX[j]) {
        numberOfElementsRemaining--;
      }
    }
  }

  if (numberOfElementsRemaining == 0) {
    expressionsAreEqual = true;
  }

  return expressionsAreEqual;
}

function processExpressionForCompare(expression) {
  const xExtractor = getPolynomialWithX(simplify(expression));

  let xExpression = [];

  for (let i = 0; i < xExtractor.cObj.coef.length; i++) {
    let coef = xExtractor.cObj.coef[i];
    if (coef == 1) coef = "";

    let power = xExtractor.pObj.powers[i];
    if (power == 1) power = "x";
    else power = "x^" + power;

    let sign = xExtractor.sObj.signs[i];
    if (sign == "") sign = "+";
    xExpression[i] = sign + coef + power;
  }

  return xExpression;
}

const _derivativeOf = derivativeOf;
export { _derivativeOf as derivativeOf };
const _calculate = calculate;
export { _calculate as calculate };
const _integralOf = integralOf;
export { _integralOf as integralOf };
const _compareDerivatives = compareDerivatives;
export { _compareDerivatives as compareDerivatives };
const _compareCalculations = compareCalculations;
export { _compareCalculations as compareCalculations };
const _compareIntegrals = compareIntegrals;
export { _compareIntegrals as compareIntegrals };
