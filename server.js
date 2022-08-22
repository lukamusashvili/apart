//#region IMPORTING
require('isomorphic-fetch');
const dotenv = require('dotenv'); dotenv.config();
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const axios = require('axios');
const auth = require('koa-basic-auth');
const credentials = {user:process.env.APP_USER,pass:process.env.APP_PASS}
const port = process.env.APP_PORT
//#endregion
//#region MongoDB
const mongoose = require('mongoose');
const mongoPath = process.env.MongoDBPath;
const db = mongoose.connection;
const dbUpdate = {useNewUrlParser:true,useUnifiedTopology:true};
const blogs = require('./model/blogs.js');

mongoose.connect(mongoPath, dbUpdate);

db.on('error', (err) => console.log('Error, DB Not Connected'));
db.on('connected', () => console.log('Connected to Mongo'));
db.on('disconnected', (err) => console.log('Mongo is disconnected'));
db.on('open', (err) => console.log('Connection Made!'));
//#endregion
//#region ROUTERS
const app = new Koa();
const router = new Router();

router
    .get('/api', async (ctx, next) => {
        ctx.body = 'hi';
    })
    .get('/api/blogs/:lang', async (ctx, next) => {
        const lang = ctx.params.lang
        const blogsList = await blogs.find({lang: lang},'-_id title text mainImage createdAt updatedAt')
        ctx.body = blogsList;
    })
    .get('/api/blog/:lang/:title', async (ctx, next) => {
        const lang = ctx.params.lang
        const title = ctx.params.title
        const blog = await blogs.find({lang: lang, title: title},'-_id title text mainImage images callonicalUrl createdAt updatedAt')
        ctx.body = blog;
    })
    .post('/api/blog', koaBody(), async (ctx, next) => {
        const data = ctx.request.body
        const numberOfBlogsWithTheSameName = await blogs.count({lang: data.lang, title: data.title})
        console.log(numberOfBlogsWithTheSameName)
        if(numberOfBlogsWithTheSameName==0){
            createBlog(data)
            ctx.body = "the blog "+data.title+" has been created successfully"
        }
        else{
            ctx.body = "The blog title already exists"
        }
        await next();
    })
    .put('/api/blog', koaBody(), async (ctx, next) => {
        const data = ctx.request.body
        updateBlog(data)
        ctx.body = "The blog "+data.title+" has been updated successfully"
    })
    .del('/api/blog/:lang/:title', async (ctx, next) => {
        await blogs.deleteOne({lang: ctx.params.lang, title: ctx.params.title}), (err,result) => {
            if(err){
                console.log('error ' + err); 
            }
            else{
                console.log('result ' + result);
            }
        }
        ctx.body = "The blog "+ctx.params.title+" has been removed successfully"
    });
//#endregion
//#region FUNCTIONS
async function createBlog(data){
    await blogs.create(data, (err,result) => {
        if(err){
            console.log('error ' + err); 
        }
        else{
            console.log('result ' + result);
        }
    })
    console.log(data)
}
async function updateBlog(data){
    await blogs.replaceOne({ lang: data.lang, title: data.title }, data), (err,result) => {
        if(err){
            console.log('error ' + err); 
        }
        else{
            console.log('result ' + result);
        }
    }
}
//#endregion
//#region APP CONFIG
app
    .use(auth(credentials))
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
//#endregion