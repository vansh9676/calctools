/* ==================================================================
   GRATUITY CALCULATOR LOGIC
   ================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    
    // Elements
    const salarySlider = document.getElementById("salary-slider");
    const yearsSlider = document.getElementById("years-slider");
    
    const displaySalary = document.getElementById("display-salary");
    const displayYears = document.getElementById("display-years");
    
    const resTotal = document.getElementById("res-total");
    const resFormula = document.getElementById("res-formula");
    const resTax = document.getElementById("res-tax");
    
    const warningText = document.getElementById("eligibility-warning");
    const modeBtns = document.querySelectorAll('.mode-btn');

    let gratuityChart;
    let isCovered = true; // Default: Covered under Act

    // --- 1. Mode Switch Logic ---
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
            isCovered = (this.dataset.covered === 'yes');
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
        let salary = parseFloat(salarySlider.value); // Basic + DA
        let years = parseFloat(yearsSlider.value);

        displaySalary.textContent = "₹" + salary.toLocaleString("en-IN");
        displayYears.textContent = years + " Yr";

        // Eligibility Check
        if (years < 5) {
            warningText.style.display = 'block';
        } else {
            warningText.style.display = 'none';
        }

        let gratuityAmount = 0;

        if (isCovered) {
            // Covered under Act Formula: (15/26) * Salary * Years
            // Note: Years are usually rounded off in covered case (handled by user input here simplistically)
            gratuityAmount = (15 * salary * years) / 26;
            resFormula.textContent = "Formula: (15 / 26) * Salary * Years";
        } else {
            // Not Covered Formula: (15/30) * Salary * Years
            gratuityAmount = (15 * salary * years) / 30;
            resFormula.textContent = "Formula: (15 / 30) * Salary * Years";
        }

        // Round to nearest int
        gratuityAmount = Math.round(gratuityAmount);
        
        // Tax Limit Check
        let taxFreeLimit = 2000000; // 20 Lakhs
        if (gratuityAmount > taxFreeLimit) {
            resTax.textContent = "Taxable Amount: ₹" + (gratuityAmount - taxFreeLimit).toLocaleString("en-IN");
            resTax.style.color = "#f87171"; // Red
        } else {
            resTax.textContent = "Fully Tax Free (Limit: ₹20 Lakhs)";
            resTax.style.color = "#22c55e"; // Green
        }

        resTotal.textContent = "₹" + gratuityAmount.toLocaleString("en-IN");

        updateChart(gratuityAmount);
    }

    // --- 4. Chart ---
    function updateChart(amount) {
        const ctx = document.getElementById('gratuityChart').getContext('2d');
        
        if (gratuityChart) {
            gratuityChart.destroy();
        }

        // For Gratuity, a gauge or single value chart is better, but keeping Doughnut for consistency
        // Showing Gratuity vs "Salary of 1 Year" context just for visualization
        let annualSalary = parseFloat(salarySlider.value) * 12;

        gratuityChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Gratuity Amount', 'Annual Salary Context'],
                datasets: [{
                    data: [amount, annualSalary],
                    backgroundColor: [
                        '#38bdf8',  // Blue (Gratuity)
                        '#1e293b'   // Dark (Context)
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
                                if(context.label === 'Annual Salary Context') return 'Annual Salary: ₹' + context.raw.toLocaleString();
                                return 'Gratuity: ₹' + context.raw.toLocaleString();
                            }
                        }
                    }
                },
                cutout: '75%',
            }
        });
    }

    // --- 5. Events ---
    [salarySlider, yearsSlider].forEach(slider => {
        slider.addEventListener("input", function() {
            updateSliderFill(this);
            calculate();
        });
        updateSliderFill(slider);
    });

    calculate();
});