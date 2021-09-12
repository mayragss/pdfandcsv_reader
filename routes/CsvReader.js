let express = require("express"),
  route = express.Router();
let fs = require("fs");
let csv = require("csv-parser");
let formModel = require("../models/Form");


route.get('/forms', (req,res)=>{
    try{
        formModel.find({}, (err, forms)=>{
            if(err) res.send({error: err, message: `Erro ao pesquisar os formulários`});
            res.send({error: null, message: `Formulários encontrados:`, data: forms});
        })
    }catch(error){
        res.send({error: error, message: `Erro ao pesquisar os formulários`});
    }
})

route.get('/guid/:guid', (req,res)=>{
    try{
        formModel.find({Guid:req.params.guid}, (err, form)=>{
            if(err) res.send({error: err, message: `Erro ao pesquisar o formulário`});
            res.send({error: null, message: `Formulário encontrado:`, data: form});
        })
    }catch(error){
        res.send({error: error, message: `Erro ao pesquisa o formulário`});
    }
})

module.exports = route;
