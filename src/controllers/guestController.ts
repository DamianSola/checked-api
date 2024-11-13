import Guest from "../models/Guest";
import { Request, Response } from 'express';
import List from "../models/List";
import Event from "../models/Event";


export const addGuest = async (req:Request | any , res: Response | any) =>{
    try{
        const {nombre, dni, listaId, eventoId} = req.body;

        let dniNumber = Number(dni)

        const isOpen : any = await List.findById(listaId)

        if(!isOpen.abierta) return res.status(403).json({message: "no se puede agregar, la lista esta cerrada"})

        // const isGuest = await Guest.find({eventoId,dni:dniNumber})
        const existingGuest = await Guest.findOne({ dni: dniNumber, eventoId: eventoId});

        if(existingGuest){
            console.log("existe")
            
            res.status(209).json({message: `El dni ${dni} ya esta registrado`})
            
        }else{
            const newGuest = new Guest({nombre, dni: dniNumber, listaId, eventoId});
           
            await newGuest.save();  

            await List.findByIdAndUpdate(listaId, { $push: { invitados: newGuest._id } });
            await Event.findByIdAndUpdate(eventoId, { $push: { invitados: newGuest._id } });
            res.status(200).json({message: 'Guest added successfully', guest: newGuest});
        }
    }catch(error:any){
        console.error(error);
        res.status(500).json({message: 'Error adding guest', error: error.message});
    }
}

export const deleteGuest = async (req:Request | any , res: Response | any) =>{
    try{
        const {guestId} = req.params;

        const guest = await Guest.findByIdAndDelete(guestId)
        if(!guest) return res.status(404).json({message: "Guest not found"})

            console.log(guest.listaId,'lista id')
            await List.findByIdAndUpdate(guest.listaId, { $pull: { invitados: guestId }})
            // await List.findByIdAndUpdate(listId, { $pull: { listas: guestId } });

        
        res.send({message:"invitado eliminado"})

    }catch(error:any){
        console.log(error);
        res.status(500).json({message: error. _message, error: error. _message});
    }
    
}

export const getGuestByList = async (req:Request | any , res: Response | any) =>{
    const {listaId} = req.params;
    try{
        const guests = await Guest.find({listaId:listaId})

        res.send(guests)
    }catch(error:any){
        console.log(error);
        res.status(500).json({message: 'Error adding guest', error: error.message});
    }
}

export const getGuestByEvent = async (req:Request | any , res: Response | any) =>{
    const {eventoId} = req.params;
    try{
        const guests = await Guest.find({eventoId:eventoId})

        res.send(guests)
    }catch(error:any){
        console.log(error);
        res.status(500).json({message: 'Error adding guest', error: error.message});
    }
}

export const findByDni = async (req:Request | any , res: Response | any) => {
    const {eventoId,dni} = req.params;
    // const {dni} = req.query;



    let dniNumber = Number(dni)
 

    try{   
        const guest = await Guest.find({
            eventoId: eventoId // Asegúrate de que eventoId esté en formato ObjectId
        });

        const isGuest = guest.find(g => g.dni === dniNumber)

        console.log(isGuest)
        
        if (!isGuest) {
            return res.status(404).json({ message: 'Invitado no encontrado' });
        }

        res.status(200).json({ message: 'Invitado encontrado', guest: isGuest});

        }catch(error: any){
            res.status(500).json({ message: 'Error en la busqueda del invitado', error: error.message });

        }
}

export const CheckGuest = async (req: Request | any, res: Response | any) => {
    const { _id } = req.params;

    try {
        const guest = await Guest.findById(_id);
        
        if (!guest) {
            return res.status(404).json({ message: 'Invitado no encontrado' });
        }

        // Actualizar el estado y la hora de ingreso
        guest.estado = 'admitido';
        guest.horaIngreso = new Date(); // Asigna la fecha y hora actual

        await guest.save(); // Guarda los cambios en la base de datos

        res.status(200).json({ message: 'Invitado admitido', guest });
    } catch (error: any) {
        res.status(500).json({ message: 'Error al actualizar el invitado', error: error.message });
    }
};
