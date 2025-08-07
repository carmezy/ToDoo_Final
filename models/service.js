// Importa la librería Mongoose para interactuar con la base de datos MongoDB.
const mongoose = require("mongoose");

// Define el esquema para la colección 'services' en MongoDB, que ahora representará los planes adquiridos por un usuario.
const serviceSchema = new mongoose.Schema({
    planName: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// Modifica la transformación del objeto cuando se convierte a JSON.
// Esto es útil para controlar cómo se ven los datos cuando se envían a través de una API.
serviceSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // Crea una propiedad 'id' que es una versión en string del '_id' de MongoDB.
    returnedObject.id = returnedObject._id.toString();
    // Elimina la propiedad '_id' original para evitar redundancia.
    delete returnedObject._id;
    // Elimina la propiedad '__v' (versión del documento) que usa Mongoose internamente.
    delete returnedObject.__v;
  }
});

// Crea el modelo 'Service' a partir del esquema definido.
// Mongoose usará este modelo para crear, leer, actualizar y eliminar documentos en la colección 'services'.
const Service = mongoose.model("Service", serviceSchema);

// Exporta el modelo para que pueda ser utilizado en otras partes de la aplicación (como en los controladores).
module.exports = Service;