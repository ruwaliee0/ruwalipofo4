// ------------------------------------------------------------------
// 9. Auth UI & Node.js Backend OTP Verification Logic
// ------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
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
    tabRegisterBtn.classList.add('active');
    tabLoginBtn?.classList.remove('active');
    registerSection?.classList.add('active');
    loginSection?.classList.remove('active');
  });

  // 1. Account Creation with Node.js Server OTP Verification
  const registerForm = document.getElementById('registerForm');
  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('regName');
    const emailInput = document.getElementById('regEmail');
    const passwordInput = document.getElementById('regPassword');

    if (!nameInput || !emailInput || !passwordInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (localStorage.getItem(`user_${email}`)) {
      alert('An account with this email already exists. Please sign in.');
      tabLoginBtn?.click();
      return;
    }

    try {
      alert('इमेलमा OTP पठाउँदैछ, कृपया प्रतिक्षा गर्नुहोस्...');

      // ब्याकइन्ड सर्भरमा OTP पठाउन अनुरोध गर्ने (fetch call)
      const sendResponse = await fetch('http://localhost:3000/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
      });

      const sendData = await sendResponse.json();

      if (!sendData.success) {
        alert(sendData.message || 'OTP पठाउन सकिएन।');
        return;
      }

      // युजरलाई इमेलमा आएको OTP हाल्न माग्ने
      const userEnteredOTP = prompt(`तपाईंको इमेल (${email}) मा पठाइएको ४ डिजिटको OTP यहाँ राख्नुहोस्:`);

      if (!userEnteredOTP) return;

      // युजरले हालेको OTP भेरिफाइ गर्न ब्याकइन्डमा पठाउने
      const verifyResponse = await fetch('http://localhost:3000/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, otp: userEnteredOTP.trim() })
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        // भेरिफाइ भएपछि मात्र LocalStorage मा सेभ गर्ने
        const userData = { name, email, password };
        localStorage.setItem(`user_${email}`, JSON.stringify(userData));
        
        alert('Account successfully created and verified! Please sign in now.');
        registerForm.reset();
        tabLoginBtn?.click();
      } else {
        alert(verifyData.message || 'Incorrect OTP code! Account could not be created.');
      }

    } catch (error) {
      console.error('Server Connection Error:', error);
      alert('ब्याकइन्ड सर्भरसँग जोडिन सकिएन। कृपया terminal मा "node server.js" चलाउनु भएको छ कि छैन चेक गर्नुहोस्।');
    }
  });
});