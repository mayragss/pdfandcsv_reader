let mongoose = require('mongoose');

let formSchema = new mongoose.Schema({
    Nome: String,
    Idade: Number,
    Morada: String,
    Genero: String,
    Instituicao: String,
    Curso: String,
    AnoConclusao: String,
    Status: String,
    Guid: String,
    Email: String,
    Link: String
});

module.exports = mongoose.model("Formulario", formSchema);