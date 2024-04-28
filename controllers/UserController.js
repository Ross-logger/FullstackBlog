import {validationResult} from "express-validator";
import bcrfypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrfypt.genSaltSync(10);
        const hash = await bcrfypt.hash(password, salt);

        const entry = new User({
            email: req.body.email,
            passwordHash: hash,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
        });

        const user = await entry.save();


        const token = jwt.sign({_id: user._id}, 'secret111', {expiresIn: '30d'});

        const {passwordHash, ...userWithoutHash} = user._doc;
        res.status(200).json({userWithoutHash, token});
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Cannot register"});
    }
}

const login = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if (!user) {
            return res.status(400).json({message: "User not found"});
        }

        const isValidPassword = await bcrfypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPassword) {
            return res.status(400).json({message: "Wrong login or password"});
        }

        const token = jwt.sign({_id: user._id}, 'secret111', {expiresIn: '30d'});

        const {passwordHash, ...userWithoutHash} = user._doc;
        res.status(200).json({userWithoutHash, token});

    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Cannot login"});
    }
}

const aboutMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send({"message": "User not found"});
        }
        const {passwordHash, ...userWithoutHash} = user._doc;
        res.status(200).json(userWithoutHash);
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Cannot get user"});
    }
}

export {register, login, aboutMe};