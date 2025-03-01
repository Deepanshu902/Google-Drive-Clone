# Google Drive Clone Backend

This is the backend API for a Google Drive clone, allowing users to authenticate, upload files, create folders, and share resources.

## 🚀 Live API Documentation
View API documentation here: [Postman Documentation](https://documenter.getpostman.com/view/40572133/2sAYdhKqBc)
<br />
Render API here: [Render](https://google-drive-clone-0z9o.onrender.com)

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
For checking API health, use `/healthz`, which will return a response "ok"

### 🔹 User Routes
- **POST** `/api/v1/users/register` - Register a new user.
- **POST** `/api/v1/users/login` - Authenticate user and return a JWT.
- **GET** `/api/v1/users/current-user` - Get details of the logged-in user.
- **POST** `/api/v1/users/change-password` - Update user password.
- **PATCH** `/api/v1/users/update-account-details` - Modify user details.

### 🔹 File Routes
- **POST** `/api/v1/file/upload` - Upload a file to Cloudinary.
- **GET** `/api/v1/file/` - Retrieve user’s stored files.
- **DELETE** `/api/v1/file/{fileId}` - Delete a file.

### 🔹 Folder Routes
- **POST** `/api/v1/folder/createFolder` - Create a new folder.
- **GET** `/api/v1/folder/list` - List all folders.
- **PATCH** `/api/v1/folder/{folderId}/rename` - Rename a folder.
- **DELETE** `/api/v1/folder/{folderId}` - Delete a folder.

### 🔹 Shared Access Routes
- **POST** `/api/v1/shared/share` - Share a file/folder with another user.
- **GET** `/api/v1/shared/user-resources` - Get files/folders shared with the user.

