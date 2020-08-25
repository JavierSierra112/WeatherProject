const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) { //solicitud de obtencion de pagina a partir del directorio raiz, parametros request y response
  res.sendFile(__dirname + "/index.html"); // a partir de la solicitud de pagina cargar una archivo html. _dirname busca en todos los archivos a partir de la ruta raiz
});

app.post("/", function (req, res) { // solicitud de peticion del servidor a la pagina
  const query = req.body.cityName; // valor provisto a partir del elemento con caracteristica name:cityName en el html y leido por el servidor a partir de req.body
  const apiKey = ""; //clave API generada a partir del sitio web openweathermap
  const unit = "metric";
  const URL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit; // API endPoint

  https.get(URL, function (response) { //solicitud a la pagina de la API
    console.log(response.statusCode);

    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;

      const description = weatherData.weather[0].description;

      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write(
        "<h1>la temperatura en "+query+" es de " + temp + " grados Celcius.</h1>"
      );
      res.write("<p>el clima actualemnte es " + description + "</p>");
      res.write("<img src=" + imageURL + ">");
      res.send();
    });
  });
});

app.listen(3000, function () {
  console.log("Server running on port 3000");
});
