import { nanoid } from "nanoid";
import Link from "../models/Link.js";
import argon2 from "argon2";

export const checkPassword = async (req, res, next) => {
    const { url } = req.params;

    try {
        const link = await Link.findOne({ url }).populate("files");

        if (!link) {
            return res.status(404).json({ message: "Link not found" });
        }

        if (link.password) {
            return res.status(200).json({ password: true, link });
        }

        next();
    } catch (error) {
        console.log(error);
    }
};

export const verifyPassword = async (req, res, next) => {
    const { url } = req.params;
    const { password } = req.body;

    const errors = {};

    if (!password) {
        const error = new Error("Password is required");
        errors.password = error.message;
    }
    
    if (Object.keys(errors).length) {
        return res.status(400).json({ errors });
    }

    try {
        const link = await Link.findOne({ url });

        if (!link) {
            res.status(404).json({ message: "Link not found" });
            return;
        }

        if (!(await argon2.verify(link.password, password))) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        next();
    } catch (error) {
        console.log(error);
    }
};

export const readLink = async (req, res) => {
    const { url } = req.params;

    try {
        const link = await Link.findOne({ url }).populate("files");

        if (!link) {
            res.status(404).json({ message: "Link not found" });
            return;
        }

        res.status(200).json({ password: false, link });
    } catch (error) {
        console.log(error);
    }
};

export const createLink = async (req, res) => {
    const { user, files } = req;
    const { title, description, downloads, password } = JSON.parse(req.body.data);

    const link = new Link({
        title,
        description,
        files: files.map((file) => file._id),
        url: nanoid(10),
    });

    if (downloads) {
        link.downloads = downloads;
    }

    if (user) {
        link.user = user._id;
    }

    if (password && password.length > 0) {
        link.password = password;
    }

    try {
        const savedLink = await link.save();
        const populatedLink = await savedLink.populate("files");

        res.status(200).json({
            message: "Link created successfully",
            link: populatedLink,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateLink = async (req, res) => {};

export const deleteLink = async (req, res) => {};
