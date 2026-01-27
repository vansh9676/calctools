/* ==================================================================
   SSY CALCULATOR LOGIC
   ================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    
    // Elements
    const amtSlider = document.getElementById("amt-slider");
    const ageSlider = document.getElementById("age-slider");
    const rateSlider = document.getElementById("rate-slider");

    const displayAmt = document.getElementById("display-amt");
    const displayAge = document.getElementById("display-age");
    const displayRate = document.getElementById("display-rate");

    const resInvested = document.getElementById("res-invested");
    const resInterest = document.getElementById("res-interest");
    const resTotal = document.getElementById("res-total");
    const resYear = document.getElementById("res-year");

    let ssyChart;

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
        let annualInvestment = parseFloat(amtSlider.value);
        let currentAge = parseInt(ageSlider.value);
        let rate = parseFloat(rateSlider.value);

        displayAmt.textContent = "₹" + annualInvestment.toLocaleString("en-IN");
        displayAge.textContent = currentAge + " Yr";
        displayRate.textContent = rate + "%";

        // SSY Rules:
        // 1. Deposits made for first 15 years from opening.
        // 2. Account matures 21 years from opening.
        // 3. Interest is compounded annually.

        let depositPeriod = 15;
        let maturityPeriod = 21;
        let currentBalance = 0;
        let totalInvested = 0;

        // Loop for 21 years
        for (let year = 1; year <= maturityPeriod; year++) {
            // Add deposit only if within first 15 years
            if (year <= depositPeriod) {
                currentBalance += annualInvestment;
                totalInvested += annualInvestment;
            }
            
            // Apply Interest
            let interest = currentBalance * (rate / 100);
            currentBalance += interest;
        }

        let totalInterest = currentBalance - totalInvested;
        let currentYear = new Date().getFullYear();
        let maturityYear = currentYear + 21;

        resInvested.textContent = "₹" + Math.round(totalInvested).toLocaleString("en-IN");
        resInterest.textContent = "₹" + Math.round(totalInterest).toLocaleString("en-IN");
        resTotal.textContent = "₹" + Math.round(currentBalance).toLocaleString("en-IN");
        resYear.textContent = maturityYear;

        updateChart(totalInvested, totalInterest);
    }

    // --- Chart ---
    function updateChart(invested, interest) {
        const ctx = document.getElementById('ssyChart').getContext('2d');
        
        if (ssyChart) {
            ssyChart.destroy();
        }

        ssyChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Total Invested', 'Total Interest'],
                datasets: [{
                    data: [invested, interest],
                    backgroundColor: [
                        '#1e293b',  // Dark Slate
                        '#db2777'   // Pink (Theme for Girl Child Scheme)
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                cutout: '75%',
            }
        });
    }

    // --- Events ---
    [amtSlider, ageSlider, rateSlider].forEach(slider => {
        slider.addEventListener("input", function() {
            updateSliderFill(this);
            calculate();
        });
        updateSliderFill(slider);
    });

    calculate();
});