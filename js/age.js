// Age Calculator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const birthDateInput = document.getElementById('birthDate');
    const currentDateInput = document.getElementById('currentDate');
    const useTodayBtn = document.getElementById('useToday');
    const calculateBtn = document.getElementById('calculateAge');
    const resetBtn = document.getElementById('resetCalculator');
    
    const yearsDisplay = document.getElementById('years');
    const monthsDisplay = document.getElementById('months');
    const daysDisplay = document.getElementById('days');
    const totalDaysDisplay = document.getElementById('totalDays');
    const totalWeeksDisplay = document.getElementById('totalWeeks');
    const totalMonthsDisplay = document.getElementById('totalMonths');
    const nextBirthdayDisplay = document.getElementById('nextBirthday');
    
    const zodiacIcon = document.getElementById('zodiacIcon');
    const zodiacName = document.getElementById('zodiacName');
    const zodiacDates = document.getElementById('zodiacDates');
    
    // Set max date to today for birth date
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    birthDateInput.max = todayFormatted;
    currentDateInput.max = todayFormatted;
    
    // Set current date input to today
    currentDateInput.value = todayFormatted;
    
    // Calculate age function
    function calculateAge() {
        const birthDate = new Date(birthDateInput.value);
        const currentDate = new Date(currentDateInput.value);
        
        // Validate dates
        if (birthDate > currentDate) {
            alert('Birth date cannot be in the future!');
            return;
        }
        
        // Calculate age
        let years = currentDate.getFullYear() - birthDate.getFullYear();
        let months = currentDate.getMonth() - birthDate.getMonth();
        let days = currentDate.getDate() - birthDate.getDate();
        
        // Adjust for negative days
        if (days < 0) {
            months--;
            // Get days in previous month
            const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            days += prevMonth.getDate();
        }
        
        // Adjust for negative months
        if (months < 0) {
            years--;
            months += 12;
        }
        
        // Calculate total days
        const timeDiff = currentDate.getTime() - birthDate.getTime();
        const totalDays = Math.floor(timeDiff / (1000 * 3600 * 24));
        
        // Update displays
        yearsDisplay.textContent = years;
        monthsDisplay.textContent = months;
        daysDisplay.textContent = days;
        totalDaysDisplay.textContent = totalDays.toLocaleString();
        totalWeeksDisplay.textContent = Math.floor(totalDays / 7).toLocaleString();
        totalMonthsDisplay.textContent = (years * 12 + months).toLocaleString();
        
        // Calculate next birthday
        const nextBirthday = calculateNextBirthday(birthDate, currentDate);
        nextBirthdayDisplay.textContent = nextBirthday;
        
        // Calculate zodiac sign
        calculateZodiac(birthDate);
        
        // Add animation
        [yearsDisplay, monthsDisplay, daysDisplay].forEach(el => {
            el.style.transform = 'scale(1.2)';
            setTimeout(() => {
                el.style.transform = 'scale(1)';
            }, 300);
        });
    }
    
    // Calculate next birthday
    function calculateNextBirthday(birthDate, currentDate) {
        const currentYear = currentDate.getFullYear();
        let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
        
        // If birthday has already passed this year, use next year
        if (nextBirthday < currentDate) {
            nextBirthday.setFullYear(currentYear + 1);
        }
        
        // Calculate days until next birthday
        const daysUntil = Math.ceil((nextBirthday.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
        
        // Format date
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = nextBirthday.toLocaleDateString('en-US', options);
        
        return `${formattedDate} (in ${daysUntil} days)`;
    }
    
    // Calculate zodiac sign
    function calculateZodiac(birthDate) {
        const month = birthDate.getMonth() + 1; // JavaScript months are 0-indexed
        const day = birthDate.getDate();
        
        const zodiacs = [
            { name: 'Capricorn', icon: '♑', dates: 'Dec 22 - Jan 19', start: [12, 22], end: [1, 19] },
            { name: 'Aquarius', icon: '♒', dates: 'Jan 20 - Feb 18', start: [1, 20], end: [2, 18] },
            { name: 'Pisces', icon: '♓', dates: 'Feb 19 - Mar 20', start: [2, 19], end: [3, 20] },
            { name: 'Aries', icon: '♈', dates: 'Mar 21 - Apr 19', start: [3, 21], end: [4, 19] },
            { name: 'Taurus', icon: '♉', dates: 'Apr 20 - May 20', start: [4, 20], end: [5, 20] },
            { name: 'Gemini', icon: '♊', dates: 'May 21 - Jun 20', start: [5, 21], end: [6, 20] },
            { name: 'Cancer', icon: '♋', dates: 'Jun 21 - Jul 22', start: [6, 21], end: [7, 22] },
            { name: 'Leo', icon: '♌', dates: 'Jul 23 - Aug 22', start: [7, 23], end: [8, 22] },
            { name: 'Virgo', icon: '♍', dates: 'Aug 23 - Sep 22', start: [8, 23], end: [9, 22] },
            { name: 'Libra', icon: '♎', dates: 'Sep 23 - Oct 22', start: [9, 23], end: [10, 22] },
            { name: 'Scorpio', icon: '♏', dates: 'Oct 23 - Nov 21', start: [10, 23], end: [11, 21] },
            { name: 'Sagittarius', icon: '♐', dates: 'Nov 22 - Dec 21', start: [11, 22], end: [12, 21] }
        ];
        
        for (const zodiac of zodiacs) {
            const [startMonth, startDay] = zodiac.start;
            const [endMonth, endDay] = zodiac.end;
            
            if ((month === startMonth && day >= startDay) || 
                (month === endMonth && day <= endDay) ||
                (startMonth > endMonth && (month === startMonth || month <= endMonth))) {
                zodiacIcon.textContent = zodiac.icon;
                zodiacName.textContent = zodiac.name;
                zodiacDates.textContent = zodiac.dates;
                break;
            }
        }
    }
    
    // Use today's date
    useTodayBtn.addEventListener('click', function() {
        currentDateInput.value = todayFormatted;
        calculateAge();
    });
    
    // Calculate button
    calculateBtn.addEventListener('click', calculateAge);
    
    // Reset button
    resetBtn.addEventListener('click', function() {
        // Set default values (35 years ago)
        const defaultBirthDate = new Date();
        defaultBirthDate.setFullYear(defaultBirthDate.getFullYear() - 35);
        birthDateInput.value = defaultBirthDate.toISOString().split('T')[0];
        
        currentDateInput.value = todayFormatted;
        calculateAge();
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
    
    // Auto-calculate on date change
    birthDateInput.addEventListener('change', calculateAge);
    currentDateInput.addEventListener('change', calculateAge);
    
    // Initialize with default calculation
    calculateAge();
});