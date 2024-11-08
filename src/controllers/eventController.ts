
import { Request, Response ,NextFunction} from 'express';
import Event from '../models/Event'; // Asegúrate de que la ruta al modelo es correcta
import List from '../models/List';
import Guest from '../models/Guest';

// Controlador para obtener los eventos del usuario autenticado
export const obtenerEventos = async (req: Request | any, res: Response | any) => {

    const {id} = req.params
    try {
   
    const eventos = await Event.find({ creadoPor: id })
    
    res.status(200).json(eventos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los eventos' });
  }
};

export const crearEvento = (req: Request | any, res: Response | any, next:NextFunction | any) => {

    try{
        const {nombre, fecha, lugar, creadoPor} = req.body
        const evento = new Event({nombre, fecha, lugar, creadoPor})
        evento.save()
        res.status(201).json({message: 'Evento creado con exito'})

    }catch(err:any){
        return res.status(500).json({ message: 'Error al crear el evento' });
    }
}

export const obtenerPorId = async (req: Request | any, res: Response | any, next:NextFunction | any) => {
    try{
        const {id} = req.params
        const evento = await Event.findById(id)
        if(!evento){
            return res.status(404).json({message: 'Evento no encontrado'})
        }
        res.status(200).json(evento)

    }catch(err:any){
        next(err)
    }
}

export const editarEvento = async (req: Request | any, res: Response | any, next: NextFunction | any) => {
    try {
        const { id } = req.params;
        const dataNueva = req.body;

        // Filtrar las propiedades con valores nulos, indefinidos o strings vacíos
        const dataFiltrada = Object.fromEntries(
            Object.entries(dataNueva).filter(([_, value]) => value !== null && value !== undefined && value !== '')
        );

        const eventoEditado = await Event.findByIdAndUpdate(id, dataFiltrada, { new: true });
        if (!eventoEditado) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        res.status(200).json({ message: 'Cambios guardados', eventoEditado });
    } catch (err: any) {
        next(err);
    }
};





export const eliminarEvento = async (req: Request | any, res: Response | any, next: NextFunction | any) => {
    try {
        const { id } = req.params;
        
        // Eliminar el evento
        const eventoEliminado = await Event.findByIdAndDelete(id);
        if (!eventoEliminado) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        // Eliminar las listas relacionadas con el evento
        await List.deleteMany({ eventoId: id });

        // Eliminar los invitados relacionados con el evento
        await Guest.deleteMany({ eventoId: id });

        res.status(200).json({ message: 'Evento y datos relacionados eliminados exitosamente' });
    } catch (err: any) {
        next(err);
    }
};

