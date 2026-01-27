/* ==================================================================
   SIP CALCULATOR LOGIC (Supports SIP & Lumpsum Modes)
   ================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    
    // --- 1. Select Elements ---
    const amtSlider = document.getElementById("amt-slider");
    const rateSlider = document.getElementById("rate-slider");
    const yearsSlider = document.getElementById("years-slider");

    const displayAmt = document.getElementById("display-amt");
    const displayRate = document.getElementById("display-rate");
    const displayYears = document.getElementById("display-years");
    const labelAmt = document.getElementById("amt-label");

    const resInvested = document.getElementById("res-invested");
    const resGains = document.getElementById("res-gains");
    const resTotal = document.getElementById("res-total");

    const tabs = document.querySelectorAll(".calc-tab");
    
    // Default Mode
    let isLumpsum = false;
    let sipChart;

    // --- 2. Tab Switching Logic ---
    tabs.forEach(tab => {
        tab.addEventListener("click", function() {
            // Remove active class from all
            tabs.forEach(t => t.classList.remove("active"));
            // Add active to clicked
            this.classList.add("active");
            
            // Check type
            const type = this.getAttribute("data-type");
            if(type === "lumpsum") {
                isLumpsum = true;
                labelAmt.textContent = "Total Investment";
                amtSlider.max = 5000000; // 50 Lakhs max for slider
                amtSlider.value = 50000;
            } else {
                isLumpsum = false;
                labelAmt.textContent = "Monthly Investment";
                amtSlider.max = 100000; // 1 Lakh max for monthly
                amtSlider.value = 5000;
            }
            calculate();
        });
        // Function to update the Blue Background Fill
function updateSliderFill(slider) {
    const val = slider.value;
    const min = slider.min;
    const max = slider.max;
    
    // Calculate percentage
    const percentage = ((val - min) * 100) / (max - min);
    
    // Update the background size (Blue on left, White on right)
    slider.style.backgroundSize = percentage + '% 100%';
}

// Add this to your existing Event Listeners loop
const sliders = document.querySelectorAll("input[type=range]");
sliders.forEach(slider => {
    slider.addEventListener("input", function() {
        updateSliderFill(this);
    });
    // Initialize on load
    updateSliderFill(slider); 
});
    });

    // --- 3. Calculation Logic ---
    function calculate() {
        let P = parseFloat(amtSlider.value);
        let r = parseFloat(rateSlider.value);
        let t = parseFloat(yearsSlider.value);

        // Update Text Displays
        displayAmt.textContent = "₹" + P.toLocaleString("en-IN");
        displayRate.textContent = r + "%";
        displayYears.textContent = t + " Yr";

        let investedVal, totalVal, gainVal;

        if (isLumpsum) {
            // LUMPSUM FORMULA: A = P(1 + r/100)^n
            investedVal = P;
            totalVal = P * Math.pow((1 + r / 100), t);
            gainVal = totalVal - investedVal;
        } else {
            // SIP FORMULA: M = P * ({[1 + i]^n - 1} / i) * (1 + i)
            let n = t * 12; // months
            let i = (r / 100) / 12; // monthly rate
            
            totalVal = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
            investedVal = P * n;
            gainVal = totalVal - investedVal;
        }

        // Update Result Text
        resInvested.textContent = "₹" + Math.round(investedVal).toLocaleString("en-IN");
        resGains.textContent = "₹" + Math.round(gainVal).toLocaleString("en-IN");
        resTotal.textContent = "₹" + Math.round(totalVal).toLocaleString("en-IN");

        updateChart(investedVal, gainVal);
    }

    // --- 4. Chart Logic (Chart.js) ---
    function updateChart(invested, gains) {
        const ctx = document.getElementById('sipChart').getContext('2d');
        
        if (sipChart) {
            sipChart.destroy();
        }

        sipChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Invested Amount', 'Est. Returns'],
                datasets: [{
                    data: [invested, gains],
                    backgroundColor: [
                        '#1e293b',  // Dark Slate (Invested)
                        '#38bdf8'   // Bright Blue (Gains)
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
                cutout: '75%', // Thickness of the ring
            }
        });
    }

    // --- 5. Event Listeners ---
    amtSlider.addEventListener("input", calculate);
    rateSlider.addEventListener("input", calculate);
    yearsSlider.addEventListener("input", calculate);

    // Initial Run
    calculate();
});