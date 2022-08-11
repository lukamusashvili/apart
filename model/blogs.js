const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reqString = {type: String, required: true}

const blogsSchema = new Schema({
    bannerimg: reqString,
    header: reqString,
    description: reqString
},{collection: 'blogs', timestamps: true});

const blogs = mongoose.model('blogs', blogsSchema);

module.exports = blogs;
