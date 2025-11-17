# Online Job Fair Registration - ArtmaybeDEV

This repository contains the source code for the "Online Job Fair Registration" project. It features a complete backend system built with Node.js (Express) and a frontend starter using React + Vite, developed by **ArtmaybeDEV**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [✨ Features](#-features)
- [🛠️ Built With](#️-built-with)
- [📂 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [🔑 Environment Variables](#-environment-variables)
- [🌐 API Endpoint Documentation](#-api-endpoint-documentation)

---

## 📖 About The Project

This project is a backend-focused Web API designed to handle the registration and interview booking process for an online job fair. The system provides RESTful endpoints for user management, company information, and booking operations.

In addition to the core requirements, this project includes advanced features such as searching for companies by geographical distance and allowing users to manage a list of their favorite companies.

---

## ✨ Features

-   **User Authentication**: Secure user registration and login using JWT (JSON Web Tokens).
-   **Interview Booking**: Users can book, view, edit, and delete up to 3 interview sessions.
-   **Admin Capabilities**: 
    -   Admins can view, edit, and delete all user bookings.
    -   Admins can add, edit, delete company data.
-   **Company Search**:
    -   View a list of participating companies.
    -   **[Extra]** Search for companies within a specific distance (e.g., within 10 km).
-   **User Favorites**:
    -   **[Extra]** Users can add companies to their personal favorites list.
    -   **[Extra]** Users can view and remove companies from their favorites.

---

## 🛠️ Built With

### Backend

-   [Node.js](https://nodejs.org/)
-   [Express.js](https://expressjs.com/)
-   [MongoDB Atlas](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
-   [JSON Web Token (JWT)](https://jwt.io/) for authentication
-   [Bcrypt.js](https://www.npmjs.com/package/bcrypt) for password hashing
-   [Dotenv](https://www.npmjs.com/package/dotenv) for environment variables

### Frontend

-   [React](https://reactjs.org/)
-   [Vite](https://vitejs.dev/)
-   [Axios](https://axios-http.com/) for API requests

---

## 📂 Project Structure

```
ArtmaybeDEV/
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── data/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/ # ส่วนจัดการ Business Logic ที่ซับซ้อน (เช่น คำนวณระยะทาง)
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── 📁 frontend/
    ├── 📁 src/
    │   ├── app/
    │   ├── assets/
    │   ├── components/
    │   ├── features/
    │   ├── lib/
    │   ├── pages/
    │   ├── App.css
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── README.md
    └── vite.config.js
```

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed on your machine:
-   [Node.js](https://nodejs.org/en/download/) (v16 or newer)
-   npm or yarn
-   [Git](https://git-scm.com/downloads)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/ArtmaybeDEV.git](https://github.com/your-username/ArtmaybeDEV.git)
    cd ArtmaybeDEV
    ```

2.  **Setup the Backend:**
    ```sh
    cd Backend
    npm install
    ```
    Create a `.env` file in the `backend` directory and add the necessary environment variables (see below).
    ```sh
    npm run dev
    ```
    The backend server will start on `http://localhost:5003` (or your configured port).

3.  **Setup the Frontend:**
    ```sh
    cd Frontend
    npm install
    ```
    The frontend dev server needs to know the backend API URL. You might need to configure a proxy in `vite.config.js` or set the base URL in your Axios instance.
    ```sh
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173` (or another port if 5173 is busy).

## 🔑 Environment Variables

To run the backend, you need to create a `.env` file in the `/backend` folder and add the following variables.

```
# Port for the server to run on (Mac 5003 / Window 5000)
PORT=5003

# Your MongoDB Atlas connection string
MONGO_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/yourDatabaseName?retryWrites=true&w=majority"

# Secret key for signing JWT tokens
JWT_SECRET="your_super_secret_and_long_key_for_jwt"
```

---

## 🌐 API Endpoint Documentation

Here are the main API endpoints available. (🔒 = Authentication Required)

#### **Authentication (`/api/auth`)**
| Method | Endpoint             | Description                                   |
|:-------|:---------------------|:----------------------------------------------|
| `POST` | `/register`          | Register a new user.                          |
| `POST` | `/login`             | Log in to get an access token.                |

#### **Companies (`/api/companies`)**
| Method | Endpoint             | Description                                   |
|:-------|:---------------------|:----------------------------------------------|
| `GET`  | `/`                  | Get a list of all companies.                  |
| `GET`  | `/:id`               | Get details for a specific company.           |
| `POST` | `/`                  | Create a new company (🔒).                    |
| `PUT`  | `/:id`               | Update a company (🔒).                        |
| `DELETE`| `/:id`              | Delete a company (🔒).                        |
| `GET`  | `/search/dist`       | Search for companies by distance (🔒).        |

#### **User Favorites (🔒) (`/api/users`)**
| Method   | Endpoint                       | Description                                |
|:---------|:-------------------------------|:-------------------------------------------|
| `GET`    | `/me/favorites`                | Get the current user's favorite companies. |
| `GET`    | `/me/favorites/:id`            | Get details for a specific favorite. |
| `POST`   | `/me/favorites`                | Add a company to favorites.                |
| `DELETE` | `/me/favorites/:companyId`     | Remove a company from favorites.           |

#### **Bookings (🔒) (`/api/bookings`)**
| Method   | Endpoint           | Description                                |
|:---------|:-------------------|:-------------------------------------------|
| `GET`    | `/`                | Get all bookings (for admin) or own bookings (for user). |
| `GET`    | `/:id`             | Get details for a specific bookings    |
| `POST`   | `/`                | Create a new interview booking.            |
| `PUT`    | `/:id`             | Update a booking.                          |
| `DELETE` | `/:id`             | Delete a booking.                          |

---
