var osat = [];
var fresh = true;
var osatt;
var posti = false;
var osa;

var tileI = 0;
var tiles = [
  L.tileLayer('https://tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png', {attribution: 'Taustakartta &copy; <a href="https://www.openstreetmap.org/">OpenStreetMapin</a> tekijät | Aluerajat &copy; Helsingin kaupunki'}),
  L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png', {attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Aluerajat &copy; Helsingin kaupunki'}),
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community | Aluerajat &copy; Helsingin kaupunki'}),
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: 'Taustakartta &copy; <a href="https://www.openstreetmap.org/">OpenStreetMapin</a> tekijät &copy; <a href="https://carto.com/attributions">CARTO</a> | Aluerajat &copy; Helsingin kaupunki'})
]

var hesa;

function vaihdaTausta() {
  hesa.removeLayer(tiles[tileI]);
  tileI = (tileI + 1) % tiles.length;
  hesa.addLayer(tiles[tileI]);
}

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
  document.getElementById('oikeat').innerHTML = '';
  document.getElementById('arvattava').innerHTML = '';
  document.getElementById('vaarat').innerHTML = '';
  if (! fresh){
    hesa.removeLayer(osatt);
  }
}

function nollaaVaarat() {
  osatt.eachLayer(function (ll) {
    if (vaarin.find(e => e === ll.feature.properties.id)){
      ll.setStyle(neutraali);
    }
  })
  vaarin = [];
}


var vaara = {
  "color": "#ff0000",
  "fillOpacity": 0.4,
  "opacity": 0.5,
  "weight": 3
};
var oikea = {
  "color": "#00bb00",
  "fillOpacity": 0.4,
  "opacity": 0.5,
  "weight": 3
};
var neutraali = {
  "color": "#0000ff",
  "fillOpacity": 0,
  "opacity": 0.7,
  "weight": 3
}

function alustaPeli(helosaalueet, gen, part) {
  nollaa();
  document.getElementById('skippinappi').innerHTML = '<button class="nappi" onclick="skip()">ohita</button>';
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
                  document.getElementById('oikeat').innerHTML = 'Olet tiennyt yhden '+ gen +'!';
                } else{
                  document.getElementById('oikeat').innerHTML = 'Olet tiennyt ' + oikeat + ' ' + part + '!';
                }
                if (osa = osat.pop()){
                  document.getElementById('arvattava').innerHTML = osa.nimi_fi + '<br>' + osa.nimi_se;
                } else {
                  document.getElementById('arvattava').innerHTML = 'Voitit pelin!';
                }
                layer.bringToFront()

                layer.setStyle(oikea);
                nollaaVaarat();
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
  osa = osat.pop();
//  if (posti) {
//    document.getElementById('arvattava').innerHTML = osa.tunnus;
//  } else {
    document.getElementById('arvattava').innerHTML = osa.nimi_fi + '<br>' + osa.nimi_se;
//  }
}

function skip() {
  nollaaVaarat();
  osat.unshift(osa);
  osa = osat.pop();
  document.getElementById('arvattava').innerHTML = osa.nimi_fi + '<br>' + osa.nimi_se;
}