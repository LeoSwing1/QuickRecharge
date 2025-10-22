document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const otpForm = document.getElementById('otpForm');
    const loginPage = document.getElementById('loginPage');
    const mainApp = document.getElementById('mainApp');
    const otpModal = new bootstrap.Modal(document.getElementById('otpModal'));
    const toggleBalance = document.getElementById('toggleBalance');
    const walletBalanceElement = document.getElementById('walletBalance');

    const navTriggers = document.querySelectorAll(
        '#bottomNav .nav-item-btn, .icon-btn, .scan-btn, .link-card, .dropdown-item, .nav-link-top'
    );
    const topLogoutBtn = document.getElementById('topLogoutBtn');

    const MOCK_EMAIL = 'test7777@gmail.com';
    const MOCK_PASSWORD = '123456789';
    const MOCK_OTP = '123456';
    let isBalanceHidden = localStorage.getItem('isBalanceHidden') === 'true'; // persisted state

    // --- Core Functions ---
    const navigateTo = (pageId) => {
        document.querySelectorAll('.page-section').forEach(section => section.classList.remove('active'));
        const targetPage = document.getElementById(pageId);
        if (targetPage) targetPage.classList.add('active');

        document.querySelectorAll('#bottomNav .nav-item-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.page === pageId) btn.classList.add('active');
        });

        const pageContent = document.getElementById('page-content');
        if (pageContent) pageContent.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- Wallet Functions ---
    const getBalance = async () => {
        try {
            const res = await fetch('/api/balance');
            const data = await res.json();
            localStorage.setItem('walletBalance', data.balance); // persist
            return data.balance;
        } catch (err) {
            console.error('Error fetching balance:', err);
            return parseFloat(localStorage.getItem('walletBalance')) || 0;
        }
    };

    const showBalance = async () => {
        const balance = await getBalance();
        walletBalanceElement.textContent = '₹ ' + balance.toLocaleString();
        walletBalanceElement.classList.add('active');
        toggleBalance.innerHTML = '<i class="fas fa-eye"></i>';
        isBalanceHidden = false;
        localStorage.setItem('isBalanceHidden', 'false');
    };

    const hideBalance = () => {
        walletBalanceElement.textContent = '₹ ••••';
        walletBalanceElement.classList.remove('active');
        toggleBalance.innerHTML = '<i class="fas fa-eye-slash"></i>';
        isBalanceHidden = true;
        localStorage.setItem('isBalanceHidden', 'true');
    };

    const updateBalanceDisplay = async () => {
        if (isBalanceHidden) await showBalance();
        else hideBalance();
    };

    const addMoney = async (amount) => {
        try {
            const res = await fetch('/api/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount })
            });
            const data = await res.json();
            if (data.error) alert(data.error);
            else showBalance();
        } catch (err) {
            console.error('Error adding money:', err);
        }
    };

    const spendMoney = async (amount) => {
        try {
            const res = await fetch('/api/spend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount })
            });
            const data = await res.json();
            if (data.error) alert(data.error);
            else showBalance();
        } catch (err) {
            console.error('Error spending money:', err);
        }
    };

    // --- Event Handlers ---
    navTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pageId = btn.dataset.page;
            if (pageId) {
                e.preventDefault();
                navigateTo(pageId);
                const parentDropdown = btn.closest('.dropdown-menu');
                if (parentDropdown) {
                    const bsDropdown = bootstrap.Dropdown.getInstance(document.getElementById('accountDropdown'));
                    if (bsDropdown) bsDropdown.hide();
                }
            }
        });
    });

    toggleBalance.addEventListener('click', updateBalanceDisplay);

    const handleLogout = (e) => {
        e.preventDefault();
        mainApp.style.display = 'none';
        loginPage.classList.add('active');
        loginPage.style.display = 'flex';
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        hideBalance();
        localStorage.removeItem('isLoggedIn');
        console.log("Dealer logged out from Trackin Portal.");
    };

    if (topLogoutBtn) topLogoutBtn.addEventListener('click', handleLogout);

    // --- Login Submission ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
            console.log("Credentials correct. Simulating OTP send (Use 123456).");
            otpModal.show();
        } else {
            const msgEl = document.getElementById('loginMessage');
            msgEl.textContent = 'Invalid Dealer ID or Password.';
            msgEl.style.display = 'block';
        }
    });

    // --- OTP Verification ---
    otpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const otpInput = document.getElementById('otpInput').value.trim();
        if (otpInput === MOCK_OTP) {
            otpModal.hide();
            loginPage.classList.remove('active');
            loginPage.style.display = 'none';
            mainApp.style.display = 'block';
            navigateTo('homePage');
            localStorage.setItem('isLoggedIn', 'true');
            if (isBalanceHidden) hideBalance();
            else await showBalance();
        } else {
            const msgEl = document.getElementById('otpMessage');
            msgEl.textContent = 'Invalid OTP.';
            msgEl.style.display = 'block';
        }
    });

    // --- Restore Login & Balance on Page Reload ---
    if (localStorage.getItem('isLoggedIn') === 'true') {
        loginPage.classList.remove('active');
        loginPage.style.display = 'none';
        mainApp.style.display = 'block';
        navigateTo('homePage');
        if (isBalanceHidden) hideBalance();
        else showBalance();
    }

    // Expose add/spend functions globally
    window.addMoney = addMoney;
    window.spendMoney = spendMoney;
});
