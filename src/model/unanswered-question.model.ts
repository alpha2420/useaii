import mongoose, { model, Schema } from "mongoose";

interface IUnansweredQuestion {
    ownerId: string;
    question: string;
    source: "widget" | "whatsapp";
    status: "unanswered" | "answered";
    answer?: string;
}

const unansweredQuestionSchema = new Schema<IUnansweredQuestion>({
    ownerId: {
        type: String,
        required: true,
        index: true
    },
    question: {
        type: String,
        required: true
    },
    source: {
        type: String,
        enum: ["widget", "whatsapp"],
        default: "widget"
    },
    status: {
        type: String,
        enum: ["unanswered", "answered"],
        default: "unanswered"
    },
    answer: {
        type: String
    }
}, { timestamps: true });

const UnansweredQuestion = mongoose.models.UnansweredQuestion || model("UnansweredQuestion", unansweredQuestionSchema);
export default UnansweredQuestion;
