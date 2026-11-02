/*
    Cristian Moresi Nadal
    2º DAW SEMI
    Despliegue de Aplicaciones Web
    Práctica 1 - API REST
*/

import express from "express";
import Evento from "../models/evento.js";

async function getEventos(req, res)
{
    try
    {
        const eventos = await Evento.find().populate("recinto");

        if (eventos.length > 0)
        {
            res.status(200).send( {ok: true, resultado: eventos} );
        }
        else
        {
            res.status(500).send( {ok: false, error: "No se han encontrado eventos"} );
        }
    }
    catch (error)
    {
        res.status(500).send( {ok: false, error: "No se han encontrado eventos"} );
    }
}

async function getEventoById(req, res)
{
    try
    {
        const evento = await Evento.findById(req.params.id);

        if (evento)
        {
            res.status(200).send( {ok: true, resultado: evento});
        }
        else
        {
            res.status(404).send( {ok: false, error: `Evento ${req.params.id} no encontrado`} );
        }
    }
    catch (error)
    {
        res.status(404).send( {ok: false, error: `Evento ${req.params.id} no encontrado`} );
    }
}

async function getEventosByLocalidad(req, res)
{
    try
    {
        const ahora = new Date();
        const eventos = (await Evento.find().populate("recinto"))
            .filter( e => e.recinto && e.recinto.localidad.toLowerCase() === req.params.nombre.toLowerCase() && e.fecha > ahora );

        if (eventos.length > 0)
        {
            res.status(200).send( {ok: true, resultado: eventos} );
        }
        else
        {
            res.status(404).send( {ok: false, error: "No se han encontrado eventos"} );
        }
    }
    catch (error)
    {
        res.status(404).send( {ok: false, error: "No se han encontrado eventos"} );
    }
}

async function getEntradaByTipo(req, res)
{
    try
    {
        const evento = await Evento.findById(req.params.idEvento);

        if (evento)
        {
            const entrada = evento.entradas.find( e => e.tipo === req.params.tipoEntrada );

            if (entrada)
            {
                const resultado =
                {
                    precio: entrada.precio,
                    disponibles: entrada.disponibles
                };

                res.status(200).send( {ok: true, resultado: resultado} );
            }
            else
            {
                res.status(404).send( {ok: false, error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`} );
            }
        }
        else
        {
            res.status(404).send( {ok: false, error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`} );
        }
    }
    catch (error)
    {
        res.status(404).send( {ok: false, error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`} );
    }
}

async function postEvento(req, res)
{
    try
    {
        const evento = new Evento
        ({
            nombre: req.body.nombre,
            fecha: req.body.fecha,
            recinto: req.body.recinto,
            entradas: req.body.entradas
        });

        const resultado = await evento.save();
        res.status(201).send( {ok: true, resultado: resultado} );
    }
    catch (error)
    {
        res.status(500).send( {ok: false, error: "Error añadiendo evento"} );
    }
}

async function putEvento(req, res)
{
    try
    {
        const cambios =
        {
            nombre: req.body.nombre,
            fecha: req.body.fecha,
            recinto: req.body.recinto,
            entradas: req.body.entradas
        };

        const evento = await Evento.findByIdAndUpdate(req.params.id, cambios, {returnDocument: "after", runValidators: true});

        if (evento)
        {
            res.status(200).send( {ok: true, resultado: evento});
        }
        else
        {
            res.status(404).send( {ok: false, error: `Error actualizando evento ${req.params.id}`} );
        }
    }
    catch (error)
    {
        res.status(404).send( {ok: false, error: `Error actualizando evento ${req.params.id}`} );
    }
}

async function putEntradas(req, res)
{
    try
    {
        const evento = await Evento.findById(req.params.idEvento);

        if (evento)
        {
            const entrada = evento.entradas.find( e => e.tipo === req.params.tipoEntrada );

            if (entrada)
            {
                if (Number.isInteger(+req.params.cantidad) && +req.params.cantidad <= entrada.disponibles
                    && +req.params.cantidad > 0)
                {
                    entrada.disponibles -= +req.params.cantidad;

                    const resultado = await evento.save();
                    res.status(200).send( {ok: true, resultado: resultado} );
                }
                else
                {
                    res.status(404).send( {ok: false, error: `Error actualizando entradas del evento ${req.params.idEvento}`} );
                }
            }
            else
            {
                res.status(404).send( {ok: false, error: `Error actualizando entradas del evento ${req.params.idEvento}`} );
            }
        }
        else
        {
            res.status(404).send( {ok: false, error: `Error actualizando entradas del evento ${req.params.idEvento}`} );
        }
    }
    catch (error)
    {
        res.status(404).send( {ok: false, error: `Error actualizando entradas del evento ${req.params.idEvento}`} );
    }
}

async function deleteEvento(req, res)
{
    try
    {
        const evento = await Evento.findByIdAndDelete(req.params.id);

        if (evento)
        {
            res.status(200).send( {ok: true, resultado: evento});
        }
        else
        {
            res.status(404).send( {ok: false, error: `Error eliminando evento ${req.params.id}`} );
        }
    }
    catch (error)
    {
        res.status(404).send( {ok: false, error: `Error eliminando evento ${req.params.id}`} );
    }
}

const router = express.Router();
router.get("/", getEventos);
router.get("/:id", getEventoById);
router.get("/localidad/:nombre", getEventosByLocalidad);
router.get("/entradas/:idEvento/:tipoEntrada", getEntradaByTipo);
router.post("/", postEvento);
router.put("/:id", putEvento);
router.put("/entradas/:idEvento/:tipoEntrada/:cantidad", putEntradas);
router.delete("/:id", deleteEvento);

export default router;
