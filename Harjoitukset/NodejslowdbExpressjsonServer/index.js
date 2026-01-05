/*ohjeet & tutoriaalit;;
https://www.youtube.com/watch?v=SY1RtzoR42g

https://github.com/satansdeer/json-server

Lowdb + ExpressJS | How to Make a JSON Server
*/

/*
Pieni ohje tälle sovellus toiminalle, että kuinka tämä toimii.

HUOM! TODO! tämä harjoitus ei liitty ton nodejs swagger ohjelman kanssa, mutta jotakin strategian toimintoja on tuttuja asioita 

Tää on tooi npm paketin "lowdb" mikäli oli edellisen swagger-routesmehod ohjelman toiminta, mitä lukaisee olemassa olevan json tiedoston. Ja sisältyy muutama paketti, mitä voidaan kuin editoita sitä olemassa sisäisen json tiedoston toiminnan. 

Tässä kehityspalvelimen määrittyksessä on, tärkeimmät muutama kokoonpanno lataukset paketit. Kun terminaalissa annetaan lataus "npm install <package-name>".

TODO - Muutama tärkeät pakeit:

- lowdb : datan varastointi
- morgan : pyyntojen vastaanotto
- nanoid : tunnuksen/id luomiseen
- cors : alkuperäisen välisen politiikan laatimiseksi.

TODO Operaatiossa:: yritettään kuin terminaalissa/komento lähteessä antaa jokin komento, että kirjataan jokinlainen muistiinpanno(note) ylös, että uuden (note) jälkeen muodostuu aina uusi id sille. Kuin oma viesti, ja sillä on oma id.

Käynnistä ensin tämä nodejs sovellus pyörimään ensin, ja minkä jälkeen käyttäjä avaa terminaalissa/shell:ssä, mitä tapahtuu pari komentoa.

Tämä kuin luo pienen viestin tai muistion ensimmäisenä, sekä pitää olla tarkana noiden merkien kanssa, ja lopussa pitää määrittää TÄSMÄLLEEN sama portti mikäli käynnistettiin tätä nodejs sovellusta;; TODO
curl --header "Content-Type: application/json" --request POST --data '{"text" : "moi miten meenee?"}' http://localhost:8080/notes/new

Viimeisenä kuin toistettan niitä kaikkia viestejä mitä kirjoitettiin edellisen kommenon mukaan. Koska jokaisen viesti tallentuvat suoraan kohti kuin tietokannan json:lle;;
curl http://localhost:8080/notes

vaihtoehtoisena on avatta uusi ikkuna, ja toistaa tämän json tietokannan datan, mutta lopussa pitää lisätä ( /notes) , koska tälle polulle määritettiin toiminta, että toistaa json sisäisen datan. Kuten;; https://AlertYellowishPhp.zhaotan18x.repl.co/notes

mikä ihme curl on? o.O TODO
https://www.geeksforgeeks.org/curl-command-in-linux-with-examples/
https://en.wikipedia.org/wiki/Shell_(computing)
*/

//Pääsovellus index.js
const express = require("express")
const cors = require("cors")
const lowDb = require("lowdb")

const FileSync = require("lowdb/adapters/FileSync")
const bodyParser = require("body-parser")
const { nanoid } = require("nanoid")

//read exist file/folder
const db = lowDb(new FileSync('db.json'))

db.defaults({ notes: [] }).write()

const app = express()

app.use(cors())
app.use(bodyParser.json())

const PORT = 8080;

//Show the notes as inside file of the json
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

//uusi
app.get('/notes/:id', (req, res) => {

})

app.listen(PORT, ()=> {
  console.log(`The server is running.. ${PORT}`)
})

