import mongoose, { model, Schema } from "mongoose";

interface IUser {
    email: string;
    password: string;
    name: string;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

const User = mongoose.models.User || model("User", userSchema);
export default User;
