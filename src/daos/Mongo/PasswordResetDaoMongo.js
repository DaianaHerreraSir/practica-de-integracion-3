import jwt from 'jsonwebtoken';
import { configObject } from '../../config/connectDB.js';
import usersModel from './models/users.model.js';
import { UserDao } from '../factory.js';


const { jwt_private_key } = configObject;

class PasswordResetDaoMongo {
  
async generatePasswordResetToken(email) {
    try {
    // Buscar al usuario por el email
    const user = await usersModel.findOne({email})
        console.log("email de usuario desde dao", user);

    if (!user) {
          throw new Error('Usuario no encontrado');
            }
// Crear el payload del token con la información necesaria
    const payload = {
          userId: user._id,
          email: user.email
        };
      console.log("informacion del usuario", payload);
// Generar el token con el payload y la clave privada
    const token = jwt.sign(payload, jwt_private_key, { expiresIn: '1h' });

// Retornar el token generado
    return token;
        } catch (error) {
            throw error;
        }
    }

//RESTABLECER CONTRASEÑA
// // DAO.js


async updatePassword(email, newPassword) {
  try {
    // Buscar al usuario por su correo electrónico y actualizar la contraseña
    const updatedUser = await usersModel.findOneAndUpdate(
      { email: email },
      { password: newPassword },
      { new: true }
    );

    // Verificar si se encontró y actualizó al usuario correctamente
    if (!updatedUser) {
      throw new Error('Usuario no encontrado');
    }

    return updatedUser;
  } catch (error) {
    throw new Error('Error al actualizar la contraseña en la base de datos');
  }
}


  }
  

export default PasswordResetDaoMongo