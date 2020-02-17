function derivativeOf(expression) {
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
    console.log(matched[3]);
    signs[S++] = matched[1];
  }

  const derivedX = deriveX(coefs, powers);

  var answer = derivedX[0];

  for (let i = 1; i < derivedX.length; i++) {
    answer = answer + " " + signs[i] + derivedX[i];
  }

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
    } else derivedXs[i] = derivedCoef + "x^" + derivedPower;
  }

  return derivedXs;
}

function calculate(expression, value) {
  const expWithXsReg = new RegExp("([?\\+ | ?-]\\s*)*(\\d+)*x\\^*(\\d+)*", "g");
  const expConsts = new RegExp("([\\+ | -]\\s*)*([^^]\\d+[^x])", "g");

  var matched;

  while ((matched = expWithXsReg.exec(expression)) != null) {
    // console.log(matched[1]);
    // console.log(matched[2]);
    // console.log(matched[3] + "\n");
  }

  var signs = [];
  var S = 0;
  var consts = [];
  var C = 0;

  while ((matched = expConsts.exec(expression)) != null) {
    signs[S++] = matched[1];
    consts[C++] = matched[2];
  }

  for (let i = 0; i < signs.length; i++) {
    console.log(signs[i] + consts[i]);
  }
}

calculate("12 - 34x^5 + 6 - 7x^8 + 910 - 11");
