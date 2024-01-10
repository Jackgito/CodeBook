// Import test libraries 
import { expect } from 'chai';
import { validateEmail, validatePassword } from '../public/javascripts/signUp.js';

// Test validateEmail 
describe('validateEmail', () => {
  it('should return true for valid email', () => {
    const validEmail = 'test@example.com';
    expect(validateEmail(validEmail)).to.be.true;
  });

  it('should return false for invalid email', () => {
    const invalidEmail = 'invalid'; 
    expect(validateEmail(invalidEmail)).to.be.false;
  });
});

// Test validatePassword
describe('validatePassword', () => {
  it('should return true for valid password', () => {
    const validPassword = 'Test123!';
    expect(validatePassword(validPassword)).to.be.true;
  });

  it('should return false if password too short', () => {
    const shortPassword = '123';
    expect(validatePassword(shortPassword)).to.be.false; 
  });
});
