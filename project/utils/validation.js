// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation regex - at least 8 chars, 1 number, 1 special character
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

// Username validation - alphanumeric, 3-20 chars
const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;

// Valid roles
const validRoles = ['user', 'moderator', 'admin'];

export const validateRegistration = (userData) => {
  const errors = {};

  // Validate username
  if (!userData.username) {
    errors.username = 'Username is required';
  } else if (!usernameRegex.test(userData.username)) {
    errors.username = 'Username must be alphanumeric and between 3-20 characters';
  }

  // Validate email
  if (!userData.email) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(userData.email)) {
    errors.email = 'Invalid email format';
  }

  // Validate password
  if (!userData.password) {
    errors.password = 'Password is required';
  } else if (!passwordRegex.test(userData.password)) {
    errors.password = 'Password must be at least 8 characters with at least 1 number and 1 special character';
  }

  // Validate role
  if (userData.role && !validRoles.includes(userData.role)) {
    errors.role = `Role must be one of: ${validRoles.join(', ')}`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateLogin = (userData) => {
  const errors = {};

  // Validate username
  if (!userData.username) {
    errors.username = 'Username is required';
  }

  // Validate password
  if (!userData.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateProfileUpdate = (userData) => {
  const errors = {};

  // Validate email if provided
  if (userData.email && !emailRegex.test(userData.email)) {
    errors.email = 'Invalid email format';
  }

  // Validate password if provided
  if (userData.password && !passwordRegex.test(userData.password)) {
    errors.password = 'Password must be at least 8 characters with at least 1 number and 1 special character';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRoleUpdate = (role) => {
  if (!role) {
    return { isValid: false, error: 'Role is required' };
  }

  if (!validRoles.includes(role)) {
    return { isValid: false, error: `Role must be one of: ${validRoles.join(', ')}` };
  }

  return { isValid: true };
};