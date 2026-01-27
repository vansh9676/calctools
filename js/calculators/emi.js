/* ==================================================================
   EMI CALCULATOR LOGIC (Home / Car / Personal)
   ================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    
    // Select Elements
    const loanSlider = document.getElementById("loan-slider");
    const rateSlider = document.getElementById("rate-slider");
    const yearsSlider = document.getElementById("years-slider");

    const displayLoan = document.getElementById("display-loan");
    const displayRate = document.getElementById("display-rate");
    const displayYears = document.getElementById("display-years");

    const resEMI = document.getElementById("res-emi");
    const resPrincipal = document.getElementById("res-principal");
    const resInterest = document.getElementById("res-interest");
    const resTotal = document.getElementById("res-total");

    const tabs = document.querySelectorAll(".calc-tab");
    
    let emiChart;

    // --- 1. Tab Switching Logic ---
    tabs.forEach(tab => {
        tab.addEventListener("click", function() {
            // Remove active class
            tabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");
            
            const type = this.getAttribute("data-type");
            
            // Set Defaults based on Loan Type (Groww Style Experience)
            if(type === "home") {
                loanSlider.max = 10000000; // 1 Cr
                loanSlider.value = 5000000; // 50L
                rateSlider.value = 8.5;
                yearsSlider.max = 30;
                yearsSlider.value = 20;
            } else if (type === "car") {
                loanSlider.max = 5000000; // 50L
                loanSlider.value = 1000000; // 10L
                rateSlider.value = 9.5;
                yearsSlider.max = 7;
                yearsSlider.value = 5;
            } else if (type === "personal") {
                loanSlider.max = 2500000; // 25L
                loanSlider.value = 500000; // 5L
                rateSlider.value = 11;
                yearsSlider.max = 5;
                yearsSlider.value = 3;
            }
            
            // Update Slider Fills
            [loanSlider, rateSlider, yearsSlider].forEach(s => updateSliderFill(s));
            calculate();
        });
    });

    // --- 2. Slider Fill Logic ---
    function updateSliderFill(slider) {
        const val = slider.value;
        const min = slider.min;
        const max = slider.max;
        const percentage = ((val - min) * 100) / (max - min);
        slider.style.backgroundSize = percentage + '% 100%';
    }

    // --- 3. Calculation Logic ---
    function calculate() {
        let P = parseFloat(loanSlider.value);
        let annualRate = parseFloat(rateSlider.value);
        let years = parseFloat(yearsSlider.value);

        // Update Text Displays
        displayLoan.textContent = "₹" + P.toLocaleString("en-IN");
        displayRate.textContent = annualRate + "%";
        displayYears.textContent = years + " Yr";

        // EMI FORMULA: E = [P x R x (1+R)^N] / [(1+R)^N-1]
        let r = annualRate / 12 / 100; // Monthly Rate
        let n = years * 12; // Months

        let emi = 0;
        if (annualRate === 0) {
            emi = P / n;
        } else {
            emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        }

        let totalPayment = emi * n;
        let totalInterest = totalPayment - P;

        // Update Result Text
        resEMI.textContent = "₹" + Math.round(emi).toLocaleString("en-IN");
        resPrincipal.textContent = "₹" + Math.round(P).toLocaleString("en-IN");
        resInterest.textContent = "₹" + Math.round(totalInterest).toLocaleString("en-IN");
        resTotal.textContent = "₹" + Math.round(totalPayment).toLocaleString("en-IN");

        updateChart(P, totalInterest);
    }

    // --- 4. Chart Logic ---
    function updateChart(principal, interest) {
        const ctx = document.getElementById('emiChart').getContext('2d');
        
        if (emiChart) {
            emiChart.destroy();
        }

        emiChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Principal Amount', 'Total Interest'],
                datasets: [{
                    data: [principal, interest],
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

    // --- 5. Event Listeners ---
    const sliders = [loanSlider, rateSlider, yearsSlider];
    
    sliders.forEach(slider => {
        slider.addEventListener("input", function() {
            updateSliderFill(this);
            calculate();
        });
        updateSliderFill(slider);
    });

    calculate(); // Initial Run
});