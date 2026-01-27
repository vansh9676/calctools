/* ==================================================================
   RD CALCULATOR LOGIC (Quarterly Compounding on Monthly Deposits)
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

    let rdChart;

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
        let P = parseFloat(amtSlider.value); // Monthly Installment
        let r = parseFloat(rateSlider.value); // Annual Rate
        let t = parseFloat(yearsSlider.value); // Years

        displayAmt.textContent = "₹" + P.toLocaleString("en-IN");
        displayRate.textContent = r + "%";
        displayYears.textContent = t + " Yr";

        let months = t * 12;
        let investedAmt = P * months;
        let maturityAmt = 0;

        // RD FORMULA (General Quarterly Compounding approximation)
        // Since calculating quarterly compounding for EVERY monthly installment is complex
        // and varies by bank software, the standard industry approximation formula is:
        // M = P * n + P * n(n+1)/2 * (r/12/100)  <-- This is simple interest on installments
        // But for "High Value" accuracy, we try to simulate compounding:
        
        // Exact method: Iterate through each installment
        // Each installment 'i' (from 1 to n) stays invested for (n - i + 1) months
        // But banks compound quarterly. 
        
        // Standard Approximation used by online tools (Compound Interest):
        // M = P * [ (1+i)^n - 1 ] / [ 1-(1+i)^(-1/3) ] ... Too complex for basic JS
        
        // Using the "Indian Bank Association" formula logic loop:
        let quarterlyRate = r / 400; 
        maturityAmt = 0;
        
        // We calculate maturity for each monthly deposit
        for (let i = 0; i < months; i++) {
            // Months remaining for this specific installment
            let monthsRemaining = months - i; 
            
            // Convert months to quarters
            let quarters = monthsRemaining / 3;
            
            // Compound interest for this installment
            let installmentMaturity = P * Math.pow((1 + quarterlyRate), quarters);
            maturityAmt += installmentMaturity;
        }

        let interestEarned = maturityAmt - investedAmt;

        resInvested.textContent = "₹" + Math.round(investedAmt).toLocaleString("en-IN");
        resInterest.textContent = "₹" + Math.round(interestEarned).toLocaleString("en-IN");
        resTotal.textContent = "₹" + Math.round(maturityAmt).toLocaleString("en-IN");

        updateChart(investedAmt, interestEarned);
    }

    // --- Chart ---
    function updateChart(invested, interest) {
        const ctx = document.getElementById('rdChart').getContext('2d');
        
        if (rdChart) {
            rdChart.destroy();
        }

        rdChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Invested', 'Interest'],
                datasets: [{
                    data: [invested, interest],
                    backgroundColor: [
                        '#1e293b',  // Dark Slate
                        '#a5b4fc'   // Soft Purple
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