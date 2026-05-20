require("dotenv").config();

const mongoose = require("mongoose");

const Document = require("../src/models/documentModel");



const seedDatabase = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");



        // CHECK EXISTING DATA

        const count = await Document.countDocuments();



        if (count > 0) {

            console.log("Database already seeded");

            process.exit();
        }



        let documents = [];



        for (let i = 1; i <= 1000; i++) {

            documents.push({

                slug: `document-${i}`,

                title: `Document ${i}`,

                content: `This is sample content for document ${i}`,

                version: 1,

                tags: ["sample", "mongodb"],

                metadata: {

                    author: {

                        id: null,

                        name: `Author ${i}`,

                        email: `author${i}@gmail.com`
                    },

                    createdAt: new Date(),

                    updatedAt: new Date(),

                    wordCount: 7
                },

                revision_history: []
            });
        }



        await Document.insertMany(documents);



        console.log("1000 Documents Seeded Successfully");



        process.exit();

    } catch (error) {

        console.log(error);

        process.exit(1);
    }
};



seedDatabase();