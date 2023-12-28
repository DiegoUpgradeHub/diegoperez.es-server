const express = require("express");
const router = express.Router();
const authorize = require("../utils/middlewares/auth.middleware")

//Requerir modelos
const taskSchema = require(`../models/task.model`);

//Obtener todas las tareas
router.route('/').get(authorize, async (req, res, next) => {
    try {
        const tasks = await taskSchema.find().populate('client'); // Populate del campo 'client' con la información del usuario

        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
});

//Obtener tareas por cliente
router.route('/task/:clientName').get(authorize, async (req, res, next) => {
    try {
        const clientName = req.params.clientName;

        const tasksByClient = await taskSchema.aggregate([
            {
                $lookup: {
                    from: 'users', // El nombre de la colección de usuarios
                    localField: 'client', //El nombre del valor en el Schema
                    foreignField: '_id',
                    as: 'clientDetails' //Donde almacenaré el nombre del cliente
                }
            },
            {
                $match: {
                    'clientDetails.name': clientName //Comprobamos el nombre del cliente
                }
            }
        ]);

        res.status(200).json(tasksByClient);
    } catch (error) {
        next(error);
    }
});

//Obtener tareas por Id
router.route('/task/:id').get(authorize, (req, res, next) => {
    taskSchema.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json(data)
        }
    })
})

//Crear nuevo tarea
router.route('/create').post(authorize, async (req, res, next) => {
// router.post('/create', async (req, res, next) => {
    try {
        const newTask = new taskSchema({
            client: req.body.client,
            dateStart: req.body.dateStart,
            dateEnd: req.body.dateEnd,
            description: req.body.description,
        });

        const createdtask = await newTask.save();
        return res.status(201).json(createdtask);
    } catch (err) {
        return next(err);
    }
});

//Eliminar tarea por id
router.route('/delete/:id').delete(authorize, async (req, res, next) => {
    try {
        const { id } = req.params;
        const taskDeleted = await taskSchema.findByIdAndDelete(id);
        return res.status(200).json(taskDeleted);
    } catch (err) {
        return next(err);
    }
});

//Editar tarea por id
router.route('/edit/:id').put(authorize, async (req, res, next) => {
    try {
        const { id } = req.params 
        const taskModify = new taskSchema(req.body) 
        taskModify._id = id 
        const taskUpdated = await taskSchema.findByIdAndUpdate(id , taskModify)
        return res.status(200).json(taskUpdated)
    } catch (err) {
        return next(err)
    }
});

module.exports = router;