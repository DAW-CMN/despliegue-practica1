/*
    Cristian Moresi Nadal
    2º DAW SEMI
    Despliegue de Aplicaciones Web
    Práctica 1 - API REST
*/

import mongoose from "mongoose";

const recintoSchema = new mongoose.Schema(
{
    nombre: 
    {
        type: String,
        minlength: 5,
        required: true
    },

    direccion:
    {
        type: String,
        minlength: 10,
        required: true
    },

    localidad:
    {
        type: String,
        minlength: 3,
        required: true
    },

    aforoMaximo:
    {
        type: Number
    }
})

const Recinto = mongoose.model("recintos", recintoSchema);
export default Recinto;