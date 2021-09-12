


let formModel = require("../models/Form");
let uuid = require('uuid');

exports.InsertForm = (list, res) => {
    console.log('entrou no insertForm')
  if (!list) res.send({error: 'Formulário vazio', data: null});

  const listToSave = [];

  list.forEach((element) => {

let item = JSON.parse(JSON.stringify(element).replace(/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, ""));
//console.log(item);
    listToSave.push({
      Idade: item.Idade,
      Peso: item['Peso'],
      Status: "Criado",
      Nome: item['Nome'],
      Guid: uuid.v1()
    });
  });

  formModel.insertMany(listToSave, (err, formInserted)=>{
      if(err){
          console.log(`Error on insert list ${err}`);
          res.send({error: `Erro ao inserir formulário ${err}`, data:null})
      }else{
          var formWorld = listToSave.length > 1 ? 'Formulários inseridos' : 'Formulario inserido';
          res.send({error: null, message: `${formWorld} com sucesso`, data:list});
      }
  })
}
