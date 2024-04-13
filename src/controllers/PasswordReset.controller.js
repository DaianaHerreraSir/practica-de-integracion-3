import { PasswordDao, UserDao } from '../daos/factory.js';
import { sendMail } from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken'; // Importar jwt para manejar los tokens JWT
import { configObject } from '../config/connectDB.js'; // Importar el objeto de configuración que contiene la clave privada JWT

export class PasswordResetController {
  constructor (){
    this.passResetService = new PasswordDao();
    this.userService= new UserDao()
  }

  // Función para solicitar restablecimiento de contraseña
  requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    console.log("Email del usuario:", email); 
    try {        
      // Generar el token para restablecer la contraseña
      const token = await this.passResetService.generatePasswordResetToken(email);
      
      // Construir la URL para el restablecimiento de contraseña
      const resetPasswordUrl = `http://localhost:8083/updatePassword?token=${token}`;
      console.log("URL para restablecer contraseña:", resetPasswordUrl);
      
      // Crear el mensaje HTML para el correo electrónico
      const html = `<p>Haga clic en el siguiente enlace para restablecer su contraseña:</p>
                    <a href="${resetPasswordUrl}">Restablecer contraseña</a>`;

      // Enviar un correo electrónico con el enlace de restablecimiento de contraseña
      await sendMail(email, 'Restablecimiento de contraseña', html);

      // Enviar respuesta al cliente
      res.status(200).send('Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico. Por favor, revisa tu bandeja de entrada.');
    } catch (error) {
      console.error('Error al solicitar restablecimiento de contraseña:', error);
      res.status(500).send('Error al solicitar restablecimiento de contraseña');
    }
  }

  // Función para restablecer la contraseña
updatePassword = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;
  
    // Agrega un registro de depuración para verificar el valor del correo electrónico
    console.log("Correo electrónico recibido en el controlador:", email, newPassword,confirmPassword);
  
  
  // comprobar que la nueva contraseña no esté vacía
    if (!newPassword) {
      return res.status(400).json({ message: 'La nueva contraseña es requerida' });
    }
  
    if (newPassword.length < 4) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 4 caracteres' });
    }
  
    // confirmar si las contraseñas coinciden
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }
  
    try {
      // Actualiza la contraseña del usuario utilizando el DAO
      const updatedUser = await this.passResetService.updatePassword(email, newPassword);
      console.log("actualizacion", updatedUser);
  
      // Envía un mensaje y un enlce para volver al login
  
      const message = 'Contraseña actualizada correctamente. Haz clic <a href="/login">aquí</a> para volver al login.';
  
      res.status(200).send(message);
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      res.status(500).send('Error al actualizar la contraseña');
    }
  }
  
  
}