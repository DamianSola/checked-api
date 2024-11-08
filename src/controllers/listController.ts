import { Request, Response } from 'express';
import List from '../models/List'; // Asegúrate de que la ruta sea correcta
import Event from '../models/Event'; // Asegúrate de que la ruta sea correcta
import Guest from '../models/Guest';

// Crear una nueva lista
export const createList = async (req: Request, res: Response) => {
    const { nombre, eventoId } = req.body;

    try {
        const newList = new List({ nombre, abierta: true, eventoId });
        await newList.save();

        // Agregar la lista al evento
        await Event.findByIdAndUpdate(eventoId, { $push: { listas: newList._id } });

        res.status(201).json(newList);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todas las listas de un evento
export const getAllLists = async (req: Request | any, res: Response | any) => {
    const { eventoId } = req.params;

    try {
        // const event = await Event.findById(eventoId).populate('listas');
        const event = await Event.findById(eventoId)
        .populate({
          path: 'listas',
          populate: {
            path: 'invitados',
          }
        });

        if (!event) return res.status(404).json({ message: 'Evento no encontrado' });

        // console.log(event)

        res.json(event.listas);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar una lista
export const deleteList = async (req: Request | any, res: Response | any) => {
    const {listId} = req.params;

    let evento: any = await List.findById(listId);
    let eventoId = evento.eventoId;
    let guestList: any = await List.findById(listId).populate('invitados');

// Verifica si evento y guestList existen
    if (!evento || !guestList) {
        return res.status(404).json({ message: 'Lista o evento no encontrado' });
    }

    // console.log(eventoId, "holaaa")

    try {
        const deletePromises = guestList.invitados.map(async (element: any) => {
            return await Guest.findByIdAndDelete(element._id);
        });
    
        await Promise.all(deletePromises);
    
        // Eliminar la lista
        await List.findByIdAndDelete(listId);
    
        // Actualizar el evento
        await Event.findByIdAndUpdate(eventoId, { $pull: { listas: listId } });
    
        res.json({ message: 'Lista eliminada' });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateList = async (req: Request | any, res: Response | any) => {
    const { id } = req.params; // Obtenemos el ID de la lista desde los parámetros de la solicitud
    const { nombre, abierta, invitados } = req.body; // Obtenemos los nuevos datos de la lista del cuerpo de la solicitud

    try {
        // Buscamos la lista por ID y la actualizamos
        const updatedList = await List.findByIdAndUpdate(
            id,
            { nombre, abierta, invitados }, // Los campos que deseas actualizar
            { new: true, runValidators: true } // Devuelve el documento actualizado y aplica validaciones
        );

        // Si no se encuentra la lista, enviamos un error
        if (!updatedList) {
            return res.status(404).json({ message: 'Lista no encontrada' });
        }

        // Enviamos la lista actualizada como respuesta
        res.status(200).json(updatedList);
    } catch (error:any) {
        // En caso de error, enviamos un mensaje de error
        res.status(500).json({ message: 'Error al actualizar la lista', error: error.message });
    }
};
