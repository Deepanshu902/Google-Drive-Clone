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
    },
    // Thanks chatgpt for improving the model
    totalSize: { // ✅ NEW: Track folder size
        type: Number,
        default: 0
    },
    isShared: { // ✅ NEW: Track if folder is shared
        type: Boolean,
        default: false
    },
    sharedWith: [{ // ✅ NEW: Store users with access
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
    
},{timestamps:true})



export const Folder = mongoose.model("Folder",folderSchema)