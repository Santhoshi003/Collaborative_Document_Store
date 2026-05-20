const Document = require("../models/documentModel");

const slugify = require("slugify");



// CREATE DOCUMENT

exports.createDocument = async (req, res) => {

    try {

        const {
            title,
            content,
            tags,
            authorName,
            authorEmail
        } = req.body;

        const slug = slugify(title, { lower: true });

        const doc = await Document.create({

            slug,

            title,

            content,

            tags,

            metadata: {

                author: {

                    id: null,

                    name: authorName,

                    email: authorEmail
                },

                wordCount: content.split(" ").length
            }
        });

        res.status(201).json(doc);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};



// GET DOCUMENT WITH LAZY MIGRATION

exports.getDocument = async (req, res) => {

    try {

        const doc = await Document.findOne({
            slug: req.params.slug
        });

        if (!doc) {

            return res.status(404).json({
                message: "Document not found"
            });
        }



        // LAZY MIGRATION

        if (typeof doc.metadata.author === "string") {

            doc.metadata.author = {

                id: null,

                name: doc.metadata.author,

                email: null
            };
        }



        res.status(200).json(doc);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};



// UPDATE DOCUMENT

exports.updateDocument = async (req, res) => {

    try {

        const {
            title,
            content,
            version
        } = req.body;



        const updatedDoc = await Document.findOneAndUpdate(

            {
                slug: req.params.slug,
                version: version
            },

            {

                $set: {

                    title: title,

                    content: content,

                    "metadata.updatedAt": new Date(),

                    "metadata.wordCount": content.split(" ").length
                },

                $inc: {
                    version: 1
                },

                $push: {

                    revision_history: {

                        version: version + 1,

                        updatedAt: new Date(),

                        contentDiff: "Document Updated"
                    }
                }
            },

            {
                new: true
            }
        );



        if (!updatedDoc) {

            const latestDoc = await Document.findOne({
                slug: req.params.slug
            });

            return res.status(409).json({

                message: "Version Conflict",

                latestDocument: latestDoc
            });
        }



        res.status(200).json(updatedDoc);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};



// DELETE DOCUMENT

exports.deleteDocument = async (req, res) => {

    try {

        const deletedDoc = await Document.findOneAndDelete({
            slug: req.params.slug
        });

        if (!deletedDoc) {

            return res.status(404).json({
                message: "Document not found"
            });
        }

        res.status(200).json({
            message: "Document deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};



// SEARCH DOCUMENTS

exports.searchDocuments = async (req, res) => {

    try {

        const q = req.query.q;

        const tags = req.query.tags;



        let query = {

            $text: {
                $search: q
            }
        };



        if (tags) {

            query.tags = {

                $all: tags.split(",")
            };
        }



        const results = await Document.find(

            query,

            {
                score: {
                    $meta: "textScore"
                }
            }
        )

        .sort({
            score: {
                $meta: "textScore"
            }
        });



        res.status(200).json(results);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};



// MOST EDITED DOCUMENTS

exports.getMostEditedDocuments = async (req, res) => {

    try {

        const results = await Document.aggregate([

            {

                $project: {

                    title: 1,

                    slug: 1,

                    editCount: {

                        $size: "$revision_history"
                    }
                }
            },

            {

                $sort: {

                    editCount: -1
                }
            },

            {

                $limit: 10
            }
        ]);



        res.status(200).json(results);

    } catch (error) {

        res.status(500).json({

            message: error.message
        });
    }
};



// TAG CO-OCCURRENCE

exports.getTagCooccurrence = async (req, res) => {

    try {

        const documents = await Document.find();

        let tagPairs = {};



        documents.forEach(doc => {

            const tags = doc.tags;



            for (let i = 0; i < tags.length; i++) {

                for (let j = i + 1; j < tags.length; j++) {

                    const pair = [tags[i], tags[j]].sort().join(",");

                    tagPairs[pair] = (tagPairs[pair] || 0) + 1;
                }
            }
        });



        const results = Object.entries(tagPairs).map(([pair, count]) => ({

            tags: pair.split(","),

            count
        }));



        results.sort((a, b) => b.count - a.count);



        res.status(200).json(results);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};