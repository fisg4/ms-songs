const express = require('express');
const crypto = require('crypto');

const router = express.Router();

let songs = [
  {
    "id": "c2bc5007-edb4-47ee-8039-9081a3dcc5a4",
    "title": "La Bachata",
    "artists": ["Manuel Turizo"],
    "genre": "bachata",
    "date": "05/26/2022",
    "lyrics": "Te bloque\u00E9 de insta\r\npero por otra cuenta veo tus historias\r\ntu n\u00FAmero lo borre\r\nno s\u00E9 pa\' qu\u00E9\r\nsi me lo s\u00E9 de memoria.\r\n\r\nMe hiciste da\u00F1o\r\ny as\u00ED te extra\u00F1o\r\ny aunque s\u00E9 que un d\u00EDa te voy a olvidar\r\na\u00FAn no lo hago\r\nes complicado\r\ntodo lo que hicimos\r\nme gusta recordar.\r\n\r\nAndo manejando por las calles que me besaste\r\noyendo las canciones que un d\u00EDa me dedicaste\r\nte dir\u00EDa que volvieras \r\npero eso no se pide\r\nmejor le pido a Dios que me cuide.\r\n\r\nPorque ando manejando por las calles que me besaste\r\noyendo las canciones que un d\u00EDa me dedicaste\r\nte dir\u00EDa que volvieras \r\npero eso no se pide\r\nmejor le pido a Dios que me cuide.\r\n\r\nQue me cuide otra que se parezca a ti\r\nno quiero caer como hice por ti\r\nojal\u00E1 te enamores\r\nte hagan lo mismo que me hiciste a m\u00ED\r\nt\u00FA me ense\u00F1aste a no amar a cualquiera\r\ny tambi\u00E9n como no quiero que me quieran.\r\n\r\nNo, \u00E9ramos tres en una relaci\u00F3n de dos\r\nno te perdono\r\np\u00EDdele perd\u00F3n a Dios\r\ndije que te olvide y la verdad es que yo\r\nyo.\r\n\r\nAndo manejando por las calles que me besaste\r\noyendo las canciones que un d\u00EDa me dedicaste\r\nte dir\u00EDa que volvieras \r\npero eso no se pide\r\nmejor le pido a Dios que me cuide.\r\n\r\nPorque ando manejando por las calles que me besaste\r\noyendo las canciones que un d\u00EDa me dedicaste\r\nte dir\u00EDa que volvieras \r\npero eso no se pide\r\nmejor le pido a Dios que me cuide.",
    "url": "https://www.youtube.com/watch?v=TiM_TFpT_DE&ab_channel=MTZManuelTurizo"
  },
  {
    "id": "fd4e9edf-8931-4af0-a4f9-2a82208ea26b",
    "title": "Duki: Bzrp Music Sessions, Vol. 50",
    "artists": ["Bizarrap", "Duki"],
    "genre": "trap",
    "date": "11/16/2022",
    "lyrics": "",
    "url": "https://www.youtube.com/watch?v=Gzs60iBgd3E&ab_channel=Bizarrap"
  },
  {
    "id": "9095db3b-8ed0-4e25-92ed-d78c0d7ddeca",
    "title": "Hey Mor",
    "artists": ["Ozuna", "Feid"],
    "genre": "reggaeton",
    "date": "10/07/2022",
    "lyrics": "",
    "url": "https://www.youtube.com/watch?v=u8jb8z3zUJM&ab_channel=Ozuna"
  },
  {
    "id": "9e05db06-e565-4bb2-98b4-79ac8cec0f03",
    "title": "Quevedo: Bzrp Music Sessions, Vol. 52",
    "artists": ["Bizarrap", "Quevedo"],
    "genre": "trap",
    "date": "07/06/2022",
    "lyrics": "Llegu\u00E9 al club con el combo\r\nR\u00E1pido la vi lejos\r\nSe pintaba los labios\r\nY la copa como espejo\r\nSe acerc\u00F3 poco a poco\r\nY yo queriendo que me baile\r\nLuego me dijo\r\n\"Vamos, que te ense\u00F1o Buenos Aire\'\"\r\nY nos fuimos en una\r\nEmpezamo\' a la una\r\nY con la nota r\u00E1pido\r\nNos dieron las tre\'\r\nPerreamos toda la noche\r\nY nos dormimo\' a las die\'\r\nAndo rez\u00E1ndole a Dios\r\nPa\' repetirlo otra ve\'\r\nY nos fuimos en una\r\nEmpezamo\' a la una\r\nY con la nota r\u00E1pido\r\nNos dieron las tre\'\r\nPerreamos toda la noche\r\nY nos dormimo\' a las diez\r\nAndo rez\u00E1ndole a Dios\r\nPa\' repetirlo otra ve\'\r\nDime, beba\r\nFecha y hora y te paso a buscar\r\nYo le llego adonde los dem\u00E1s\r\nT\u00FA sabes que no le llegan\r\nRuido de botellas de champ\u00E1n\r\nDe las copas al brindar\r\nPero solo escucho c\u00F3mo late\r\nMi coraz\u00F3n cuando veo ese cuerpo \'e escaparate\r\nEl traje combina con la Mercede\' Granate\r\nNo hay otro por m\u00E1s que ellos traten (yeah)\r\nQu\u00E9date\r\nQue las noches sin ti duelen\r\nTengo en la mente las pose\'\r\nY todos los gemido\'\r\nQue ya no quiero nada\r\nQue no sea contigo\r\nQu\u00E9date\r\nQue las noches sin ti due-e-e-e-len\r\nTengo en la mente las pose\'\r\nY todo lo que hicimo\'\r\nQue ya no quiero nada\r\nQue no sea contigo\r\nDale, guacha, suelta (suelta)\r\nVente pa\' Canaria\' sin el equipaje\r\nY sin viaje de vuelta\r\nPor la isla te vo\'a dar una vuelta\r\nBeb\u00E9, solo avisa\r\nEl s\u00E1bado teteo, el domingo misa\r\nEstoy a ver si me garantiza\'\r\nQue te me pegas como quien graba con Biza\r\nY vi salir a las amigas del party\r\nY ella se qued\u00F3\r\nMir\u00E1ndonos a los ojo\'\r\nNo al reloj\r\nY nos fuimos en Uber al apartamento\r\nEn privado me ped\u00EDa que le diera un concierto\r\nLe dije que por meno\' de un beso no canto\r\nY nos fuimos en una\r\nEmpezamo\' a la una\r\nY con la nota r\u00E1pido\r\nNos dieron las tre\'\r\nPerreamos toda la noche\r\nY nos dormimo\' a las die\'\r\nAndo rez\u00E1ndole a Dios\r\nPa\' repetirlo otra ve\'\r\nQu\u00E9date\r\nQue las noches sin ti duelen\r\nTengo en la mente las pose\'\r\nY todos los gemido\'\r\nQue ya no quiero nada\r\nQue no sea contigo\r\nQu\u00E9date\r\nQue las noches sin ti due-e-e-e-len\r\nTengo en la mente las pose\'\r\nY todo lo que hicimo\'\r\nQue ya no quiero nada\r\nQue no sea contigo\r\nBizarrap\r\nQuevedo con el Biza, yeah-yeah-yeah\r\nLPGC, you know",
    "url": "https://www.youtube.com/watch?v=A_g3lMcWVy0&ab_channel=Bizarrap"
  },
  {
    "id": "bd733288-3305-4b29-8c92-c629925fbb3c",
    "title": "DESPECHÁ",
    "artists": ["ROSALÍA"],
    "genre": "reggaeton",
    "date": "08/10/2022",
    "lyrics": "",
    "url": "https://www.youtube.com/watch?v=5g2hT4GmAGU&ab_channel=RosaliaVEVO"
  }
]

router.get('/', function (req, res, next) {
  if (Object.keys(req.query).length === 0)
    res.send(songs);
  else if (req.query.hasOwnProperty("title"))
    next();
  else
    res.sendStatus(404);
});

router.get('/:id', function (req, res, next) {
  const id = req.params.id;
  const result = songs.find(song => {
    return song.id == id;
  });
  if (result)
    res.send(result);
  else
    next();
  
});

/* GET songs by title */
router.get('/', function (req, res, next) {
  const title = req.query.title;
  const result = songs.find(song => {
    return song.title == title;
  });
  if (result)
    res.send(result);
  else
    res.sendStatus(404);
});

router.post('/', function (req, res, next) {
  const song = req.body;
  const newSong = {
    "id": crypto.randomUUID(),
    "title": song.title,
    "artists": song.artists,
    "genre": song.genre,
    "date": song.date,
    "lyrics": typeof song.lyrics !== 'undefined' ? song.lyrics : "",
    "url": typeof song.url !== 'undefined' ? song.url : "",
  }
  songs.push(newSong);
  res.sendStatus(201);
});

router.put('/', function (req, res, next) {
  const song = req.body;
  const result = songs.find(s => {
    return s.id == song.id;
  });
  if (result) {
    if (typeof song.lyrics !== 'undefined')
      result.lyrics = song.lyrics;
    if (typeof song.url !== 'undefined')
      result.url = song.url;
    res.send(result);
  } else {
    res.sendStatus(400);
  }
});

router.delete('/:id', function (req, res, next) {
  const id = req.params.id;
  songs = songs.filter(song => song.id !== id);
  res.sendStatus(204);
});

module.exports = router;
