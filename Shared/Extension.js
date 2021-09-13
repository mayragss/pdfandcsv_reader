let formModel = require("../models/Form");
let uuid = require('uuid');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const getStream = require('get-stream');

exports.PdfGenerator = (guid, name, res) =>{
  formModel.findOne({Guid:guid}, (err, form)=>{
    if(err) res.send("Ocorreu um erro ao gerar o PDF "+err);
    else{
      var doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(name));
      doc.font('Times-Roman');
      doc.fontSize(25).text("Currículo", 250, 70);
      doc.fontSize(25).text("Currículo", 250, 70);
      
      // dados pessoais
      doc.fontSize(12).text("Nome: "+form.Nome, 180, 140);
      doc.fontSize(12).text("Idade: "+ form.Idade, 180, 160);
      doc.fontSize(12).text("E-mail: "+ form.Email, 180, 180);
      doc.fontSize(12).text("Morada: "+ form.Morada, 180, 200);
      
      // formação academica
      doc.fontSize(15).text("Formação Academica ", 80, 250);
      doc.fontSize(12).text("Instituição: "+ form.Instituicao, 80, 275);
      doc.fontSize(12).text("Curso: "+ form.Curso, 80, 295);
      doc.fontSize(12).text("Ano de Conclusão: "+ form.AnoConclusao, 350, 295);
      
      doc.end();
      
      const pdfStream = getStream.buffer(doc);

      return pdfStream;
    }
  })
}

exports.InsertForm = (list, res) => {
    console.log('entrou no insertForm')
  if (!list) res.send({error: 'Formulário vazio', data: null});

  const listToSave = [];

  list.forEach((element) => {

let item = JSON.parse(JSON.stringify(element).replace(/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, ""));
let guid = uuid.v1();
    listToSave.push({
      // Dados pessoais
      Nome: item['Nome'],
      Idade: item.Idade,
      Morada: item.Morada,
      Genero: item.Genero,
      Email: item.Email,
      // Formação
      Instituicao: item.Instituicao,
      Curso: item.Curso,
      AnoConclusao: item.AnoConclusao,
      Status: "Criado",
      Guid: guid,
      Link: `/form/${guid}`
    });
  });

  formModel.insertMany(listToSave, (err, formInserted)=>{
      if(err){
          console.log(`Error on insert list ${err}`);
          res.send({error: `Erro ao inserir formulário ${err}`, data:null})
      }else{
          var formWorld = listToSave.length > 1 ? 'Formulários inseridos' : 'Formulario inserido';
         // res.send({error: null, message: `${formWorld} com sucesso`, data:formInserted});
         console.log(formInserted)
         res.render("listGenerated",{forms:formInserted, text:formWorld});
      }
  })
}
