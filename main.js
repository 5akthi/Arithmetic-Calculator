const current = document.getElementById("curr");
const previous = document.getElementById("prev");
const operators = "+-%^x/";
var buttons = document.getElementById("button-wrap");
var res = 0;
var curr_o = "";
var prev_o = "";
var oppr = "";
var check = 0;

class Calc {
  // To append the datas which user targets on current operand
  static appendc(data) {
    // To ensure that user does'nt input multiple decimal points
    if (curr_o.includes(".") && data === ".") return;
    // To ensure that user does'nt input any operators at the begining
    if (curr_o === "" && operators.includes(data)) return;
    // Convert to proper decimal '0.' if user starts with decimal accidentally
    if (curr_o.indexOf(".") === 0) {
      curr_o = "0.";
    }
    curr_o += data;
    return;
  }

  // To append the datas which user targets on previous operand
  static appendp(data) {
    // To ensure that user does'nt input multiple decimal points
    if (prev_o.includes(".") && data === ".") return;
    // To ensure that user does'nt input any further operators when there is one
    if (operators.includes(prev_o[prev_o.length - 1])) {
      if (operators.includes(data)) return;
    }
    prev_o += data;
    return;
  }

  // To display the datas on the current screen
  static dispcurr(data) {
    current.innerText = data;
    return;
  }

  // To display the datas on the previous screen
  static dispprev(data) {
    previous.innerText = data;
    return;
  }

  // To restore all datas and output on the screens to their original values
  static clear() {
    curr_o = "";
    prev_o = "";
    oppr = "";
    res = 0;
    check = 0;
    return;
  }

  // To pop the last character out from either screens
  static delete() {
    // Ensuring that the current screen is NOT empty
    if (curr_o !== "") {
      // By chance if the last character is an operator, oppr is assigned none
      if (operators.includes(curr_o[curr_o.length - 1])) {
        oppr = "";
      }
      curr_o = curr_o.substr(0, curr_o.length - 1);
      Calc.dispcurr(curr_o);
    }
    // Pop the last character from previous screen if the current screen is empty
    else {
      // By chance if the last character is an operator
      if (operators.includes(prev_o[prev_o.length - 1])) {
        oppr = "";
      }
      prev_o = prev_o.substr(0, prev_o.length - 1);
      Calc.dispprev(prev_o);
    }
    return;
  }

  // To perform any arithmetic operations on both operands
  // Arguments: a & b => both operands
  //          : data  => any operator
  //          : n     => new operator (if any)
  //          : f     => depends on e.target("result" or "operation") within which it is called.
  //          :          "result" will pass '1'; otherwise none, since default value = 0;
  static operation(a, b, data, n, f = "0") {
    // Ensures that the current screen is NOT empty
    if (curr_o != "") {
      // Performs the operation through switch function
      switch (data) {
        case "+":
          res = b + a;
          check = 1;
          break;
        case "x":
          res = b * a;
          check = 1;
          break;
        case "/":
          res = b / a;
          check = 1;
          break;
        case "-":
          res = b - a;
          check = 1;
          break;
        case "%":
          res = (b * a) / 100;
          check = 1;
          break;
        case "^":
          res = Math.pow(b, a);
          check = 1;
      }
    }
    // If this function was called from "result" target, display the final result on the current screen
    if (f === "1") {
      prev_o = res.toString();
      curr_o = prev_o;
      prev_o = "";
      Calc.dispprev(prev_o);
      Calc.dispcurr(curr_o);
    }
    // If not then retain the current result on the previous screen followed by any new operator
    else {
      // Ensures that some operation is performed successfully
      if (check === 1) {
        prev_o = res.toString();
        check = 0;
      }
      // Calls this function to append the new operator on previous screen
      Calc.appendp(n);
      Calc.dispprev(prev_o);
      // Makes the current screen empty
      curr_o = "";
      Calc.dispcurr(curr_o);
      // Asigns the value of oppr to none
      oppr = "";
    }
    return;
  }
}

// Wait for an event "click" from the user
buttons.addEventListener("click", (e) => {
  // To prevent any default action by e
  e.preventDefault();

  // If user targets any of the digit
  if (e.target.classList.contains("digit")) {
    Calc.appendc(e.target.innerText);
    Calc.dispcurr(curr_o);
  }

  // If user targets any of the operators
  if (e.target.classList.contains("operator")) {
    if (prev_o !== "") {
      const opprn = e.target.innerText;
      Calc.operation(parseFloat(curr_o), parseFloat(prev_o), oppr, opprn);
      oppr = opprn;
    } else {
      oppr = e.target.innerText;
      Calc.appendc(oppr);
      Calc.dispcurr(curr_o);
      prev_o = curr_o;
      curr_o = "";
      Calc.dispcurr(curr_o);
      Calc.dispprev(prev_o);
    }
  }

  // If user targets the clear button to clear all
  if (e.target.classList.contains("clear")) {
    Calc.clear();
    Calc.dispcurr(curr_o);
    Calc.dispprev(prev_o);
  }

  // If user targets the delete button to remove last character only
  if (e.target.classList.contains("delete")) {
    Calc.delete();
  }

  // If user targets "=" button to see the result
  if (e.target.classList.contains("result")) {
    Calc.operation(parseFloat(curr_o), parseFloat(prev_o), oppr, "", "1");
  }
});
