import {body} from 'express-validator';

export const registerValidation = [
    body('email', 'Wrong email format').isEmail(),
    body('password', 'Password must contain at least 6 characters').isLength({min: 6}),
    body('fullName', 'Enter a valid name').isLength({min: 1}),
    body('avatarUrl', 'Wrong avatar URL').optional().isURL(),
];

export const loginValidation = [
    body('email', 'Wrong email format').isEmail(),
    body('password', 'Password must contain at least 6 characters').isLength({min: 6}),
];

export const articleCreateValidation = [
    body('title', 'Title must contain at least 1 character').isLength({min: 1}),
    body('content', 'Content must contain at least 1 character').isLength({min: 1}),
    body('tags', 'Wrong tag format, input an array').optional().isArray(),
    body('imageUrl', 'Wrong image URL').optional(),
];