// Percentage Calculator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const typeBtns = document.querySelectorAll('.type-btn');
    const calculatorSections = document.querySelectorAll('.calculator-section');
    
    // Basic percentage elements
    const percentageOfInput = document.getElementById('percentageOf');
    const numberValueInput = document.getElementById('numberValue');
    const calculateBasicBtn = document.getElementById('calculateBasic');
    const basicResult = document.getElementById('basicResult');
    const basicExplanation = document.getElementById('basicExplanation');
    
    // Percentage increase elements
    const originalValueInput = document.getElementById('originalValue');
    const newValueInput = document.getElementById('newValue');
    const calculateIncreaseBtn = document.getElementById('calculateIncrease');
    const increaseResult = document.getElementById('increaseResult');
    const increaseExplanation = document.getElementById('increaseExplanation');
    
    // Percentage decrease elements
    const decreaseOriginalInput = document.getElementById('decreaseOriginal');
    const decreaseNewInput = document.getElementById('decreaseNew');
    const calculateDecreaseBtn = document.getElementById('calculateDecrease');
    const decreaseResult = document.getElementById('decreaseResult');
    const decreaseExplanation = document.getElementById('decreaseExplanation');
    
    // Percentage difference elements
    const value1Input = document.getElementById('value1');
    const value2Input = document.getElementById('value2');
    const calculateDifferenceBtn = document.getElementById('calculateDifference');
    const differenceResult = document.getElementById('differenceResult');
    const differenceExplanation = document.getElementById('differenceExplanation');
    
    // Type selector functionality
    typeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            
            // Update active button
            typeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide calculator sections
            calculatorSections.forEach(section => {
                section.classList.remove('active');
            });
            
            document.getElementById(`${type}-calculator`).classList.add('active');
            
            // Calculate for the active type
            switch(type) {
                case 'basic':
                    calculateBasicPercentage();
                    break;
                case 'increase':
                    calculatePercentageIncrease();
                    break;
                case 'decrease':
                    calculatePercentageDecrease();
                    break;
                case 'difference':
                    calculatePercentageDifference();
                    break;
            }
        });
    });
    
    // Basic percentage calculation
    function calculateBasicPercentage() {
        const percentage = parseFloat(percentageOfInput.value);
        const number = parseFloat(numberValueInput.value);
        
        if (isNaN(percentage) || isNaN(number)) {
            basicResult.textContent = '0';
            basicExplanation.textContent = 'Please enter valid numbers';
            return;
        }
        
        const result = (percentage / 100) * number;
        
        // Format result
        let formattedResult;
        if (Number.isInteger(result)) {
            formattedResult = result;
        } else {
            formattedResult = result.toFixed(2);
        }
        
        basicResult.textContent = formattedResult;
        basicExplanation.textContent = `${percentage}% of ${number} is ${formattedResult}`;
        
        // Add animation
        animateResult(basicResult);
    }
    
    // Percentage increase calculation
    function calculatePercentageIncrease() {
        const original = parseFloat(originalValueInput.value);
        const newVal = parseFloat(newValueInput.value);
        
        if (isNaN(original) || isNaN(newVal)) {
            increaseResult.textContent = '0%';
            increaseExplanation.textContent = 'Please enter valid numbers';
            return;
        }
        
        if (original === 0) {
            increaseResult.textContent = '∞%';
            increaseExplanation.textContent = 'Original value cannot be zero';
            return;
        }
        
        const increase = ((newVal - original) / original) * 100;
        
        // Format result
        let formattedResult;
        if (Number.isInteger(increase)) {
            formattedResult = `${increase}%`;
        } else {
            formattedResult = `${increase.toFixed(2)}%`;
        }
        
        increaseResult.textContent = formattedResult;
        increaseExplanation.textContent = `Increase from ${original} to ${newVal} is ${formattedResult}`;
        
        // Add animation
        animateResult(increaseResult);
    }
    
    // Percentage decrease calculation
    function calculatePercentageDecrease() {
        const original = parseFloat(decreaseOriginalInput.value);
        const newVal = parseFloat(decreaseNewInput.value);
        
        if (isNaN(original) || isNaN(newVal)) {
            decreaseResult.textContent = '0%';
            decreaseExplanation.textContent = 'Please enter valid numbers';
            return;
        }
        
        if (original === 0) {
            decreaseResult.textContent = '∞%';
            decreaseExplanation.textContent = 'Original value cannot be zero';
            return;
        }
        
        const decrease = ((original - newVal) / original) * 100;
        
        // Format result
        let formattedResult;
        if (Number.isInteger(decrease)) {
            formattedResult = `${decrease}%`;
        } else {
            formattedResult = `${decrease.toFixed(2)}%`;
        }
        
        decreaseResult.textContent = formattedResult;
        decreaseExplanation.textContent = `Decrease from ${original} to ${newVal} is ${formattedResult}`;
        
        // Add animation
        animateResult(decreaseResult);
    }
    
    // Percentage difference calculation
    function calculatePercentageDifference() {
        const val1 = parseFloat(value1Input.value);
        const val2 = parseFloat(value2Input.value);
        
        if (isNaN(val1) || isNaN(val2)) {
            differenceResult.textContent = '0%';
            differenceExplanation.textContent = 'Please enter valid numbers';
            return;
        }
        
        const average = (val1 + val2) / 2;
        
        if (average === 0) {
            differenceResult.textContent = '∞%';
            differenceExplanation.textContent = 'Average value cannot be zero';
            return;
        }
        
        const difference = (Math.abs(val1 - val2) / average) * 100;
        
        // Format result
        let formattedResult;
        if (Number.isInteger(difference)) {
            formattedResult = `${difference}%`;
        } else {
            formattedResult = `${difference.toFixed(2)}%`;
        }
        
        differenceResult.textContent = formattedResult;
        differenceExplanation.textContent = `Difference between ${val1} and ${val2} is ${formattedResult}`;
        
        // Add animation
        animateResult(differenceResult);
    }
    
    // Animation function
    function animateResult(element) {
        element.style.transform = 'scale(1.2)';
        element.style.color = '#667eea';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 300);
    }
    
    // Event listeners for basic percentage
    calculateBasicBtn.addEventListener('click', calculateBasicPercentage);
    percentageOfInput.addEventListener('input', calculateBasicPercentage);
    numberValueInput.addEventListener('input', calculateBasicPercentage);
    
    // Event listeners for percentage increase
    calculateIncreaseBtn.addEventListener('click', calculatePercentageIncrease);
    originalValueInput.addEventListener('input', calculatePercentageIncrease);
    newValueInput.addEventListener('input', calculatePercentageIncrease);
    
    // Event listeners for percentage decrease
    calculateDecreaseBtn.addEventListener('click', calculatePercentageDecrease);
    decreaseOriginalInput.addEventListener('input', calculatePercentageDecrease);
    decreaseNewInput.addEventListener('input', calculatePercentageDecrease);
    
    // Event listeners for percentage difference
    calculateDifferenceBtn.addEventListener('click', calculatePercentageDifference);
    value1Input.addEventListener('input', calculatePercentageDifference);
    value2Input.addEventListener('input', calculatePercentageDifference);
    
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
    
    // Initialize calculations
    calculateBasicPercentage();
});