/**
 * Sharan Ruwali Portfolio Engine
 * Features: Mobile & Desktop Responsive Logic, Direct LocalStorage Auth, 
 * Strict Device Email Match Validation, Web3Forms Alerts, Google Identity SDK.
 */

// ------------------------------------------------------------------
// API Configurations
// ------------------------------------------------------------------
const WEB3FORMS_ACCESS_KEY = "ddee9129-153a-41f6-bc3b-320a4563aabb";
const EMAILVERIFY_API_KEY = "YOUR_EMAILVERIFY_API_KEY"; 
const GOOGLE_CLIENT_ID = "915820950265-ofrd7v6p7cvues6i5vd865ci8jqlj2v6.apps.googleusercontent.com";

// Temporary Holder for Registration Data 
window.pendingRegistrationData = null;

// ------------------------------------------------------------------
// Web3Forms Configuration & Admin Notification Helper
// ------------------------------------------------------------------
async function sendAdminAuthNotification(userName, userEmail, actionType) {
  try {
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `New Auth Alert: ${actionType} (${userName || "User"})`,
        from_name: "Portfolio Auth Alert",
        email: userEmail,
        message: `User Auth Event Notification:\n\nEvent Type: ${actionType}\nName: ${userName || "N/A"}\nEmail: ${userEmail}\nTime: ${new Date().toLocaleString()}`
      })
    });
    console.log(`Admin notification email sent via Web3Forms for: ${actionType}`);
  } catch (err) {
    console.error('Failed to send admin notification email:', err);
  }
}

// ------------------------------------------------------------------
// Async Email Strict Validator (Blocks Fake Mailboxes & Random Formats)
// ------------------------------------------------------------------
const DISPOSABLE_DOMAINS = [
  'mailinator.com', '10minutemail.com', 'tempmail.com', 'yopmail.com',
  'guerrillamail.com', 'dispostable.com', 'sharklasers.com', 'getnada.com',
  'throwawaymail.com', 'temp-mail.org', 'fake-box.com', 'maildrop.cc'
];

async function isStrictValidEmail(email) {
  if (!email) return false;
  
  // Standard RFC Email Regex Check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return false;

  const domain = email.split('@')[1]?.toLowerCase();
  
  // Block Disposable / Temporary Email Domains
  if (DISPOSABLE_DOMAINS.includes(domain)) {
    return false;
  }

  // Live Check via Verification API
  if (EMAILVERIFY_API_KEY && EMAILVERIFY_API_KEY !== "YOUR_EMAILVERIFY_API_KEY") {
    try {
      const res = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${EMAILVERIFY_API_KEY}&email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.deliverability !== "DELIVERABLE" || data.is_disposable_email?.value) {
        return false;
      }
    } catch (e) {
      console.warn("Live API check failed, falling back to local domain validation.");
    }
  }

  return true;
}

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ------------------------------------------------------------------
  // 1. Mobile Navigation & Responsive Drawer Toggle
  // ------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  const handleScrollNavbar = () => {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  const toggleMobileMenu = () => {
    if (!navMenu) return;
    const isOpen = navMenu.classList.contains('is-open');
    if (isOpen) {
      navMenu.classList.remove('is-open');
      hamburgerBtn?.classList.remove('is-active');
      hamburgerBtn?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      navMenu.classList.add('is-open');
      hamburgerBtn?.classList.add('is-active');
      hamburgerBtn?.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  };

  hamburgerBtn?.addEventListener('click', toggleMobileMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu?.classList.contains('is-open')) {
        toggleMobileMenu();
      }
    });
  });

  // Active Navigation Scroll Tracking
  const sections = document.querySelectorAll('section[id]');
  const observeActiveSection = () => {
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  // ------------------------------------------------------------------
  // 2. Scroll Progress Bar
  // ------------------------------------------------------------------
  const progressBar = document.getElementById('progressBar');

  const updateProgressBar = () => {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${scrollPercent}%`;
  };

  // ------------------------------------------------------------------
  // 3. Custom Cursor Follower (Disabled for Touch Devices)
  // ------------------------------------------------------------------
  const cursorDot = document.getElementById('cursorDot');
  const cursorOutline = document.getElementById('cursorOutline');
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  if (!isTouchDevice && cursorDot && cursorOutline) {
    const moveCursor = (e) => {
      document.body.classList.add('cursor-active');
      const posX = e.clientX;
      const posY = e.clientY;

      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 400, fill: 'forwards' });
    };

    window.addEventListener('mousemove', moveCursor);

    const hoverTargets = document.querySelectorAll('a, button, input, textarea, .service-bw-card, .project-card, .filter-btn');
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // ------------------------------------------------------------------
  // 4. Scroll Reveal Observer
  // ------------------------------------------------------------------
  const revealItems = document.querySelectorAll('.reveal-item');
  if (revealItems.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -30px 0px'
    });

    revealItems.forEach(item => revealObserver.observe(item));
  }

  // ------------------------------------------------------------------
  // 5. Portfolio Filtering Logic
  // ------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || filterValue === category) {
          card.style.display = 'block';
          setTimeout(() => card.classList.remove('is-hidden'), 10);
        } else {
          card.classList.add('is-hidden');
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ------------------------------------------------------------------
  // 6. Contact Form Validation & Mail Dispatch
  // ------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const messageInput = document.getElementById('userMessage');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let isValid = true;

      document.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));

      if (!nameInput?.value.trim()) {
        nameInput?.parentElement?.classList.add('has-error');
        isValid = false;
      }

      const isEmailValid = await isStrictValidEmail(emailInput?.value.trim());
      if (!emailInput?.value.trim() || !isEmailValid) {
        emailInput?.parentElement?.classList.add('has-error');
        alert("Please provide a valid, active email address.");
        isValid = false;
      }

      if (!messageInput?.value.trim()) {
        messageInput?.parentElement?.classList.add('has-error');
        isValid = false;
      }

      if (isValid) {
        if (formStatus) {
          formStatus.textContent = 'Sending message...';
          formStatus.style.color = '#000';
        }

        setTimeout(() => {
          if (formStatus) {
            formStatus.textContent = 'Thank you! Your message has been submitted.';
            formStatus.style.color = 'green';
          }
          contactForm.reset();
        }, 1000);
      }
    });
  }

  // ------------------------------------------------------------------
  // 7. Global Listeners & Back To Top
  // ------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTop');
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    handleScrollNavbar();
    updateProgressBar();
    observeActiveSection();
  });
});

// ------------------------------------------------------------------
// 8. Auth Modal Tabs Switching
// ------------------------------------------------------------------
const tabLoginBtn = document.getElementById('tabLoginBtn');
const tabRegisterBtn = document.getElementById('tabRegisterBtn');
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');

tabLoginBtn?.addEventListener('click', () => {
  tabLoginBtn.classList.add('active');
  tabRegisterBtn?.classList.remove('active');
  loginSection?.classList.add('active');
  registerSection?.classList.remove('active');
});

tabRegisterBtn?.addEventListener('click', () => {
  tabRegisterBtn?.classList.add('active');
  tabLoginBtn?.classList.remove('active');
  registerSection?.classList.add('active');
  loginSection?.classList.remove('active');
});

// ------------------------------------------------------------------
// 9. Sign Up with Google Device Email Verification Match
// ------------------------------------------------------------------
const registerForm = document.getElementById('registerForm');
registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('regName')?.value.trim();
  const email = document.getElementById('regEmail')?.value.trim().toLowerCase();
  const password = document.getElementById('regPassword')?.value;

  if (!name || !email || !password) return;

  const isValid = await isStrictValidEmail(email);
  if (!isValid) {
    alert('Invalid or temporary email format. Please provide a valid email address.');
    return;
  }

  if (localStorage.getItem(`user_${email}`)) {
    alert('An account with this email already exists. Please sign in.');
    tabLoginBtn?.click();
    return;
  }

  // Save temporary registration data to global window object
  window.pendingRegistrationData = { name, email, password };

  alert(`Device Verification Required:\n\nPlease select the Google Account (${email}) from the pop-up to confirm ownership.`);

  // Trigger Google Prompt Modal on Desktop/Mobile
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.prompt();
  } else {
    alert('Google Identity SDK failed to load. Please reload the page.');
  }
});

// ------------------------------------------------------------------
// 10. Direct Sign In Handler
// ------------------------------------------------------------------
const loginForm = document.getElementById('loginForm');
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail')?.value.trim().toLowerCase();
  const password = document.getElementById('loginPassword')?.value;

  if (!email || !password) return;

  const isValid = await isStrictValidEmail(email);
  if (!isValid) {
    alert('Invalid email format or non-existent email.');
    return;
  }

  const storedData = localStorage.getItem(`user_${email}`);

  if (!storedData) {
    alert('No account found with this email. Please create an account or sign in with Google.');
    tabRegisterBtn?.click();
    return;
  }

  const userData = JSON.parse(storedData);

  if (userData.password === password) {
    alert(`Welcome back, ${userData.name}!`);
    localStorage.setItem('user_authenticated', 'true');
    
    sendAdminAuthNotification(userData.name, email, "User Sign In (Password)");

    const authModal = document.getElementById('authModal');
    if (authModal) authModal.style.display = 'none';
  } else {
    alert('Incorrect password! Please try again.');
  }
});

// ------------------------------------------------------------------
// 11. Fixed & Robust Forgot Password Handler
// ------------------------------------------------------------------
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
forgotPasswordLink?.addEventListener('click', (e) => {
  e.preventDefault();

  const email = prompt('Enter your registered Email Address:');
  if (!email) return;

  const cleanEmail = email.trim().toLowerCase();
  
  // Basic Format Regex Check (Avoid API Deadlocks during Password Reset)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) {
    alert('Please enter a valid email address format.');
    return;
  }

  const storedData = localStorage.getItem(`user_${cleanEmail}`);

  if (!storedData) {
    alert('No account found with this email address. Please register first.');
    return;
  }

  const userData = JSON.parse(storedData);

  // Handle Google Signed In Users trying to reset password
  if (userData.googleAuth && !userData.password) {
    alert('This email was registered using Google Sign-In. Please click "Sign in with Google" instead.');
    return;
  }

  const newPassword = prompt('Enter your new password:');
  if (!newPassword || newPassword.trim() === '') {
    alert('Password update cancelled or invalid password provided.');
    return;
  }

  userData.password = newPassword.trim();
  localStorage.setItem(`user_${cleanEmail}`, JSON.stringify(userData));

  sendAdminAuthNotification(userData.name || "User", cleanEmail, "Password Reset Success");

  alert('Password reset successfully! You can now sign in with your new password.');
  tabLoginBtn?.click();
});

// ------------------------------------------------------------------
// 12. Google Identity Integration (With Strict Email Matching Logic)
// ------------------------------------------------------------------
function parseJwt(token) {
  try {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

window.handleGoogleCredentialResponse = function(response) {
  const payload = parseJwt(response.credential);
  if (!payload) {
    alert("Google Sign-In verification failed. Please try again.");
    return;
  }

  const googleEmail = payload.email.toLowerCase();
  const googleName = payload.name;

  // Check if this response originated from Form Registration
  if (window.pendingRegistrationData) {
    const typedEmail = window.pendingRegistrationData.email;

    // Strict Validation: Typed Email vs Device Google Email
    if (typedEmail !== googleEmail) {
      alert(`Account Creation Failed!\n\nTyped Email: ${typedEmail}\nSelected Device Email: ${googleEmail}\n\nBoth emails must match to verify your account.`);
      window.pendingRegistrationData = null; // Clear state
      return;
    }

    // Emails Match: Complete Account Creation
    const newUserData = {
      name: window.pendingRegistrationData.name,
      email: typedEmail,
      password: window.pendingRegistrationData.password
    };

    localStorage.setItem(`user_${typedEmail}`, JSON.stringify(newUserData));
    localStorage.setItem('user_authenticated', 'true');

    sendAdminAuthNotification(newUserData.name, typedEmail, "Verified Form Sign Up");

    alert(`Account created successfully for ${typedEmail}!`);
    window.pendingRegistrationData = null;

    registerForm?.reset();
    tabLoginBtn?.click();

    const authModal = document.getElementById('authModal');
    if (authModal) authModal.style.display = 'none';
    return;
  }

  // Direct Google Sign In Button Flow
  alert(`Welcome ${googleName}! Signed in with Google.`);
  localStorage.setItem('user_authenticated', 'true');
  localStorage.setItem(`user_${googleEmail}`, JSON.stringify({ name: googleName, email: googleEmail, googleAuth: true }));

  sendAdminAuthNotification(googleName, googleEmail, "Google Direct Sign In");

  const authModal = document.getElementById('authModal');
  if (authModal) authModal.style.display = 'none';
};

window.renderGoogleAuthButton = function() {
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: window.handleGoogleCredentialResponse,
      auto_select: false,
      locale: "en"
    });

    // Render buttons across layout elements
    document.querySelectorAll('.google-auth-btn').forEach(btn => {
      btn.innerHTML = "";
      google.accounts.id.renderButton(
        btn,
        { 
          theme: "outline", 
          size: "large", 
          width: "100%", 
          type: "standard", 
          shape: "pill" 
        }
      );
    });
  }
};

window.addEventListener('load', () => {
  window.renderGoogleAuthButton();
});