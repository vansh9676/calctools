/* ==================================================================
   MULTI-COUNTRY INCOME TAX CALCULATOR
   ================================================================== */

function updateSliderFill(slider) {
    const min = slider.min ? slider.min : 0;
    const max = slider.max ? slider.max : 100;
    const value = slider.value;

    const percent = ((value - min) / (max - min)) * 100;

    slider.style.background =
        `linear-gradient(to right, #38bdf8 ${percent}%, #334155 ${percent}%)`;
}

document.addEventListener("DOMContentLoaded", function () {

    
    // --- Elements ---
    const countrySelect = document.getElementById("country-select");
    const incomeSlider = document.getElementById("income-slider");
    const labelIncome = document.getElementById("label-income");
    const displayIncome = document.getElementById("display-income");
    const govLink = document.getElementById("gov-link");

    // India Specific Inputs
    const cSlider = document.getElementById("80c-slider");
    const dSlider = document.getElementById("80d-slider");
    const hraSlider = document.getElementById("hra-slider");
    const display80c = document.getElementById("display-80c");
    const display80d = document.getElementById("display-80d");
    const displayHRA = document.getElementById("display-hra");

    // Sections to Toggle
    const inputsIndia = document.getElementById("inputs-india");
    const inputsUSA = document.getElementById("inputs-usa");
    const inputsUK = document.getElementById("inputs-uk");
    const resultsIndia = document.getElementById("results-india");
    const resultsGlobal = document.getElementById("results-global");
    
    const contentIndia = document.getElementById("content-india");
    const contentUSA = document.getElementById("content-usa");
    const contentUK = document.getElementById("content-uk");

    // Chart
    let taxChart;
    let currentCountry = "india";

    // --- 1. Country Switching Logic ---
    countrySelect.addEventListener("change", function() {
        currentCountry = this.value;
        updateUIForCountry();
        calculate();
    });

    function updateUIForCountry() {
        // Hide all specific sections first
        inputsIndia.style.display = "none";
        inputsUSA.style.display = "none";
        inputsUK.style.display = "none";
        resultsIndia.style.display = "none";
        resultsGlobal.style.display = "none";
        contentIndia.style.display = "none";
        contentUSA.style.display = "none";
        contentUK.style.display = "none";

        if(currentCountry === "india") {
            // Show India
            inputsIndia.style.display = "block";
            resultsIndia.style.display = "block";
            contentIndia.style.display = "block";
            
            // Adjust Sliders
            incomeSlider.max = 10000000; // 1 Cr
            incomeSlider.step = 50000;
            if(incomeSlider.value < 300000) incomeSlider.value = 1200000;
            
            // Gov Link
            govLink.href = "https://eportal.incometax.gov.in/";
            govLink.innerText = "e-Filing Portal (India) ↗";

        } else if(currentCountry === "usa") {
            // Show USA
            inputsUSA.style.display = "block";
            resultsGlobal.style.display = "block";
            contentUSA.style.display = "block";
            
            // Adjust Sliders
            incomeSlider.max = 500000; // $500k
            incomeSlider.step = 1000;
            incomeSlider.value = 75000; // Default Salary
            
            // Gov Link
            govLink.href = "https://www.irs.gov/";
            govLink.innerText = "IRS Official Site ↗";

        } else if(currentCountry === "uk") {
            // Show UK
            inputsUK.style.display = "block";
            resultsGlobal.style.display = "block";
            contentUK.style.display = "block";
            
            // Adjust Sliders
            incomeSlider.max = 200000; // £200k
            incomeSlider.step = 500;
            incomeSlider.value = 45000; // Default Salary
            
            // Gov Link
            govLink.href = "https://www.gov.uk/income-tax";
            govLink.innerText = "GOV.UK Tax ↗";
        }
    }


    // --- 2. Calculation Logic ---
    function calculate() {
        let grossIncome = parseFloat(incomeSlider.value);
        
        // Update Income Display based on Currency
        if(currentCountry === "india") displayIncome.textContent = formatCurrency(grossIncome, "₹");
        else if(currentCountry === "usa") displayIncome.textContent = formatCurrency(grossIncome, "$");
        else if(currentCountry === "uk") displayIncome.textContent = formatCurrency(grossIncome, "£");

        if(currentCountry === "india") {
            calculateIndia(grossIncome);
        } else if(currentCountry === "usa") {
            calculateUSA(grossIncome);
        } else if(currentCountry === "uk") {
            calculateUK(grossIncome);
        }
    }


    // --- INDIA LOGIC (Old vs New) ---
    function calculateIndia(grossIncome) {
        // Update deduction displays
        let ded80c = parseFloat(cSlider.value);
        let ded80d = parseFloat(dSlider.value);
        let dedHRA = parseFloat(hraSlider.value);
        let stdDed = 75000;

        display80c.textContent = formatCurrency(ded80c, "₹");
        display80d.textContent = formatCurrency(ded80d, "₹");
        displayHRA.textContent = formatCurrency(dedHRA, "₹");

        // Old Regime Tax
        let taxableOld = grossIncome - (ded80c + ded80d + dedHRA + stdDed);
        if(taxableOld < 0) taxableOld = 0;
        let taxOld = getIndiaTaxOld(taxableOld);

        // New Regime Tax
        let taxableNew = grossIncome - stdDed;
        if(taxableNew < 0) taxableNew = 0;
        let taxNew = getIndiaTaxNew(taxableNew);

        // Update India Results
        document.getElementById("res-old").textContent = formatCurrency(taxOld, "₹");
        document.getElementById("res-new").textContent = formatCurrency(taxNew, "₹");
        
        const verdict = document.getElementById("res-verdict");
        if(taxNew < taxOld) {
            verdict.textContent = "Choose New Regime (Save " + formatCurrency(taxOld - taxNew, "₹") + ")";
            verdict.style.color = "#22c55e";
        } else {
            verdict.textContent = "Choose Old Regime (Save " + formatCurrency(taxNew - taxOld, "₹") + ")";
            verdict.style.color = "#38bdf8";
        }

        updateChart(taxOld, taxNew, ["Old Regime", "New Regime"]);
    }

    function getIndiaTaxOld(income) {
        let tax = 0;
        if (income > 1000000) {
            tax += (income - 1000000) * 0.30 + 112500;
        } else if (income > 500000) {
            tax += (income - 500000) * 0.20 + 12500;
        } else if (income > 250000) {
            tax += (income - 250000) * 0.05;
        }
        if (income <= 500000) tax = 0; // Rebate 87A
        return tax * 1.04; // Cess
    }

    function getIndiaTaxNew(income) {
        let tax = 0;
        // FY 25-26 New Slabs
        if (income > 1500000) tax += (income - 1500000) * 0.30 + 150000;
        else if (income > 1200000) tax += (income - 1200000) * 0.20 + 90000;
        else if (income > 900000) tax += (income - 900000) * 0.15 + 45000;
        else if (income > 700000) tax += (income - 700000) * 0.10 + 25000; // 7L barrier
        else if (income > 300000) tax += (income - 300000) * 0.05;
        
        if (income <= 700000) tax = 0; // Rebate 87A
        return tax * 1.04; // Cess
    }


    // --- USA LOGIC (Federal 2024 Single) ---
    function calculateUSA(grossIncome) {
        let stdDed = 14600;
        let taxable = grossIncome - stdDed;
        if(taxable < 0) taxable = 0;

        let tax = 0;
        // 2024 Brackets
        if (taxable > 609350) tax += (taxable - 609350) * 0.37 + 183647; // Simplified accumulation
        else if (taxable > 243725) tax += (taxable - 243725) * 0.35 + 55678;
        else if (taxable > 191950) tax += (taxable - 191950) * 0.32 + 39110;
        else if (taxable > 100525) tax += (taxable - 100525) * 0.24 + 17168;
        else if (taxable > 47150) tax += (taxable - 47150) * 0.22 + 5426;
        else if (taxable > 11600) tax += (taxable - 11600) * 0.12 + 1160;
        else tax += taxable * 0.10;

        updateGlobalResults(taxable, tax, "$");
        updateChart(tax, grossIncome - tax, ["Federal Tax", "Net Income"]);
    }


    // --- UK LOGIC (2024-25) ---
    function calculateUK(grossIncome) {
        // Personal Allowance Taper
        let allowance = 12570;
        if (grossIncome > 100000) {
            let reduction = (grossIncome - 100000) / 2;
            allowance = Math.max(0, allowance - reduction);
        }

        let taxable = grossIncome - allowance;
        if(taxable < 0) taxable = 0;

        let tax = 0;
        // UK Bands
        if (taxable > 125140) { // Additional 45% (Over 125140 taxable)
            // Note: Taxable starts after allowance.
            // Actually UK bands are based on gross usually, but simpler to view as taxable stack
            // 20% on 37700
            // 40% on next...
            // Let's use simpler Gross logic:
            
            // 0 - 12570: 0%
            // 12571 - 50270: 20%
            // 50271 - 125140: 40%
            // > 125140: 45%
            
            // This is complex due to allowance taper. Simplified Taxable stack:
            // Basic Rate Band: 37700
            // Higher Rate Band: 125140 - 50270 = 74870
            
            let temp = taxable;
            if(temp > 125140) { // 45%
                 tax += (temp - 125140) * 0.45;
                 temp = 125140;
            }
            if(temp > 37700) { // 40%
                tax += (temp - 37700) * 0.40;
                temp = 37700;
            }
            tax += temp * 0.20; // 20%
        } else {
             // Standard Logic if allowance exists
             // Basic rate on first 37700
             if(taxable > 37700) {
                 tax += (taxable - 37700) * 0.40;
                 tax += 37700 * 0.20;
             } else {
                 tax += taxable * 0.20;
             }
        }

        updateGlobalResults(taxable, tax, "£");
        updateChart(tax, grossIncome - tax, ["Income Tax", "Net Income"]);
    }


    function updateGlobalResults(taxable, tax, sym) {
        document.getElementById("res-global-taxable").textContent = formatCurrency(taxable, sym);
        document.getElementById("res-global-tax").textContent = formatCurrency(tax, sym);
        
        let rate = 0;
        let gross = parseFloat(incomeSlider.value);
        if(gross > 0) rate = (tax / gross) * 100;
        
        document.getElementById("res-global-rate").textContent = rate.toFixed(1) + "%";
    }

    function formatCurrency(num, sym) {
        if(sym === "₹") return sym + Math.round(num).toLocaleString("en-IN");
        return sym + Math.round(num).toLocaleString("en-US");
    }

    // --- Chart ---
    function updateChart(val1, val2, labels) {
        const ctx = document.getElementById('taxChart').getContext('2d');
        if (taxChart) taxChart.destroy();

        // For India we show Old vs New (Bar)
        // For Global we show Tax vs Net (Pie/Doughnut)
        
        if(currentCountry === "india") {
            taxChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        data: [val1, val2],
                        backgroundColor: ['#38bdf8', '#22c55e'],
                        borderRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        } else {
            taxChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: [val1, val2],
                        backgroundColor: ['#f87171', '#1e293b'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%'
                }
            });
        }
    }
     // --- 3. Event Listeners for Sliders ---
    [incomeSlider, cSlider, dSlider, hraSlider].forEach(slider => {
    if (!slider) return;

    slider.addEventListener("input", function () {
        updateSliderFill(this);
        calculate();
    });

    updateSliderFill(slider);
});


    calculate(); // Init
});