/* ==================================================================
   HRA CALCULATOR LOGIC
   ================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    
    // Inputs
    const basicSlider = document.getElementById("basic-slider");
    const daSlider = document.getElementById("da-slider");
    const hraSlider = document.getElementById("hra-slider");
    const rentSlider = document.getElementById("rent-slider");

    // Displays
    const displayBasic = document.getElementById("display-basic");
    const displayDA = document.getElementById("display-da");
    const displayHRA = document.getElementById("display-hra");
    const displayRent = document.getElementById("display-rent");

    // Results
    const resExempt = document.getElementById("res-exempt");
    const resTaxable = document.getElementById("res-taxable");
    const logic1 = document.getElementById("logic-1");
    const logic2 = document.getElementById("logic-2");
    const logic3 = document.getElementById("logic-3");

    // Toggle
    const modeBtns = document.querySelectorAll('.mode-btn');
    let isMetro = true; // Default
    let hraChart;

    // --- 1. Mode Switch (Metro/Non-Metro) ---
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            modeBtns.forEach(b => {
                b.style.background = 'transparent';
                b.style.color = '#9ca3af';
            });
            this.style.background = '#38bdf8';
            this.style.color = '#0f172a';
            
            isMetro = (this.dataset.metro === 'yes');
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
        let basic = parseFloat(basicSlider.value);
        let da = parseFloat(daSlider.value);
        let hraReceived = parseFloat(hraSlider.value);
        let rentPaid = parseFloat(rentSlider.value);
        let salary = basic + da;

        displayBasic.textContent = formatK(basic);
        displayDA.textContent = formatK(da);
        displayHRA.textContent = formatK(hraReceived);
        displayRent.textContent = formatK(rentPaid);

        // HRA Rule: Least of 3
        
        // 1. Actual HRA Received
        let val1 = hraReceived;

        // 2. Rent Paid - 10% of Salary
        let val2 = rentPaid - (0.10 * salary);
        if (val2 < 0) val2 = 0;

        // 3. 50% (Metro) or 40% (Non-Metro) of Salary
        let val3 = isMetro ? (0.50 * salary) : (0.40 * salary);

        // Result: Exempt is Min of above
        let exemptHRA = Math.min(val1, val2, val3);
        let taxableHRA = hraReceived - exemptHRA;
        if (taxableHRA < 0) taxableHRA = 0;

        // Update Results
        resExempt.textContent = "₹" + Math.round(exemptHRA).toLocaleString("en-IN");
        resTaxable.textContent = "₹" + Math.round(taxableHRA).toLocaleString("en-IN");

        // Update Logic Text
        logic1.textContent = formatK(val1);
        logic2.textContent = formatK(val2);
        logic3.textContent = formatK(val3);

        updateChart(exemptHRA, taxableHRA);
    }

    function formatK(num) {
        if(num >= 100000) return "₹" + (num/100000).toFixed(2) + " L";
        return "₹" + (num/1000).toFixed(1) + " K";
    }

    // --- 4. Chart ---
    function updateChart(exempt, taxable) {
        const ctx = document.getElementById('hraChart').getContext('2d');
        
        if (hraChart) {
            hraChart.destroy();
        }

        hraChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Exempt (Tax Free)', 'Taxable HRA'],
                datasets: [{
                    data: [exempt, taxable],
                    backgroundColor: [
                        '#22c55e',  // Green
                        '#1e293b'   // Dark
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

    // --- 5. Events ---
    [basicSlider, daSlider, hraSlider, rentSlider].forEach(slider => {
        slider.addEventListener("input", function() {
            updateSliderFill(this);
            calculate();
        });
        updateSliderFill(slider);
    });

    calculate();
});