import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {verifyJWT} from "../middleware/auth.middleware.js"
import {
    uploadFile,
    getFiles,
    deleteFile,
    moveFile
} from "../controller/file.controller.js"

const router = Router()

router.use(verifyJWT)

router.post("/upload", upload.single("file"), uploadFile);

router.get("/", getFiles);

router.delete("/:fileId", deleteFile);

router.patch("/:fileId/move", upload.none(), moveFile);

export default router