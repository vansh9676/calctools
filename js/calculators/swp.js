/* ==================================================================
   SWP CALCULATOR LOGIC (Mutual Fund & FD Modes)
   ================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    
    // Elements
    const amtSlider = document.getElementById("amt-slider");
    const withdrawSlider = document.getElementById("withdraw-slider");
    const rateSlider = document.getElementById("rate-slider");
    const yearsSlider = document.getElementById("years-slider");

    const displayAmt = document.getElementById("display-amt");
    const displayWithdraw = document.getElementById("display-withdraw");
    const displayRate = document.getElementById("display-rate");
    const displayYears = document.getElementById("display-years");

    const resInvested = document.getElementById("res-invested");
    const resWithdrawn = document.getElementById("res-withdrawn");
    const resBalance = document.getElementById("res-balance");

    const modeBtns = document.querySelectorAll('.mode-btn');

    let swpChart;
    let isFD = false; // Default is Mutual Fund

    // --- 1. Mode Switch Logic (MF vs FD) ---
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // UI Toggle
            modeBtns.forEach(b => {
                b.style.background = 'transparent';
                b.style.color = '#9ca3af';
            });
            this.style.background = '#38bdf8';
            this.style.color = '#0f172a';

            // Logic Switch
            if(this.dataset.mode === 'fd') {
                isFD = true;
                rateSlider.value = 6.5; // Default FD Rate
                rateSlider.max = 10;
                // Visual cue for FD
                document.getElementById('display-rate').style.color = '#e2e8f0'; 
            } else {
                isFD = false;
                rateSlider.value = 10; // Default MF Rate
                rateSlider.max = 20;
                document.getElementById('display-rate').style.color = '#38bdf8';
            }
            
            updateSliderFill(rateSlider);
            calculate();
        });
    });


    // --- 2. Slider Fill ---
    function updateSliderFill(slider) {
        const val = slider.value;
        const min = slider.min;
        const max = slider.max;
        const percentage = ((val - min) * 100) / (max - min);
        slider.style.backgroundSize = percentage + '% 100%';
    }

    // --- 3. Calculation ---
    function calculate() {
        let initialCorpus = parseFloat(amtSlider.value);
        let monthlyWithdrawal = parseFloat(withdrawSlider.value);
        let annualRate = parseFloat(rateSlider.value);
        let years = parseFloat(yearsSlider.value);

        displayAmt.textContent = "₹" + initialCorpus.toLocaleString("en-IN");
        displayWithdraw.textContent = "₹" + monthlyWithdrawal.toLocaleString("en-IN");
        displayRate.textContent = annualRate + "%";
        displayYears.textContent = years + " Yr";

        let months = years * 12;
        // Monthly Rate: Simple division is standard for SWP calculators
        // (Even for FD, monthly payout is usually Simple Interest or Annual/12)
        let monthlyRate = annualRate / 100 / 12;
        
        let currentBalance = initialCorpus;
        let totalWithdrawn = 0;

        // Loop through each month
        for(let i = 0; i < months; i++) {
            // 1. Earn Interest
            let interest = currentBalance * monthlyRate;
            
            // 2. Add Interest to Balance
            currentBalance = currentBalance + interest;
            
            // 3. Subtract Withdrawal
            currentBalance = currentBalance - monthlyWithdrawal;
            
            // Track total withdrawn
            totalWithdrawn += monthlyWithdrawal;

            // Stop if money runs out
            if(currentBalance < 0) {
                currentBalance = 0;
                break; 
            }
        }

        resInvested.textContent = "₹" + Math.round(initialCorpus).toLocaleString("en-IN");
        resWithdrawn.textContent = "₹" + Math.round(totalWithdrawn).toLocaleString("en-IN");
        resBalance.textContent = "₹" + Math.round(currentBalance).toLocaleString("en-IN");

        updateChart(currentBalance, totalWithdrawn);
    }

    // --- 4. Chart ---
    function updateChart(balance, withdrawn) {
        const ctx = document.getElementById('swpChart').getContext('2d');
        
        if (swpChart) {
            swpChart.destroy();
        }

        swpChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Remaining Balance', 'Total Withdrawn'],
                datasets: [{
                    data: [balance, withdrawn],
                    backgroundColor: [
                        isFD ? '#a5b4fc' : '#38bdf8',  // Purple for FD, Blue for MF
                        '#22c55e'   // Green (Money Enjoyed)
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

    // --- 5. Event Listeners ---
    [amtSlider, withdrawSlider, rateSlider, yearsSlider].forEach(slider => {
        slider.addEventListener("input", function() {
            updateSliderFill(this);
            calculate();
        });
        updateSliderFill(slider);
    });

    calculate();
});