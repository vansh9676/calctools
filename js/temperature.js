// Temperature Converter JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const tempValue = document.getElementById('tempValue');
    const scaleRadios = document.querySelectorAll('input[name="scale"]');
    const convertBtn = document.getElementById('convertTemp');
    
    const celsiusResult = document.getElementById('celsiusResult');
    const fahrenheitResult = document.getElementById('fahrenheitResult');
    const kelvinResult = document.getElementById('kelvinResult');
    
    const scaleFill = document.getElementById('scaleFill');
    const currentTemp = document.getElementById('currentTemp');
    
    // Get selected scale
    function getSelectedScale() {
        for (const radio of scaleRadios) {
            if (radio.checked) {
                return radio.value;
            }
        }
        return 'c'; // Default to Celsius
    }
    
    // Convert temperatures
    function convertTemperature() {
        const value = parseFloat(tempValue.value);
        const scale = getSelectedScale();
        
        if (isNaN(value)) {
            alert('Please enter a valid temperature');
            return;
        }
        
        let celsius, fahrenheit, kelvin;
        
        // Convert input to all scales
        switch(scale) {
            case 'c':
                celsius = value;
                fahrenheit = (value * 9/5) + 32;
                kelvin = value + 273.15;
                break;
            case 'f':
                fahrenheit = value;
                celsius = (value - 32) * 5/9;
                kelvin = celsius + 273.15;
                break;
            case 'k':
                kelvin = value;
                celsius = value - 273.15;
                fahrenheit = (celsius * 9/5) + 32;
                break;
        }
        
        // Update results
        celsiusResult.textContent = celsius.toFixed(1);
        fahrenheitResult.textContent = fahrenheit.toFixed(1);
        kelvinResult.textContent = kelvin.toFixed(2);
        
        // Update temperature scale visualization
        updateTemperatureScale(celsius);
        
        // Add animation to results
        [celsiusResult, fahrenheitResult, kelvinResult].forEach(el => {
            el.style.transform = 'scale(1.1)';
            setTimeout(() => {
                el.style.transform = 'scale(1)';
            }, 300);
        });
    }
    
    // Update temperature scale visualization
    function updateTemperatureScale(celsius) {
        // Scale from -273.15°C to 100°C for visualization
        const minTemp = -273.15;
        const maxTemp = 100;
        
        // Clamp temperature within visible range
        let displayTemp = Math.max(minTemp, Math.min(maxTemp, celsius));
        
        // Calculate percentage for scale fill
        const percentage = ((displayTemp - minTemp) / (maxTemp - minTemp)) * 100;
        
        // Update scale fill and current temperature indicator
        scaleFill.style.width = `${percentage}%`;
        currentTemp.style.left = `${percentage}%`;
        currentTemp.textContent = `${celsius.toFixed(1)}°C`;
        
        // Update color based on temperature
        let color;
        if (celsius < 0) {
            color = '#4a90e2'; // Blue for cold
        } else if (celsius < 20) {
            color = '#7ed321'; // Green for mild
        } else if (celsius < 50) {
            color = '#f5a623'; // Orange for warm
        } else {
            color = '#d0021b'; // Red for hot
        }
        
        scaleFill.style.background = color;
        currentTemp.style.background = color;
    }
    
    // Set example temperature
    function setExampleTemperature(temp, scale) {
        tempValue.value = temp;
        
        // Set the radio button
        scaleRadios.forEach(radio => {
            radio.checked = (radio.value === scale);
        });
        
        convertTemperature();
    }
    
    // Event Listeners
    convertBtn.addEventListener('click', convertTemperature);
    
    tempValue.addEventListener('input', convertTemperature);
    
    scaleRadios.forEach(radio => {
        radio.addEventListener('change', convertTemperature);
    });
    
    // Example temperatures when clicking on common temperature cards
    document.querySelectorAll('.temp-card').forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h4').textContent;
            
            switch(title) {
                case 'Absolute Zero':
                    setExampleTemperature(-273.15, 'c');
                    break;
                case 'Water Freezes':
                    setExampleTemperature(0, 'c');
                    break;
                case 'Room Temperature':
                    setExampleTemperature(20, 'c');
                    break;
                case 'Water Boils':
                    setExampleTemperature(100, 'c');
                    break;
            }
        });
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
    
    // Initialize
    convertTemperature();
});