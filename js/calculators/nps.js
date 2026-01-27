/* ==================================================================
   NPS CALCULATOR LOGIC
   ================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    
    // Elements
    const amtSlider = document.getElementById("amt-slider");
    const ageSlider = document.getElementById("age-slider");
    const rateSlider = document.getElementById("rate-slider");
    const annuitySlider = document.getElementById("annuity-slider");

    const displayAmt = document.getElementById("display-amt");
    const displayAge = document.getElementById("display-age");
    const displayRate = document.getElementById("display-rate");
    const displayAnnuity = document.getElementById("display-annuity");

    const resInvested = document.getElementById("res-invested");
    const resCorpus = document.getElementById("res-corpus");
    const resLumpsum = document.getElementById("res-lumpsum");
    const resPension = document.getElementById("res-pension");

    let npsChart;

    // --- Slider Fill ---
    function updateSliderFill(slider) {
        const val = slider.value;
        const min = slider.min;
        const max = slider.max;
        const percentage = ((val - min) * 100) / (max - min);
        slider.style.backgroundSize = percentage + '% 100%';
    }

    // --- Calculation ---
    function calculate() {
        let monthlyInv = parseFloat(amtSlider.value);
        let currentAge = parseInt(ageSlider.value);
        let annualRate = parseFloat(rateSlider.value);
        let annuityPercent = parseInt(annuitySlider.value);

        displayAmt.textContent = "₹" + monthlyInv.toLocaleString("en-IN");
        displayAge.textContent = currentAge + " Yr";
        displayRate.textContent = annualRate + "%";
        displayAnnuity.textContent = annuityPercent + "%";

        // NPS matures at 60
        let retirementAge = 60;
        let investmentYears = retirementAge - currentAge;
        
        // Safety check if user is already 60 or older
        if (investmentYears <= 0) investmentYears = 1;

        let months = investmentYears * 12;
        let monthlyRate = annualRate / 100 / 12;

        // 1. Calculate Corpus at 60 (Standard SIP Formula)
        // FV = P * [ (1+i)^n - 1 ] * (1+i)/i
        let corpus = monthlyInv * ( (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate ) * (1 + monthlyRate);
        
        let totalInvested = monthlyInv * months;

        // 2. Split Corpus based on Annuity %
        let annuityAmount = (corpus * annuityPercent) / 100;
        let lumpsumAmount = corpus - annuityAmount;

        // 3. Calculate Monthly Pension from Annuity Amount
        // Assuming Annuity Return Rate of approx 6% (standard conservation estimate for annuity plans)
        let annuityRate = 6; 
        let monthlyPension = (annuityAmount * annuityRate) / 100 / 12;

        // Display Results (Shorten large numbers to Cr/Lakh if needed, or full)
        // Using helper for readability
        resInvested.textContent = formatCurrency(totalInvested);
        resCorpus.textContent = formatCurrency(corpus);
        resLumpsum.textContent = formatCurrency(lumpsumAmount);
        resPension.textContent = "₹" + Math.round(monthlyPension).toLocaleString("en-IN");

        updateChart(lumpsumAmount, annuityAmount);
    }

    function formatCurrency(num) {
        if (num >= 10000000) {
            return "₹" + (num / 10000000).toFixed(2) + " Cr";
        } else if (num >= 100000) {
            return "₹" + (num / 100000).toFixed(2) + " L";
        } else {
            return "₹" + Math.round(num).toLocaleString("en-IN");
        }
    }

    // --- Chart ---
    function updateChart(lumpsum, annuity) {
        const ctx = document.getElementById('npsChart').getContext('2d');
        
        if (npsChart) {
            npsChart.destroy();
        }

        npsChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Lump Sum (Withdrawal)', 'Annuity (Pension)'],
                datasets: [{
                    data: [lumpsum, annuity],
                    backgroundColor: [
                        '#22c55e',  // Green (Cash in Hand)
                        '#f59e0b'   // Orange (Locked for Pension)
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: true, position: 'bottom', labels: { color: '#9ca3af' } } }
            }
        });
    }

    // --- Events ---
    [amtSlider, ageSlider, rateSlider, annuitySlider].forEach(slider => {
        slider.addEventListener("input", function() {
            updateSliderFill(this);
            calculate();
        });
        updateSliderFill(slider);
    });

    calculate();
});