/* ==================================================================
   PPF CALCULATOR LOGIC
   ================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    
    const amtSlider = document.getElementById("amt-slider");
    const yearsSlider = document.getElementById("years-slider");
    const rateSlider = document.getElementById("rate-slider");

    const displayAmt = document.getElementById("display-amt");
    const displayYears = document.getElementById("display-years");
    const displayRate = document.getElementById("display-rate");

    const resInvested = document.getElementById("res-invested");
    const resInterest = document.getElementById("res-interest");
    const resTotal = document.getElementById("res-total");

    let ppfChart;

    // --- Slider Fill Logic ---
    function updateSliderFill(slider) {
        const val = slider.value;
        const min = slider.min;
        const max = slider.max;
        const percentage = ((val - min) * 100) / (max - min);
        slider.style.backgroundSize = percentage + '% 100%';
    }

    // --- Calculation Logic ---
    function calculate() {
        let annualAmt = parseFloat(amtSlider.value);
        let years = parseFloat(yearsSlider.value);
        let rate = parseFloat(rateSlider.value);

        displayAmt.textContent = "₹" + annualAmt.toLocaleString("en-IN");
        displayYears.textContent = years + " Yr";
        displayRate.textContent = rate + "%";

        // PPF FORMULA: A = P [({(1+i)^n}-1)/i] x (1+i)
        // P = Annual Instalment
        // n = Number of years
        // i = Rate of interest / 100

        let i = rate / 100;
        let maturityAmt = annualAmt * ( (Math.pow(1+i, years) - 1) / i ) * (1+i);
        
        let investedAmt = annualAmt * years;
        let interestEarned = maturityAmt - investedAmt;

        resInvested.textContent = "₹" + Math.round(investedAmt).toLocaleString("en-IN");
        resInterest.textContent = "₹" + Math.round(interestEarned).toLocaleString("en-IN");
        resTotal.textContent = "₹" + Math.round(maturityAmt).toLocaleString("en-IN");

        updateChart(investedAmt, interestEarned);
    }

    // --- Chart Logic ---
    function updateChart(invested, interest) {
        const ctx = document.getElementById('ppfChart').getContext('2d');
        
        if (ppfChart) {
            ppfChart.destroy();
        }

        ppfChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Invested', 'Interest'],
                datasets: [{
                    data: [invested, interest],
                    backgroundColor: [
                        '#1e293b',  // Dark Slate
                        '#22c55e'   // Green (Tax Free!)
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

    // --- Event Listeners ---
    [amtSlider, yearsSlider, rateSlider].forEach(slider => {
        slider.addEventListener("input", function() {
            updateSliderFill(this);
            calculate();
        });
        updateSliderFill(slider);
    });

    calculate();
});