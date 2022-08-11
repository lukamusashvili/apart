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

const app = new Koa();
const router = new Router();

router
    .get('/', (ctx, next) => {
        ctx.body = '/';
    })
    .get('/blogs', (ctx, next) => {
        ctx.body = '/blogs';
    })
    .get('/blog/:id', (ctx, next) => {
        console.log(ctx.params.id);
        ctx.body = '/blog/'+ctx.params.id;
    })
    .post('/blog', koaBody(), (ctx, next) => {
        console.log(ctx.request.body);
        ctx.body = '/blog';
    })
    .put('/blog/:id', koaBody(), (ctx, next) => {
        console.log(ctx.params.id);
        console.log(ctx.request.body);
        ctx.body = '/blog/'+ctx.params.id;
    })
    .del('/blog/:id', koaBody(), (ctx, next) => {
        console.log(ctx.params.id);
        console.log(ctx.request.body);
        ctx.body = '/blog/'+ctx.params.id;
    })

app
    .use(auth(credentials))
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });