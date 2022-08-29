//#region IMPORTING
require('isomorphic-fetch');
const dotenv = require('dotenv'); dotenv.config();
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const axios = require('axios');
const auth = require('koa-basic-auth');
const cors = require('@koa/cors');
const port = process.env.APP_PORT
//#endregion
//#region MongoDB
const mongoose = require('mongoose');
const mongoPath = process.env.MongoDBPath;
const db = mongoose.connection;
const dbUpdate = {useNewUrlParser:true,useUnifiedTopology:true};
const blogs = require('./model/blogs.js');

const app = new Koa();
const router = new Router();

app
    .use(cors())
    .use(auth({user:process.env.APP_USER,pass:process.env.APP_PASS}));

router
    .get('/', (ctx, next) => {
        ctx.body = '/';
    })
    .get('/api/blogs/:lang', async (ctx, next) => {
        const lang = ctx.params.lang
        const blogsData = await blogs.find({lang: lang},'-_id mainImage lang title text url')
        ctx.body = blogsData
    })
    .get('/api/blog/:lang/:url', async (ctx, next) => {
        const lang = ctx.params.lang
        const url = ctx.params.url
        const blogData = await blogs.find({lang: lang,url:url},'-_id mainImage images url callonicalUrl lang title text')
        ctx.body = blogData
    })
    .post('/api/blog', koaBody(), async (ctx, next) => {
        const data = ctx.request.body
        const url = data.url
        console.log(ctx)
        const blogTitleExists = await blogs.countDocuments({lang:data.lang, url: url})
        if(blogTitleExists == 0){
            insertShop(data)
            ctx.body = 'The blog has been created successfully';
        }
        else{
            ctx.body = 'The title already exists';
        }
    })
    .put('/api/blog/:lang/:url', koaBody(), async (ctx, next) => {
        const lang = ctx.params.lang
        const url = ctx.params.url
        const data = ctx.request.body
        await blogs.replaceOne({ lang: lang, url: url }, data), (err,result) => {
            if(err){
                console.log('error ' + err); 
            }
            else{
                console.log('result ' + result);
            }
        }
        ctx.body = "The blog has been updated successfully"
    })
    .del('/blog/:id', koaBody(), (ctx, next) => {
        console.log(ctx.params.id);
        console.log(ctx.request.body);
        ctx.body = '/blog/'+ctx.params.id;
    })

app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
//#endregion