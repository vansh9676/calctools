// EMI Calculator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const loanAmountSlider = document.getElementById('loanAmount');
    const interestRateSlider = document.getElementById('interestRate');
    const loanTenureSlider = document.getElementById('loanTenure');
    const loanTypeSelect = document.getElementById('loanType');
    
    const loanAmountValue = document.getElementById('loanAmountValue');
    const interestRateValue = document.getElementById('interestRateValue');
    const loanTenureValue = document.getElementById('loanTenureValue');
    
    const monthlyEMI = document.getElementById('monthlyEMI');
    const totalInterest = document.getElementById('totalInterest');
    const totalPayment = document.getElementById('totalPayment');
    const principalAmount = document.getElementById('principalAmount');
    const detailInterest = document.getElementById('detailInterest');
    const detailDuration = document.getElementById('detailDuration');
    const annualInterest = document.getElementById('annualInterest');
    
    // Format currency
    function formatCurrency(amount) {
        return '₹' + amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    // Format percentage
    function formatPercentage(rate) {
        return rate.toFixed(1) + '%';
    }
    
    // Calculate EMI
    function calculateEMI() {
        // Get input values
        const principal = parseFloat(loanAmountSlider.value);
        const annualRate = parseFloat(interestRateSlider.value);
        const years = parseFloat(loanTenureSlider.value);
        
        // Calculate monthly values
        const monthlyRate = annualRate / 12 / 100;
        const months = years * 12;
        
        // EMI Calculation formula
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
        
        // Calculate totals
        const totalPaymentAmount = emi * months;
        const totalInterestAmount = totalPaymentAmount - principal;
        
        // Update display values
        loanAmountValue.textContent = formatCurrency(principal);
        interestRateValue.textContent = formatPercentage(annualRate);
        loanTenureValue.textContent = years + (years === 1 ? ' year' : ' years');
        
        // Update results
        monthlyEMI.textContent = formatCurrency(emi);
        totalInterest.textContent = formatCurrency(totalInterestAmount);
        totalPayment.textContent = formatCurrency(totalPaymentAmount);
        
        // Update details
        principalAmount.textContent = formatCurrency(principal);
        detailInterest.textContent = formatCurrency(totalInterestAmount);
        detailDuration.textContent = months + ' months';
        annualInterest.textContent = formatPercentage(annualRate);
    }
    
    // Update slider value display with animation
    function updateSliderValue(slider, displayElement, isCurrency = false, isPercentage = false) {
        let value = parseFloat(slider.value);
        
        if (isCurrency) {
            displayElement.textContent = formatCurrency(value);
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
    
    // Event listeners for sliders
    loanAmountSlider.addEventListener('input', function() {
        updateSliderValue(this, loanAmountValue, true);
        calculateEMI();
    });
    
    interestRateSlider.addEventListener('input', function() {
        updateSliderValue(this, interestRateValue, false, true);
        calculateEMI();
    });
    
    loanTenureSlider.addEventListener('input', function() {
        updateSliderValue(this, loanTenureValue);
        calculateEMI();
    });
    
    loanTypeSelect.addEventListener('change', function() {
        // Set default values based on loan type
        const type = this.value;
        switch(type) {
            case 'home':
                loanAmountSlider.value = 300000;
                interestRateSlider.value = 7.5;
                loanTenureSlider.value = 20;
                break;
            case 'car':
                loanAmountSlider.value = 25000;
                interestRateSlider.value = 5.5;
                loanTenureSlider.value = 5;
                break;
            case 'personal':
                loanAmountSlider.value = 15000;
                interestRateSlider.value = 12.5;
                loanTenureSlider.value = 3;
                break;
            case 'education':
                loanAmountSlider.value = 50000;
                interestRateSlider.value = 6.5;
                loanTenureSlider.value = 10;
                break;
        }
        
        // Trigger input events to update displays
        loanAmountSlider.dispatchEvent(new Event('input'));
        interestRateSlider.dispatchEvent(new Event('input'));
        loanTenureSlider.dispatchEvent(new Event('input'));
    });
    
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
    
    // Initialize calculation
    calculateEMI();
});