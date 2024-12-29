# Voosh Music Library Management API
### Voosh Music Library Management API is a RESTful API designed to manage a music streaming service, providing functionalities to handle artists, albums, tracks, and user favorites.

## Features
- **Artists:** create, retrieve, update, and delete artist information.
- **Albums:** Manage album details, including retrieval by artist and visibility status.
- **Tracks:** Handle track information associated with albums and artists.
- **Favorites:** Allow users to add and remove favorite artists, albums, and tracks.
- **Authentication:** Secure endpoints with JWT-based authentication.

## Installation
1. Clone the repository:
``` bash
git clone https://github.com/RehanShaikh007/Voosh_API.git
```
2. Navigate to the project directory:
``` bash
cd Voosh_API/backend
```
3. Install dependencies:
``` bash
npm install mongoose express bcryptjs jsonwebtoken uuid cookie-parser dotenv
```
4. Set up environment variables:
Create a .env file in the backend directory with the following variables:
``` bash
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
## Usage
1. Start the server:
``` bash
npm start
```
The API will be accessible at http://localhost:4000.

## API Endpoints

### Authentication
- **Register User:** POST /signup
- **Login User:** POST /login
- **Logout User:** GET /logout

## Users
- **Get All Users:** GET /users
- **Add Users:** POST /users/add-user
- **Delete User by ID:** DELETE /users/:id
- **Update User:** PUT /users/update-password

### Artists
- **Create Artist:** POST /artists/add-artist
- **Get All Artists:** GET /artists
- **Get Artist by ID:** GET /artists/:artist_id
- **Update Artist:** PUT /artists/:artist_id
- **Delete Artist:** DELETE /artists/:artist_id

### Albums
- **Create Album:** POST /albums/add-album
- **Get All Albums:** GET /albums
- **Get Album by ID:** GET /albums/:album_id
- **Update Album:** PUT /albums/:album_id
- **Delete Album:** DELETE /albums/:album_id

### Tracks
- **Create Track:** POST /tracks/add-track
- **Get All Tracks:** GET /tracks
- **Get Track by ID:** GET /tracks/:track_id
- **Update Track:** PUT /tracks/:track_id
- **Delete Track:** DELETE /tracks/:track_id
### Favorites
- **Add Favorite:** POST /favorites/add-favorite
- **Get Favorites by Category:** GET /favorites/:category
- **Remove Favorite:** DELETE /favorites/remove-favorite/:favorite_id

## Error Handling
The API returns standard HTTP status codes along with a consistent error response structure:
``` bash
{
  "status": 400,
  "data": null,
  "message": "Bad Request",
  "error": "Detailed error message"
}
```

## Authentication
Authentication is implemented using JSON Web Tokens (JWT). Protected routes require an Authorization header with the format:
``` bash
Bearer <token>
```
## Middleware
- **verifyToken:** Validates JWT tokens to secure protected routes.
## Models
The application uses Mongoose models for data management:

- **User:** Schema for user authentication and authorization.
- **Artist:** Schema representing artists in the database.
- **Album:** Schema for albums, linked to artists.
- **Track:** Schema for tracks, associated with albums and artists.
- **Favorite:** Schema to manage user favorites across artists, albums, and tracks.
## Contribution
Contributions are welcome! Please fork the repository and submit a pull request.
