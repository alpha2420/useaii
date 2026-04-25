import mongoose, { model, Schema } from "mongoose";

interface IReview {
    rating: number;
    feedback: string;
}

const reviewSchema = new Schema<IReview>({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    feedback: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1500
    }
}, { timestamps: true });

const Review = mongoose.models.Review || model("Review", reviewSchema);
export default Review;
