import mongoose,{Schema} from "mongoose"

const fileSchema = new mongoose.Schema({
    userId:{
     type:Schema.Types.ObjectId,
     ref:"User",
     required:true
    },
    filename:{
        type:String,
        required:true,
        trim:true
    },
    fileUrl:{
        type:String,
        required:true
    },
    cloudinaryPublicId: { // for deleting the file from cloudinary 
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    size:{
        type:Number,
        required:true
    },
    folderId:{
        type:Schema.Types.ObjectId,
        ref:"Folder"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},{timestamps:true})


export const File = mongoose.model("File",fileSchema)