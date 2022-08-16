const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reqString = {type: String, required: true}

const blogsSchema = new Schema({
    lang: reqString,
    mainImage: reqString,
    images: Array,
    title: reqString,
    url: reqString,
    text: reqString,
    callonicalUrl: String
},{collection: 'blogs', timestamps: true});

const blogs = mongoose.model('blogs', blogsSchema);

module.exports = blogs;
