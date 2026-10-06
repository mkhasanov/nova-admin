(function () {
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (window.novaAdminStorage.isAuthenticated()) {
      window.location.href = 'index.html#/dashboard';
      return;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      let valid = true;

      if (!validateEmail(email)) {
        emailInput.classList.add('invalid');
        emailInput.nextElementSibling.textContent = 'Enter a valid email address.';
        valid = false;
      } else {
        emailInput.classList.remove('invalid');
        emailInput.nextElementSibling.textContent = '';
      }

      if (!password) {
        passwordInput.classList.add('invalid');
        passwordInput.nextElementSibling.textContent = 'Password is required.';
        valid = false;
      } else {
        passwordInput.classList.remove('invalid');
        passwordInput.nextElementSibling.textContent = '';
      }

      if (!valid) return;

      const credentials = window.novaAdminData.adminCredentials || { email: 'admin@example.com', password: 'admin123' };
      if (email !== credentials.email || password !== credentials.password) {
        window.novaAdminUtils.showToast('Invalid demo credentials.', 'error');
        return;
      }

      window.novaAdminStorage.login({
        name: 'Alicia Morgan',
        email,
        role: 'Product Lead',
        avatar: 'AM'
      });

      window.novaAdminUtils.showToast('Login successful. Redirecting to dashboard...', 'success');
      setTimeout(() => {
        window.location.href = 'index.html#/dashboard';
      }, 400);
    });
  });
})();
