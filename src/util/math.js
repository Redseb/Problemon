const extractXReg = /\s*([\+|-]*)\s*(\d+\/\d+|\d+\.\d+|\d+)*x\^*(\d+)*\s*/g;
const extractNumberReg = /\s*([\+|-]*)\s*(\d+\/\d+|\d+\.\d+|\d+)\s*/g;


//
// MAIN FUNCTIONS
//

function derivativeOf(expression) {

    if (!expression.includes('x')) {
        return '0';
    }

    return derive(expression);
}

function derive(expression) {

    let polynomials = getPolynomialWithX(expression);
    let coefs = polynomials.cObj.coef;
    let powers = polynomials.pObj.powers;
    let signs = polynomials.sObj.signs;

    let derivedExpressionArray = [];
    let derivedPower = '';
    let derivedCoef = '';

    for (let i = 0; i < coefs.length; i++) {

        derivedPower = powers[i] - 1;
        derivedCoef = (coefs[i] * powers[i]);

        switch (derivedPower) {
            case 0:
                derivedExpressionArray[i] = signs[i] + derivedCoef;
                break;
            case 1:
                if (derivedCoef == 1) {
                    derivedExpressionArray[i] = signs[i] + "x";
                } else {
                    derivedExpressionArray[i] = signs[i] + derivedCoef + "x";
                }
                break;
            default:
                if (derivedCoef == 1) {
                    derivedExpressionArray[i] = signs[i] + "x^" + derivedPower;
                } else derivedExpressionArray[i] = signs[i] + derivedCoef + "x^" + derivedPower;
        }
    }

    let derivedExpression = '';
    for (let i = 0; i < derivedExpressionArray.length; i++) {
        derivedExpression += derivedExpressionArray[i];
    }

    return derivedExpression.replace(/^\+/m, '');
}

/**
 * Takes an expression written in such a way: (x^2 + 4x^4 - 12) 
 * and looks for x's with a power and ordinary numbers through out two
 * separate functions: getPolynomialWithX and getNumbers
 */

function calculate(expression, value) {

    let xExtractor = getPolynomialWithX(expression);
    let signsOfX = xExtractor.sObj.signs; 
    let coefsOfX = xExtractor.cObj.coef;
    let powersOfX = xExtractor.pObj.powers;

    let answer = 0;
    let unit = 0;

    for (let i = 0; i < coefsOfX.length; i++) {
        unit = Number(coefsOfX[i] * Math.pow(value, powersOfX[i]));
        if (signsOfX[i].toString() == '+' || signsOfX[i] == '') {
            answer += unit;
        } else if (signsOfX[i].toString() == '-') {
            answer -= unit;
        } else throw new Error('Misread sign of x');
    }

    let numberExtractor = getNumbers(expression);
    let numbers = numberExtractor.nObj.numbers;
    let signOfNumber = numberExtractor.sObj.signs; 

    for (let i = 0; i < numbers.length; i++) {
        if (signOfNumber[i].toString() == '+' || signOfNumber[i].toString() == '') {
            answer += Number(numbers[i]);
        } else if (signOfNumber[i].toString() == '-') {
            answer -= Number(numbers[i]);
        } else throw new Error('Misread sign of the number' + numbers[i]);
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
    let signsOfX = xExtractor.sObj.signs; 

    let integratedExpression = '';
    let integratedPower;
    let integratedUnit;
    for (let i = 0; i < powersOfX.length; i++) {
        integratedPower = Number(powersOfX[i]) + 1;
        let integratedCoef = coefsOfX[i] + '/' + integratedPower;
        if (coefsOfX[i] / integratedPower == 1) {
            integratedCoef = '';
        }
        integratedUnit = signsOfX[i] + integratedCoef + 'x^' + integratedPower;
        integratedExpression += integratedUnit;
    }

    let answer = integratedExpression;

    // WORKING ON NUMBERS

    let numberExtractor = getNumbers(expression);
    let numbers = numberExtractor.nObj.numbers;
    let signsOfNumbers = numberExtractor.sObj.signs;
    for (let i = 0; i < numbers.length; i++) {
        let integralOfConst = signsOfNumbers[i] + numbers[i] + 'x';
        answer += integralOfConst;
    }

    return answer.toString().replace(/\s/g, '');
}

//
//LOW-LEVEL EXTRACTORS HELPERS
//

function processXOverNumber(expression) {

    const regXOverNumberWithPower = /\((\d+)*x\/(\d+)\)\^(\d+)/g;

    let match;
    let numerator = 0;
    let denominator = 0;
    let power = 0;
    while ((match = regXOverNumberWithPower.exec(expression)) != null) {
        numerator = match[1];
        denominator = match[2];
        power = match[3];
        let unitToReplace = '';
        if (numerator == null) {
            numerator = 1;
            unitToReplace = '(' + 'x/' + denominator + ')^' + power
        } else unitToReplace = '(' + numerator + 'x/' + denominator + ')^' + power;

        expression = expression.replace(
            unitToReplace,
            Math.pow(numerator, power) + '/' + Math.pow(denominator, power) + 'x^' + power
        );
    }

    const regXOverNumberWithoutPower = /(\d*)x\/(\d+)/g;

    while ((match = regXOverNumberWithoutPower.exec(expression)) != null) {
        numerator = match[1];
        if (numerator == '') numerator = 1;
        denominator = match[2];
        expression = expression.replace(regXOverNumberWithoutPower, numerator + '/' + denominator + 'x');
    }

    return expression;
}

//
// LOW-LEVEL EXTRACTORS
//

function getPolynomialWithX(expression) {

    expression = processXOverNumber(expression);

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

    let match;
    while ((match = extractXReg.exec(expression)) != null) {

        if (match[1] == null) {
            sObj.signs[sObj.s++] = '';
        } else sObj.signs[sObj.s++] = match[1];

        if (match[2] == null) {
            cObj.coef[cObj.c++] = 1;
        } else cObj.coef[cObj.c++] = match[2];
        if (match[3] == null) {
            pObj.powers[pObj.p++] = 1;
        } else pObj.powers[pObj.p++] = match[3];

    }

    return {
        "cObj": cObj,
        "pObj": pObj,
        "sObj": sObj
    };
}

function getNumbers(expression) {

    expression = processXOverNumber(expression);

    let numbersInExpression = expression.replace(
        extractXReg,
        ''
    );

    let sObj = {
        signs: [],
        s: 0
    };
    let nObj = {
        numbers: [],
        n: 0
    };

    let match;

    while ((match = extractNumberReg.exec(numbersInExpression)) != null) {

        if (match[1] == null) {
            sObj.signs[sObj.s++] = '';
        } else sObj.signs[sObj.s++] = match[1];

        nObj.numbers[nObj.n++] = match[2];
    }

    return {
        "sObj": sObj,
        "nObj": nObj
    };
}


// 
// HIGH-LEVEL EXTRACTORS
//

function getExpressionInDecimals(expression) {

    expression = processXOverNumber(expression);

    const reg = /(\d+)\/(\d+)/g;

    let numerators = [];
    let N = 0;
    let denominators = [];
    let D = 0;
    let match;
    while ((match = reg.exec(expression)) != null) {
        numerators[N++] = match[1];
        denominators[D++] = match[2];
    }

    let decimals = [];
    for (let i = 0; i < numerators.length; i++) {
        decimals[i] = Number(numerators[i] / denominators[i]);
        expression = expression.replace(numerators[i] + '\/' + denominators[i], decimals[i]);
    }

    return expression;
}


function getExpressionInFractions(expression) {

    const reg = /\d+\.\d+/g;

    let match;
    let decimalNumbers = [];
    let DN = 0;
    while ((match = reg.exec(expression)) != null) {
        decimalNumbers[DN++] = match;
    }

    let decimalPlaces = 0;
    let decimalPart = 0;
    let intPart = 0;
    let fractions = [];
    for (let i = 0; i < decimalNumbers.length; i++) {
        decimalPlaces = decimalNumbers[i].toString().split('.')[1].length;
        decimalPart = decimalNumbers[i].toString().split('.')[1];
        intPart = decimalNumbers[i].toString().split('.')[0];
        if (intPart == 0) intPart = '';
        fractions[i] = intPart + '' + decimalPart + '/' + Math.pow(10, decimalPlaces);
        expression = expression.replace(decimalNumbers[i], fractions[i]);
    }

    return expression;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////


function simplify(expression) {

    let decimalExpression = getExpressionInDecimals(expression);
    let decimalExpressionWithX = getPolynomialWithX(decimalExpression);
    let coefsOfXDecimal = decimalExpressionWithX.cObj.coef;
    let powersOfXDecimal = decimalExpressionWithX.pObj.powers;
    let signsOfXDecimal = decimalExpressionWithX.sObj.signs;
    let decimalExpressionWithNumbers = getNumbers(decimalExpression);
    let numbersDecimal = decimalExpressionWithNumbers.nObj.numbers;
    let signsOfNumbersDecimal = decimalExpressionWithNumbers.sObj.signs;

    signsOfXDecimal = turnNullToPlus(signsOfXDecimal);
    signsOfNumbersDecimal = turnNullToPlus(signsOfNumbersDecimal);

    let simplifiedDecimal = simplifyDecimals(sumUpXDecimals(signsOfXDecimal, coefsOfXDecimal, powersOfXDecimal)) + sumUpNumbersInDecimal(numbersDecimal, signsOfNumbersDecimal);
    let simplifiedFractional = simplifyFractions(getExpressionInFractions(simplifiedDecimal));

    return {
        "simplifiedDecimal": simplifiedDecimal.toString().replace(/^\+/, ''),
        "simplifiedFractional": simplifiedFractional.toString().replace(/^\+/, '')
    };
}

function turnNullToPlus(signs) {
    for (let i = 0; i < signs.length; i++) {
        if (signs[i] == '') signs[i] = '+';
    }
    return signs;
}

function getSamePowers(powersOfX) {

    let equalPowersPositions = [];
    let EPP = 0;
    let equalPowers = [];
    let EP = 0;

    for (let i = 0; i < powersOfX.length; i++) {

        let notChecked = true;
        for (let k = 0; k < equalPowersPositions.length; k++) {
            for (let l = 0; l < equalPowersPositions[k].length && notChecked; l++) {
                if (i == equalPowersPositions[k][l]) {
                    notChecked = false;
                }
            }
        }

        let haveTheSamePowers = false;
        let powersCollector = [];
        let PC = 1;
        if (notChecked) {
            for (let j = i + 1; j < powersOfX.length; j++) {
                if (powersOfX[i] == powersOfX[j]) {
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
        "equalPowersPositions": equalPowersPositions, // returns 2D array
        "equalPowers": equalPowers
    };
}

function sumUpSamePowersDecimals(signsOfXDecimal, coefsOfXDecimal, powersOfXDecimal) {
    let powersProcessor = getSamePowers(powersOfXDecimal);
    let samePowersPositions = powersProcessor.equalPowersPositions; // 2D array
    let powers = powersProcessor.equalPowers;

    let sumedUpCoef = 0;

    let simplified = '';
    for (let i = 0; i < samePowersPositions.length; i++) {
        for (let j = 0; j < samePowersPositions[i].length; j++) {
            if (signsOfXDecimal[samePowersPositions[i][j]] == '+') {
                sumedUpCoef += Number(coefsOfXDecimal[samePowersPositions[i][j]]);
            } else sumedUpCoef -= Number(coefsOfXDecimal[samePowersPositions[i][j]]);
        }

        if (sumedUpCoef != 0) {

            let coefWithSign = '';
            if (sumedUpCoef > 0) {
                if (sumedUpCoef == 1) {
                    coefWithSign = '+';
                } else coefWithSign = '+' + sumedUpCoef;
            }

            if (sumedUpCoef < 0) {
                if (sumedUpCoef == -1) {
                    coefWithSign = '-';
                } else coefWithSign = sumedUpCoef;
            }

            if (powers[i] == 1) {
                simplified += coefWithSign + 'x';
            } else simplified += coefWithSign + 'x^' + powers[i];
        }

        sumedUpCoef = 0;
    }

    return {
        "simplified": simplified,
        "samePowersPositions": samePowersPositions
    };
}

function getSingleCoefPositions(samePowersPositions, coefsOfXDecimal) {
    let repetitiveCoefsPosition = [];
    let RC = 0;
    for (let i = 0; i < samePowersPositions.length; i++) {
        for (let j = 0; j < samePowersPositions[i].length; j++) {
            repetitiveCoefsPosition[RC++] = samePowersPositions[i][j];
        }
    }

    let singleCoefsPosition = [];
    let SC = 0;
    for (let i = 0; i < coefsOfXDecimal.length; i++) {
        let notProcessed = true;
        for (let j = 0; j < repetitiveCoefsPosition.length && notProcessed; j++) {
            if (i == repetitiveCoefsPosition[j]) {
                notProcessed = false;
            }
        }
        if (notProcessed) {
            singleCoefsPosition[SC++] = i;
        }
    }
    return singleCoefsPosition;
}

function sumUpXDecimals(signsOfXDecimal, coefsOfXDecimal, powersOfXDecimal) {

    let sumUpSamePowersDecimalsObj = sumUpSamePowersDecimals(signsOfXDecimal, coefsOfXDecimal, powersOfXDecimal);
    let simplified = sumUpSamePowersDecimalsObj.simplified;
    let samePowersPositions = sumUpSamePowersDecimalsObj.samePowersPositions;

    let singleCoefsPosition = getSingleCoefPositions(samePowersPositions, coefsOfXDecimal);

    let positionNumber = '';
    for (let i = 0; i < singleCoefsPosition.length; i++) {
        positionNumber = singleCoefsPosition[i];
        if (powersOfXDecimal[positionNumber] == 1) {
            simplified += signsOfXDecimal[positionNumber] + Number(coefsOfXDecimal[positionNumber]) + 'x';
        } else {
            simplified += signsOfXDecimal[positionNumber] + Number(coefsOfXDecimal[positionNumber]) + 'x^' + powersOfXDecimal[positionNumber];
        }
    }
    
    return simplified;
}

function sumUpNumbersInDecimal(numbersDecimal, signsOfNumbersDecimal) {
    let simplifiedNumber = 0;
    let toReturn = '';
    for (let i = 0; i < numbersDecimal.length; i++) {
        if (signsOfNumbersDecimal[i] == '+') {
            simplifiedNumber += Number(numbersDecimal[i]);
        } else simplifiedNumber -= Number(numbersDecimal[i]);
    }

    if (simplifiedNumber > 0) {
        toReturn = '+' + simplifiedNumber;
    } else if (simplifiedNumber < 0) {
        toReturn += simplifiedNumber;
    }

    return toReturn;
}

function GCD(a, b) {
    let remainder;
    while (a > 0) {
        remainder = b % a;
        b = a;
        a = remainder;
    }
    return b;
}

function simplifyFractions(expression) {

    const reg = /(\d+)\/(\d+)/g;

    let numerators = [];
    let N = 0;
    let denominators = [];
    let D = 0;

    let match;
    while ((match = reg.exec(expression)) != null) {
        numerators[N++] = match[1];
        denominators[D++] = match[2];
    }

    let amountOfZeros = 0;
    let firstZero = true;
    let begining = 0;
    let switched = true;
    let fixedNumerator;
    let fixedDenominator;
    for (let i = 0; i < numerators.length; i++) {
        for (let j = 0; j < numerators[i].toString().length && switched; j++) {

            if (amountOfZeros >= 7) {
                fixedNumerator = numerators[i].toString().substr(0, begining);
                fixedDenominator = denominators[i].toString().substr(0, begining);
                expression = expression.replace(numerators[i] + '/' + denominators[i], fixedNumerator + '/' + fixedDenominator);
                numerators[i] = fixedNumerator;
                denominators[i] = fixedDenominator;
                switched = false;
            }
            if (numerators[i].charAt(j) == '0') {
                if (firstZero) {
                    begining = j;
                    firstZero = false
                } else amountOfZeros++;
            }
        }

        let gcd = GCD(numerators[i], denominators[i]);
        fixedNumerator = Number(numerators[i]) / gcd;
        fixedDenominator = Number(denominators[i]) / gcd;
        expression = expression.replace(numerators[i] + '/' + denominators[i], fixedNumerator + '/' + fixedDenominator);
    }

    return expression;
}

function simplifyDecimals(expression) {

    const reg = /\d+\.(\d+)/g;

    let decimalPlaces = [];
    let DP = 0;

    let match;
    while ((match = reg.exec(expression)) != null) {
        decimalPlaces[DP++] = match[1];
    }

    let amountOfRepetitiveNumbers = 0;
    let firstRepetitiveNumber = true;
    let begining = 0;
    let switched = true;
    for (let i = 0; i < decimalPlaces.length; i++) {
        let repetitiveNumber = decimalPlaces[i].toString().charAt(0);
        for (let j = 1; j < decimalPlaces[i].length && switched; j++) {

            if (amountOfRepetitiveNumbers >= 7) {
                if (repetitiveNumber >= 5) {
                    expression = expression.replace(decimalPlaces[i], decimalPlaces[i].toString().substr(0, begining));
                    decimalPlaces[i] = decimalPlaces[i].toString().substr(0, begining);
                    
                    let finalNumber = Number(decimalPlaces[i].substr(decimalPlaces[i].length - 2, decimalPlaces[i].length)) + 1;
                    finalNumber = finalNumber.toString().replace(/0$/, '');
                    expression = expression.replace(decimalPlaces[i].substr(decimalPlaces[i].length - 2, ), finalNumber);
                } else expression = expression.replace(decimalPlaces[i], decimalPlaces[i].toString().substr(0, begining - 1));
                switched = false;
            }

            if (decimalPlaces[i].toString().charAt(j) == repetitiveNumber) {
                if (firstRepetitiveNumber) {
                    begining = j;
                    firstRepetitiveNumber = false;
                } else amountOfRepetitiveNumbers++;
            } else {
                repetitiveNumber = decimalPlaces[i].toString().charAt(j);
                firstRepetitiveNumber = true;
            }
        }
    }

    return expression
}

/////////////////////////////////////////////////////////////////

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

//
// MAIN COMPARE HEPLERS
//

function compare(userAnswer, correctAnswer) {

    let userSimplified = simplify(userAnswer);
    let userAnswerDecimal = userSimplified.simplifiedDecimal;
    let userAnswerFractional = userSimplified.simplifiedFractional;

    let correctAnswerSimplified = simplify(correctAnswer);
    let correctAnswerDecimal = correctAnswerSimplified.simplifiedDecimal;
    let correctAnswerFractional = correctAnswerSimplified.simplifiedFractional;

    if (numbersNotEqual(userAnswerDecimal, userAnswerFractional, correctAnswerDecimal, correctAnswerFractional)) return false;

    const usersExpressionXDecimal = processExpressionForCompare(userAnswerDecimal);
    const usersExpressionXFractional = processExpressionForCompare(userAnswerFractional);

    const correctExpressionXDecimal = processExpressionForCompare(correctAnswerDecimal);
    const correctExpressionXFractional = processExpressionForCompare(correctAnswerFractional);

    if (usersExpressionXDecimal.length != correctExpressionXDecimal.length) return false;

    let expressionsAreEqual = false;
    let numberOfElementsRemaining = usersExpressionXDecimal.length;
    for (let i = 0; i < usersExpressionXDecimal.length; i++) {
        for (let j = 0; j < correctExpressionXDecimal.length; j++) {
            if (
                usersExpressionXDecimal[i] == correctExpressionXDecimal[j] || 
                usersExpressionXFractional[i] == correctExpressionXFractional[j]
                ) {
                    numberOfElementsRemaining--;
            }
        }
    }

    if (numberOfElementsRemaining == 0) {
        expressionsAreEqual = true;
    }

    return expressionsAreEqual;
}
      
function numbersNotEqual(
    userAnswerDecimal,
    userAnswerFractional,
    correctAnswerDecimal,
    correctAnswerFractional
    ) {

    let numberOfUserDecimal = getNumbers(userAnswerDecimal).sObj.signs[0] + getNumbers(userAnswerDecimal).nObj.numbers[0];
    let numberOfUserFractional = getNumbers(userAnswerFractional).sObj.signs[0] + getNumbers(userAnswerFractional).nObj.numbers[0];

    let correctNumberDecimal = getNumbers(correctAnswerDecimal).sObj.signs[0] + getNumbers(correctAnswerDecimal).nObj.numbers[0];
    let correctNumberFractional = getNumbers(correctAnswerFractional).sObj.signs[0] + getNumbers(correctAnswerFractional).nObj.numbers[0];

    if (isNaN(numberOfUserDecimal)) {
        numberOfUserDecimal = 0;
        numberOfUserFractional = 0;
    }

    if (isNaN(correctNumberDecimal)) {
        correctNumberDecimal = 0;
        correctNumberFractional = 0;
    }

    if (
        Number(numberOfUserDecimal) == Number(correctNumberDecimal) || 
        Number(numberOfUserFractional) == Number(correctNumberFractional)
        )
        {return false;} else return true;
}

function processExpressionForCompare(expression) {

    const xExtractor = getPolynomialWithX(expression);

    let xExpression = [];

    for (let i = 0; i < xExtractor.cObj.coef.length; i++) {
        let coef = xExtractor.cObj.coef[i];
        if (coef == 1) coef = '';

        let power = xExtractor.pObj.powers[i];
        if (power == 1) power = 'x';
        else power = 'x^' + power;

        let sign = xExtractor.sObj.signs[i];
        if (sign == '') sign = '+';
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
