import jwt from "jsonwebtoken";
import User from "../models/User.js";

const checkAuthSoft = async (req, res, next) => {
    // const token = req.cookies.access_token;
    const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmQ3Yjc3OGFlMzczOGU1ODBhNjhkNCIsImlhdCI6MTY4MDcwMzQxMCwiZXhwIjoxNjgzMjk1NDEwfQ.8yL9bkdaTtYZYV2d71DqJoiHSZv6rKlLUtyrTU-yRCc";

    if (!token) {
        return next();
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;

        req.user = await User.findById(userId).select("__id name email");

        return next();
    } catch (error) {
        return next();
    }
};

export default checkAuthSoft;
