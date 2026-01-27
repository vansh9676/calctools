/* ==================================================================
   EPF CALCULATOR LOGIC
   ================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    
    // Elements
    const salarySlider = document.getElementById("salary-slider");
    const ageSlider = document.getElementById("age-slider");
    const hikeSlider = document.getElementById("hike-slider");
    const rateSlider = document.getElementById("rate-slider");

    const displaySalary = document.getElementById("display-salary");
    const displayAge = document.getElementById("display-age");
    const displayHike = document.getElementById("display-hike");
    const displayRate = document.getElementById("display-rate");

    const resEmployee = document.getElementById("res-employee");
    const resEmployer = document.getElementById("res-employer");
    const resInterest = document.getElementById("res-interest");
    const resTotal = document.getElementById("res-total");

    let epfChart;

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
        let basicSalary = parseFloat(salarySlider.value);
        let currentAge = parseInt(ageSlider.value);
        let annualHike = parseFloat(hikeSlider.value);
        let annualRate = parseFloat(rateSlider.value);

        displaySalary.textContent = "₹" + basicSalary.toLocaleString("en-IN");
        displayAge.textContent = currentAge + " Yr";
        displayHike.textContent = annualHike + "%";
        displayRate.textContent = annualRate + "%";

        let retirementAge = 58;
        let yearsToRetire = retirementAge - currentAge;
        if(yearsToRetire <= 0) yearsToRetire = 1;

        let totalEmployeeContrib = 0;
        let totalEmployerContrib = 0;
        let totalInterest = 0;
        let currentBalance = 0;

        // Loop through each year until retirement
        for(let i = 0; i < yearsToRetire; i++) {
            
            // Monthly Calculation for this year
            for(let m = 0; m < 12; m++) {
                
                // 1. Employee Contribution (12% of Basic)
                let empShare = basicSalary * 0.12;
                
                // 2. Employer Contribution to EPF (3.67% of Basic)
                // Note: EPS gets 8.33%, but max ₹1250. 
                // However, for pure EPF Corpus calculator, we calculate the 3.67% flowing to PF.
                // Or if salary > 15000 and not capped, standard practice is:
                // Employer PF = (12% of Basic) - EPS Contribution.
                // Simplified for estimation: 3.67% goes to PF Corpus if not capped.
                let employerShare = basicSalary * 0.0367;

                // Add contributions to balance
                currentBalance += empShare + employerShare;
                
                // Track Totals
                totalEmployeeContrib += empShare;
                totalEmployerContrib += employerShare;

                // 3. Monthly Interest Calculation (Compounded Annually technically, but calculated on monthly running balance)
                // Interest = (Balance * Rate) / 1200
                let monthlyInterest = (currentBalance * annualRate) / 1200;
                currentBalance += monthlyInterest;
                totalInterest += monthlyInterest;
            }

            // Increase Salary for next year
            basicSalary = basicSalary + (basicSalary * (annualHike / 100));
        }

        // Display Results
        resEmployee.textContent = formatCurrency(totalEmployeeContrib);
        resEmployer.textContent = formatCurrency(totalEmployerContrib);
        resInterest.textContent = formatCurrency(totalInterest);
        resTotal.textContent = formatCurrency(currentBalance);

        updateChart(totalEmployeeContrib, totalEmployerContrib, totalInterest);
    }

    function formatCurrency(num) {
        if (num >= 10000000) {
            return "₹" + (num / 10000000).toFixed(2) + " Cr";
        } else if (num >= 100000) {
            return "₹" + (num / 100000).toFixed(2) + " L";
        } else {
            return "₹" + Math.round(num).toLocaleString("en-IN");
        }
    }

    // --- Chart ---
    function updateChart(emp, employer, interest) {
        const ctx = document.getElementById('epfChart').getContext('2d');
        
        if (epfChart) {
            epfChart.destroy();
        }

        epfChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Your Share', 'Employer Share', 'Total Interest'],
                datasets: [{
                    data: [emp, employer, interest],
                    backgroundColor: [
                        '#38bdf8',  // Blue (You)
                        '#a5b4fc',  // Purple (Boss)
                        '#22c55e'   // Green (Interest)
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: true, position: 'bottom', labels: { color: '#9ca3af' } } },
                cutout: '70%',
            }
        });
    }

    // --- Events ---
    [salarySlider, ageSlider, hikeSlider, rateSlider].forEach(slider => {
        slider.addEventListener("input", function() {
            updateSliderFill(this);
            calculate();
        });
        updateSliderFill(slider);
    });

    calculate();
});