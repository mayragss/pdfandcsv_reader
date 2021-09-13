let express = require('express'),
    app     = express(),
    methodOverride = require("method-override"),
    bodyParser = require('body-parser'),
    fileUpload = require('express-fileupload'),
    extension = require("./shared/Extension");
let fs = require('fs');
let csv = require('csv-parser');
let mongoose = require('mongoose');
const mongoDev = "mongodb://localhost/csvReader_db";

let asyncHandler = require('./shared/middleware');

app.use(express.static(__dirname + "/public"));

mongoose.connect(
  process.env.MONGOPRD || mongoDev,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, response) {
    if (err) {
      console.log("erro na conex com o banco " + err);
    } else {
      console.log("conex ok");
    }
  }
);

app.use(asyncHandler(async (req, res, next) => {
  next();
}));

mongoose.Promise = global.Promise;

var csvReader = require('./routes/CsvReader');
app.use(fileUpload());

app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const setupGracefulShutdown = (httpServer) => {
  process.on("SIGHUP", () => {
    console.log("SIGHUP happened!");
    httpServer.close(() => {
      console.log("server closed!");
      process.exit(128 + 1);
    });
  });
  process.on("SIGINT", () => {
    console.log("SIGINT happened!");
    httpServer.close(() => {
      console.log("server closed!");
      process.exit(128 + 2);
    });
  });
  process.on("SIGTERM", () => {
    console.log("SIGTERM happened!");
    httpServer.close(() => {
      console.log("server closed!");
      process.exit(128 + 15);
    });
  });
};

app.set("view engine", "ejs");
app.use(methodOverride("_method"));

app.post('/csv', (req, res) => {
  try {
      if (!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).send('Selecione um ficheiro.');
        }
        let sampleFile = req.files.input;
        const results = [];
        var filename = `upload${Date.now()}.csv`;
        sampleFile.mv("./public/uploads/"+filename, function(err) {
          if (err)
            return res.status(500).send(err);
          else{
              fs.createReadStream("./public/uploads/"+filename)
                  .pipe(csv({ separator: ';' }))
                  .on('data', function (data) {
                    results.push(data)
                  })
                  .on('end', function () {
                      //some final operation
                      extension.InsertForm(results, res);
                  });
          }
        });
  } catch (error) {
      console.log('catch '+error)
      res.send({ error: error });
  }
});

app.get('/', (req,res)=>{
  res.render("uploadFile");
})


app.use('/form', csvReader);

var port = process.env.PORT || 2021;
const server = app.listen(port, function () {
  console.log(port, " port");
});
setupGracefulShutdown(server);