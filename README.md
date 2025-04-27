# cap-cap-be

BE for CapCap

## Overview

CapCap is a backend system designed to manage resources for a food-related application. It provides APIs for user authentication, food management, restaurant management, quizzes, badges, and vouchers.

## Features

- User authentication and authorization
- CRUD operations for foods, restaurants, quizzes, badges, and vouchers
- Interactive quizzes with scoring and rewards
- Interactive map with restaurant details using manual Google Maps links
- "What to eat today?" feature for random food suggestions
- Participation in competitions with ranking and rewards
- Member registration and profile management, including loyalty points and voucher storage

## Prerequisites

- Node.js (>= 14.x)
- MongoDB (>= 4.x)
- npm (>= 6.x) or yarn

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-repo/cap-cap-be.git
    cd cap-cap-be
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3. Create a `.env` file in the root directory and configure environment variables with your actual credentials. (There is an example template in `.env.example`)

4. Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

## Data Seeding

The project includes a comprehensive set of seed data for testing and development purposes. To seed the database with sample data:

1. Make sure your MongoDB connection is properly configured in the `.env` file.

2. Run the seeding script:
    ```bash
    npm run seed
    # or
    yarn seed
    ```

This will populate your database with:

- Food items and their tags
- Restaurants with their menus
- Quizzes and questions
- Badges and vouchers
- Sample quiz results

The seed data is located in the `seeds/seed-data` directory and includes:

- `Food.json`: Vietnamese dishes with descriptions and ingredients
- `FoodTag.json`: Food categories and tags
- `Restaurant.json`: Restaurants with their menus and locations
- `Quiz.json`: Quizzes with their configurations
- `Question.json`: Quiz questions with answers
- `Badge.json`: Achievement badges
- `Voucher.json`: Discount vouchers
- `QuizResults.json`: Sample quiz completion records

Note: Running the seed script will delete all existing data in the database before inserting the new seed data.

## API Documentation

Refer to the [API List](./docs/api-list.md) for detailed documentation of all available endpoints.

## Scripts

- `npm run dev`: Start the development server with debugging enabled
- `npm start`: Start the production server
- `npm run pretty`: Format codebase using Prettier
- `npm test`: Run tests

## Folder Structure

```
cap-cap-be/
├── src/
│   ├── controllers/   # API controllers
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── middlewares/   # Custom middlewares
│   ├── utils/         # Utility functions
│   └── app.js         # Express app setup
├── docs/              # Documentation
├── tests/             # Test cases
├── .env.example       # Example environment variables
└── README.md          # Project README
```

## Contributing

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature/your-feature-name
    ```
3. Commit your changes:
    ```bash
    git commit -m "Add your message here"
    ```
4. Push to your branch:
    ```bash
    git push origin feature/your-feature-name
    ```
5. Create a pull request.

## Security Practices

- Sensitive information such as database credentials and secret keys are stored in a `.env` file and not hardcoded in the codebase.
- Use placeholders in documentation for sensitive values (e.g., `<username>`, `<password>`).
- Middleware for authentication and authorization is implemented to protect API endpoints.
- Rate-limiting and brute-force protection are recommended for production deployment.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
