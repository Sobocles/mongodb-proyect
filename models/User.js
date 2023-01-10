import bcryptjs from "bcryptjs";
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        index: { unique: true },
    },
    password:{
        type: String,
        required: true,
    },
});

//ANTES que hagamos la solicitud de guardar se hashea la contraseña
userSchema.pre("save", async function (next){ //antes de que se guarde la contraseña la estamos hasheando
    const user = this; //el usuario con un correo y contraseña

    if(!user.isModified("password")) return next(); //si el usuario  modifica la password no entra al hash solo en el caso de que sea modificado

    try {
        const salt = await bcryptjs.genSalt(10); //cantidad de saltos de la contraseña
        user.password = await bcryptjs.hash(user.password, salt); //se hashea la contraseña del usuario
        next();
    } catch (error) {
        console.log(error);
        throw new Error("Fallo el hash de contraseña");
    }
});

userSchema.methods.comparePassword = async function(candidatePassword){ //candidatePassword es la contraseña que ingresa el cliente y this.password es la que esta en la base de datos, ambas contraseñas deben ser comparadas
    return await bcryptjs.compare(candidatePassword, this.password) //esto retorna un verdadero o un falso
}; //ahora User podra usar ese metodo de comparar password


export const User = mongoose.model("User", userSchema); //user contiene el esquema (se inicializa el modelo)
//el modelo es el que nos da la capacidad de accder a todos los metodos que vienen de mongoose para guardar al usuario