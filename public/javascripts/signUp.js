document.addEventListener('DOMContentLoaded', function () {
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const invalidUsernameHelper = document.getElementById('invalidUsername');
  const invalidEmailHelper = document.getElementById('invalidEmail');
  const invalidPasswordHelper = document.getElementById('invalidPassword');

  // Function to make an asynchronous request to check uniqueness
  const checkUniqueness = async (field, value) => {
    try {
      const response = await fetch(`/check-unique?field=${field}&value=${value}`);
      const data = await response.json();
      return data.unique;
    } catch (error) {
      console.error('Error checking uniqueness:', error);
      return false;
    }
  };

  // Function to debounce a check function
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  // Function to check username uniqueness
  const checkUsernameUniqueness = async () => {
    const value = usernameInput.value;
    const isUnique = await checkUniqueness('username', value);

    if (!isUnique) {
      invalidUsernameHelper.hidden = false;
      invalidUsernameHelper.textContent = 'Username already taken.';
      usernameInput.classList.add('invalid');
    } else {
      invalidUsernameHelper.hidden = true;
      invalidUsernameHelper.textContent = '';
      usernameInput.classList.remove('invalid');
    }
  };

  // Function to validate password
  const validatePassword = () => {
    const password = passwordInput.value;
    const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);

    if (!isValidPassword) {
      invalidPasswordHelper.textContent = 'Password must contain at least eight characters, including at least 1 letter and 1 number.';
      passwordInput.classList.add('invalid');
    } else {
      invalidPasswordHelper.textContent = '';
      passwordInput.classList.remove('invalid');
    }
  };

  // Function to check email uniqueness
  const checkEmailUniqueness = async () => {
    const value = emailInput.value;
    const isUnique = await checkUniqueness('email', value);
    return isUnique;
  };
  
  // Function to validate email syntax
  const validateEmailSyntax = () => {
    const email = emailInput.value;
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    return isValidEmail;
  };

  // Debounced event listener for username input
  usernameInput.addEventListener('input', debounce(checkUsernameUniqueness, 800));

  // Debounced event listener for email input
  emailInput.addEventListener('input', debounce(async () => {
  const isValidSyntax = validateEmailSyntax();
  const isUnique = await checkEmailUniqueness(); // Wait for the asynchronous function to complete

  if (isValidSyntax && isUnique) {
    invalidEmailHelper.hidden = true;
    invalidEmailHelper.textContent = '';
    emailInput.classList.remove('invalid');
  } else {
    invalidEmailHelper.hidden = false;
    invalidEmailHelper.textContent = 'Enter a valid email address.';
    emailInput.classList.add('invalid');
  }
}, 800));

  // Debounced event listener for password input
  passwordInput.addEventListener('input', debounce(validatePassword, 800));
});
