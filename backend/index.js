import express from 'express';
import mongoose from "mongoose";
import multer from 'multer';
import dotenv from 'dotenv';
import cors from 'cors';
import {registerValidation, loginValidation, articleCreateValidation} from './validations.js';
import checkAuth from './utils/checkAuth.js';
import {login, aboutMe, register} from "./controllers/UserController.js";
import {
    createArticle,
    deleteOneArticle,
    getAllArticles,
    getOneArticle,
    updateArticle,
    getLastTags,
    getPostsWithTag
} from "./controllers/ArticleController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

dotenv.config();

const PORT = 4444;
const DB_URI = process.env.DB_URI;

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));


mongoose
    .connect(DB_URI)
    .then(() => {
            console.log('Connected to DB')
            app.listen(PORT, (err) => {
                if (err) {
                    console.log('Error: ', err);
                }
                console.log('Server is running on port ' + PORT);
            });
        }
    )
    .catch((err) => console.log('Error: ', err));

const storage = multer.diskStorage({
    destination: (_, __, callback) => {
        callback(null, 'uploads');
    },
    filename: (_, file, callback) => {
        callback(null, file.originalname);
    }
});

const upload = multer({storage})


app.post('/auth/login', loginValidation, handleValidationErrors, login);
app.post('/auth/register', registerValidation, handleValidationErrors, register);
app.get('/auth/me', checkAuth, aboutMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/articles', getAllArticles);

app.get('/tags', getLastTags);
app.get('/tags/:tag', getPostsWithTag);
app.get('/articles/tags', getLastTags);

app.get('/articles/:id', getOneArticle);
app.post('/articles', checkAuth, articleCreateValidation, createArticle);
app.patch('/articles/:id', checkAuth, articleCreateValidation, handleValidationErrors, updateArticle);
app.delete('/articles/:id', checkAuth, deleteOneArticle);