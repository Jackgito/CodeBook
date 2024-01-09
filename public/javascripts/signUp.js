document.addEventListener('DOMContentLoaded', function () {
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const invalidUsernameHelper = document.getElementById('invalidUsername');
  const invalidEmailHelper = document.getElementById('invalidEmail');
  const invalidPasswordHelper = document.getElementById('invalidPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const confirmPasswordError = document.getElementById('confirmPasswordError');

  // Used for checking username and email unqiueness
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

  // Used for mitigating database overload
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  // Function to check username uniqueness and validity
  const validateUsername = async () => {
    const value = usernameInput.value;
  
    // Check length
    if (value.length > 30) {
      invalidUsernameHelper.hidden = false;
      invalidUsernameHelper.textContent = 'Username can\'t exceed 30 characters.';
      usernameInput.classList.add('invalid');
      return;
    }

    // Check if username exists already
    const isUnique = await checkUniqueness('username', value);
    if (!isUnique) {
      invalidUsernameHelper.hidden = false;
      invalidUsernameHelper.textContent = 'Username already taken.';
      usernameInput.classList.add('invalid');
      return;
    }

    // Check for invalid characters
    const invalidChars = /[^\w-]/.test(value);
    if (invalidChars) {
      invalidUsernameHelper.textContent = 'Username can only contain letters, numbers, underscores and dashes.';
      usernameInput.classList.add('invalid');
      usernameInput.classList.add('invalid');
      return; 
    }

    invalidUsernameHelper.hidden = true;
    invalidUsernameHelper.textContent = '';
    usernameInput.classList.remove('invalid');
  };

  // Validate email and show error messages
  const validateEmail = () => {

    const email = emailInput.value;

    // Check email syntax
    const validateEmailSyntax = (email) => {
      const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      return re.test(email);
    }  

    const isValidEmail = validateEmailSyntax(email);

    if (isValidEmail) {
      // Clear error
      invalidEmailHelper.hidden = true;
      invalidEmailHelper.textContent = '';
      emailInput.classList.remove('invalid'); 
    } else {
      // Show error
      invalidEmailHelper.hidden = false;
      invalidEmailHelper.textContent = 'Enter a valid email address.';
      emailInput.classList.add('invalid');
    }
  }
  
  // Function to validate password
  const validatePassword = () => {
    const password = passwordInput.value;

    // Check if the password is empty
    if (!password) {
      invalidPasswordHelper.textContent = 'Password is required.';
      passwordInput.classList.add('invalid');
      return;
    }

    // Check length
    if (password.length < 8 || password.length > 30) {
      invalidPasswordHelper.textContent = 'Password must be between 8 and 30 characters.';
      passwordInput.classList.add('invalid');
      return;
    }

    // Check for at least 1 letter and 1 number using Unicode character classes
    const hasLetter = /\p{L}/u.test(password);
    const hasNumber = /\d/.test(password);

    if (!hasLetter || !hasNumber) {
      invalidPasswordHelper.textContent = 'Password must contain at least 1 letter and 1 number.';
      passwordInput.classList.add('invalid');
      return;
    }

    invalidPasswordHelper.textContent = '';
    passwordInput.classList.remove('invalid');
  };

  // Validate confirm password
  const validateConfirmPassword = () => {

    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (confirmPassword === password) {
      // Clear error
      confirmPasswordError.hidden = true;
      confirmPasswordError.textContent = '';
      confirmPasswordInput.classList.remove('invalid');
    } else {
      // Show error 
      confirmPasswordError.hidden = false;
      confirmPasswordError.textContent = 'Passwords do not match';
      confirmPasswordInput.classList.add('invalid');
    }
  }

  // Debounced event listeners
  usernameInput.addEventListener('input', debounce(validateUsername, 800));
  emailInput.addEventListener('input', debounce(validateEmail, 800));
  passwordInput.addEventListener('input', debounce(validatePassword, 800));
  confirmPasswordInput.addEventListener('input', debounce(validateConfirmPassword, 800));

  // Prevent sign up if errors in input fields

  const form = document.getElementById('signUpForm');

  form.addEventListener('submit', (event) => {
    if (hasErrors()) {
      event.preventDefault();
    }
  });

  function hasErrors() {
    // check if there are errors
    return !!invalidUsername.textContent || !!invalidEmail.textContent || !!invalidPassword.textContent || !!confirmPasswordError.textContent; 
  }
});