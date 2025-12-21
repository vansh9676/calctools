// Currency Converter JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');
    const fromSymbol = document.getElementById('fromSymbol');
    const convertBtn = document.getElementById('convert');
    const swapBtn = document.getElementById('swapCurrencies');
    const reverseBtn = document.getElementById('reverse');
    
    const convertedAmount = document.getElementById('convertedAmount');
    const toCurrencyName = document.getElementById('toCurrencyName');
    const exchangeRate = document.getElementById('exchangeRate');
    const lastUpdated = document.getElementById('lastUpdated');
    const fromAmount = document.getElementById('fromAmount');
    const toAmount = document.getElementById('toAmount');
    const unitRate = document.getElementById('unitRate');
    const reverseRate = document.getElementById('reverseRate');
    
    const currencyRatesTable = document.getElementById('currencyRates');
    const popularConversionBtns = document.querySelectorAll('.conversion-btn');
    
    // Currency data with exchange rates (example rates - in real app, fetch from API)
    const exchangeRates = {
        'USD': { symbol: '$', name: 'US Dollar', rate: 1.0 },
        'EUR': { symbol: '€', name: 'Euro', rate: 0.9250 },
        'GBP': { symbol: '£', name: 'British Pound', rate: 0.7900 },
        'JPY': { symbol: '¥', name: 'Japanese Yen', rate: 150.00 },
        'CAD': { symbol: 'C$', name: 'Canadian Dollar', rate: 1.3500 },
        'AUD': { symbol: 'A$', name: 'Australian Dollar', rate: 1.5200 },
        'CHF': { symbol: 'CHF', name: 'Swiss Franc', rate: 0.8800 },
        'CNY': { symbol: '¥', name: 'Chinese Yuan', rate: 7.2000 },
        'INR': { symbol: '₹', name: 'Indian Rupee', rate: 83.00 },
        'BRL': { symbol: 'R$', name: 'Brazilian Real', rate: 5.0000 }
    };
    
    // Update currency symbol
    function updateCurrencySymbol() {
        const fromCurrency = fromCurrencySelect.value;
        fromSymbol.textContent = exchangeRates[fromCurrency].symbol;
    }
    
    // Format currency amount
    function formatCurrency(amount, currencyCode) {
        const currency = exchangeRates[currencyCode];
        const formatted = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
        
        return `${currency.symbol}${formatted}`;
    }
    
    // Calculate conversion
    function calculateConversion() {
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        
        if (isNaN(amount) || amount < 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        // Get rates
        const fromRate = exchangeRates[fromCurrency].rate;
        const toRate = exchangeRates[toCurrency].rate;
        
        // Calculate converted amount
        const converted = (amount / fromRate) * toRate;
        
        // Update results
        convertedAmount.textContent = converted.toFixed(2);
        toCurrencyName.textContent = `${toCurrency} - ${exchangeRates[toCurrency].name}`;
        
        // Calculate exchange rate
        const rate = toRate / fromRate;
        exchangeRate.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
        
        // Update details
        fromAmount.textContent = `${formatCurrency(amount, fromCurrency)}`;
        toAmount.textContent = `${formatCurrency(converted, toCurrency)}`;
        unitRate.textContent = `${formatCurrency(rate, toCurrency)}`;
        
        // Calculate reverse rate
        const reverseRateValue = fromRate / toRate;
        reverseRate.textContent = `${formatCurrency(reverseRateValue, fromCurrency)}`;
        
        // Update last updated time
        const now = new Date();
        lastUpdated.textContent = now.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Add animation
        convertedAmount.style.transform = 'scale(1.1)';
        setTimeout(() => {
            convertedAmount.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Swap currencies
    function swapCurrencies() {
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        
        // Swap values
        fromCurrencySelect.value = toCurrency;
        toCurrencySelect.value = fromCurrency;
        
        // Update symbol and recalculate
        updateCurrencySymbol();
        calculateConversion();
    }
    
    // Populate currency rates table
    function populateCurrencyTable() {
        currencyRatesTable.innerHTML = '';
        
        const currencies = Object.keys(exchangeRates);
        const baseCurrency = 'USD';
        const baseRate = exchangeRates[baseCurrency].rate;
        
        currencies.forEach(currency => {
            const row = document.createElement('tr');
            
            // Currency name
            const nameCell = document.createElement('td');
            nameCell.textContent = exchangeRates[currency].name;
            row.appendChild(nameCell);
            
            // Currency code
            const codeCell = document.createElement('td');
            codeCell.textContent = currency;
            row.appendChild(codeCell);
            
            // Rate vs USD
            const usdRateCell = document.createElement('td');
            const usdRate = exchangeRates[currency].rate / baseRate;
            usdRateCell.textContent = `1 ${currency} = ${usdRate.toFixed(4)} USD`;
            row.appendChild(usdRateCell);
            
            // Rate vs EUR
            const eurRateCell = document.createElement('td');
            const eurRate = (exchangeRates[currency].rate / exchangeRates['EUR'].rate);
            eurRateCell.textContent = `1 ${currency} = ${eurRate.toFixed(4)} EUR`;
            row.appendChild(eurRateCell);
            
            currencyRatesTable.appendChild(row);
        });
    }
    
    // Set popular conversion
    function setPopularConversion(from, to) {
        fromCurrencySelect.value = from;
        toCurrencySelect.value = to;
        updateCurrencySymbol();
        calculateConversion();
    }
    
    // Event Listeners
    convertBtn.addEventListener('click', calculateConversion);
    swapBtn.addEventListener('click', swapCurrencies);
    reverseBtn.addEventListener('click', swapCurrencies);
    
    fromCurrencySelect.addEventListener('change', function() {
        updateCurrencySymbol();
        calculateConversion();
    });
    
    toCurrencySelect.addEventListener('change', calculateConversion);
    amountInput.addEventListener('input', calculateConversion);
    
    // Popular conversion buttons
    popularConversionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const from = this.getAttribute('data-from');
            const to = this.getAttribute('data-to');
            setPopularConversion(from, to);
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
    updateCurrencySymbol();
    calculateConversion();
    populateCurrencyTable();
    
    // Auto-update rates (simulated - in real app, fetch from API)
    setInterval(() => {
        // Simulate rate fluctuation
        Object.keys(exchangeRates).forEach(currency => {
            if (currency !== 'USD') {
                const fluctuation = (Math.random() - 0.5) * 0.01; // ±0.5%
                exchangeRates[currency].rate *= (1 + fluctuation);
            }
        });
        
        // Recalculate and update table
        calculateConversion();
        populateCurrencyTable();
        
        // Update popular conversion rates
        popularConversionBtns.forEach(btn => {
            const from = btn.getAttribute('data-from');
            const to = btn.getAttribute('data-to');
            const rate = (exchangeRates[to].rate / exchangeRates[from].rate).toFixed(4);
            btn.querySelector('.rate').textContent = `1 ${from} = ${rate} ${to}`;
        });
    }, 30000); // Update every 30 seconds
});