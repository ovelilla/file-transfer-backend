import mongoose from "mongoose";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import JSZip from "jszip";
import fs from "fs";
import Link from "../models/Link.js";
import File from "../models/File.js";

export const updloadFiles = async (req, res, next) => {
    const { user } = req;

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "./uploads");
        },
        filename: (req, file, cb) => {
            const extension = file.originalname.split(".").pop();
            const name = uuidv4() + "." + extension;
            cb(null, name);
        },
    });

    const limits = { fileSize: user ? 1024 * 1024 * 10 : 1024 * 1024 };

    const upload = multer({
        storage,
        limits,
    }).array("files");

    upload(req, res, async (error) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }

        req.files = await Promise.all(
            req.files.map(async (file) => await File.create(Object.assign({}, file)))
        );

        next();
    });
};

export const downloadFiles = async (req, res, next) => {
    const { url } = req.params;

    try {
        const link = await Link.findOne({ url }).populate("files");

        if (!link) {
            return res.status(404).json({ message: "Link not found" });
        }

        if (link.files.length > 1) {
            const zip = new JSZip();

            link.files.forEach((file) => {
                zip.file(file.originalname, fs.readFileSync(file.path));
            });

            const buffer = await zip.generateAsync({ type: "nodebuffer" });
            res.send(buffer);
        } else {
            res.download(link.files[0].path);
        }

        if (link.downloads === 1) {
            await Promise.all([
                File.deleteMany({ _id: { $in: link.files } }),
                Link.deleteOne({ _id: link._id }),
            ]);

            req.link = link;

            next();
        } else {
            link.downloads--;
            await link.save();
        }
    } catch (error) {
        console.log(error);
    }
};

export const deleteFiles = async (req, res) => {
    const { link } = req;

    try {
        link.files.forEach((file) => {
            fs.unlinkSync(file.path);
        });
    } catch (error) {
        console.log(error);
    }
};
