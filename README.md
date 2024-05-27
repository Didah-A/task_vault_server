## Task manager API

## Demo api url
- [Link](https://task-vault-server.onrender.com/ping)

### Features
- Register a user
- Sign in a user
- Get user details from Id
- Edit user details
- Delete user
- Create a task
- Edit a task
- view a task
- delete Task

## Endpoints
- `/api/users/signin` - POST - sign in user to get JWT token
- `/api/users` - POST - create new user
- `/api/users` - GET - Get All users
- `/api/users/:userId` - GET - Get user by Id
- `/api/users/:userId` - PATCH - update user details
- `/api/users/:userId` - DELETE - delete a user

- `/api/tasks` - GET - Get all tasks for a user
- `/api/tasks` - POST - create new task
- `/api/tasks/:taskId` - GET - get task by id
- `/api/tasks/:taskId` - PATCH - update a task
- `/api/tasks/:taskId` - DELETE - delete a task

## Getting started

### Prerequisites
- MongoDB
- Node.js

### Steps
- clone repository
- `npm install`
- create .env in root directory
- add `MONGODB_URL` to .env
- add `AUTH_KEY` to .env
- `nodemon`

- Create a new user
- sign in user to get Token in response header
- add 'x-auth-token` header with token to all other requests to the server
  
