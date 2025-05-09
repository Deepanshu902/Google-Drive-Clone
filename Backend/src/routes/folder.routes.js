import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import  {
    createFolder,
    renameFolder,
    deleteFolder,
    allFolder,
} from "../controller/folder.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = Router()

router.use(upload.none(),verifyJWT)

router.post("/createFolder",createFolder)

router.patch("/:folderId/rename",renameFolder)

router.delete("/:folderId",deleteFolder)

router.get("/list",allFolder)

export default router