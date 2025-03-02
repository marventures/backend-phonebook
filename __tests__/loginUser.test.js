import request from 'supertest';
import { app } from '../app.js';
import { User } from '../models/usersModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';
import gravatar from 'gravatar';

describe('Test @POST /api/users/login', () => {
  const signInData = {
    email: 'marvin@example.com',
    password: 'examplepassword',
  };

  const mockUserId = 'mockUserId';
  const mockUser = {
    _id: mockUserId,
    firstName: 'Marvin',
    lastName: 'Pacis',
    email: signInData.email,
    password: bcrypt.hash(signInData.password, 10),
    subscription: 'starter',
    avatarURL: gravatar.url(signInData.email, { protocol: 'https' }),
  };

  beforeAll(() => {
    // Mock User.findOne
    jest.spyOn(User, 'findOne').mockImplementation(({ email }) => {
      if (email === signInData.email) {
        return Promise.resolve(mockUser);
      }
      return Promise.resolve(null);
    });

    // Mock bcrypt.compare
    jest.spyOn(bcrypt, 'compare').mockImplementation((password, hashedPassword) => {
      return Promise.resolve(
        password === signInData.password && hashedPassword === mockUser.password
      );
    });

    // Mock jwt.sign
    jest.spyOn(jwt, 'sign').mockImplementation(() => 'mockJwtToken');

    // Mock User.findByIdAndUpdate
    jest.spyOn(User, 'findByIdAndUpdate').mockImplementation((id, update) => {
      if (id === mockUserId) {
        return Promise.resolve({ ...mockUser, ...update });
      }
      return Promise.resolve(null);
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('Test login with correct data.', async () => {
    const response = await request(app).post('/api/users/login').send(signInData);

    console.log('Login Data:', signInData);
    console.log('Response status code:', response.status);
    console.log('Response body:', response.body);
    console.log('Response body USER:', response.body.user);

    // Response must have status code 200
    expect(response.status).toBe(200);

    // The token must be returned in the response
    expect(response.body).toHaveProperty('token', 'mockJwtToken');

    const { user } = response.body;

    // The response should return a user object with 2 fields email and subscription
    expect(user).toHaveProperty(
      'email' && 'subscription' && 'firstName' && 'lastName' && 'avatarURL'
    );

    // email and subscription, having the data type String
    expect(
      user.email && user.subscription && user.firstName && user.lastName && user.avatarURL
    ).toEqual(expect.any(String));
  });
});
