import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {verifyJWT} from "../middleware/auth.middleware.js"
import  {
    share,
    updateAccess,
    removeAccess,
    userWithFolderAccess,
    listWithAccessToUser
} from "../controller/sharedAccess.controller.js"

const router = Router()

router.use(upload.none(),verifyJWT)

router.post("/share", share);

router.patch("/:sharedId/update", updateAccess);

router.delete("/:sharedId/remove", removeAccess);

router.get("/:resourceId/users", userWithFolderAccess);

router.get("/user-resources", listWithAccessToUser);

export default router