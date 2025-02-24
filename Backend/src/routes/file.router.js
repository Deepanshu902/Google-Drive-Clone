import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {verifyJWT} from "../middleware/auth.middleware.js"
import {
    uploadFile,
    getFiles,
    deleteFile
} from "../controller/file.controller.js"

const router = Router()

router.use(verifyJWT)

router.post("/upload", upload.single("file"), uploadFile);

router.get("/", getFiles);

router.delete("/:fileId", deleteFile);

export default router