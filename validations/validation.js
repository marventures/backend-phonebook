import Joi from 'joi';

// validation for adding/updating a contact
const contactValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string(),
  phone: Joi.string().required(),
});

// validation for updating favorite field
const favoriteValidation = Joi.object({
  favorite: Joi.bool().required(),
});

// validation for signup
const signupValidation = Joi.object({
  firstName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      'string.pattern.base': 'First name must only contain alphabet letters',
      'any.required': 'Missing required first name field',
    }),
  lastName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Last name must only contain alphabet letters',
      'any.required': 'Missing required last name field',
    }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required()
    .messages({
      'any.required': 'Missing required email field',
      'string.email': 'Invalid email format',
    }),
  password: Joi.string().min(6).max(16).required().messages({
    'any.required': 'Missing required password field',
    'string.min': 'Password must be at least {#limit} characters long',
    'string.max': 'Password cannot be longer than {#limit} characters',
  }),
});

// validation for signup
const loginValidation = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required()
    .messages({
      'any.required': 'Missing required email field',
      'string.email': 'Invalid email format',
    }),
  password: Joi.string().min(6).max(16).required().messages({
    'any.required': 'Missing required password field',
    'string.min': 'Password must be at least {#limit} characters long',
    'string.max': 'Password cannot be longer than {#limit} characters',
  }),
});

const subscriptionValidation = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business'),
});

const profileValidation = Joi.object({
  firstName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      'string.pattern.base': 'First name must only contain alphabet letters',
      'any.required': 'Missing required first name field',
    }),
  lastName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Last name must only contain alphabet letters',
      'any.required': 'Missing required last name field',
    }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required()
    .messages({
      'any.required': 'Missing required email field',
      'string.email': 'Invalid email format',
    }),
});

// prettier-ignore
export { contactValidation, favoriteValidation, signupValidation, loginValidation, subscriptionValidation, profileValidation };
