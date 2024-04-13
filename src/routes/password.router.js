import { Router } from "express";
import {PasswordResetController} from "../controllers/PasswordReset.controller.js";
import { passportCall } from "../middleware/passportCall.js";

const passwordRouter= Router()

const{requestPasswordReset,
 
    updatePassword
    } = new PasswordResetController()


passwordRouter.post("/requestPassword",requestPasswordReset)



passwordRouter.post("/updatePassword", passportCall('jwt'), updatePassword)

export default passwordRouter