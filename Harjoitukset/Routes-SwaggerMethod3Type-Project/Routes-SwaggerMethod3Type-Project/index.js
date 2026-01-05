/*Tää on kopio Method3:sta, mutta tässä yritetään kuin luoda yhteenvedon useista toiminnasta, jos saisi esim REST toiminnan json kanssa & Eli periaatteessa kaikenlaista multi toimintaa tänne ohjelmaan/harjoitukseen & saa nähdä mitä kaikkea voidaan muodostaa

- lowdb : datan varastointi
- morgan : pyyntojen vastaanotto
- nanoid : tunnuksen/id luomiseen
- cors : alkuperäisen välisen politiikan laatimiseksi.
- dotenv: nollariippuvuusmoduuli, joka lataa ympäristömuuttujan .env tiedoston, ja kokopanon tallentamista koodista erillisissä ympäristössä & ja pitää olla mukana kuin; dotenv.config()

- bodyparser : middleware , saapuvan pyynnön väliohjelmiston käsittelijän edessä, jotta käsittelee req.body-ominaisuutta eli, määrittään methodi/parametrin, että lukaiseen käyttäjän syötön esim. id tai kirjoittaa jotakin tekstiä mikäli jos täsmää datan tietokantaan.
*/
/* LOWDB toiminnasta tässä pieni selitys ohje siihen

Operaatiossa:: yritettään kuin terminaalissa/komento lähteessä antaa jokin komento, että kirjataan jokinlainen muistiinpanno(note) ylös, että uuden (note) jälkeen muodostuu aina uusi id sille. Kuin oma viesti, ja sillä on oma id.

Käynnistä ensin tämä nodejs sovellus pyörimään ensin, ja minkä jälkeen käyttäjä avaa terminaalissa/shell:ssä, mitä tapahtuu pari komentoa.

Tämä kuin luo pienen viestin tai muistion ensimmäisenä, sekä pitää olla tarkana noiden merkien kanssa, ja lopussa pitää määrittää TÄSMÄLLEEN sama portti mikäli käynnistettiin tätä nodejs sovellusta;;
curl --header "Content-Type: application/json" --request POST --data '{"text" : "moi miten meenee?"}' http://localhost:8080/notes/new

Viimeisenä kuin toistettan niitä kaikkia viestejä mitä kirjoitettiin edellisen kommenon mukaan. Koska jokaisen viesti tallentuvat suoraan kohti kuin tietokannan json:lle;;
curl http://localhost:8080/notes

vaihtoehtoisena on avatta uusi ikkuna, ja toistaa tämän json tietokannan datan, mutta lopussa pitää lisätä ( /notes) , koska tälle polulle määritettiin toiminta, että toistaa json sisäisen datan. Kuten;; https://AlertYellowishPhp.zhaotan18x.repl.co/notes

*/

//TÄMÄ ON PÄÄSOVELLUS, MISSÄ LATAUTUU NOI PAKETIT JA YMS OSAT MÄÄRITYKSET
//Lataukset NPM paketit
const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const basicAuth = require("express-basic-auth");

const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

const lowDb = require("lowdb");

const FileSync = require("lowdb/adapters/FileSync")
const bodyParser = require("body-parser")
const { nanoid } = require("nanoid");

//read exist file/folder
const db = lowDb(new FileSync('db.json')); //note of data
const { router } = require("./routes/app");

const app = express();
const PORT = 8080;

//let user write db notes something 
db.defaults({ notes: [] }).write()

dotenv.config();

app.use(morgan("dev"));
app.use(cors());

app.use(express.json());
app.use(bodyParser.json())

//Alku oman ominaisuudet esim. tämän sovelluksen yrityksen nimi, versio ja muu yhteystiedot, avainsanat tai # jostakin kuvauksesta/infosta ja jne.
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
        title: 'Mynthix June 2021',
        termsOfService: "http://swagger.io/terms/",
        version: '1.0.4',
            description: "Mynthix API infot & More about Swagger at [http://swagger.io] (http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/). \n This is sample description, something about the api key `special-key` & `nodejs js`to test the authorization filters.",
        contact: {
              name: "Mynthix Oy",
              url: 'https://Mynthix.net',
              email: 'Mynthix@yahoo.com',
        },
        license: {
          name: 'Apache 2.0',
          url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
      },
		},

//tämän url pitää täsmätä tämän repl.it mukaan, normaalisti se olisi localhost:8080   
		servers: [{
				url: "https://routes-swaggermethod3type-project.zhaotan18x.repl.co/",
        description: "API of the system"
			},
		],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [{
        bearerAuth: [],
      },
    ],
	},
  //määrittys polku methodi menetelmän operaatio, missä tapahtuu /**pälä pälä **/ @swagger toimintoja
	apis: ["./routes/*.js"],
};

//now home page of the swagger & {explorer: true} , tämä on kuin haku palkki, että siinä on boxi että käyttäjä voi syöttää jotakin sinne haku kohteeseen
const specs = swaggerJsDoc(options);
app.use("/", swaggerUI.serve, swaggerUI.setup(specs, { explorer: true } ));

//TODO: before, if put path api-docs will show the swagger app // app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));


//antaa käytää apin, polku session, että luoo jonkinlaisen json luettelon, tämä kuin antaa olemassa olevan tiedston julkaista ja käyttää
app.use("/api", router);

//TODO: Default home page
/*
app.get("/", (req, res) => {
  res.send("Default home page");
});
*/

//Show the notes as inside file of the json, tämän http://polku/notes
app.get('/notes', (req, res) => {
  const data = db.get("notes").value()
  return res.json(data)
})

app.post('/notes/new', (req, res) => {
  const note = req.body
  db.get("notes").push({
    ...note, id: nanoid()
  }).write()
  res.json({ success: true })
})


app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));