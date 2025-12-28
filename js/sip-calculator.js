// SIP & Lump Sum Calculator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    // Toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    
    // SIP Inputs
    const monthlyInvestmentSlider = document.getElementById('monthlyInvestment');
    const sipExpectedReturnSlider = document.getElementById('sipExpectedReturn');
    const sipTimePeriodSlider = document.getElementById('sipTimePeriod');
    const stepUpSelect = document.getElementById('stepUp');
    
    const monthlyInvestmentValue = document.getElementById('monthlyInvestmentValue');
    const sipExpectedReturnValue = document.getElementById('sipExpectedReturnValue');
    const sipTimePeriodValue = document.getElementById('sipTimePeriodValue');
    
    // Lump Sum Inputs
    const lumpSumAmountSlider = document.getElementById('lumpSumAmount');
    const lumpsumExpectedReturnSlider = document.getElementById('lumpsumExpectedReturn');
    const lumpsumTimePeriodSlider = document.getElementById('lumpsumTimePeriod');
    const lumpsumFrequencySelect = document.getElementById('lumpsumFrequency');
    
    const lumpSumAmountValue = document.getElementById('lumpSumAmountValue');
    const lumpsumExpectedReturnValue = document.getElementById('lumpsumExpectedReturnValue');
    const lumpsumTimePeriodValue = document.getElementById('lumpsumTimePeriodValue');
    
    // Result Elements
    // SIP Results
    const sipInvestedAmount = document.getElementById('sipInvestedAmount');
    const sipEstimatedReturns = document.getElementById('sipEstimatedReturns');
    const sipTotalValue = document.getElementById('sipTotalValue');
    
    // Lump Sum Results
    const lumpsumInvestedAmount = document.getElementById('lumpsumInvestedAmount');
    const lumpsumEstimatedReturns = document.getElementById('lumpsumEstimatedReturns');
    const lumpsumTotalValue = document.getElementById('lumpsumTotalValue');
    
    // Comparison Results
    const comparisonSipValue = document.getElementById('comparisonSipValue');
    const comparisonLumpsumValue = document.getElementById('comparisonLumpsumValue');
    const valueDifference = document.getElementById('valueDifference');
    
    // Metrics
    const sipCAGR = document.getElementById('sipCAGR');
    const lumpsumCAGR = document.getElementById('lumpsumCAGR');
    const sipAbsoluteReturns = document.getElementById('sipAbsoluteReturns');
    const lumpsumAbsoluteReturns = document.getElementById('lumpsumAbsoluteReturns');
    const sipXIRR = document.getElementById('sipXIRR');
    const lumpsumXIRR = document.getElementById('lumpsumXIRR');
    const sipTotalInvestment = document.getElementById('sipTotalInvestment');
    const lumpsumTotalInvestment = document.getElementById('lumpsumTotalInvestment');
    
    // Table
    const yearlyBreakdown = document.getElementById('yearlyBreakdown');
    
    let growthChart = null;
    let currentView = 'both'; // 'both', 'sip', or 'lumpsum'
    
    // Format currency (Indian Rupee format)
    function formatCurrency(amount) {
        if (amount >= 10000000) { // 1 crore
            return '₹' + (amount / 10000000).toFixed(2) + ' Cr';
        } else if (amount >= 100000) { // 1 lakh
            return '₹' + (amount / 100000).toFixed(2) + ' L';
        } else if (amount >= 1000) { // 1 thousand
            return '₹' + amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        return '₹' + amount.toFixed(0);
    }
    
    // Format number with commas
    function formatNumberWithCommas(amount) {
        return '₹' + amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    // Format percentage
    function formatPercentage(rate, decimals = 1) {
        return rate.toFixed(decimals) + '%';
    }
    
    // Toggle view between SIP, Lump Sum, or Both
    function toggleView(viewType) {
        currentView = viewType;
        
        // Update toggle buttons
        toggleButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-type') === viewType) {
                btn.classList.add('active');
            }
        });
        
        // Show/hide input columns based on view
        const sipInputs = document.getElementById('sip-inputs');
        const lumpsumInputs = document.getElementById('lumpsum-inputs');
        
        switch(viewType) {
            case 'both':
                sipInputs.style.display = 'block';
                lumpsumInputs.style.display = 'block';
                break;
            case 'sip':
                sipInputs.style.display = 'block';
                lumpsumInputs.style.display = 'none';
                break;
            case 'lumpsum':
                sipInputs.style.display = 'none';
                lumpsumInputs.style.display = 'block';
                break;
        }
        
        // Recalculate
        calculateInvestments();
    }
    
    // Calculate SIP returns
    function calculateSIP(monthlyInvestment, annualReturn, years, stepUpRate) {
        const monthlyRate = annualReturn / 12 / 100;
        const months = years * 12;
        
        let totalInvested = 0;
        let futureValue = 0;
        let yearlyData = [];
        
        // Calculate for each year
        for (let year = 0; year < years; year++) {
            const currentYearInvestment = monthlyInvestment * Math.pow(1 + stepUpRate, year);
            let yearInvested = 0;
            let yearFutureValue = 0;
            
            for (let month = 0; month < 12; month++) {
                const monthsFromStart = year * 12 + month;
                const monthsRemaining = months - monthsFromStart - 1;
                
                if (monthsRemaining >= 0) {
                    const monthValue = currentYearInvestment * Math.pow(1 + monthlyRate, monthsRemaining);
                    yearFutureValue += monthValue;
                    yearInvested += currentYearInvestment;
                    totalInvested += currentYearInvestment;
                    futureValue += monthValue;
                }
            }
            
            yearlyData.push({
                year: year + 1,
                invested: yearInvested,
                value: yearFutureValue
            });
        }
        
        const returns = futureValue - totalInvested;
        
        // Calculate CAGR (Compound Annual Growth Rate)
        const cagr = (Math.pow(futureValue / totalInvested, 1 / years) - 1) * 100;
        
        // Calculate absolute returns percentage
        const absoluteReturns = (returns / totalInvested) * 100;
        
        return {
            totalInvested,
            futureValue,
            returns,
            cagr,
            absoluteReturns,
            xirr: annualReturn, // For simplicity, using expected return as XIRR
            yearlyData
        };
    }
    
    // Calculate Lump Sum returns
    function calculateLumpSum(investmentAmount, annualReturn, years, frequency) {
        let totalInvested = 0;
        let futureValue = 0;
        let yearlyData = [];
        
        switch(frequency) {
            case 'one-time':
                // One-time investment
                totalInvested = investmentAmount;
                futureValue = investmentAmount * Math.pow(1 + annualReturn / 100, years);
                
                // Yearly breakdown
                for (let year = 1; year <= years; year++) {
                    const yearValue = investmentAmount * Math.pow(1 + annualReturn / 100, year);
                    yearlyData.push({
                        year,
                        invested: year === 1 ? investmentAmount : 0,
                        value: yearValue
                    });
                }
                break;
                
            case 'yearly':
                // Yearly investments (like recurring lump sum)
                for (let year = 1; year <= years; year++) {
                    const yearsRemaining = years - year;
                    const yearInvestment = investmentAmount;
                    totalInvested += yearInvestment;
                    
                    // Each yearly investment compounds for remaining years
                    const yearFutureValue = yearInvestment * Math.pow(1 + annualReturn / 100, yearsRemaining);
                    futureValue += yearFutureValue;
                    
                    // Calculate value at the end of each year
                    let cumulativeValue = 0;
                    for (let y = 1; y <= year; y++) {
                        const remaining = year - y;
                        cumulativeValue += investmentAmount * Math.pow(1 + annualReturn / 100, remaining);
                    }
                    
                    yearlyData.push({
                        year,
                        invested: yearInvestment,
                        value: cumulativeValue
                    });
                }
                break;
                
            case 'half-yearly':
                // Half-yearly investments
                const halfYearlyInvestment = investmentAmount / 2;
                const halfYearlyRate = annualReturn / 2 / 100;
                
                for (let year = 1; year <= years; year++) {
                    let yearInvested = 0;
                    let yearValue = 0;
                    
                    // Two half-yearly investments per year
                    for (let half = 0; half < 2; half++) {
                        const periodsFromStart = (year - 1) * 2 + half;
                        const periodsRemaining = years * 2 - periodsFromStart - 1;
                        
                        if (periodsRemaining >= 0) {
                            yearInvested += halfYearlyInvestment;
                            totalInvested += halfYearlyInvestment;
                            const periodValue = halfYearlyInvestment * Math.pow(1 + halfYearlyRate, periodsRemaining);
                            yearValue += periodValue;
                            futureValue += periodValue;
                        }
                    }
                    
                    yearlyData.push({
                        year,
                        invested: yearInvested,
                        value: yearValue
                    });
                }
                break;
                
            case 'quarterly':
                // Quarterly investments
                const quarterlyInvestment = investmentAmount / 4;
                const quarterlyRate = annualReturn / 4 / 100;
                
                for (let year = 1; year <= years; year++) {
                    let yearInvested = 0;
                    let yearValue = 0;
                    
                    // Four quarterly investments per year
                    for (let quarter = 0; quarter < 4; quarter++) {
                        const periodsFromStart = (year - 1) * 4 + quarter;
                        const periodsRemaining = years * 4 - periodsFromStart - 1;
                        
                        if (periodsRemaining >= 0) {
                            yearInvested += quarterlyInvestment;
                            totalInvested += quarterlyInvestment;
                            const periodValue = quarterlyInvestment * Math.pow(1 + quarterlyRate, periodsRemaining);
                            yearValue += periodValue;
                            futureValue += periodValue;
                        }
                    }
                    
                    yearlyData.push({
                        year,
                        invested: yearInvested,
                        value: yearValue
                    });
                }
                break;
        }
        
        const returns = futureValue - totalInvested;
        
        // Calculate CAGR
        const cagr = (Math.pow(futureValue / totalInvested, 1 / years) - 1) * 100;
        
        // Calculate absolute returns percentage
        const absoluteReturns = (returns / totalInvested) * 100;
        
        return {
            totalInvested,
            futureValue,
            returns,
            cagr,
            absoluteReturns,
            xirr: annualReturn, // For simplicity
            yearlyData
        };
    }
    
    // Calculate and update all investments
    function calculateInvestments() {
        // Get input values
        const monthlyInvestment = parseFloat(monthlyInvestmentSlider.value);
        const sipAnnualReturn = parseFloat(sipExpectedReturnSlider.value);
        const sipYears = parseFloat(sipTimePeriodSlider.value);
        const stepUpRate = parseFloat(stepUpSelect.value) / 100;
        
        const lumpSumAmount = parseFloat(lumpSumAmountSlider.value);
        const lumpsumAnnualReturn = parseFloat(lumpsumExpectedReturnSlider.value);
        const lumpsumYears = parseFloat(lumpsumTimePeriodSlider.value);
        const lumpsumFrequency = lumpsumFrequencySelect.value;
        
        // Calculate SIP
        const sipResults = calculateSIP(monthlyInvestment, sipAnnualReturn, sipYears, stepUpRate);
        
        // Calculate Lump Sum
        const lumpsumResults = calculateLumpSum(lumpSumAmount, lumpsumAnnualReturn, lumpsumYears, lumpsumFrequency);
        
        // Update display values
        monthlyInvestmentValue.textContent = formatNumberWithCommas(monthlyInvestment);
        sipExpectedReturnValue.textContent = formatPercentage(sipAnnualReturn);
        sipTimePeriodValue.textContent = sipYears + (sipYears === 1 ? ' year' : ' years');
        
        lumpSumAmountValue.textContent = formatNumberWithCommas(lumpSumAmount);
        lumpsumExpectedReturnValue.textContent = formatPercentage(lumpsumAnnualReturn);
        lumpsumTimePeriodValue.textContent = lumpsumYears + (lumpsumYears === 1 ? ' year' : ' years');
        
        // Update results based on current view
        if (currentView === 'both' || currentView === 'sip') {
            sipInvestedAmount.textContent = formatNumberWithCommas(sipResults.totalInvested);
            sipEstimatedReturns.textContent = formatNumberWithCommas(sipResults.returns);
            sipTotalValue.textContent = formatNumberWithCommas(sipResults.futureValue);
            
            sipCAGR.textContent = formatPercentage(sipResults.cagr);
            sipAbsoluteReturns.textContent = formatPercentage(sipResults.absoluteReturns);
            sipXIRR.textContent = formatPercentage(sipResults.xirr);
            sipTotalInvestment.textContent = formatNumberWithCommas(sipResults.totalInvested);
        }
        
        if (currentView === 'both' || currentView === 'lumpsum') {
            lumpsumInvestedAmount.textContent = formatNumberWithCommas(lumpsumResults.totalInvested);
            lumpsumEstimatedReturns.textContent = formatNumberWithCommas(lumpsumResults.returns);
            lumpsumTotalValue.textContent = formatNumberWithCommas(lumpsumResults.futureValue);
            
            lumpsumCAGR.textContent = formatPercentage(lumpsumResults.cagr);
            lumpsumAbsoluteReturns.textContent = formatPercentage(lumpsumResults.absoluteReturns);
            lumpsumXIRR.textContent = formatPercentage(lumpsumResults.xirr);
            lumpsumTotalInvestment.textContent = formatNumberWithCommas(lumpsumResults.totalInvested);
        }
        
        // Update comparison
        if (currentView === 'both') {
            comparisonSipValue.textContent = formatNumberWithCommas(sipResults.futureValue);
            comparisonLumpsumValue.textContent = formatNumberWithCommas(lumpsumResults.futureValue);
            
            const difference = sipResults.futureValue - lumpsumResults.futureValue;
            valueDifference.textContent = formatNumberWithCommas(Math.abs(difference));
            
            // Add color to difference
            const diffElement = document.getElementById('valueDifference');
            if (difference > 0) {
                diffElement.style.color = '#4CAF50';
                diffElement.innerHTML = formatNumberWithCommas(difference) + ' <span style="font-size: 0.8em">(SIP leads)</span>';
            } else if (difference < 0) {
                diffElement.style.color = '#2196F3';
                diffElement.innerHTML = formatNumberWithCommas(Math.abs(difference)) + ' <span style="font-size: 0.8em">(Lump Sum leads)</span>';
            } else {
                diffElement.style.color = '#FF9800';
                diffElement.innerHTML = formatNumberWithCommas(0);
            }
        }
        
        // Generate yearly breakdown
        generateYearlyBreakdown(sipResults.yearlyData, lumpsumResults.yearlyData);
        
        // Update growth chart
        updateGrowthChart(sipResults.yearlyData, lumpsumResults.yearlyData);
        
        // Add animation
        const elementsToAnimate = [
            sipInvestedAmount, sipEstimatedReturns, sipTotalValue,
            lumpsumInvestedAmount, lumpsumEstimatedReturns, lumpsumTotalValue
        ];
        
        elementsToAnimate.forEach(el => {
            if (el.textContent !== '') {
                el.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    el.style.transform = 'scale(1)';
                }, 300);
            }
        });
    }
    
    // Generate yearly breakdown table
    function generateYearlyBreakdown(sipYearlyData, lumpsumYearlyData) {
        let html = '';
        const maxYears = Math.max(sipYearlyData.length, lumpsumYearlyData.length);
        
        let sipCumulativeInvested = 0;
        let lumpsumCumulativeInvested = 0;
        let sipCumulativeValue = 0;
        let lumpsumCumulativeValue = 0;
        
        for (let i = 0; i < maxYears; i++) {
            const sipData = sipYearlyData[i] || { year: i + 1, invested: 0, value: 0 };
            const lumpsumData = lumpsumYearlyData[i] || { year: i + 1, invested: 0, value: 0 };
            
            sipCumulativeInvested += sipData.invested;
            lumpsumCumulativeInvested += lumpsumData.invested;
            sipCumulativeValue = sipData.value;
            lumpsumCumulativeValue = lumpsumData.value;
            
            const difference = sipCumulativeValue - lumpsumCumulativeValue;
            
            html += `
                <tr>
                    <td>${sipData.year}</td>
                    <td>${formatNumberWithCommas(sipCumulativeInvested)}</td>
                    <td>${formatNumberWithCommas(sipCumulativeValue)}</td>
                    <td>${formatNumberWithCommas(lumpsumCumulativeInvested)}</td>
                    <td>${formatNumberWithCommas(lumpsumCumulativeValue)}</td>
                    <td style="color: ${difference > 0 ? '#4CAF50' : difference < 0 ? '#2196F3' : '#666'}; font-weight: ${difference !== 0 ? '600' : '400'}">
                        ${formatNumberWithCommas(Math.abs(difference))} 
                        ${difference > 0 ? '(SIP)' : difference < 0 ? '(Lump Sum)' : ''}
                    </td>
                </tr>
            `;
        }
        
        yearlyBreakdown.innerHTML = html;
    }
    
    // Update growth chart
    function updateGrowthChart(sipYearlyData, lumpsumYearlyData) {
        const ctx = document.getElementById('growthChart').getContext('2d');
        
        // Prepare data for chart
        const labels = [];
        const sipData = [];
        const lumpsumData = [];
        const sipInvestedData = [];
        const lumpsumInvestedData = [];
        
        const maxYears = Math.max(sipYearlyData.length, lumpsumYearlyData.length);
        
        for (let i = 0; i < maxYears; i++) {
            labels.push(`Year ${i + 1}`);
            
            const sipValue = sipYearlyData[i] ? sipYearlyData[i].value : 0;
            const lumpsumValue = lumpsumYearlyData[i] ? lumpsumYearlyData[i].value : 0;
            
            sipData.push(sipValue);
            lumpsumData.push(lumpsumValue);
            
            // Calculate cumulative invested
            const sipCumulativeInvested = sipYearlyData.slice(0, i + 1).reduce((sum, data) => sum + data.invested, 0);
            const lumpsumCumulativeInvested = lumpsumYearlyData.slice(0, i + 1).reduce((sum, data) => sum + data.invested, 0);
            
            sipInvestedData.push(sipCumulativeInvested);
            lumpsumInvestedData.push(lumpsumCumulativeInvested);
        }
        
        // Destroy previous chart if it exists
        if (growthChart) {
            growthChart.destroy();
        }
        
        // Determine which datasets to show based on current view
        const datasets = [];
        
        if (currentView === 'both' || currentView === 'sip') {
            datasets.push(
                {
                    label: 'SIP Investment',
                    data: sipInvestedData,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'SIP Total Value',
                    data: sipData,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.3)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                }
            );
        }
        
        if (currentView === 'both' || currentView === 'lumpsum') {
            datasets.push(
                {
                    label: 'Lump Sum Investment',
                    data: lumpsumInvestedData,
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Lump Sum Total Value',
                    data: lumpsumData,
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.3)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                }
            );
        }
        
        // Create new chart
        growthChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += formatNumberWithCommas(context.parsed.y);
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }
    
    // Update slider value display with animation
    function updateSliderValue(slider, displayElement, isCurrency = false, isPercentage = false) {
        let value = parseFloat(slider.value);
        
        if (isCurrency) {
            displayElement.textContent = formatNumberWithCommas(value);
        } else if (isPercentage) {
            displayElement.textContent = formatPercentage(value);
        } else {
            displayElement.textContent = value + (value === 1 ? ' year' : ' years');
        }
        
        // Add animation
        displayElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            displayElement.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Event listeners for toggle buttons
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleView(this.getAttribute('data-type'));
        });
    });
    
    // Event listeners for SIP sliders
    monthlyInvestmentSlider.addEventListener('input', function() {
        updateSliderValue(this, monthlyInvestmentValue, true);
        calculateInvestments();
    });
    
    sipExpectedReturnSlider.addEventListener('input', function() {
        updateSliderValue(this, sipExpectedReturnValue, false, true);
        calculateInvestments();
    });
    
    sipTimePeriodSlider.addEventListener('input', function() {
        updateSliderValue(this, sipTimePeriodValue);
        calculateInvestments();
    });
    
    stepUpSelect.addEventListener('change', calculateInvestments);
    
    // Event listeners for Lump Sum sliders
    lumpSumAmountSlider.addEventListener('input', function() {
        updateSliderValue(this, lumpSumAmountValue, true);
        calculateInvestments();
    });
    
    lumpsumExpectedReturnSlider.addEventListener('input', function() {
        updateSliderValue(this, lumpsumExpectedReturnValue, false, true);
        calculateInvestments();
    });
    
    lumpsumTimePeriodSlider.addEventListener('input', function() {
        updateSliderValue(this, lumpsumTimePeriodValue);
        calculateInvestments();
    });
    
    lumpsumFrequencySelect.addEventListener('change', calculateInvestments);
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const isVisible = navList.style.display === 'flex';
            navList.style.display = isVisible ? 'none' : 'flex';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!e.target.closest('.nav') && !e.target.closest('.mobile-menu-btn')) {
                    navList.style.display = 'none';
                }
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navList.style.display = 'flex';
            } else {
                navList.style.display = 'none';
            }
        });
    }
    
    // Initialize calculator
    calculateInvestments();
});