import mongoose,{Schema} from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new Schema({

    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:[true,"Email is required"],
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    refreshToken:{
        type:String
    }


},{timestamps:true})


userSchema.pre("save",async function(next){
    if (!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}


export  const User = mongoose.model("User",userSchema)