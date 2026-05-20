const express = require("express");

const router = express.Router();

const {

    createDocument,
    getDocument,
    updateDocument,
    deleteDocument,
    searchDocuments,
    getMostEditedDocuments,
    getTagCooccurrence

} = require("../controllers/documentController");



// CREATE DOCUMENT

router.post("/documents", createDocument);



// GET DOCUMENT

router.get("/documents/:slug", getDocument);



// UPDATE DOCUMENT

router.put("/documents/:slug", updateDocument);



// DELETE DOCUMENT

router.delete("/documents/:slug", deleteDocument);



// SEARCH DOCUMENTS

router.get("/search", searchDocuments);



// MOST EDITED ANALYTICS

router.get("/analytics/most-edited", getMostEditedDocuments);



// TAG CO-OCCURRENCE

router.get("/analytics/tag-cooccurrence", getTagCooccurrence);



module.exports = router;