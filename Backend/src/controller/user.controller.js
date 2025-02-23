import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"



const  generateAccessAndRefreshTokens = async(userId)=>{
    try{
       const user = await User.findById(userId)
     const accessToken =  user.generateAccessToken()
      const refreshToken=  user.generateRefreshToken()
 
       user.refreshToken = refreshToken // save value to db 
       await  user.save({ validateBeforeSave : false })  // save the updated user
       // dont do any validation just save the user
 
       return {refreshToken,accessToken}
 
    }
    catch(error){
       throw new ApiError(501,"Something went wrong while generating refresh and access token ")
    }
 }

const options = {
    httpOnly:true,  
    secure:true
 }


const registerUser = asyncHandler(async(req,res)=>{
   const {name,email,password} = req.body

   if(!name || !email || !password){
      throw new ApiError(401,"All the fields are required for registering the user")
   }

   const existedUser = await User.findOne({email})

   if(existedUser){
      throw new ApiError(409,"Already Exist")
   }

   const user = await User.create({
      name,
      email,
      password
   })

   if(!user){
      throw new ApiError(500,"Server error while creating user")
   }

   const createdUser = await User.findById(user._id).select("-password -refreshToken")

   if(!createdUser){
      throw new ApiError(500,"Something went wrong ")
   }

   return res.status(201)
   .json(new ApiResponse(200,createdUser,"User Registered") 
   )
})

const loginUser = asyncHandler(async(req,res)=>{
   const {email,password} = req.body

   if(!email || !password){
      throw new ApiError(401,"Email and Password is required")
   }

   const user = await User.findOne({email})

   if(!user){
      throw new ApiError(500,"No user exist")
   }

   const correctPassword = await user.isPasswordCorrect(password)

   if(!correctPassword){
      throw new ApiError(401,"Password is not correct")
   }

   const {refreshToken,accessToken}= await generateAccessAndRefreshTokens(user._id)

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

   return res.status(200)
   .cookie("refreshToken",refreshToken,options)
   .cookie("accessToken",accessToken,options)
   .json(
      new ApiResponse(200,loggedInUser,"User Logged in successfully")
   )
})


const logoutUser = asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(req.user._id,
      {
         $set:{
            refreshToken: undefined
         }
         },
         {
            new: true
         }
      )

   return res.status(200)
   .clearCookie("refreshToken",options)
   .clearCookie("accessToken",options)
   .json(new ApiResponse(200,{},"User Logged out Successfully"))
})


const updateAccountDetails = asyncHandler(async(req,res)=>{
   const {name,email} = req.body
   
   if(!name && !email){
      throw new ApiError(401,"One feild is required")
   }

   const user = await User.findOneAndUpdate( // error here thx to chatgpt my mistake below 
      { _id: req.user._id },// findOneAndUpdate() does not support both inclusion and exclusion in projections.
      { $set: req.body },
      { new: true }
  ).select("-password"); // ✅ This correctly excludes password
  

   if(!user){
      throw new ApiError(500,"Error while Updating")
   }

   return res.status(200)
   .json(new ApiResponse(200,user,"Details updated Successfully"))
})


const getCurrentUser = asyncHandler(async(req,res)=>{
   return res.status(200)
   .json(new ApiResponse(200,req.user,"CurrentUser Fetch successfully"))
 })


const changeCurrentPassword = asyncHandler(async(req,res)=>{
   const {oldpassword,newpassword} = req.body

   if(!oldpassword || !newpassword){
      throw new ApiError(401,"Old and new password is required")
   }

   const user = await User.findById(req.user._id)
   const correctPassword = await user.isPasswordCorrect(oldpassword)

   if(!correctPassword){
      throw new ApiError(401,"Old password is incorrect")
   }

   user.password = newpassword
   await user.save({validateBeforeSave:false})

   return res.status(200)
   .json(new ApiResponse(200,{},"Password changed Successfully"))
})


const getUserStorage = asyncHandler(async (req, res) => {
   const user = await User.findById(req.user._id).select("totalStorage usedStorage");
   if (!user){
      throw new ApiError(404, "User not found")
   }

   return res.status(200)
   .json(new ApiResponse(200, user, "Storage details fetched successfully"));
});


export {
   registerUser,
   loginUser,
   logoutUser,
   updateAccountDetails,
   getCurrentUser,
   changeCurrentPassword,
   getUserStorage
}