import jwt from "jsonwebtoken";

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer /, '')
    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret111');
            req.userId = decoded._id;
        } catch {
            return res.status(403).send({"message": "Not Allowed"});
        }
    } else {
        return res.status(403).send({"message": "Not Allowed"});
    }
    next()
};