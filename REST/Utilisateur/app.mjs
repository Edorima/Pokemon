"use strict"

import express from "express"

const app = express()

//chargement des middleware
//Pour le CORS
app.use((req,res,next)=> {
    res.setHeader("Access-Control-Allow-Origin",'*')
    res.setHeader("Access-Control-Allow-Methods",'GET, POST, PUT, DELETE')
    res.setHeader("Access-Control-Allow-Headers",'Content-Type,Authorization')
    next()
})

app.use(express.json()) //pour traiter les body en json

//chargement des routes
const {default: routes}  = await import ('./api/route.mjs')
app.use('', routes)

//message par defaut
app.use((error,req,res, next)=>{
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message
    res.status(status).json({message:message})
})

export default app;
