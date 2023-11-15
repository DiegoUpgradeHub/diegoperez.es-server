const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Definimos el equema de nuestro formulario
let messageSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    company: {
        type: String
    },
    message: {
        type: String
    },
    label: {
        type: String
    },
    read: {
        type: Boolean
    },
    date: {
        type: String
    }
}, {
    collection: 'messages'
})

//Exportamos el esquema
module.exports = mongoose.model('Message', messageSchema);