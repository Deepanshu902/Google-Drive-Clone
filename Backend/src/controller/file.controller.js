import {uploadOnCloudinary,deleteCloudinaryFile} from "../utils/cloudinary.js"
import {File} from "../models/file.model.js"
import {User} from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"


const uploadFile = asyncHandler(async(req,res)=>{
    const file = req.file
 
    if(!file){
         throw new ApiError(401,"Upload file")
    }

    const user = await User.findById(req.user._id)
    if (!user){
         throw new ApiError(404, "User not found")
    }

    if (user.usedStorage + file.size > user.totalStorage) {
        throw new ApiError(403, "Storage limit exceeded")
    }

    const fileExtension = file.mimetype.split("/")[1]; // Extract file extension
    const generatedFilename = `file_${Date.now()}.${fileExtension}`; // Generate a fallback filename

    const response = await uploadOnCloudinary(file.buffer)

    const newFile = await File.create({
            filename: file.originalname || generatedFilename,
            fileUrl: response.secure_url,
            cloudinaryPublicId: response.public_id,
            contentType:req.file.mimetype,
            size:file.size,
            userId: req.user._id,
         })

    if(!newFile){
        throw new ApiError(500,"Error while uploading file ")
    }

    user.usedStorage += file.size;
    await user.save();

    return res.status(200)
    .json( new ApiResponse(200,newFile,"File uploaded success"))
    
})

const getFiles = asyncHandler(async (req, res) => {
    const files = await File.find({ userId: req.user._id });

    if (files.length === 0) {
        return res.status(404).json({ message: "No files found" });
    }
    return res.status(200)
    .json(new ApiResponse(200, files, "Files fetched successfully"));

    });

const deleteFile = asyncHandler(async(req,res)=>{
    const file = await File.findById(req.params.fileId)

    if (!file) {
        throw new ApiError(404, "File not found");
    }

    const user = await User.findById(file.userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const deleteResponse = await deleteCloudinaryFile(file.cloudinaryPublicId)

    if(!deleteResponse){
        throw new ApiError(404,"Error while deleting ")
    }

    user.usedStorage -= file.size;
    if (user.usedStorage < 0){
         user.usedStorage = 0
    }
    await user.save();

    await File.findByIdAndDelete(req.params.fileId);

    return res.status(200).json(
        new ApiResponse(200, {}, "File deleted successfully")
    );
})


export {
    uploadFile,
    getFiles,
    deleteFile
}
