import {uploadOnCloudinary,deleteCloudinaryFile} from "../utils/cloudinary.js"
import File from "../models/file.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"


const uploadFile = asyncHandler(async(req,res)=>{
    const file = req.file

    if(!file){
            throw new ApiError(401,"Upload file")
    }

    const response = await uploadOnCloudinary(file.path)

    const newFile = await File.create({
            filename: req.file.filename,
            fileUrl: response.secure_url,
            userId: req.user._id,
         })

    if(!newFile){
        throw new ApiError(500,"Error while uploading file ")
    }

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

    const deleteResponse = await deleteCloudinaryFile(file.fileUrl)

    if(!deleteResponse){
        throw new ApiError(404,"Error while deleting ")
    }

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
