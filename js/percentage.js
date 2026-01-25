function calculatePercentage() {
  const value = parseFloat(document.getElementById("value").value);
  const percent = parseFloat(document.getElementById("percent").value);
  const resultBox = document.getElementById("resultBox");
  const resultOutput = document.getElementById("result");

  if (isNaN(value) || isNaN(percent)) {
    alert("Please enter valid numbers.");
    return;
  }

  const result = (value * percent) / 100;
  resultOutput.textContent = result.toLocaleString();
  resultBox.style.display = "block";
}
