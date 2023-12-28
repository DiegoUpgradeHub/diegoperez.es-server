const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const userSchema = require("../models/user.model");
const authorize = require("../utils/middlewares/auth.middleware")
const { check, validationResult } = require('express-validator');

// Sign-up
router.post("/register-user",
    [
        check('name')
            .not()
            .isEmpty()
            .isLength({ min: 3 })
            .withMessage('El nombre debe tener al menos 3 caracteres.'),
        check('email', 'Email is required')
            .not()
            .isEmpty(),
        check('password', 'Contraseña debe contener de 5 a 8 caracteres.')
            .not()
            .isEmpty()
            .isLength({ min: 5, max: 8 })
    ],
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).jsonp(errors.array());
        }
        else {
            bcrypt.hash(req.body.password, 10).then((hash) => {
                const user = new userSchema({
                    name: req.body.name,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hash,
                    phone: req.body.phone,
                    company: req.body.company,
                    brand: req.body.brand,
                    role: req.body.role,
                    startDate: req.body.startDate,
                });
                user.save().then((response) => {
                    res.status(201).json({
                        message: "¡Usuario creado con éxito!",
                        result: response
                    });
                }).catch(error => {
                    res.status(500).json({
                        error: error
                    });
                });
            });
        }
    });


// Sign-in
router.post("/signin", (req, res, next) => {
    let getUser;
    userSchema.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: "Fallo en el usuario."
            });
        }
        getUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(response => {
        if (!response) {
            return res.status(401).json({
                message: "Fallo en la respuesta."
            });
        }
        let jwtToken = jwt.sign({
            email: getUser.email,
            userId: getUser._id
        }, "longer-secret-is-better", {
            expiresIn: "1h"
        });
        res.status(200).json({
            token: jwtToken,
            expiresIn: 28800,
            _id: getUser._id
        });
        
    }).catch(err => {
        return res.status(401).json({
            message: "Fallo en la autentificación."
        });
    });
});

// Get Users.get
router.route('/').get(authorize, (req, res, next) => {
    userSchema.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json(response)
        }
    })
})

// Get Single User
router.route('/user-area/:id').get(authorize, (req, res, next) => {
    userSchema.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json(data)
        }
    })
})

// Update User
router.route('/update-user/:id').put(authorize, (req, res, next) => {
    userSchema.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data)
            console.log('¡Usuario actualizado correctamente!')
        }
    })
})

// Delete User
router.route('/delete-user/:id').delete(authorize, (req, res, next) => {
    userSchema.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data)
            console.log('¡Usuario eliminado correctamente!')
        }
    })
})

module.exports = router;