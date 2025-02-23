import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {SharedAccess} from "../models/sharedAccess.model.js"
import {Folder} from "../models/folder.model.js"
import {File} from "../models/file.model.js"


// to me future self i dont know what i was doing do this again or understand with help of chatgpt
// this file is copy paste from chatgpt as i just dont know how to build this logic of this file
const share = asyncHandler(async(req,res)=>{
    const { resourceId, resourceType, sharedWithUserId, accessType } = req.body

    if (!resourceId || !resourceType || !sharedWithUserId || !accessType) {
        throw new ApiError(400, "All fields are required")
    }

    
    const resource = resourceType === "folder" ? await Folder.findById(resourceId) : await File.findById(resourceId)

    if (!resource) {
        throw new ApiError(404, `${resourceType} not found`)
    }

   
    if (resource.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to share this resource")
    }

   
    let sharedAccess = await SharedAccess.findOne({ resourceId, sharedWithUserId })

    if (sharedAccess) {
        throw new ApiError(400, "User already has access")
    }

    
    sharedAccess = await SharedAccess.create({
        resourceId,
        resourceType,
        sharedBy: req.user._id,
        sharedWith: [{ userId: sharedWithUserId, accessType }]
    })

    return res.status(200)
    .json(new ApiResponse(201, sharedAccess, "Resource shared successfully"))
})

const updateAccess = asyncHandler(async(req,res)=>{
    const { sharedId } = req.params
    const { sharedWithUserId, newAccessType } = req.body

    if (!sharedWithUserId || !newAccessType) {
        throw new ApiError(400, "All fields are required")
    }

    let sharedAccess = await SharedAccess.findById(sharedId)
    if (!sharedAccess) {
        throw new ApiError(400, "Shared access not found")
    }

 
    if (sharedAccess.sharedBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this access")
    }

 
    sharedAccess.sharedWith = sharedAccess.sharedWith.map(user =>
        user.userId.toString() === sharedWithUserId ? { ...user, accessType: newAccessType } : user
    )

    await sharedAccess.save()

    return res.status(200)
    .json(new ApiResponse(200, sharedAccess, "Access updated successfully"))

})

const removeAccess = asyncHandler(async(req,res)=>{
    const { sharedId } = req.params
    const { sharedWithUserId } = req.body

    if (!sharedWithUserId) {
        throw new ApiError(400, "User ID is required")
    }

    let sharedAccess = await SharedAccess.findById(sharedId)
    if (!sharedAccess) {
        throw new ApiError(400, "Shared access not found")
    }

    
    if (sharedAccess.sharedBy.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "You are not authorized to remove access")
    }

    sharedAccess.sharedWith = sharedAccess.sharedWith.filter(user => user.userId.toString() !== sharedWithUserId)

  
    if (sharedAccess.sharedWith.length === 0) {
        await SharedAccess.findByIdAndDelete(sharedId)
        return res.status(200).json(new ApiResponse(200, {}, "Shared access removed successfully"))
    }

    await sharedAccess.save()

    return res.status(200).json(new ApiResponse(200, sharedAccess, "User access removed successfully"))
})

const userWithFolderAccess = asyncHandler(async(req,res)=>{
    const { resourceId } = req.params

    let sharedAccess = await SharedAccess.findOne({ resourceId }).populate("sharedWith.userId", "name email")

    if (!sharedAccess) {
        throw new ApiError(404, "No shared access found for this resource")
    }

    return res.status(200)
    .json(new ApiResponse(200, sharedAccess.sharedWith, "Users with access fetched successfully"))
})

const listWithAccessToUser = asyncHandler(async(req,res)=>{
    let sharedResources = await SharedAccess.find({ "sharedWith.userId": req.user._id })
    .populate("resourceId", "folderName fileName")

    return res.status(200)
    .json(new ApiResponse(200, sharedResources, "Shared resources fetched successfully"))
})

export {
    share,
    updateAccess,
    removeAccess,
    userWithFolderAccess,
    listWithAccessToUser

}