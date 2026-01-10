document.getElementById("calculateBtn").addEventListener("click", function () {

  const $ = (id) => document.getElementById(id);

  const sipAmt = Number($("sipAmount").value);
  const sipYears = Number($("sipYears").value);
  const sipRate = Number($("sipRate").value) / 100 / 12;

  const fdAmt = Number($("fdAmount").value);
  const fdYears = Number($("fdYears").value);
  const fdRate = Number($("fdRate").value) / 100;

  const lsAmt = Number($("lsAmount").value);
  const lsYears = Number($("lsYears").value);
  const lsRate = Number($("lsRate").value) / 100;

  // SIP calculation
  let sipValue = 0;
  for (let i = 0; i < sipYears * 12; i++) {
    sipValue = (sipValue + sipAmt) * (1 + sipRate);
  }
  const sipInvested = sipAmt * sipYears * 12;
  const sipGains = sipValue - sipInvested;

  // FD
  const fdInvested = fdAmt;
  const fdValue = fdAmt * Math.pow(1 + fdRate, fdYears);
  const fdGains = fdValue - fdInvested;

  // Lumpsum
  const lsInvested = lsAmt;
  const lsValue = lsAmt * Math.pow(1 + lsRate, lsYears);
  const lsGains = lsValue - lsInvested;

  // Text results
  $("sipInvested").textContent = "₹" + sipInvested.toLocaleString("en-IN");
  $("sipGains").textContent = "₹" + Math.round(sipGains).toLocaleString("en-IN");
  $("sipResult").textContent = "₹" + Math.round(sipValue).toLocaleString("en-IN");

  $("fdInvested").textContent = "₹" + fdInvested.toLocaleString("en-IN");
  $("fdGains").textContent = "₹" + Math.round(fdGains).toLocaleString("en-IN");
  $("fdResult").textContent = "₹" + Math.round(fdValue).toLocaleString("en-IN");

  $("lsInvested").textContent = "₹" + lsInvested.toLocaleString("en-IN");
  $("lsGains").textContent = "₹" + Math.round(lsGains).toLocaleString("en-IN");
  $("lsResult").textContent = "₹" + Math.round(lsValue).toLocaleString("en-IN");

  // Graph scaling
  const max = Math.max(sipValue, fdValue, lsValue);

  function setBar(invest, gain, investId, gainId) {
    const investEl = $(investId);
    const gainEl = $(gainId);
    if (!investEl || !gainEl) return;

    investEl.style.width = (invest / max * 100) + "%";
    gainEl.style.width = (gain / max * 100) + "%";

    investEl.textContent = "₹" + Math.round(invest / 100000) + "L";
    gainEl.textContent = "+₹" + Math.round(gain / 100000) + "L";
  }

  setBar(sipInvested, sipGains, "sipInvestBar", "sipGainBar");
  setBar(fdInvested, fdGains, "fdInvestBar", "fdGainBar");
  setBar(lsInvested, lsGains, "lsInvestBar", "lsGainBar");

  // Winner
  let winner = "SIP";
  if (fdValue > sipValue && fdValue > lsValue) winner = "FD";
  if (lsValue > sipValue && lsValue > fdValue) winner = "Lumpsum";

  $("winnerText").textContent =
    winner + " gives the highest total value for this example.";

  $("resultSection").style.display = "block";
});
