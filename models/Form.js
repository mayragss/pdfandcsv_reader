let mongoose = require('mongoose');

let formSchema = new mongoose.Schema({
    Nome: String,
    Idade: Number,
    Peso: String,
    Status: String,
    Guid: String
});

module.exports = mongoose.model("Formulario", formSchema);