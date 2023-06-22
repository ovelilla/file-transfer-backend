import mongoose from "mongoose";
import argon2 from "argon2";

const linkSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        files: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "File",
            },
        ],
        url: {
            type: String,
            required: true,
            trim: true,
        },
        downloads: {
            type: Number,
            default: 1,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        password: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

linkSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }

        this.password = await argon2.hash(this.password);
    } catch (error) {
        return next(error);
    }
});

const Link = mongoose.model("Link", linkSchema);

export default Link;
