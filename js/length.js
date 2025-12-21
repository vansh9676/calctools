// Length Converter JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements for length converter
    const inputValue = document.getElementById('inputValue');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const convertBtn = document.getElementById('convert');
    const swapBtn = document.getElementById('swapUnits');
    
    const resultValue = document.getElementById('resultValue');
    const resultUnit = document.getElementById('resultUnit');
    const fromDisplay = document.getElementById('fromDisplay');
    const toDisplay = document.getElementById('toDisplay');
    
    const conversionTable = document.getElementById('conversionTable');
    const quickBtns = document.querySelectorAll('.quick-btn');
    
    // Conversion factors to meters (base unit)
    const conversionFactors = {
        'mm': 0.001,   // millimeters to meters
        'cm': 0.01,    // centimeters to meters
        'm': 1,        // meters
        'km': 1000,    // kilometers to meters
        'in': 0.0254,  // inches to meters
        'ft': 0.3048,  // feet to meters
        'yd': 0.9144,  // yards to meters
        'mi': 1609.34  // miles to meters
    };
    
    // Unit names for display
    const unitNames = {
        'mm': 'Millimeters',
        'cm': 'Centimeters',
        'm': 'Meters',
        'km': 'Kilometers',
        'in': 'Inches',
        'ft': 'Feet',
        'yd': 'Yards',
        'mi': 'Miles'
    };
    
    // Unit symbols
    const unitSymbols = {
        'mm': 'mm',
        'cm': 'cm',
        'm': 'm',
        'km': 'km',
        'in': 'in',
        'ft': 'ft',
        'yd': 'yd',
        'mi': 'mi'
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
        
        if (Math.abs(num) < 1000) {
            return num.toFixed(4).replace(/\.?0+$/, '');
        }
        
        return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    // Convert length
    function convertLength() {
        const value = parseFloat(inputValue.value);
        const from = fromUnit.value;
        const to = toUnit.value;
        
        if (isNaN(value) || value < 0) {
            alert('Please enter a valid positive number');
            return;
        }
        
        // Convert to meters first, then to target unit
        const valueInMeters = value * conversionFactors[from];
        const result = valueInMeters / conversionFactors[to];
        
        // Update results
        resultValue.textContent = formatNumber(result);
        resultUnit.textContent = unitSymbols[to];
        
        // Update equation display
        fromDisplay.textContent = `${formatNumber(value)} ${unitSymbols[from]}`;
        toDisplay.textContent = `${formatNumber(result)} ${unitSymbols[to]}`;
        
        // Add animation
        resultValue.style.transform = 'scale(1.1)';
        setTimeout(() => {
            resultValue.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Swap units
    function swapUnits() {
        const from = fromUnit.value;
        const to = toUnit.value;
        
        // Swap values
        fromUnit.value = to;
        toUnit.value = from;
        
        // Recalculate
        convertLength();
    }
    
    // Set quick conversion
    function setQuickConversion(value, from, to) {
        inputValue.value = value;
        fromUnit.value = from;
        toUnit.value = to;
        convertLength();
    }
    
    // Generate conversion table
    function generateConversionTable() {
        const baseValue = 1; // 1 of each unit
        const units = Object.keys(conversionFactors);
        
        conversionTable.innerHTML = '';
        
        units.forEach(unit => {
            const row = document.createElement('tr');
            
            // Unit name
            const nameCell = document.createElement('td');
            nameCell.textContent = unitNames[unit];
            nameCell.style.fontWeight = '500';
            row.appendChild(nameCell);
            
            // Convert to all other units
            units.forEach(targetUnit => {
                const cell = document.createElement('td');
                const valueInMeters = baseValue * conversionFactors[unit];
                const result = valueInMeters / conversionFactors[targetUnit];
                cell.textContent = formatNumber(result);
                row.appendChild(cell);
            });
            
            conversionTable.appendChild(row);
        });
    }
    
    // Event Listeners
    convertBtn.addEventListener('click', convertLength);
    swapBtn.addEventListener('click', swapUnits);
    
    inputValue.addEventListener('input', convertLength);
    fromUnit.addEventListener('change', convertLength);
    toUnit.addEventListener('change', convertLength);
    
    // Quick conversion buttons
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const value = parseFloat(this.getAttribute('data-value'));
            const from = this.getAttribute('data-from');
            const to = this.getAttribute('data-to');
            setQuickConversion(value, from, to);
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
    convertLength();
    generateConversionTable();
});

// Weight Converter JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Weight converter will be loaded in weight-converter.html
    // Similar structure to length converter
});

// Temperature Converter JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Temperature converter will be loaded in temperature.html
    // Similar structure to length converter
});