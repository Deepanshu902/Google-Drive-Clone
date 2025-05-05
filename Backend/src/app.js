import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { rateLimit } from 'express-rate-limit'


const app = express()

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	limit: 20, // Limit each IP is 20
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
	
})

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
})) 

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"))

app.use(cookieParser())

app.use(limiter)


// all the routes importing
import userRouter from "./routes/user.routes.js"
import folderRouter from "./routes/folder.routes.js"
import SharedAccessRouter from "./routes/sharedAccess.routes.js"
import fileRouter from "./routes/file.router.js"

// routes declaration 
app.use("/api/v1/users", userRouter)
app.use("/api/v1/folder",folderRouter)
app.use("/api/v1/shared",SharedAccessRouter)
app.use("/api/v1/file",fileRouter)

app.get("/healthz", (req, res) => {
    res.status(200).json({ status: "OK" });
  });

export {app}  