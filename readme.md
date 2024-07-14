# Backend Phonebook API

This repository contains the backend code for a phonebook application. It provides RESTful API
endpoints for managing users and contacts.

## Table of Contents

- [Project Overview](#project-overview)
- [Usage](#usage)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Commands](#commands)
  - [API Endpoints](#api-endpoints)
- [Built With](#built-with)
- [Testing](#testing)
- [Author](#author)

## Project Overview

This project is a backend API for managing user authentication and CRUD operations on contacts. It
is designed to provide a secure and efficient way to interact with a phonebook database.

## Usage

### Prerequisites

Before you begin, ensure you have Node.js and MongoDB installed on your local machine.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/marventures/backend-phonebook.git
   cd backend-phonebook
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set environment variables: Create a .env file in the root directory with the following variables:
   ```
    PORT=
    DB_HOST=
    SECRET_KEY=
    GMAIL_EMAIL=
    GMAIL_PASSWORD=
    BASE_URL=
   ```

### Commands

- `npm start`: Starts the server in production mode.
- `npm run start:dev`: Starts the server in development mode.
- `npm run lint`: Runs eslint to check the code.
- `npm run lint:fix`: Fixes simple linting errors automatically.

### API Endpoints

#### API Documentation

- GET`/api-docs`: You can access the full API documentation built using Swagger UI

#### Users

- POST `/api/users/signup`: Create a new user.

- POST `/api/users/login`: Log in an existing user.

- GET `/api/users/logout`: Log out the current user.

- GET `/api/users/current`: Get information about the current user.

- PATCH `/api/users/`: Update user subscription information.

- PUT `/api/users/info`: Update user information including avatar.

- GET `/api/users/verify/{verificationToken}`: Verify email using verification token.

- POST `/api/users/verify/`: Resend email verfication link.

##### Contacts

- GET `/api/contacts`: Retrieve all contacts.

- POST `/api/contacts`: Create a new contact.

- GET `/api/contacts/{contactId}`: Retrieve a contact by ID.

- PUT `/api/contacts/{contactId}`: Update a contact by ID.

- DELETE `/api/contacts/{contactId}`: Delete a contact by ID.

###### NOTE: Each endpoint requires authentication using JWT (Bearer token) except for `/signup`, `/login` and `/verify/{verificationToken}`.

## Built With

### Core

- [Node.js](https://nodejs.org/en): JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Express.js](https://expressjs.com/): Fast, unopinionated, minimalist web framework for Node.js.

### Database

- [MongoDB](https://www.mongodb.com/products/platform/atlas-database): NoSQL database for modern
  applications.

### Authentication

- [bcryptjs](https://www.npmjs.com/package/bcryptjs): Library to hash passwords.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): Library to create and verify JSON Web
  Tokens (JWT).
- [cookie](https://www.npmjs.com/package/cookie): Library to parse and serialize cookies.

### Middleware

- [cors](https://www.npmjs.com/package/cors): Middleware to enable Cross-Origin Resource Sharing.
- [morgan](https://www.npmjs.com/package/morgan): HTTP request logger middleware for Node.js.
- [multer](https://www.npmjs.com/package/multer): Middleware for handling multipart/form-data,
  primarily for file uploads.

### Utilities

- [dotenv](https://www.npmjs.com/package/dotenv): Module to load environment variables from a .env
  file.
- [gravatar](https://www.npmjs.com/package/gravatar): Library to retrieve Gravatar URLs.
- [jimp](https://www.npmjs.com/package/jimp): Image processing library.
- [joi](https://www.npmjs.com/package/joi): Schema validation library.
- [nodemailer](https://www.npmjs.com/package/nodemailer): Library to send emails.
- [uuid](https://www.npmjs.com/package/uuid): Library to generate unique identifiers.
- [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express): Library to serve
  auto-generated swagger-ui generated API docs from express.

### Development Tools

- [cross-env](https://www.npmjs.com/package/cross-env): Cross-platform environment setting tool.
- [eslint](https://eslint.org/): Linting utility for JavaScript.
- [jest](https://jestjs.io/): JavaScript testing framework.
- [nodemon](https://www.npmjs.com/package/nodemon): Utility to automatically restart the node
  application when file changes are detected.
- [supertest](https://www.npmjs.com/package/supertest): Library to test HTTP assertions.

## Testing

```bash
npm test
```

## Author

- GitHub - [marventures](https://github.com/marventures)
- LinkedIn - [Marvin Morales Pacis](https://www.linkedin.com/in/marventures/)
