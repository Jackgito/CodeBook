document.addEventListener('DOMContentLoaded', function () {
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const invalidUsernameHelper = document.getElementById('invalidUsername');
  const invalidEmailHelper = document.getElementById('invalidEmail');
  const invalidPasswordHelper = document.getElementById('invalidPassword');

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
  
    // Check if the username is empty
    if (!value) {
      invalidUsernameHelper.hidden = true;
      invalidUsernameHelper.textContent = '';
      usernameInput.classList.remove('invalid');
      return;
    }
  
    // Check length
    if (value.length > 30) {
      invalidUsernameHelper.hidden = false;
      invalidUsernameHelper.textContent = 'Username can\'t exceed 30 characters.';
      usernameInput.classList.add('invalid');
      return;
    }
  
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



  // Function to check email uniqueness (not used for user security purposes)
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
  usernameInput.addEventListener('input', debounce(validateUsername, 800));

  // Debounced event listener for email input
  emailInput.addEventListener('input', debounce(async () => {
    const isValidSyntax = validateEmailSyntax();
    // const isUnique = await checkEmailUniqueness(); // Wait for the asynchronous function to complete

    if (isValidSyntax) {
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
