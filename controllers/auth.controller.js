import { validationResult } from 'express-validator'

export const register = (req, res) => {
    const errors = validationResult(req) //si no es un email va a viajar a traves del request ese mensaje de error y lo vamos a guardar en esa constante
    
    if(!errors.isEmpty()){ //si el usuario ingreso algo erroneo salta el mensaje
        return res.status(400).json({ errors: errors.array() }); 
    }
    console.log(req.body)
    res.json({ ok: true})
}

export const login = (req, res) => {
    res.json({ ok: "login"});
}

