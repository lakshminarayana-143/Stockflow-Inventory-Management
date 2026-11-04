export const validateSignup = (req, res, next) => {
  const { email, password, confirmPassword, organizationName } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    errors.push('A valid email address is required');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    errors.push('Password and Confirm Password do not match');
  }

  if (!organizationName || typeof organizationName !== 'string' || organizationName.trim().length === 0) {
    errors.push('Organization name is required');
  } else if (organizationName.trim().length > 100) {
    errors.push('Organization name cannot exceed 100 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: errors[0],
      errors,
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push('Email is required');
  }

  if (!password || typeof password !== 'string' || !password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: errors[0],
      errors,
    });
  }

  next();
};

