// Weight Converter JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements for weight converter
    const weightValue = document.getElementById('weightValue');
    const weightFrom = document.getElementById('weightFrom');
    const weightTo = document.getElementById('weightTo');
    const weightConvertBtn = document.getElementById('weightConvert');
    const weightSwapBtn = document.getElementById('weightSwap');
    
    const weightResult = document.getElementById('weightResult');
    const weightUnit = document.getElementById('weightUnit');
    const weightFromDisplay = document.getElementById('weightFromDisplay');
    const weightToDisplay = document.getElementById('weightToDisplay');
    
    // Conversion factors to grams (base unit)
    const conversionFactors = {
        'mg': 0.001,        // milligrams to grams
        'g': 1,             // grams
        'kg': 1000,         // kilograms to grams
        't': 1000000,       // metric tons to grams
        'oz': 28.3495,      // ounces to grams
        'lb': 453.592,      // pounds to grams
        'st': 6350.29       // stone to grams
    };
    
    // Unit names for display
    const unitNames = {
        'mg': 'Milligrams',
        'g': 'Grams',
        'kg': 'Kilograms',
        't': 'Metric Tons',
        'oz': 'Ounces',
        'lb': 'Pounds',
        'st': 'Stone'
    };
    
    // Unit symbols
    const unitSymbols = {
        'mg': 'mg',
        'g': 'g',
        'kg': 'kg',
        't': 't',
        'oz': 'oz',
        'lb': 'lb',
        'st': 'st'
    };
    
    // Format number with appropriate decimal places
    function formatNumber(num) {
        if (Math.abs(num) < 0.000001) {
            return '0';
        }
        
        if (Math.abs(num) < 0.001) {
            return num.toExponential(4);
        }
        
        if (Math.abs(num) < 1) {
            return num.toFixed(6).replace(/\.?0+$/, '');
        }
        
        if (Math.abs(num) < 10000) {
            return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        
        return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    // Convert weight
    function convertWeight() {
        const value = parseFloat(weightValue.value);
        const from = weightFrom.value;
        const to = weightTo.value;
        
        if (isNaN(value) || value < 0) {
            alert('Please enter a valid positive number');
            return;
        }
        
        // Convert to grams first, then to target unit
        const valueInGrams = value * conversionFactors[from];
        const result = valueInGrams / conversionFactors[to];
        
        // Update results
        weightResult.textContent = formatNumber(result);
        weightUnit.textContent = unitSymbols[to];
        
        // Update equation display
        weightFromDisplay.textContent = `${formatNumber(value)} ${unitSymbols[from]}`;
        weightToDisplay.textContent = `${formatNumber(result)} ${unitSymbols[to]}`;
        
        // Add animation
        weightResult.style.transform = 'scale(1.1)';
        setTimeout(() => {
            weightResult.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Swap units
    function swapWeightUnits() {
        const from = weightFrom.value;
        const to = weightTo.value;
        
        // Swap values
        weightFrom.value = to;
        weightTo.value = from;
        
        // Recalculate
        convertWeight();
    }
    
    // Update quick conversion cards
    function updateQuickConversions() {
        // This function would update the quick conversion cards
        // with the current conversion factors if they were dynamic
    }
    
    // Event Listeners
    weightConvertBtn.addEventListener('click', convertWeight);
    weightSwapBtn.addEventListener('click', swapWeightUnits);
    
    weightValue.addEventListener('input', convertWeight);
    weightFrom.addEventListener('change', convertWeight);
    weightTo.addEventListener('change', convertWeight);
    
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
    convertWeight();
    updateQuickConversions();
});