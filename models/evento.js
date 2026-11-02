/*
    Cristian Moresi Nadal
    2º DAW SEMI
    Despliegue de Aplicaciones Web
    Práctica 1 - API REST
*/

import mongoose from "mongoose";

const entradaSchema = new mongoose.Schema(
{
    tipo:
    {
        type: String,
        required: true,
        minlength: 3
    },

    precio:
    {
        type: Number,
        required: true,
        min: 0
    },

    disponibles:
    {
        type: Number,
        required: true,
        min: 0,
        validate: Number.isInteger
    }
});

const eventoSchema = new mongoose.Schema(
{
    nombre: 
    {
        type: String,
        minlength: 5,
        required: true
    },

    fecha: 
    {
        type: Date,
        required: true
    },

    recinto: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "recintos",
        required: true
    },

    entradas: [entradaSchema]
});

const Evento = mongoose.model("eventos", eventoSchema);
export default Evento;
