document.getElementById("calculateEmiBtn").addEventListener("click", function () {

  const loan = Number(document.getElementById("loanAmount").value);
  const annualRate = Number(document.getElementById("interestRate").value);
  const tenureYears = Number(document.getElementById("loanTenure").value);
  const reducedYears = Number(document.getElementById("reducedTenure").value);

  if (!loan || !annualRate || !tenureYears) {
    alert("Please enter valid loan details");
    return;
  }

  const rate = annualRate / 12 / 100;
  const months = tenureYears * 12;

  /* ===== EMI CALCULATION ===== */
  const emi =
    loan * rate * Math.pow(1 + rate, months) /
    (Math.pow(1 + rate, months) - 1);

  const totalPayment = emi * months;
  const totalInterest = totalPayment - loan;

  /* ===== OUTPUT (MATCH HTML IDS) ===== */
  document.getElementById("emiValue").textContent =
    "₹" + Math.round(emi).toLocaleString("en-IN");

  document.getElementById("totalInterest").textContent =
    "₹" + Math.round(totalInterest).toLocaleString("en-IN");

  document.getElementById("totalPayment").textContent =
    "₹" + Math.round(totalPayment).toLocaleString("en-IN");

  /* ===== LINE GRAPH SETUP ===== */
  const svg = document.getElementById("emiGraph");
  svg.innerHTML = `
    <polyline id="lineOriginal" fill="none" stroke="#38bdf8" stroke-width="3"/>
    <polyline id="lineReduced" fill="none" stroke="#22c55e" stroke-width="3"/>
  `;

  const width = 600;
  const height = 300;

  function buildLine(totalMonths, emiAmount) {
    let balance = loan;
    let points = "";

    for (let i = 0; i <= totalMonths; i += Math.ceil(totalMonths / 30)) {
      const x = (i / totalMonths) * width;
      const y = height - (balance / loan) * height;
      points += `${x},${y} `;

      const interest = balance * rate;
      const principal = emiAmount - interest;
      balance -= principal;
      if (balance < 0) balance = 0;
    }
    return points.trim();
  }

  document
    .getElementById("lineOriginal")
    .setAttribute("points", buildLine(months, emi));

  /* ===== REDUCED TENURE FEATURE (SAFE) ===== */
  const impactText = document.getElementById("tenureImpactText");

  if (reducedYears && reducedYears < tenureYears) {

    const reducedMonths = reducedYears * 12;
    const newEmi =
      loan * rate * Math.pow(1 + rate, reducedMonths) /
      (Math.pow(1 + rate, reducedMonths) - 1);

    const newTotalPayment = newEmi * reducedMonths;
    const newInterest = newTotalPayment - loan;

    document
      .getElementById("lineReduced")
      .setAttribute("points", buildLine(reducedMonths, newEmi));

    impactText.textContent =
      `If you reduce the loan tenure to ${reducedYears} years, ` +
      `your EMI increases to ₹${Math.round(newEmi).toLocaleString("en-IN")}, ` +
      `but you save ₹${Math.round(totalInterest - newInterest).toLocaleString("en-IN")} in interest.`;

  } else {
    document.getElementById("lineReduced").setAttribute("points", "");
    impactText.textContent = "";
  }

  document.getElementById("emiResultSection").style.display = "block";
});
