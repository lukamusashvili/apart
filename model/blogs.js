const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reqString = {type: String, required: true}

const blogsSchema = new Schema({
    lang: reqString,
    mainImage: reqString,
    title: reqString,
    url: reqString,
    blogContent: reqString,
    callonicalUrl: String,
    meta: String
},{collection: 'blogs', timestamps: true});

const blogs = mongoose.model('blogs', blogsSchema);

module.exports = blogs;
