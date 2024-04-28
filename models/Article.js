import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
    },
    imageUrl: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    viewCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true
});

const Article = mongoose.model('Article', ArticleSchema);

export default Article;