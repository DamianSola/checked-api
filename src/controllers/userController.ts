import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface RegisterProps {
  nombre: string;
  email: string;
  password: string;
  rol: string;
}

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { nombre, email, password, rol } = req.body as RegisterProps;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser:any = new User({ nombre, email, password: hashedPassword, rol });

    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '5h' });

    console.log(newUser)
    res.status(201).json({ message: 'User registered successfully', user: newUser, token });
  } catch (error: unknown) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as RegisterProps;

  try {
    const user: any = await User.findOne({ email });
    if (!user)  res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '5h' });
      
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
      res.cookie('user', JSON.stringify({ id: user._id, nombre: user.nombre, rol: user.rol }), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
            
      res.status(200).json({ message: 'Login successful', token, user: { _id: user._id, password: password ,nombre: user.nombre, email: user.email, rol: user.rol } });
    }else{
      res.status(400).json({ message: 'Invalid credentials' });
    }

  } catch (error: unknown) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteUser = async (req:Request, res:Response): Promise<void> => {
  const { email, password } = req.body;
  try{
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });

    } else{
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) res.status(400).json({ message: 'Invalid credentials' });
      else{
        await User.findByIdAndDelete(user._id);
        res.status(200).json({ message: 'user deleted' });
      }
    }

  }catch(error: unknown){
    res.status(500).json({ message: 'Server error', error });
  }
}

export const logout = (req: Request, res: Response): void => {
  res.clearCookie('authToken');
  res.clearCookie('user');
  res.json({ message: 'Logout successful' });
};

export const updateUser  = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nombre, email, password } = req.body ;
  try{
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(id, { nombre, email, hashedPassword }, { new: true})
    res.send({message:"cambios realizados exitosamente", user})
  }catch(error: any){
    console.log(error)
    res.status(500).json({ message: 'Server error', error });
  }
 

}