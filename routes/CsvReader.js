let express = require("express");
let fs = require("fs");
let csv = require("csv-parser");
let formModel = require("../models/Form");
let nodemailer = require('nodemailer');
let extension = require('../shared/Extension');
const asyncify = require('express-asyncify')
const route = asyncify(express.Router());
const smtpTransport = require('nodemailer-smtp-transport');

async function wait (ms) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, ms)
    });
  }

route.get('/forms', (req, res) => {
    try {
        formModel.find({}, (err, forms) => {
            if (err) res.send({ error: err, message: `Erro ao pesquisar os formulários` });
            res.send({ error: null, message: `Formulários encontrados:`, data: forms });
        })
    } catch (error) {
        res.send({ error: error, message: `Erro ao pesquisar os formulários` });
    }
})

asyncMiddleware = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

route.get('/pdf/:guid', asyncMiddleware( async(req, res) => {
    try {        
        let name = `cv_${Date.now()}.pdf`;
        extension.PdfGenerator(req.params.guid, name, res);
        console.log('name '+name)
        await new Promise(resolve => setTimeout(resolve, 5000));
        res.download(name);
    } catch (error) {
        res.send({ error: error, message: `Erro ao pesquisa o formulário` });
    }
}))

route.get('/:guid', (req, res) => {
    try {
        formModel.findOne({ Guid: req.params.guid }, (err, form) => {
            if (err) res.send({ error: err, message: `Erro ao pesquisar o formulário` });
          console.log(form)
            res.render("form",{form:form})
        })
    } catch (error) {
        res.send({ error: error, message: `Erro ao pesquisar o formulário` });
    }
})

route.put('/:guid', (req, res) => {
    try {
        formModel.findOneAndUpdate({ Guid: req.params.guid }, req.body.form, (err, form) => {
            if (err) res.send({ error: err, message: `Erro ao pesquisar o formulário` });
          console.log(form)
            res.render("form",{form:form})
        })
    } catch (error) {
        res.send({ error: error, message: `Erro ao atualizar o formulário` });
    }
})

route.get('/send/:guid', async (req, res) => {
    try {
        formModel.findOne({ Guid: req.params.guid }, (err, form) => {
            console.log(form.Email)
            if (err) res.send({ error: err, message: `Erro ao pesquisar o formulário` });
            else if(form.Email == null) res.send("Não existe email cadastrado para o formulário")
            else{
                let testAccount = nodemailer.createTestAccount();
    
                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport(smtpTransport({
                   // host: "smtp.ethereal.email",
                    service: "Gmail",
                    host: 'smtp.gmail.com',
                    //port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: "mayrocas14@gmail.com",
                        pass: "Tteam2k19"
                    },
                }));
    
                // send mail with defined transport object
                let mailOptions = transporter.sendMail({
                    from: 'mayrocas14@gmail.com', 
                    to: form.Email,  
                    subject: "Link para o Currículo", 
                    text: ` `,  
                    html: `<b>Clique no link para ver o form</b> <br> <a href="${form.Link}"></a>`,  
                });

                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                console.log("Message sent: %s", info);
    
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                res.send("Email enviado com sucesso")
            })
        }
        })
    } catch (error) {
        res.send({ error: error, message: `Erro ao pesquisa o formulário` });
    }
})

module.exports = route
