import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: { type: String, reqired: true },
    name: { type: String, reqired: true },
    email: { type: String, reqired: true, unique: true },
    resume: { type: String },
    image: { type: String, required: true }
})

const User = mongoose.model('User', userSchema)

export default User;