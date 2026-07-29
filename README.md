# 🏡 HopNest – Airbnb Clone

HopNest is a full-stack Airbnb-inspired web application that allows users to discover, list, and book unique stays. It provides a modern and responsive experience for both guests and hosts while implementing core Airbnb functionalities.

## ✨ Features

- 🔐 User Authentication & Authorization
- 🏠 Create, Edit, and Delete Property Listings
- 📸 Upload Property Images
- 🔍 Browse and Search Listings
- 💬 Flash Messages & Form Validation
- 📍 Interactive Location Maps
- ⭐ Property Details Page
- 👤 User Profile & Listing Management
- 📱 Fully Responsive Design

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- Bootstrap
- JavaScript
- EJS (Embedded JavaScript Templates)

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- Passport.js
- Express Session

### Cloud & APIs
- Cloudinary (Image Storage)
- Map API (Location Services)

## 📂 Project Structure

```
HopNest/
├── controllers/
├── models/
├── routes/
├── views/
├── public/
├── middleware/
├── utils/
├── app.js
└── package.json
```

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/kashukhan-786/hopnest.git
cd hopnest
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the project root and add:

```env
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAP_API_KEY=your_map_api_key
```

### Run the Application

```bash
npm start
```

or

```bash
nodemon app.js
```

The application will run at:

```
http://localhost:8080
```

## 📸 Screenshots

Add screenshots here.

Example:

```
screenshots/
├── home.png
├── listing.png
├── login.png
```

## 🎯 Future Improvements

- ❤️ Wishlist Feature
- 💳 Payment Integration
- 📅 Booking Calendar
- 🔔 Notifications
- ⭐ Reviews & Ratings
- 🔍 Advanced Filters

## 👩‍💻 Author

**Kashish Khan**

- GitHub: https://github.com/kashukhan-786
