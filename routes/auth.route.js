import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { body } from "express-validator";
const router = express.Router();

router.post(
    "/register",
    [
        body("email", "Formato de email incorrecto")
            .trim()
            .isEmail()
            .normalizeEmail(), 
        body("password", "Minimo 6 caracteres").trim().isLength({ min: 6}), //en el body se recibe una propiedad llamada email (el que llega del front)
        body("password", "formato de password incorrecta").custom(
            (value, { req }) => { //el value es el password
                if (value !== req.body.repassword) {
                    throw new Error("No coinciden las contraseñas"); //error personalizado
                }
                return value;
            }
        ), 
    ],     
    register  
                                                                     //ese mail tiene que pasar ciertas validaciones, por ejemplo que sea una email en caso de que no sea deberia fallar (salta em mensaje)
);
router.post("/login", login);

export default router;