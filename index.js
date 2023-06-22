import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import usersRoutes from "./routes/usersRoutes.js";
import linksRoutes from "./routes/linksRoutes.js";
import filesRoutes from "./routes/filesRoutes.js";

const app = express();
app.use(cookieParser());
app.use(express.json());

dotenv.config();

await connectDB();

const whiteList = [process.env.FRONTEND_URL];

const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        if (whiteList.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

app.use(cors(corsOptions));

app.use("/api/users", usersRoutes);
app.use("/api/links", linksRoutes);
app.use("/api/files", filesRoutes);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
