let displayValue = "0";
let firstValue = "0";
let secondValue = "";
let operator = "";
let operatorPressed = false;
let operation = "1";

const numberRegex = /^[0-9]*$/;
const symbolRegex = /^[\/×+–÷*-]*$/;
const specialsRegex = /^[cC±%]*$/;
const controlsKB = ["Enter", "Backspace", "=", "+", "-", "/", "."];

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 3,
});

const buttonsArray = document.querySelectorAll(".btn");
const displayValueElement = document.querySelector("#displayValue");

const sanitizeNumber = (n) => {
  if (n.toString().includes(",")) return parseFloat(Number(n.replace(/,/g, "")));
  if (n.toString().includes(".")) return parseFloat(Number(n));
  return Number(n);
};

const setDisplay = () => (displayValueElement.innerHTML = displayValue);
const toggleActive = (input) => {
  let target = input;
  if (target === "*") target = "×";
  if (target === "-") target = "–";
  if (target === "/") target = "÷";
  document.getElementsByClassName(`${target}`)[0].classList.toggle("active");
};
const clearAllActive = () => {
  document.querySelectorAll(".orange").forEach((el) => el.classList.remove("active"));
};

const operate = (op, a, b) => {
  switch (op) {
    case "+":
      return a + b;
    case "–":
    case "-":
      return a - b;
    case "×":
    case "*":
      return a * b;
    case "÷":
    case "/":
      return a / b;
    default:
      break;
  }
};

const reset = () => {
  displayValue = "0";
  firstValue = "0";
  secondValue = "0";
  operator = "";
  clearAllActive();
};

const handleInput = (e) => {
  const input = e.currentTarget.innerHTML || e.key;
  if (
    input &&
    !numberRegex.test(input) &&
    !controlsKB.includes(input) &&
    !symbolRegex.test(input) &&
    !specialsRegex.test(input)
  )
    return;
  e.preventDefault();
  const isNum = numberRegex.test(input);
  const isSymbol = symbolRegex.test(input);

  if (input === "C" || input === "c") reset();
  if (input === "±" && displayValue !== "0")
    displayValue = displayValue[0] === "-" ? displayValue.substring(1) : "-" + displayValue;
  if (input === "%") displayValue = (1 / 100) * displayValue;
  if (input === "." && !displayValue.includes(".")) displayValue = displayValue + input;
  if (input === "Backspace" && displayValue !== "0") {
    displayValue = displayValue.slice(0, -1);
    !displayValue ? (displayValue = "0") : "";
  }

  if (isNum && displayValue === "0") displayValue = "";

  if (isNum && (operation === "1" || operation === "3")) {
    if (operator) toggleActive(operator);
    operatorPressed = false;
    displayValue = displayValue + input;
  }
  if (isNum && operation === "2") {
    if (operator) toggleActive(operator);
    operatorPressed = false;
    displayValue = input;
    operation = "3";
  }

  if (isSymbol && operatorPressed) {
    toggleActive(operator);
    operator = input;
    toggleActive(input);
  }
  if (isSymbol && !operatorPressed) {
    operatorPressed = true;
    toggleActive(input);

    if (operation === "1") {
      operator = input;
      firstValue = displayValue;
      operation = "2";
      setDisplay();
      return;
    }
    if (operation === "2") {
      operator = input;
      secondValue = displayValue;
      displayValue = operate(operator, sanitizeNumber(firstValue), sanitizeNumber(secondValue));
      operator = "";
      firstValue = displayValue;
      secondValue = "0";
      setDisplay();
      return;
    }
    if (operation === "3") {
      secondValue = displayValue;
      displayValue = operate(operator, sanitizeNumber(firstValue), sanitizeNumber(secondValue));
      firstValue = displayValue;
      secondValue = "0";
      operation = "2";
      setDisplay();
      operator = input;
      return;
    }
  }

  if (input === "=" || input === "Enter" || input === "=") {
    secondValue = displayValue;
    if (!operator) return;
    displayValue = formatter.format(
      operate(operator, sanitizeNumber(firstValue), sanitizeNumber(secondValue)).toString()
    );
    operator = "";
    firstValue = "0";
    secondValue = "0";
    operation = "1";
    clearAllActive();
  }
  if (displayValue === "Infinity" || displayValue === "∞") reset();
  setDisplay();
};
buttonsArray.forEach((el) => el.addEventListener("click", handleInput));
document.addEventListener("keydown", handleInput);
