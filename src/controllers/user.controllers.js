
import { UserDao } from "../daos/factory.js";
import { UserDto } from "../dto/userDto.js";
import userService from "../repository/index.repository.js";

export class UserControllers {
    constructor() {
        this.service = UserDao();
    }

// Llama a todos los usuarios
async getUsers(req, res) {
    try {
        const users = await this.service.getUsers();
        res.status(200).json({ status: "success", users });
    } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
    }
}
// Llama a un usuario por ID
async getUserBy(req, res) {
    try {
        const { uid } = req.params;
        const user = await this.service.getUserBy(uid);
        res.status(200).json({ status: "success", user });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

// Crea un usuario
async createUser(req, res) {
    try {
        const { first_name, last_name, email, password } = req.body;
        const userNew = new UserDto({ first_name, last_name, email, password });
        const result = await this.service.createUser(userNew);
        res.status(201).json({ status: "success", user: result });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

// Actualiza el usuario
async updateUser(req, res) {
    try {
        const { uid } = req.params;
        const userToUpdate = req.body;
        const result = await this.service.updateUser(uid, userToUpdate);
        res.status(200).json({ status: "success", message: result });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

// Elimina un usuario
async deleteUser(req, res) {
    try {
        const { uid } = req.params;
        const result = await this.service.deleteUser(uid);
        res.status(200).json({ status: "success", message: result });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

async userRole (req, res){
    const { uid } = req.params;
    try {
    // Obtener el usuario por su UID
    const user = await usersModel.findById(uid);

    // Verificar si el usuario existe
    if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Cambiar el rol del usuario
    user.role = user.role === 'USER' ? 'PREMIUM' : 'USER';
    
   // Actualizar el rol del usuario en la base de datos
    await usersModel.updateOne({ _id: uid },{ $set: { role: newRole } });

    res.status(200).json({ message: `Rol de usuario ${user.role === 'premium' ? 'actualizado a premium' : 'actualizado a user'}` });
    } catch (error) {
    console.error('Error al cambiar el rol del usuario:', error);
    res.status(500).send('Error al cambiar el rol del usuario');
    }
}
    }

