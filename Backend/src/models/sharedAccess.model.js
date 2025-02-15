import mongoose,{Schema} from "mongoose";

const sharedAccessSchema = new Schema({

    resourceId:{
        type:Schema.Types.ObjectId,
        refPath:"resourceType",
        required:true,
    },
    resourceType: {
        type: String,
        required: true,
        enum: ["File", "Folder"]
    },
    sharedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User" 
    },
    sharedWith: [ // Thanks to chatgpt for telling me this 
        // for my futureSelf this is more storage and performance efficient and easy to update 
        // By using an array for sharedWith, the database structure is cleaner, queries are faster, and updating permissions is easier.
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            accessType: {
                type: String,
                enum: ["view", "edit", "owner"],
                default: "view"
            }
        }
    ]

},{timestamps:true})



export const SharedAccess = mongoose.model("SharedAccess",sharedAccessSchema)