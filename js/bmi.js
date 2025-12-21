// BMI Calculator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const unitBtns = document.querySelectorAll('.unit-btn');
    const metricInputs = document.getElementById('metric-inputs');
    const imperialInputs = document.getElementById('imperial-inputs');
    
    // Metric inputs
    const heightCmSlider = document.getElementById('heightCm');
    const weightKgSlider = document.getElementById('weightKg');
    const heightCmValue = document.getElementById('heightCmValue');
    const weightKgValue = document.getElementById('weightKgValue');
    
    // Imperial inputs
    const heightFeetInput = document.getElementById('heightFeet');
    const heightInchesInput = document.getElementById('heightInches');
    const weightLbInput = document.getElementById('weightLb');
    
    // Other inputs
    const ageInput = document.getElementById('age');
    const genderSelect = document.getElementById('gender');
    
    // Results elements
    const bmiValue = document.getElementById('bmiValue');
    const bmiCategory = document.getElementById('bmiCategory');
    const scaleMarker = document.getElementById('scaleMarker');
    const idealWeight = document.getElementById('idealWeight');
    const weightStatus = document.getElementById('weightStatus');
    const bmiPrime = document.getElementById('bmiPrime');
    
    // Current unit state
    let currentUnit = 'metric';
    
    // Unit toggle
    unitBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const unit = this.getAttribute('data-unit');
            
            // Update active button
            unitBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide inputs
            if (unit === 'metric') {
                metricInputs.classList.add('active');
                imperialInputs.classList.remove('active');
                currentUnit = 'metric';
            } else {
                metricInputs.classList.remove('active');
                imperialInputs.classList.add('active');
                currentUnit = 'imperial';
            }
            
            // Recalculate BMI
            calculateBMI();
        });
    });
    
    // Update slider value displays
    function updateSliderValue(slider, displayElement, suffix = '') {
        let value = parseFloat(slider.value);
        displayElement.textContent = value + suffix;
        
        // Add animation
        displayElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            displayElement.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Calculate BMI
    function calculateBMI() {
        let height, weight, bmi;
        
        if (currentUnit === 'metric') {
            // Metric calculation
            height = parseFloat(heightCmSlider.value) / 100; // Convert cm to m
            weight = parseFloat(weightKgSlider.value);
            bmi = weight / (height * height);
        } else {
            // Imperial calculation
            const feet = parseFloat(heightFeetInput.value);
            const inches = parseFloat(heightInchesInput.value);
            const heightInInches = feet * 12 + inches;
            weight = parseFloat(weightLbInput.value);
            bmi = (weight / (heightInInches * heightInInches)) * 703;
        }
        
        // Round BMI to 1 decimal place
        bmi = Math.round(bmi * 10) / 10;
        
        // Update BMI value
        bmiValue.textContent = bmi;
        
        // Determine BMI category
        let category, categoryClass, status;
        if (bmi < 18.5) {
            category = 'Underweight';
            categoryClass = 'underweight';
            status = 'Underweight';
        } else if (bmi < 25) {
            category = 'Normal Weight';
            categoryClass = 'normal';
            status = 'Healthy';
        } else if (bmi < 30) {
            category = 'Overweight';
            categoryClass = 'overweight';
            status = 'Overweight';
        } else {
            category = 'Obese';
            categoryClass = 'obese';
            status = 'Obese';
        }
        
        // Update category
        bmiCategory.textContent = category;
        
        // Update scale marker position
        let markerPosition;
        if (bmi < 18.5) {
            markerPosition = (bmi / 18.5) * 18.5;
        } else if (bmi < 25) {
            markerPosition = 18.5 + ((bmi - 18.5) / 6.5) * 31;
        } else if (bmi < 30) {
            markerPosition = 49.5 + ((bmi - 25) / 5) * 25;
        } else {
            markerPosition = Math.min(74.5 + ((bmi - 30) / 10) * 25.5, 100);
        }
        
        scaleMarker.style.left = Math.min(markerPosition, 99.5) + '%';
        
        // Calculate ideal weight range
        let minIdealWeight, maxIdealWeight;
        if (currentUnit === 'metric') {
            const heightM = parseFloat(heightCmSlider.value) / 100;
            minIdealWeight = 18.5 * heightM * heightM;
            maxIdealWeight = 24.9 * heightM * heightM;
            idealWeight.textContent = `${minIdealWeight.toFixed(1)} - ${maxIdealWeight.toFixed(1)} kg`;
        } else {
            const heightInInches = parseFloat(heightFeetInput.value) * 12 + parseFloat(heightInchesInput.value);
            minIdealWeight = (18.5 * heightInInches * heightInInches) / 703;
            maxIdealWeight = (24.9 * heightInInches * heightInInches) / 703;
            idealWeight.textContent = `${minIdealWeight.toFixed(1)} - ${maxIdealWeight.toFixed(1)} lb`;
        }
        
        // Update other results
        weightStatus.textContent = status;
        bmiPrime.textContent = (bmi / 25).toFixed(2);
        
        // Add animation to BMI value
        bmiValue.style.transform = 'scale(1.2)';
        setTimeout(() => {
            bmiValue.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Event listeners for metric inputs
    heightCmSlider.addEventListener('input', function() {
        updateSliderValue(this, heightCmValue, ' cm');
        calculateBMI();
    });
    
    weightKgSlider.addEventListener('input', function() {
        updateSliderValue(this, weightKgValue, ' kg');
        calculateBMI();
    });
    
    // Event listeners for imperial inputs
    [heightFeetInput, heightInchesInput, weightLbInput, ageInput].forEach(input => {
        input.addEventListener('input', calculateBMI);
    });
    
    genderSelect.addEventListener('change', calculateBMI);
    
    // Validate imperial inputs
    heightFeetInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (value < 3) this.value = 3;
        if (value > 8) this.value = 8;
    });
    
    heightInchesInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (value < 0) this.value = 0;
        if (value > 11) this.value = 11;
    });
    
    weightLbInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (value < 66) this.value = 66;
        if (value > 440) this.value = 440;
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
    
    // Initialize BMI calculation
    calculateBMI();
});