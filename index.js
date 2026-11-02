/*
    Cristian Moresi Nadal
    2º DAW SEMI
    Despliegue de Aplicaciones Web
    Práctica 1 - API REST
*/

import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import eventosRouter from "./routes/eventos.js";
import recintosRouter from "./routes/recintos.js";

dotenv.config();

async function main()
{
    try
    {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const app = express();
        app.use(express.json());
        app.use("/eventos", eventosRouter);
        app.use("/recintos", recintosRouter);
        app.listen(process.env.PORT, "0.0.0.0");
    }
    catch (error)
    {
        const mensaje = String(error.message || error).replace(/mongodb(?:\+srv)?:\/\/\S+/g, '[URI ocultada]');
        console.error('Error connecting to MongoDB: ', mensaje);
        process.exitCode = 1;
    }
}

main();
