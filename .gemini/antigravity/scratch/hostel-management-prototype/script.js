// Global state
let currentRole = null;
let currentSlide = 1;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Show splash screen for 2 seconds
    setTimeout(() => {
        showScreen('onboarding-screen');
    }, 2000);

    // Initialize event listeners
    initializeEventListeners();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Onboarding
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            showScreen('role-selection-screen');
        });
    }

    // Slide indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            const slideNum = parseInt(indicator.dataset.slide);
            showSlide(slideNum);
        });
    });

    // Auto-advance slides
    setInterval(() => {
        currentSlide = currentSlide >= 3 ? 1 : currentSlide + 1;
        showSlide(currentSlide);
    }, 3000);

    // Role selection
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            currentRole = card.dataset.role;
            showScreen('login-screen');
        });
    });

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleRegister();
        });
    }

    // Password toggle
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                btn.classList.remove('fa-eye');
                btn.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                btn.classList.remove('fa-eye-slash');
                btn.classList.add('fa-eye');
            }
        });
    });

    // Bottom navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const screenId = item.dataset.screen;
            if (screenId) {
                // Update active state
                const parent = item.closest('.bottom-nav');
                parent.querySelectorAll('.nav-item').forEach(nav => {
                    nav.classList.remove('active');
                });
                item.classList.add('active');
                
                // Show screen
                showScreen(screenId);
            }
        });
    });
}

// Show specific slide
function showSlide(slideNum) {
    currentSlide = slideNum;
    
    // Update slides
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        if (parseInt(slide.dataset.slide) === slideNum) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    // Update indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        if (parseInt(indicator.dataset.slide) === slideNum) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Show screen
function showScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
}

// Handle login
function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simple validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate login
    showNotification('Login successful!', 'success');
    
    // Navigate to role-specific dashboard
    setTimeout(() => {
        if (!currentRole) currentRole = 'owner'; // Default to owner for demo
        
        switch(currentRole) {
            case 'owner':
                showScreen('owner-dashboard');
                break;
            case 'tenant':
                showScreen('tenant-home');
                break;
            case 'guest':
                showScreen('guest-search');
                break;
        }
    }, 1000);
}

// Handle registration
function handleRegister() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;
    const terms = document.getElementById('terms').checked;
    
    // Validation
    if (!name || !email || !phone || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!terms) {
        showNotification('Please accept terms and conditions', 'error');
        return;
    }
    
    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        showNotification('Password does not meet requirements', 'error');
        return;
    }
    
    // Simulate registration
    showNotification('Registration successful! Please login.', 'success');
    
    setTimeout(() => {
        showScreen('login-screen');
    }, 1500);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Get notification icon
function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Get notification color
function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#10b981';
        case 'error': return '#ef4444';
        case 'warning': return '#f59e0b';
        default: return '#3b82f6';
    }
}

// Show quick actions
function showQuickActions() {
    const actions = [
        { icon: 'fa-building', label: 'Add Hostel', action: () => showScreen('add-hostel') },
        { icon: 'fa-user-plus', label: 'Add Tenant', action: () => showScreen('add-tenant') },
        { icon: 'fa-money-bill', label: 'Record Payment', action: () => showNotification('Record payment feature coming soon!') }
    ];
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'quick-actions-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="modal-content">
            <h3>Quick Actions</h3>
            <div class="action-list">
                ${actions.map(action => `
                    <button class="action-item" onclick='${action.action.toString()}()'>
                        <i class="fas ${action.icon}"></i>
                        <span>${action.label}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .quick-actions-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            display: flex;
            align-items: flex-end;
            justify-content: center;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            position: relative;
            background: white;
            border-radius: 20px 20px 0 0;
            padding: 2rem;
            max-width: 450px;
            width: 100%;
            animation: slideUp 0.3s ease;
        }
        
        .modal-content h3 {
            margin-bottom: 1.5rem;
            font-size: 1.5rem;
        }
        
        .action-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .action-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: var(--bg-tertiary);
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: var(--transition);
            font-size: 1rem;
        }
        
        .action-item:hover {
            background: var(--primary-color);
            color: white;
        }
        
        .action-item i {
            font-size: 1.5rem;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
}

// Demo data functions
function loadOwnerDashboard() {
    // This would normally fetch data from API
    console.log('Loading owner dashboard data...');
}

function loadHostels() {
    console.log('Loading hostels...');
}

function loadTenants() {
    console.log('Loading tenants...');
}

function searchHostels() {
    console.log('Searching hostels...');
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(date));
}

// Export functions for inline onclick handlers
window.showScreen = showScreen;
window.showQuickActions = showQuickActions;
window.showNotification = showNotification;

console.log('HostelHub Prototype Loaded ✨');
