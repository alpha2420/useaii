import mongoose, { model, Schema } from "mongoose";
 
export type UserRole = "owner" | "admin" | "agent" | "viewer";
 
interface IUser {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    // For sub-users: which owner's account they belong to
    parentOwnerId: string | null;
}
 
const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        name: { type: String, required: true, trim: true },
        role: {
            type: String,
            enum: ["owner", "admin", "agent", "viewer"],
            default: "owner",
        },
        // null = top-level owner account. Set to ownerId for sub-users.
        parentOwnerId: { type: String, default: null },
        credits: { type: Number, default: 100000 }, // Tokens or Credits (e.g., 100k free start)
        isSuperAdmin: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);
 
const User = mongoose.models.User || model("User", userSchema);
export default User;
