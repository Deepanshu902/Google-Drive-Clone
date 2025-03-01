# Google Drive Clone Backend

This is the backend API for a Google Drive clone, allowing users to authenticate, upload files, create folders, and share resources.

## 🚀 Live API Documentation
View API documentation here: [Postman Documentation](https://documenter.getpostman.com/view/40572133/2sAYdhKqBc)

## 🛠 Technologies Used
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer (for file uploads)
- Cloudinary (for cloud storage)
- Render (for deployment)

## 📌 Features
- **User Authentication:** Secure registration and login with JWT.
- **File Management:** Upload, list, and delete files.
- **Folder Management:** Create, rename, and delete folders.
- **Sharing:** Share files/folders with other users.

## 📑 API Endpoints
### 🔹 User Routes
- **POST** `/users/register` - Register a new user.
- **POST** `/users/login` - Authenticate user and return a JWT.
- **GET** `/users/current-user` - Get details of the logged-in user.
- **POST** `/users/change-password` - Update user password.
- **PATCH** `/users/update-account-details` - Modify user details.

### 🔹 File Routes
- **POST** `/file/upload` - Upload a file to Cloudinary.
- **GET** `/file/` - Retrieve user’s stored files.
- **DELETE** `/file/{fileId}` - Delete a file.

### 🔹 Folder Routes
- **POST** `/folder/createFolder` - Create a new folder.
- **GET** `/folder/list` - List all folders.
- **PATCH** `/folder/{folderId}/rename` - Rename a folder.
- **DELETE** `/folder/{folderId}` - Delete a folder.

### 🔹 Shared Access Routes
- **POST** `/shared/share` - Share a file/folder with another user.
- **GET** `/shared/user-resources` - Get files/folders shared with the user.

