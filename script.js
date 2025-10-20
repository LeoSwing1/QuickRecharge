// Client-Side Logic for Trackin Dealer Service Portal - 14 Page SPA Simulation

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const otpForm = document.getElementById('otpForm');
    const loginPage = document.getElementById('loginPage');
    const mainApp = document.getElementById('mainApp');
    const otpModal = new bootstrap.Modal(document.getElementById('otpModal'));
    const toggleBalance = document.getElementById('toggleBalance');
    const walletBalanceElement = document.getElementById('walletBalance');
    
    // Select all interactive elements that trigger navigation
    const navTriggers = document.querySelectorAll(
        '#bottomNav .nav-item-btn, .icon-btn, .scan-btn, .link-card, .dropdown-item, .nav-link-top'
    );
    const topLogoutBtn = document.getElementById('topLogoutBtn');
    
    // --- Constants ---
    const MOCK_EMAIL = 'test7777@gmail.com';
    const MOCK_PASSWORD = '123456789';
    const MOCK_OTP = '123456'; 
    const ACTUAL_BALANCE = '₹ 5,85,000.50'; 
    let isBalanceHidden = true;

    // --- Core Functions ---
    
    // Function to switch between simulated pages
    const navigateTo = (pageId) => {
        // Hide all page sections
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });
        // Show the target page section
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update bottom navigation active state (mobile only)
        document.querySelectorAll('#bottomNav .nav-item-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.page === pageId) {
                btn.classList.add('active');
            }
        });

        // Scroll content to the top
        const pageContent = document.getElementById('page-content');
        if (pageContent) pageContent.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Feature: Toggle Wallet Balance
    const updateBalanceDisplay = () => {
        isBalanceHidden = !isBalanceHidden;
        if (isBalanceHidden) {
            walletBalanceElement.textContent = '₹ ••••';
            walletBalanceElement.classList.remove('active');
            toggleBalance.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            walletBalanceElement.textContent = ACTUAL_BALANCE;
            walletBalanceElement.classList.add('active');
            toggleBalance.innerHTML = '<i class="fas fa-eye"></i>';
        }
    };
    
    // --- Event Handlers ---

    // Global Navigation Handler for all interactive elements
    navTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pageId = btn.dataset.page;
            if (pageId) {
                e.preventDefault();
                navigateTo(pageId);
                // For dropdowns, close the menu after click
                const parentDropdown = btn.closest('.dropdown-menu');
                if (parentDropdown) {
                    const bsDropdown = bootstrap.Dropdown.getInstance(document.getElementById('accountDropdown'));
                    if (bsDropdown) bsDropdown.hide();
                }
            }
        });
    });

    // Toggle Balance Event
    toggleBalance.addEventListener('click', updateBalanceDisplay);
    
    // Logout Handler
    const handleLogout = (e) => {
        e.preventDefault();
        mainApp.style.display = 'none';
        loginPage.classList.add('active'); 
        loginPage.style.display = 'flex'; 
        
        // Reset state and clear inputs
        document.getElementById('email').value = ''; 
        document.getElementById('password').value = ''; 
        isBalanceHidden = true;
        walletBalanceElement.textContent = '₹ ••••';
        walletBalanceElement.classList.remove('active');
        toggleBalance.innerHTML = '<i class="fas fa-eye-slash"></i>';
        
        console.log("Dealer logged out from Trackin Portal.");
    };

    // Attach logout to the top dropdown button
    if (topLogoutBtn) topLogoutBtn.addEventListener('click', handleLogout);
    
    // Step 1: Login Submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
            console.log("Credentials correct. Simulating OTP send (Use 123456).");
            otpModal.show();
        } else {
            document.getElementById('loginMessage').textContent = 'Invalid Dealer ID or Password. (Hint: ' + MOCK_EMAIL + ' / ' + MOCK_PASSWORD + ')';
            document.getElementById('loginMessage').style.display = 'block';
        }
    });

    // Step 2: OTP Verification Submission
    otpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const otpInput = document.getElementById('otpInput').value.trim();
        
        if (otpInput === MOCK_OTP) {
            console.log("OTP verified. Entering Dealer Portal.");

            otpModal.hide(); 
            
            // Redirect to main app interface
            loginPage.classList.remove('active');
            loginPage.style.display = 'none';
            mainApp.style.display = 'block';
            
            // Navigate to the default home page
            navigateTo('homePage'); 

        } else {
            document.getElementById('otpMessage').textContent = 'Invalid OTP.';
            document.getElementById('otpMessage').style.display = 'block';
        }
    });

    // Initialize the starting state
    loginPage.classList.add('active');
});