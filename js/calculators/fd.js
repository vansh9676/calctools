/* ==================================================================
   FD CALCULATOR LOGIC
   ================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    
    const amtSlider = document.getElementById("amt-slider");
    const rateSlider = document.getElementById("rate-slider");
    const yearsSlider = document.getElementById("years-slider");

    const displayAmt = document.getElementById("display-amt");
    const displayRate = document.getElementById("display-rate");
    const displayYears = document.getElementById("display-years");

    const resInvested = document.getElementById("res-invested");
    const resInterest = document.getElementById("res-interest");
    const resTotal = document.getElementById("res-total");

    let fdChart;

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
        let P = parseFloat(amtSlider.value);
        let r = parseFloat(rateSlider.value);
        let t = parseFloat(yearsSlider.value);

        displayAmt.textContent = "₹" + P.toLocaleString("en-IN");
        displayRate.textContent = r + "%";
        displayYears.textContent = t + " Yr";

        // FD FORMULA (Compound Interest Quarterly)
        // A = P * (1 + r/400)^(4*t)
        
        let n = 4; // Quarterly compounding is standard in India
        let maturityAmt = P * Math.pow( (1 + r/400), (n*t) );
        
        let investedAmt = P;
        let interestEarned = maturityAmt - investedAmt;

        resInvested.textContent = "₹" + Math.round(investedAmt).toLocaleString("en-IN");
        resInterest.textContent = "₹" + Math.round(interestEarned).toLocaleString("en-IN");
        resTotal.textContent = "₹" + Math.round(maturityAmt).toLocaleString("en-IN");

        updateChart(investedAmt, interestEarned);
    }

    // --- Chart ---
    function updateChart(invested, interest) {
        const ctx = document.getElementById('fdChart').getContext('2d');
        
        if (fdChart) {
            fdChart.destroy();
        }

        fdChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Invested', 'Interest'],
                datasets: [{
                    data: [invested, interest],
                    backgroundColor: [
                        '#1e293b',  // Dark Slate
                        '#a5b4fc'   // Soft Purple for FD
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
    [amtSlider, yearsSlider, rateSlider].forEach(slider => {
        slider.addEventListener("input", function() {
            updateSliderFill(this);
            calculate();
        });
        updateSliderFill(slider);
    });

    calculate();
});