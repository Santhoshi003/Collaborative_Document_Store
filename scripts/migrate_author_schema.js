require("dotenv").config();

const mongoose = require("mongoose");

const Document = require("../src/models/documentModel");



const migrate = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");



        // FIND OLD AUTHOR SCHEMA

        const documents = await Document.find({

            "metadata.author": {

                $type: "string"
            }
        });



        console.log(`Found ${documents.length} old documents`);




        for (const doc of documents) {

            const oldAuthor = doc.metadata.author;



            doc.metadata.author = {

                id: null,

                name: oldAuthor,

                email: null
            };



            await doc.save();



            console.log(`Migrated: ${doc.slug}`);
        }



        console.log("Migration Completed");



        process.exit();

    } catch (error) {

        console.log(error);

        process.exit(1);
    }
};



migrate();