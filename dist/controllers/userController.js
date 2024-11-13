"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.logout = exports.deleteUser = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, email, password, rol } = req.body;
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new User_1.default({ nombre, email, password: hashedPassword, rol });
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({ id: newUser._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '5h' });
        console.log(newUser);
        res.status(201).json({ message: 'User registered successfully', user: newUser, token });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user)
            res.status(400).json({ message: 'Invalid credentials' });
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (isMatch) {
            const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '5h' });
            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
            res.cookie('user', JSON.stringify({ id: user._id, nombre: user.nombre, rol: user.rol }), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
            res.status(200).json({ message: 'Login successful', token, user: { _id: user._id, password: password, nombre: user.nombre, email: user.email, rol: user.rol } });
        }
        else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.loginUser = loginUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
        }
        else {
            const isMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!isMatch)
                res.status(400).json({ message: 'Invalid credentials' });
            else {
                yield User_1.default.findByIdAndDelete(user._id);
                res.status(200).json({ message: 'user deleted' });
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.deleteUser = deleteUser;
const logout = (req, res) => {
    res.clearCookie('authToken');
    res.clearCookie('user');
    res.json({ message: 'Logout successful' });
};
exports.logout = logout;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre, email, password } = req.body;
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield User_1.default.findByIdAndUpdate(id, { nombre, email, hashedPassword }, { new: true });
        res.send({ message: "cambios realizados exitosamente", user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.updateUser = updateUser;
