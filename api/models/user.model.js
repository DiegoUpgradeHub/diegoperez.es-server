const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

//Definimos el equema de nuestro usuario
let userSchema = new Schema({
    name: {
        type: String
    },
    lastName: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String,
        unique: true //En este campo indicamos que solo puede haber un usuario con un e-mail único
    },
    phone: {
        type: String
    },
    company: {
        type: String
    },
    brand: {
        type: String
    },
    role: {
        type: String
    },
    startDate: {
        type: String
    }
}, {
    collection: 'users'
})

//Le indicamos a través del campo unique en el Schema que nos lo valide gracias al plugin instalado y su mensaje al matchearlo si existiera
userSchema.plugin(uniqueValidator, { message: 'Esta cuenta ya ha sido registrada' });
module.exports = mongoose.model('User', userSchema); //Exportamos el esquema