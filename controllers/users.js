// Importa las dependencias necesarias.
const usersRouters = require('express').Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {PAGE_URL} = require('../config');
const { userExtractor } = require("../middleware/auth");

// --- RUTA DE REGISTRO DE USUARIOS (POST /api/users) ---
usersRouters.post('/' , async (req, res) =>{
    // Extrae los datos del cuerpo de la petición.
    const { name, email, password} = req.body
    // Valida que todos los campos necesarios estén presentes.
    if (!name || !email || !password){
        return res.status(400).json({message: "Todos los campos son obligatorios"}); 
    }


    try {
        // Busca si ya existe un usuario con el mismo correo electrónico.
        const userExist = await User.findOne({ email });
        if (userExist) { 
            // Si el email ya está en uso, devuelve un error de conflicto.
            return res.status(409).json({ message: "Este email ya está en uso" }); 
        }
        // Genera un hash de la contraseña para almacenarla de forma segura.
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            name,
            email,
            passwordHash, 
        });
        // Guarda el nuevo usuario en la base de datos.
        const savedUser = await newUser.save();
        // Crea un token JWT para la verificación del correo, que expira en 1 día.
        const token = jwt.sign({id: savedUser.id}, process.env.ACCESS_TOKEN_SECRET, 
            {
            expiresIn: "1d"
        });

        
        // Configura el transportador de correo (nodemailer) para enviar emails a través de Gmail.
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        

        // Envía el correo de verificación al nuevo usuario.
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: savedUser.email,
            subject: "Verificacion de usuario",
            html: `<a href="${PAGE_URL}/verify/${savedUser.id}/${token}">Verify Mail</a>`,
        });
        return res.status(201).json({ message: "Usuario creado. Por favor verifica tu correo." });

    } catch (error) {
        
        console.error('Error al registrar el usuario:', error);

        return res.status(500).json({ message: 'Error interno del servidor al crear el usuario.', error: error.message });
    }
});

// --- RUTA PARA OBTENER DATOS DEL USUARIO AUTENTICADO (GET /api/users/me) ---
// El middleware 'userExtractor' se ejecuta primero para verificar el token y obtener los datos del usuario.
usersRouters.get('/me', userExtractor, (request, response) => {
    // Devuelve los datos relevantes del usuario que fueron adjuntados por el middleware.
    const { name, email, plan } = request.user;
    response.json({ name, email, plan });
});

// --- RUTA PARA VERIFICAR EL CORREO DEL USUARIO (PATCH /api/users/:id/:token) ---
usersRouters.patch('/:id/:token', async (request, response) => {
    try {
        // Extrae el ID y el token de los parámetros de la URL.
        const { id, token } = request.params;
        // Verifica que el token sea válido y no haya expirado.
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' });
        }
        // Comprueba que el ID del token coincida con el ID de la URL para mayor seguridad.
        if (id !== decodedToken.id) {
            return response.status(401).json({ error: 'user does not match' });
        }
        // Actualiza el estado del usuario a 'verificado' en la base de datos.
        await User.findByIdAndUpdate(id, { verified: true });
        response.json({ message: 'user verified' });
    } catch (error) {
        console.error('Error verifying user:', error);
        response.status(500).json({ message: 'Internal server error' });
    }
});

// --- RUTA PARA ACTUALIZAR EL PLAN DEL USUARIO (PATCH /api/users/plan) ---
// El middleware 'userExtractor' se encarga de la autenticación.
usersRouters.patch('/plan', userExtractor, async (request, response) => {
    try {
        // Obtiene el nombre del plan del cuerpo de la petición.
        const { plan } = request.body;
        if (!plan) {
            return response.status(400).json({ message: 'Plan is required' });
        }

        // Obtiene el ID del usuario desde el objeto 'request' que fue poblado por 'userExtractor'.
        const userId = request.user.id;

        // Busca al usuario por su ID y actualiza su campo 'plan'.
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { plan: plan }, 
            { new: true } // Esta opción devuelve el documento actualizado
        );

        // Si no se encuentra el usuario, devuelve un error 404.
        if (!updatedUser) {
            return response.status(404).json({ message: 'User not found' });
        }

        response.json({ message: 'Plan updated successfully', plan: updatedUser.plan });
    } catch (error) {
        console.error('Error updating plan:', error);
        response.status(500).json({ message: 'Internal server error' });
    }
});

// Exporta el router para ser utilizado en la aplicación principal.
module.exports = usersRouters;