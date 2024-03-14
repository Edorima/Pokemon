"use strict"

import express from "express";

const APIPATH = process.env.API_PATH || '/'

const app = express()

//chargement des middleware
//Pour le CORS
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin",'*');
    res.setHeader("Access-Control-Allow-Methods",'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers",'Content-Type,Authorization');
    next();
})

app.use(express.json()) //pour traiter les body en json

//chargement des routes
const {default: routes}  = await import ('./api/route.mjs')
app.use(APIPATH === '/' ? '' : APIPATH+'/', routes)

//message par defaut
app.use((error,req,res, next)=>{
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message
    res.status(status).json({message:message})
})

export default app;
