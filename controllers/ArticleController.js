import Article from '../models/Article.js';

export const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find({}).populate({'path': 'user', 'select': ['fullName', 'avatarUrl']}).exec();
        res.status(200).json(articles);
    } catch (err) {
        res.status(500).json({message: "Cannot get articles"});
    }
}

export const getOneArticle = async (req, res) => {
    try {
        console.log(req.body.id)
        const entry = await Article.findOneAndUpdate(
            {'_id': req.params.id},
            {$inc: {viewsCount: 1}},
            {returnDocument: "after"}
        );

        if (!entry) {
            return res.status(404).json({message: "Article is not found"});
        }

        res.status(200).json(entry);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Problem occurred when retrieving Article'});
    }
}


export const createArticle = async (req, res) => {
    try {
        const entry = new Article({
            title: req.body.title,
            content: req.body.content,
            tags: req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag), // Trim and filter tags
            imageUrl: req.body.imageUrl,
            user: req.userId,
        });

        const article = await entry.save();

        res.status(201).json(article);
    } catch (err) {
        res.status(500).json({message: err});

    }
}

export const deleteOneArticle = async (req, res) => {
    try {
        const entry = Article.findOne({'_id': req.params.id});
        if (!entry) {
            return res.status(404).json({message: "Cannot delete article. Article is not found"});
        }
        await Article.findOneAndDelete({'_id': req.params.id});
        res.status(200).json({"message": "Article has been deleted"});


    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Cannot delete article"});
    }
}

export const updateArticle = async (req, res) => {
    try {
        const entry = await Article.findOneAndUpdate(
            { '_id': req.params.id },
            { $set: req.body }, // Use $set to specify the fields to update
            { new: true } // Return the updated document
        );
        if (!entry) {
            return res.status(404).json({ message: "Cannot update article. Article is not found" });
        }
        res.status(200).json({ message: "Article has been updated", updatedArticle: entry });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Cannot update article" });
    }
}


export const getLastTags = async (req,res) => {
    try {
        const articles = await Article.find().limit(5).exec();
        const tags = articles.map(post => post.tags).flat().slice(0,5);

        res.status(200).json(tags);
    } catch (err) {
        res.status(500).json({message: "Cannot get last tags"});
    }
}