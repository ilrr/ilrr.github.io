var osat = [];
var fresh = true;
var osatt;
var posti = false;

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

function nollaa() {
  oikeat = 0;
  vaarat = 0;
  document.getElementById('voitit').innerHTML = '';
  document.getElementById('oikeat').innerHTML = '';
  document.getElementById('arvattava').innerHTML = '';
  document.getElementById('vaarat').innerHTML = '';
  if (! fresh){
    hesa.removeLayer(osatt);
  }
}

function alustaPeli(helosaalueet) {
  nollaa();
  fresh = false;
  osat = [];
  for (osa of helosaalueet.features) {
    osat.push({id:osa.properties.id, nimi_fi:osa.properties.nimi_fi, nimi_se:osa.properties.nimi_se});
  }
  shuffle(osat);
  osatt = L.geoJson(helosaalueet, {
    style: neutraali
  }).addTo(hesa);
  osatt.eachLayer(function (layer) {
            layer.on('click', function(ev) {
              if (layer.feature.properties.id == osa.id) {
                layer.bindTooltip(osa.nimi_fi+"<br>"+osa.nimi_se,{permanent: false, direction:"center", opacity:0.5}).openTooltip();
                oikeat += 1;
                if (oikeat == 1){
                  document.getElementById('oikeat').innerHTML = 'Olet tiennyt yhden kaupunginosan!';
                } else{
                  document.getElementById('oikeat').innerHTML = 'Olet tiennyt ' + oikeat + ' kaupunginosaa!';
                }
                if (osa = osat.pop()){
                  document.getElementById('arvattava').innerHTML = osa.nimi_fi + '<br>' + osa.nimi_se;
                } else {
                  document.getElementById('arvattava').innerHTML = 'Voitit pelin!';
                }
                layer.bringToFront()

                layer.setStyle(oikea);
                osatt.eachLayer(function (ll) {
                  if (vaarin.find(e => e === ll.feature.properties.id)){
                    ll.setStyle(neutraali);
                  }
                })
                vaarin = [];
                this.redraw();
              }
              else if (osat.find(e => e.id === layer.feature.properties.id) && !vaarin.includes(layer.feature.properties.id)) {
                layer.setStyle(vaara);
                layer.bringToFront()
                vaarin.push(layer.feature.properties.id);
                vaarat += 1;
                document.getElementById('vaarat').innerHTML = 'Vääriä arvauksia: ' + vaarat;
              }

            ;});
        });
  var osa = osat.pop();
//  if (posti) {
//    document.getElementById('arvattava').innerHTML = osa.tunnus;
//  } else {
    document.getElementById('arvattava').innerHTML = osa.nimi_fi + '<br>' + osa.nimi_se;
//  }
}
