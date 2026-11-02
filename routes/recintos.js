/*
    Cristian Moresi Nadal
    2º DAW SEMI
    Despliegue de Aplicaciones Web
    Práctica 1 - API REST
*/

import express from "express";
import Recinto from "../models/recinto.js";

async function getRecintos(req, res)
{
    try
    {
        const recintos = await Recinto.find();
        
        if (recintos.length > 0)
        {
            res.status(200).send( {ok: true, resultado: recintos} );
        }
        else
        {
            res.status(500).send( {ok: false, error: "No se han encontrado recintos"} );
        }
    }
    catch (error)
    {
        res.status(500).send( {ok: false, error: "No se han encontrado recintos"} );
    }
}

async function getRecintoById(req, res)
{
    try
    {
        const recinto = await Recinto.findById(req.params.id);

        if (recinto)
        {
            res.status(200).send( {ok: true, resultado: recinto});
        }
        else
        {
            res.status(404).send( {ok: false, error: `Recinto ${req.params.id} no encontrado`} );
        }
    }
    catch (error)
    {
        res.status(404).send( {ok: false, error: `Recinto ${req.params.id} no encontrado`} );
    }
}

async function getRecintosByLocalidad(req, res)
{
    try
    {
        const recintos = await Recinto.find( {localidad: req.params.nombre} );

        if (recintos.length > 0)
        {
            res.status(200).send( {ok: true, resultado: recintos});
        }
        else
        {
            res.status(404).send( {ok: false, error: "No se han encontrado recintos de la localidad indicada"} );
        }
    }
    catch (error)
    {
        res.status(404).send( {ok: false, error: "No se han encontrado recintos de la localidad indicada"} );
    }
}

async function postRecinto(req, res)
{
    try
    {
        const recinto = new Recinto
        ({
            nombre: req.body.nombre,
            direccion: req.body.direccion,
            localidad: req.body.localidad,
            aforoMaximo: req.body.aforoMaximo
        });

        const resultado = await recinto.save();
        res.status(201).send( {ok: true, resultado: resultado} );
    }
    catch (error)
    {
        res.status(500).send( {ok: false, error: "Error añadiendo recinto"} );
    }
}

async function deleteRecinto(req, res)
{
    try
    {
        const recinto = await Recinto.findByIdAndDelete(req.params.id);

        if (recinto)
        {
            res.status(200).send( {ok: true, resultado: recinto});
        }
        else
        {
            res.status(404).send( {ok: false, error: `Error eliminando recinto ${req.params.id}`} );
        }
    }
    catch (error)
    {
        res.status(404).send( {ok: false, error: `Error eliminando recinto ${req.params.id}`} );
    }
}

const router = express.Router();
router.get("/", getRecintos);
router.get("/:id", getRecintoById);
router.get("/localidad/:nombre", getRecintosByLocalidad);
router.post("/", postRecinto);
router.delete("/:id", deleteRecinto);

export default router;
