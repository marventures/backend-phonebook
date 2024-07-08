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
- [Testing](#testing)
- [License](#license)
- [Author](#author)

## Project Overview

This project is part of the GoIT Node.js Course Template Homework. It includes functionality for
user authentication and CRUD operations on contacts.

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
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/phonebook
   JWT_SECRET=yoursecretkey
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

##### Contacts

- GET `/api/contacts`: Retrieve all contacts.

- POST `/api/contacts`: Create a new contact.

- GET `/api/contacts/{contactId}`: Retrieve a contact by ID.

- PUT `/api/contacts/{contactId}`: Update a contact by ID.

- DELETE `/api/contacts/{contactId}`: Delete a contact by ID.

###### NOTE: Each endpoint except for `/signup` and `/login` requires authentication using JWT (Bearer token).

### Author

- GitHub - [marventures](https://github.com/marventures)
- LinkedIn - [Marvin Morales Pacis](https://www.linkedin.com/in/marventures/)
- Twitter - [@marventures11](https://twitter.com/marventures11)
