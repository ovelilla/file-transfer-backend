import mongoose from "mongoose";

const fileSchema = mongoose.Schema(
    {
        fieldname: {
            type: String,
            required: true,
            trim: true,
        },
        originalname: {
            type: String,
            required: true,
            trim: true,
        },
        encoding: {
            type: String,
            required: true,
            trim: true,
        },
        mimetype: {
            type: String,
            required: true,
            trim: true,
        },
        destination: {
            type: String,
            required: true,
            trim: true,
        },
        filename: {
            type: String,
            required: true,
            trim: true,
        },
        path: {
            type: String,
            required: true,
            trim: true,
        },
        size: {
            type: Number,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const File = mongoose.model("File", fileSchema);

export default File;
