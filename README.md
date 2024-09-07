![image](https://github.com/user-attachments/assets/7e59fb1d-bac8-4356-b00d-c2d7c6ec31db)
https://watermark.theadityadubey.com/

Watermark App
=============

This is a Watermark web application that allows users to upload images, apply a watermark logo, and customize the watermark's size and opacity. The project is built using Node.js, Express, MongoDB, EJS templating, and TailwindCSS for styling.

Table of Contents
-----------------

*   [Installation](#installation)
*   [Environment Variables](#environment-variables)
*   [Project Structure](#project-structure)
*   [Usage](#usage)
*   [Features](#features)
*   [Middleware](#middleware)
*   [License](#license)

Installation
------------

### Prerequisites

*   [Node.js](https://nodejs.org/) (v21)
*   [MongoDB](https://www.mongodb.com/) (local)
*   [npm](https://www.npmjs.com/) 

### Steps

1.  Clone the repository:
    
        git clone https://github.com/your-username/watermark.git
        cd watermark
    
2.  Install dependencies:
    
        npm install
    
3.  Create a `.env` file in the root of your project and configure your environment variables. Refer to the [Environment Variables](#environment-variables) section.

    
5.  Visit [http://localhost:3000](http://localhost:3000) in your browser.

Environment Variables
---------------------

You need to set up the following environment variables in your `.env` file:

    MONGO_URI=your_mongo_uri
    SECRET=your_session_secret

*   `MONGO_URI`: The MongoDB connection string.
*   `SECRET`: A secret key used for session management.

Project Structure
-----------------

Here's an overview of the project structure:

    ├── middleware/           # Middleware files
    │   ├── errorLogger.js    # Logs errors and handles them
    │   └── requireLogin.js   # Middleware to protect routes
    ├── models/               # Mongoose models
    │   ├── Image.js          # Schema for storing image information
    │   └── User.js           # Schema for user authentication
    ├── routes/               # Express routes
    │   ├── index.js          # Main route for uploading images
    │   ├── dashboard.js      # Route for viewing watermarked images
    │   ├── login.js          # Route for login page
    │   └── signup.js         # Route for signup page
    ├── public/               # Static files
    ├── views/                # EJS templates
    │   ├── index.ejs         # Homepage template
    │   ├── dashboard.ejs     # Dashboard template
    │   ├── login.ejs         # Login page template
    │   ├── signup.ejs        # Signup page template
    │   ├── 404.ejs           # 404 error page template
    │   └── 500.ejs           # 500 error page template
    ├── app.js                # Main application file
    ├── .env                  # Environment variables
    ├── package.json          # Project dependencies and scripts
    └── README.md             # Project documentation

Usage
-----

### Authentication

*   **Signup**: Navigate to `/signup` to create a new user account.
*   **Login**: Navigate to `/login` to log in with an existing account.

### Watermarking

*   **Upload Image**: After logging in, use the homepage form to upload an image and apply a watermark logo. You can adjust the watermark's size and opacity.
*   **Dashboard**: View and manage all your watermarked images, and download the final images.

Features
--------

*   User Authentication: Secure user login and registration with hashed passwords.
*   Upload Images: Upload and manage images on your profile.
*   Watermarking: Apply a watermark logo, and adjust its size and opacity in real-time.
*   Error Handling: Custom 404 and 500 error pages.
*   Middleware: Logging, authentication, and watermark application middleware.

Middleware
----------

### `errorLogger.js`

Logs errors into a file for debugging purposes and handles them gracefully.

### `requireLogin.js`

Protects routes by ensuring that only logged-in users can access them.


License
-------

This project is licensed under the MIT License. See the LICENSE file for details.
