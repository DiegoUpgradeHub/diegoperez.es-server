//Requerir paquetes y librerias
const mongoose = require(`mongoose`);

//Conexión con Atlas
const dotenv = require("dotenv");
dotenv.config();
const mongoDb = process.env.MONGO_DB;

//Requerir los modelos
const User = require(`../models/user.model`);

//Creación del listado semilla
const users = [
    {
        name: "Margarita",
        price: 10,
        ingredients: ["Harina de trigo", "Tomate", "Mozzarella", "Basílico"],
        image: "https://www.annarecetasfaciles.com/files/pizza-margarita-1-scaled.jpg",
        category: "Pizzas",
        vegetarian: true,
    },
    {
        name: `Agua con gas`,
        price: 3,
        ingredients: [`agua`],
        image: `https://www.bodecall.com/images/stories/virtuemart/product/agua-vichy-catalan-25-cl.png`,
        category: "Bebidas",
        vegetarian: true,
    }
];
const userDocuments = users.map(user => new User(user));
mongoose.set('strictQuery', true);
mongoose
    .connect(mongoDb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        const allUser = await User.find();
        if (allUser.length) {
        await User.collection.drop();
        }
    })
    .catch((err) => console.log(`Error deleting data: ${err}`))
    .then(async () => {
            await User.insertMany(userDocuments);
        console.log('Database Created')
        })
    .catch((err) => console.log(`Error creating data: ${err}`))
    .finally(() => mongoose.disconnect());