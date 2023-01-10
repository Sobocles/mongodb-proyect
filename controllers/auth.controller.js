import { User } from "../models/User.js"
import jwt from 'jsonwebtoken'

export const register = async(req, res) => {
    const { email, password} = req.body;
    try{
        //alternativa 2 //el modelo es el que tiene la capacidad para invocar metodos por eso va con mayusculas
        let user = await User.findOne({ email }); //buscamos primero al usuario atraves del email en nuestra base de datos
        if (user) throw { code: 11000 }; //si es que existe este usuario quiere decir que esta repetido por lo que se arroja el error 11000

        user = new User({ email, password });     
        await user.save()

        //jwt token

        return res.status(201).json({ ok: true });
    } catch (error) {
        console.log(error);
        // Alternativa por defecto mongoose
        if (error.code === 11000) {
            return res.status(400).json({ error: "Ya existe este usuario" });
        }
        return res.status(500).json({ error: "Error de servidor" });
    }
};

export const login = async(req, res) => {
    try{
        const { email , password } = req.body;

        //validacion de que existe el correo electronico
        let user = await User.findOne({ email }); //busca el usuario que ingreso el cliente en la bd
        if (!user) 
            return res.status(403).json({ error: "No existe este usuario" }); //si no lo encuentra salta el mensaje "No existe este usuario" por lo que usuario no puede logearse porque no se ha registrado

            //Validacion de que la contraseñas coincidan
        const respuestaPassword = await user.comparePassword(password); //se compara la contraseña ingresada por el cliente y la que existe en la bd, si no coinciden le cliente no puede logearse
        if (!respuestaPassword)
            return res.status(403).json({ error: "Contraseña incorrecta" }); //no coincide la contraseña de la bd con la que ingreso el usuario

        //generar el token JWT
        const token = jwt.sign({uid : user.id }, process.env.JWT_SECRET);

        return res.json({ token });
    } catch (error){
        console.log(error)
        return res.status(500).json({ error: "Error de servidor"});
    }
};

