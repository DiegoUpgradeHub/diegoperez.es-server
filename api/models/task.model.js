const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Definimos el equema de nuestro formulario
let taskSchema = new Schema({
    client: {
        // type: String,
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    dateStart: {
        type: String
    },
    dateEnd: {
        type: String
    },
    description: {
        type: String
    }
}, {
    collection: 'taskSchema'
})

//Exportamos el esquema
module.exports = mongoose.model('Task', taskSchema);