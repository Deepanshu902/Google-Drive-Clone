import { Router } from "express"
import {verifyJWT} from "../middleware/auth.middleware.js"
import {
    registerUser,
    loginUser,
    logoutUser,
    updateAccountDetails,
    getCurrentUser,
    changeCurrentPassword,
    getUserStorage,
    searchUserByEmail
        } from "../controller/user.controller.js"
import {upload} from "../middleware/multer.middleware.js"

const router = Router()

router.use(upload.none());

router.post("/register",registerUser)

router.post("/login",loginUser)

router.post("/logout",verifyJWT,logoutUser)

router.patch("/update-account-details",verifyJWT,updateAccountDetails)

router.get("/current-user",verifyJWT,getCurrentUser)

router.post("/change-password",verifyJWT,changeCurrentPassword)

router.get("/storage",verifyJWT,getUserStorage)

router.get("/search",verifyJWT,searchUserByEmail) 

export default router