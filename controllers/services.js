const servicesRouter = require("express").Router();
const User = require("../models/user");
const Service = require("../models/service");

servicesRouter.get('/', async (request , response) =>{
   const user = request.user;
   if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' });
   }
   const services = await Service.find({ user: user.id });
   return response.status(200).json(services);
});

servicesRouter.post('/', async (request , response) =>{
    const user = request.user;
    // Esperamos recibir el nombre del plan desde el frontend
    const { planName } = request.body;

    if (!planName) {
        return response.status(400).json({ message: 'planName is required' });
    }

    // Creamos un nuevo documento de Servicio/Plan usando el nuevo modelo
    const newService = new Service({
        planName,
        // isActive y purchaseDate tendrán sus valores por defecto definidos en el modelo
        user: user._id
    });
    const savedService = await newService.save();
    // Asociamos este nuevo servicio/plan con el usuario
    user.services = user.services.concat(savedService._id);
    await user.save();

    return response.status(201).json(savedService);
});

servicesRouter.delete('/:id', async (request , response) =>{
    const user = request.user;
    const serviceIdToDelete = request.params.id; 

    await Service.findByIdAndDelete(serviceIdToDelete);

    user.services = user.services.filter(serviceId => serviceId.toString() !== serviceIdToDelete);

    await user.save();

    return response.sendStatus(204);
});

servicesRouter.patch('/:id', async (request , response) =>{
   // Extraemos los campos que se pueden actualizar del nuevo modelo
   const { isActive, planName } = request.body; 
   const serviceIdToUpdate = request.params.id;

   // Construye un objeto con los campos a actualizar dinámicamente
   const updateFields = {};
   if (isActive !== undefined) { 
       updateFields.isActive = isActive;
   }
   if (planName !== undefined) {
       updateFields.planName = planName;
   }
    // Actualiza el plan con los campos proporcionados
   const updatedService = await Service.findByIdAndUpdate(serviceIdToUpdate, updateFields, { new: true });
   if (!updatedService) {
       return response.status(404).json({ message: 'Plan no encontrado' });
   }
   return response.status(200).json(updatedService); // Devuelve el plan actualizado
});
module.exports= servicesRouter;
