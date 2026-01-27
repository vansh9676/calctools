/* ==================================================================
   GST CALCULATOR LOGIC
   ================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    
    // Elements
    const amtSlider = document.getElementById("amt-slider");
    const displayAmt = document.getElementById("display-amt");
    const displayRate = document.getElementById("display-rate");
    
    // Results
    const resNet = document.getElementById("res-net");
    const resGST = document.getElementById("res-gst");
    const resTotal = document.getElementById("res-total");
    const resCGST = document.getElementById("res-cgst");
    const resSGST = document.getElementById("res-sgst");
    
    // Buttons
    const modeBtns = document.querySelectorAll('.mode-btn');
    const rateBtns = document.querySelectorAll('.rate-btn');

    let currentRate = 18;
    let isExclusive = true; // Default: Add Tax
    let gstChart;

    // --- 1. Mode Switch (Inclusive / Exclusive) ---
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            modeBtns.forEach(b => {
                b.style.background = 'transparent';
                b.style.color = '#9ca3af';
            });
            this.style.background = '#38bdf8';
            this.style.color = '#0f172a';
            
            isExclusive = (this.dataset.mode === 'exclusive');
            calculate();
        });
    });

    // --- 2. Rate Selection (5, 12, 18, 28) ---
    window.setRate = function(rate) {
        currentRate = rate;
        displayRate.textContent = rate + "%";
        
        // Update UI classes
        rateBtns.forEach(b => b.classList.remove('active'));
        event.target.classList.add('active');
        
        calculate();
    }

    // --- 3. Slider Fill ---
    function updateSliderFill(slider) {
        const val = slider.value;
        const min = slider.min;
        const max = slider.max;
        const percentage = ((val - min) * 100) / (max - min);
        slider.style.backgroundSize = percentage + '% 100%';
    }

    // --- 4. Calculation Logic ---
    function calculate() {
        let amount = parseFloat(amtSlider.value);
        displayAmt.textContent = "₹" + amount.toLocaleString("en-IN");

        let netAmount = 0;
        let gstAmount = 0;
        let totalAmount = 0;

        if (isExclusive) {
            // Formula: Total = Base + (Base * Rate / 100)
            netAmount = amount;
            gstAmount = (amount * currentRate) / 100;
            totalAmount = netAmount + gstAmount;
        } else {
            // Formula: Base = Total / (1 + Rate/100)
            // Here 'amount' input is treated as Total
            totalAmount = amount;
            netAmount = amount / (1 + (currentRate / 100));
            gstAmount = totalAmount - netAmount;
        }

        // Breakdown
        let halfGST = gstAmount / 2;

        resNet.textContent = "₹" + Math.round(netAmount).toLocaleString("en-IN");
        resGST.textContent = "₹" + Math.round(gstAmount).toLocaleString("en-IN");
        resTotal.textContent = "₹" + Math.round(totalAmount).toLocaleString("en-IN");
        
        resCGST.textContent = "₹" + Math.round(halfGST).toLocaleString("en-IN");
        resSGST.textContent = "₹" + Math.round(halfGST).toLocaleString("en-IN");

        updateChart(netAmount, gstAmount);
    }

    // --- 5. Chart ---
    function updateChart(base, tax) {
        const ctx = document.getElementById('gstChart').getContext('2d');
        
        if (gstChart) {
            gstChart.destroy();
        }

        gstChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Net Cost', 'GST Tax'],
                datasets: [{
                    data: [base, tax],
                    backgroundColor: [
                        '#1e293b',  // Dark Slate
                        '#f59e0b'   // Orange (Tax)
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

    // --- 6. Events ---
    amtSlider.addEventListener("input", function() {
        updateSliderFill(this);
        calculate();
    });
    updateSliderFill(amtSlider);

    calculate();
});