/* ==================================================================
   LUMPSUM CALCULATOR LOGIC
   ================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    
    // Select Elements
    const amtSlider = document.getElementById("amt-slider");
    const rateSlider = document.getElementById("rate-slider");
    const yearsSlider = document.getElementById("years-slider");

    const displayAmt = document.getElementById("display-amt");
    const displayRate = document.getElementById("display-rate");
    const displayYears = document.getElementById("display-years");

    const resInvested = document.getElementById("res-invested");
    const resGains = document.getElementById("res-gains");
    const resTotal = document.getElementById("res-total");

    let lumpsumChart;

    // --- Slider Fill Logic (Blue Progress Bar) ---
    function updateSliderFill(slider) {
        const val = slider.value;
        const min = slider.min;
        const max = slider.max;
        const percentage = ((val - min) * 100) / (max - min);
        slider.style.backgroundSize = percentage + '% 100%';
    }

    // --- Calculation Logic ---
    function calculate() {
        let P = parseFloat(amtSlider.value); // Principal
        let r = parseFloat(rateSlider.value); // Annual Rate
        let t = parseFloat(yearsSlider.value); // Years

        // Update Text Displays
        displayAmt.textContent = "₹" + P.toLocaleString("en-IN");
        displayRate.textContent = r + "%";
        displayYears.textContent = t + " Yr";

        // LUMPSUM FORMULA: A = P(1 + r/100)^t
        // (Compounded Annually is standard for Mutual Fund CAGR estimations)
        
        let totalVal = P * Math.pow((1 + r / 100), t);
        let investedVal = P;
        let gainVal = totalVal - investedVal;

        // Update Result Text
        resInvested.textContent = "₹" + Math.round(investedVal).toLocaleString("en-IN");
        resGains.textContent = "₹" + Math.round(gainVal).toLocaleString("en-IN");
        resTotal.textContent = "₹" + Math.round(totalVal).toLocaleString("en-IN");

        updateChart(investedVal, gainVal);
    }

    // --- Chart Logic ---
    function updateChart(invested, gains) {
        const ctx = document.getElementById('lumpsumChart').getContext('2d');
        
        if (lumpsumChart) {
            lumpsumChart.destroy();
        }

        lumpsumChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Invested Amount', 'Est. Returns'],
                datasets: [{
                    data: [invested, gains],
                    backgroundColor: [
                        '#1e293b',  // Dark Slate
                        '#38bdf8'   // Bright Blue
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += '₹' + Math.round(context.raw).toLocaleString("en-IN");
                                return label;
                            }
                        }
                    }
                },
                cutout: '75%',
            }
        });
    }

    // --- Event Listeners ---
    const sliders = [amtSlider, rateSlider, yearsSlider];
    
    sliders.forEach(slider => {
        slider.addEventListener("input", function() {
            updateSliderFill(this);
            calculate();
        });
        // Init Fill
        updateSliderFill(slider);
    });

    // Initial Run
    calculate();
});