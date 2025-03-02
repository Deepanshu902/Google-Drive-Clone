import multer from "multer";

// Define Storage
const storage = multer.memoryStorage();

export const upload = multer({ storage });
