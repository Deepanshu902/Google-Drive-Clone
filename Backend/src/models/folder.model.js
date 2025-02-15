import mongoose,{Schema} from "mongoose";


const folderSchema = new Schema({

    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
       },
    folderName:{
        type:String,
        required:true,
        trim:true
    },
    parentFolderId:{
        type:Schema.Types.ObjectId,
        ref:"Folder",
        default:null
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},{timestamps:true})



export const Folder = mongoose.model("Folder",folderSchema)