var osat = [];

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}


for (osa of helosaalueet.features) {
  osat.push({id:osa.properties.id, nimi_fi:osa.properties.nimi_fi, nimi_se:osa.properties.nimi_se});
}
shuffle(osat);