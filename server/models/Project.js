import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        color: { type: String, default: "#6366f1" }, // Default indigo
        description: String,
    },
    { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
