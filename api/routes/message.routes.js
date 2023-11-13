const express = require("express");
const router = express.Router();
const authorize = require("../utils/middlewares/auth.middleware")

//Requerir modelos
const messageSchema = require(`../models/message.model`);

//Obtener todas los mensajes
router.route('/').get(authorize, (req, res, next) => {
    messageSchema.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json(response)
        }
    })
})

//Obtener mensajes por nombre
router.route('message/:name').get(authorize, async (req, res, next) => {
    const { name } = req.params;
	try {
		const messageByName = await messageSchema.find({ name });
		return res.status(200).json(messageByName);
	} catch (err) {
		return next(err);
	}
});

//Obtener mensajes por etiqueta
router.route('/message/:label').get(authorize, async (req, res, next) => {
	const { label } = req.params;
	try {
		const messageByLabel = await messageSchema.find({ label });
		return res.status(200).json(messageByLabel);
	} catch (err) {
		return next(err);
	}
});

//Obtener mensajes por Id
router.route('/message/:id').get(authorize, async (req, res, next) => {
    const { id } = req.params;
	try {
		const messageById = await messageSchema.find({ id });
		return res.status(200).json(messageById);
	} catch (err) {
		return next(err);
	}
});

//Crear nuevo mensaje
router.post('/create', async (req, res, next) => {
    try {
        const newMessage = new messageSchema({
            name: req.body.name,
            email: req.body.email,
            company: req.body.company,
            message: req.body.message,
            label: req.body.label,
            read: req.body.read,
        }, { timestamps: true});

        const createdMessage = await newMessage.save();
        return res.status(201).json(createdMessage);
    } catch (err) {
        return next(err);
    }
});

//Eliminar mensaje por id
router.route('/delete/:id').delete(authorize, async (req, res, next) => {
    try {
        const { id } = req.params;
        const messageDeleted = await messageSchema.findByIdAndDelete(id);
        return res.status(200).json(messageDeleted);
    } catch (err) {
        return next(err);
    }
});

//Editar mensaje por id
router.route('/edit/:id').put(authorize, async (req, res, next) => {
    try {
        const { id } = req.params 
        const messageModify = new messageSchema(req.body) 
        messageModify._id = id 
        const messageUpdated = await messageSchema.findByIdAndUpdate(id , messageModify)
        return res.status(200).json(messageUpdated)
    } catch (err) {
        return next(err)
    }
});

module.exports = router;