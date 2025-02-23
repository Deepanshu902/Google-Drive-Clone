import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Folder} from "../models/folder.model.js"

// Imp todo Learn about Error code as i am only using code 200,401 and 500 

const createFolder = asyncHandler(async(req,res)=>{
    const {folderName,parentFolderId} = req.body
    if(!folderName){
        throw new ApiError(401,"Provide folder name")
    }

    let parentFolder = nul

    if(parentFolderId){
        parentFolder = await Folder.findById(parentFolderId)

        if(!parentFolder){
            throw new ApiError(401,"Parent folder not found")
        }
    }

    const existedFolder = await Folder.findOne({
        folderName,
        parentFolderId: parentFolderId || null,
        userId:req.user._id
    })

    if(existedFolder){
        throw new ApiError(401,"Folder with same name exist already")
    }

    const newFolder = await Folder.create({
        folderName,
        parentFolderId: parentFolderId || null,
        userId:req.user._id
    })

    if(!newFolder){
        throw new ApiError(500,"Error while creating folder")
    }

    return res.status(200)
    .json(new ApiResponse(200,newFolder,"Folder created successfully"))
})

const renameFolder = asyncHandler(async(req,res)=>{
    const {newName} = req.body
    const {folderId} = req.params

    if(!newName){
        throw new ApiError(401,"Provide new folder name")
    }

    const folder = await Folder.findById(folderId)

    if(!folder){
        throw new ApiError(500,"No folder found ")
    }

    if(folder.userId !== req.user._id ){
        throw new ApiError(401,"You cannot rename folder")
    }

    // remember to add check for duplicate folder name 
    // todo

    folder.name = newName
    await folder.save()

    return res.status(200)
    .json(new ApiResponse(200,folder,"Name changed Successfully"))
})

const deleteFolder = asyncHandler(async(req,res)=>{
    const {folderId} = req.params

    const folder = await Folder.findById(folderId)

    if(!folder){
        throw new ApiError(401,"Folder dont exist ")
    }

    if(folder.userId !== req.user._id){
        throw new ApiError(401,"You cannot delete folder")
    }

    folder.isDeleted = true
    await folder.save()

    return res.status(200)
    .json(new ApiResponse(200,{},"Folder deleted Successfully"))
    
})

const allFolder = asyncHandler(async(req,res)=>{
    const folders = await Folder.find({
        userId: req.user._id,
        isDeleted: false 
    })

    return res.status(200)
    .json(new ApiResponse(200, folders, "Folders fetched successfully"))
})

// todo 
// currently cannot make or understand it logic will try later
const moveFolder = asyncHandler(async(req,res)=>{

})

export {
    createFolder,
    renameFolder,
    deleteFolder,
    allFolder,
    // moveFolder
}