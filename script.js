/**
 * Alex Vance Portfolio Architecture
 * Engine: Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ------------------------------------------------------------------
  // 1. Navigation & Mobile Drawer
  // ------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  const handleScrollNavbar = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  const toggleMobileMenu = () => {
    const isOpen = navMenu.classList.contains('is-open');
    if (isOpen) {
      navMenu.classList.remove('is-open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      navMenu.classList.add('is-open');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  };

  hamburgerBtn.addEventListener('click', toggleMobileMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('is-open')) {
        toggleMobileMenu();
      }
    });
  });

  // Active Nav Link Observer
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
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;
  };

  // ------------------------------------------------------------------
  // 3. Custom Cursor Follower
  // ------------------------------------------------------------------
  const cursorDot = document.getElementById('cursorDot');
  const cursorOutline = document.getElementById('cursorOutline');

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

  const hoverTargets = document.querySelectorAll('a, button, input, textarea, .service-row, .project-card, .filter-btn');
  hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // ------------------------------------------------------------------
  // 4. Scroll Reveal Animations (Intersection Observer)
  // ------------------------------------------------------------------
  const revealItems = document.querySelectorAll('.reveal-item');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealItems.forEach(item => revealObserver.observe(item));

  // ------------------------------------------------------------------
  // 5. Statistics Counter Animation
  // ------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let animatedStats = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      let count = 0;
      const speed = target / 40;

      const updateCount = () => {
        count += speed;
        if (count < target) {
          stat.innerText = Math.ceil(count);
          setTimeout(updateCount, 30);
        } else {
          stat.innerText = target;
        }
      };

      updateCount();
    });
  };

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animatedStats) {
        animateCounters();
        animatedStats = true;
      }
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }

  // ------------------------------------------------------------------
  // 6. Projects Filtering System
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
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  // ------------------------------------------------------------------
  // 7. Contact Form Validation
  // ------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const messageInput = document.getElementById('userMessage');
  const formStatus = document.getElementById('formStatus');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      document.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));

      if (!nameInput.value.trim()) {
        nameInput.parentElement.classList.add('has-error');
        isValid = false;
      }

      if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        emailInput.parentElement.classList.add('has-error');
        isValid = false;
      }

      if (!messageInput.value.trim()) {
        messageInput.parentElement.classList.add('has-error');
        isValid = false;
      }

      if (isValid) {
        formStatus.textContent = 'Sending message...';
        formStatus.style.color = 'var(--text-primary)';

        setTimeout(() => {
          formStatus.textContent = 'Thank you. Your message has been sent successfully.';
          contactForm.reset();
        }, 1200);
      }
    });
  }

  // ------------------------------------------------------------------
  // 8. Back to Top Scroll
  // ------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Global Scroll Listener
  window.addEventListener('scroll', () => {
    handleScrollNavbar();
    updateProgressBar();
    observeActiveSection();
  });
});
// ------------------------------------------------------------------
// 9. Auth UI & Full OTP Verification Logic (With Forgot Password & Mail Alerts)
// ------------------------------------------------------------------
const tabLoginBtn = document.getElementById('tabLoginBtn');
const tabRegisterBtn = document.getElementById('tabRegisterBtn');
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');

// Tab Switch Functionality
tabLoginBtn?.addEventListener('click', () => {
  tabLoginBtn.classList.add('active');
  tabRegisterBtn.classList.remove('active');
  loginSection.classList.add('active');
  registerSection.classList.remove('active');
});

tabRegisterBtn?.addEventListener('click', () => {
  tabRegisterBtn.classList.add('active');
  tabLoginBtn.classList.remove('active');
  registerSection.classList.add('active');
  loginSection.classList.remove('active');
});

const WEB3FORMS_ACCESS_KEY = "ddee9129-153a-41f6-bc3b-320a4563aabb";

// मेल पठाउने Helper Function
async function sendMail(subject, messageBody) {
  try {
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: subject,
        from_name: "Portfolio Auth System",
        message: messageBody
      })
    });
  } catch (err) {
    console.log("Mail Send Error:", err);
  }
}

// 1. Account Creation with OTP Verification
const registerForm = document.getElementById('registerForm');
registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const password = document.getElementById('regPassword').value;

  if (localStorage.getItem(`user_${email}`)) {
    alert('An account with this email already exists. Please sign in.।');
    tabLoginBtn.click();
    return;
  }

  const generatedOTP = Math.floor(1000 + Math.random() * 9000);
  
  alert(`तपाईंको इमेल (${email}) मा Verification Code पठाइएको छ।`);
  await sendMail("Account Verification OTP", `Hello ${name},\n\nYour OTP code is: ${generatedOTP}`);

  const userEnteredOTP = prompt("Please enter the 4-digit OTP code received in your email here.");

  if (userEnteredOTP && parseInt(userEnteredOTP) === generatedOTP) {
    const userData = { name, email, password };
    localStorage.setItem(`user_${email}`, JSON.stringify(userData));
    
    await sendMail(
      "New User Account Created & Verified!", 
      `New Account Created:\n\nName: ${name}\nEmail: ${email}\nTime: ${new Date().toLocaleString()}`
    );

    alert('Account successfully created and verified! Please sign in now.।');
    registerForm.reset();
    tabLoginBtn.click();
  } else {
    alert('Incorrect OTP code! Account could not be created. sorry hai');
  }
});

// 2. Sign In (Login with OTP Verification + Mail Alert)
const loginForm = document.getElementById('loginForm');
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;

  const storedData = localStorage.getItem(`user_${email}`);

  if (!storedData) {
    alert('No account found with this email. Please create an account first.।');
    tabRegisterBtn.click();
    return;
  }

  const userData = JSON.parse(storedData);

  if (userData.password === password) {
    const loginOTP = Math.floor(1000 + Math.random() * 9000);
    alert(`For security purposes. (${email}) Login OTP has been sent to your email।`);
    
    await sendMail("Login Verification OTP", `Hello ${userData.name},\n\nYour Login OTP is: ${loginOTP}`);

    const enteredLoginOTP = prompt("Please enter the Login OTP code received in your email.:");

    if (enteredLoginOTP && parseInt(enteredLoginOTP) === loginOTP) {
      alert(`स्वागत छ, ${userData.name}!`);
      localStorage.setItem('user_authenticated', 'true');
      document.getElementById('authModal').style.display = 'none';

      await sendMail(
        "User Logged In Alert!", 
        `User successfully logged in:\n\nName: ${userData.name}\nEmail: ${email}\nTime: ${new Date().toLocaleString()}`
      );
    } else {
      alert('"Incorrect OTP! Login cancelled।');
    }
  } else {
    alert('Incorrect password! Please enter the correct password।');
  }
});

// 3. Forgot Password Logic
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
forgotPasswordLink?.addEventListener('click', async (e) => {
  e.preventDefault();
  
  const email = prompt("Please enter your registered email:");
  if (!email) return;

  const cleanEmail = email.trim().toLowerCase();
  const storedData = localStorage.getItem(`user_${cleanEmail}`);

  if (!storedData) {
    alert("No account found with this email!");
    return;
  }

  const userData = JSON.parse(storedData);
  const resetOTP = Math.floor(1000 + Math.random() * 9000);

 alert(`Password Reset OTP has been sent to your email (${cleanEmail}).`);
  await sendMail("Password Reset OTP", `Hello ${userData.name},\n\nYour Password Reset OTP is: ${resetOTP}`);

  const enteredResetOTP = prompt("Please enter the Reset OTP code received in your email:");

  if (enteredResetOTP && parseInt(enteredResetOTP) === resetOTP) {
    const newPassword = prompt("Please enter your new password:");
    if (newPassword && newPassword.trim() !== "") {
      userData.password = newPassword.trim();
      localStorage.setItem(`user_${cleanEmail}`, JSON.stringify(userData));

      await sendMail(
        "Password Reset Successful Alert", 
        `The password for user was reset successfully.\n\nName: ${userData.name}\nEmail: ${cleanEmail}\nTime: ${new Date().toLocaleString()}`
      );

      alert("Your password has been successfully changed! Please sign in using your new password.।");
      tabLoginBtn.click();
    } else {
      alert("Password cannot be empty.!");
    }
  } else {
    alert("Incorrect OTP code! Password could not be reset.।");
  }
});

// 4. Google/Quick Continue with OTP
document.querySelectorAll('.google-auth-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const userName = prompt("Please enter your full name:");
    const userEmail = prompt("Please enter your actual email.:");
    
    if (userName && userEmail) {
      const googleOTP = Math.floor(1000 + Math.random() * 9000);
     alert(`Verification OTP has been sent to your email (${userEmail}).`);
      await sendMail("Quick Login OTP", `Hello ${userName},\n\nYour Quick Login OTP is: ${googleOTP}`);

      const enteredG_OTP = prompt("Please enter the OTP code received in your email.:");

      if (enteredG_OTP && parseInt(enteredG_OTP) === googleOTP) {
        alert("Verification successful!");
        localStorage.setItem('user_authenticated', 'true');
        document.getElementById('authModal').style.display = 'none';

        await sendMail(
          "Quick Login Alert!", 
          `User logged in via Quick Auth:\n\nName: ${userName}\nEmail: ${userEmail}\nTime: ${new Date().toLocaleString()}`
        );
      } else {
        alert("गलत OTP कोड!");
      }
    }
  });
});