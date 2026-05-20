    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        if (mobileMenu.classList.contains('hidden')) {
            menuIcon.className = 'fa-solid fa-bars text-2xl';
        } else {
            menuIcon.className = 'fa-solid fa-xmark text-2xl';
        }
    });

    // Close mobile menu when clicking menu links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuIcon.className = 'fa-solid fa-bars text-2xl';
        });
    });

    // 2. Before/After Interactive Drag Slider
    const sliderInput = document.getElementById('comparison-slider');
    const afterWrapper = document.getElementById('after-wrapper');
    const sliderLine = document.getElementById('slider-line');

    sliderInput.addEventListener('input', (e) => {
        const sliderPos = e.target.value;
        // Adjust the clipping width of the "After" overlay image wrapper
        afterWrapper.style.width = `${sliderPos}%`;
        // Match the physical indicator line pos
        sliderLine.style.left = `${sliderPos}%`;
    });

    // 3. Cost Estimator Pricing Rules & Interactive Logic
    const sizeSlider = document.getElementById('size-slider');
    const sqftVal = document.getElementById('sqft-val');
    const calcRange = document.getElementById('calc-range');
    const paintGrade = document.getElementById('paint-grade');
    const radioInterior = document.getElementById('radio-interior');
    const radioExterior = document.getElementById('radio-exterior');
    const lblInterior = document.getElementById('lbl-interior');
    const lblExterior = document.getElementById('lbl-exterior');

    function updateCalculatedCost() {
        const sqft = parseInt(sizeSlider.value);
        sqftVal.textContent = `${sqft.toLocaleString()} sq ft`;

        // Base rate per square foot depending on project type
        let baseRate = 1.50; // Interior baseline
        if (radioExterior.checked) {
            baseRate = 2.00; // Exterior baseline (requires more prep/ladders)
        }

        // Multiplying factors by paint quality selection
        let gradeMultiplier = 1.0;
        if (paintGrade.value === 'premium') {
            gradeMultiplier = 1.25;
        } else if (paintGrade.value === 'luxury') {
            gradeMultiplier = 1.55;
        }

        // Calculate a low-end and high-end quote bracket
        const finalBase = sqft * baseRate * gradeMultiplier;
        const lowEnd = Math.round(finalBase * 0.9);
        const highEnd = Math.round(finalBase * 1.35);

        calcRange.textContent = `$${lowEnd.toLocaleString()} - $${highEnd.toLocaleString()}`;
    }

    // Toggle styling on radio box selection
    function handleTypeToggle() {
        if (radioInterior.checked) {
            lblInterior.classList.add('border-brand-navy');
            lblInterior.classList.remove('border-gray-200');
            lblExterior.classList.add('border-gray-200');
            lblExterior.classList.remove('border-brand-navy');
        } else {
            lblExterior.classList.add('border-brand-navy');
            lblExterior.classList.remove('border-gray-200');
            lblInterior.classList.add('border-gray-200');
            lblInterior.classList.remove('border-brand-navy');
        }
        updateCalculatedCost();
    }

    sizeSlider.addEventListener('input', updateCalculatedCost);
    paintGrade.addEventListener('change', updateCalculatedCost);
    radioInterior.addEventListener('change', handleTypeToggle);
    radioExterior.addEventListener('change', handleTypeToggle);

    // Initial load pricing run
    updateCalculatedCost();

    // Carry estimate choice to form fields
    function applyEstimateToForm() {
        const currentRange = calcRange.textContent;
        const projectType = radioInterior.checked ? "Interior Painting" : "Exterior Painting";
        const sqftString = sqftVal.textContent;
        const selectedGradeText = paintGrade.options[paintGrade.selectedIndex].text;

        // Auto-select corresponding category in the form
        const formService = document.getElementById('form-service');
        if (radioInterior.checked) {
            formService.value = 'interior';
        } else {
            formService.value = 'exterior';
        }

        // Fill in size and custom detailed notes
        document.getElementById('form-size').value = sqftString;
        document.getElementById('form-notes').value = `I am interested in ${projectType} for my home. My quick estimator calculation returned: ${currentRange} using ${selectedGradeText}.`;

        // Smooth scroll to the form section
        document.getElementById('quote').scrollIntoView({ behavior: 'smooth' });
    }

    // 4. Portfolio Filter Logic
    function filterPortfolio(category) {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        const filterButtons = document.querySelectorAll('.portfolio-btn');

        // Update active class styles for buttons
        filterButtons.forEach(btn => {
            if (btn.getAttribute('onclick').includes(category)) {
                btn.className = 'portfolio-btn bg-brand-navy text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition';
            } else {
                btn.className = 'portfolio-btn bg-white text-gray-700 hover:bg-brand-navy hover:text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition';
            }
        });

        // Hide/Show items based on data class
        portfolioItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                // Add minor entrance anim
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // 5. Quote Form Submission (Simulated without alert alerts)
    function handleFormSubmission(event) {
        event.preventDefault();

        // Get success alert DOM element
        const successAlert = document.getElementById('form-success-alert');
        successAlert.classList.remove('hidden');

        // Reset form input values
        document.getElementById('quote-form').reset();

        // Scroll to the top of the card container to see the confirmation easily
        document.getElementById('quote').scrollIntoView({ behavior: 'smooth' });
    }
