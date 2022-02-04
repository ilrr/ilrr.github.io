var divsToGuess = [];
var fresh = true;
var divisionLayer;
var posti = false;
var div;

var espoo_pienalueet = {"features": []};
var espoo_suuralueet = {"features": []};

for (alue of espoo_tilasto.features) {
    if (alue.properties.TYYPPI === "Pienalue") {
        //var a = alue.properties;
        if (alue.properties.nimi_se == null) {
            alue.properties.nimi_se = alue.properties.nimi_fi;
        }
        espoo_pienalueet.features.push(alue);
    }
    if (alue.properties.TYYPPI === "Suuralue") {
        //var a = alue.properties;
        if (alue.properties.nimi_se == null) {
            alue.properties.nimi_se = alue.properties.nimi_fi;
        }
        espoo_suuralueet.features.push(alue);
    }
}


var pks = {"features": espoo.features.concat(kaupunginosat.features).concat(grani.features).concat(vantaa.features)};

var tileI = 0;
var tiles = [
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
    	attribution: 'Taustakartta: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMapin</a> tekijät &copy; <a href="https://carto.com/attributions">CARTO</a> | Aluerajat &copy; Helsingin kaupunki',
    	subdomains: 'abcd',
    	maxZoom: 20
    }),
//  L.tileLayer('https://tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png', {attribution: 'Taustakartta &copy; <a href="https://www.openstreetmap.org/">OpenStreetMapin</a> tekijät | Aluerajat &copy; Helsingin kaupunki'}),
  L.tileLayer('http://a.tile.stamen.com/toner-background/{z}/{x}/{y}{r}.png', {attribution: 'TÄHÄN JOTAIN | Aluerajat &copy; Helsingin kaupunki'}),
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community | Aluerajat &copy; Helsingin kaupunki'}),
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: 'Taustakartta &copy; <a href="https://www.openstreetmap.org/">OpenStreetMapin</a> tekijät &copy; <a href="https://carto.com/attributions">CARTO</a> | Aluerajat &copy; Helsingin kaupunki'})
]

var gameMap;

function vaihdaTausta() {
  gameMap.removeLayer(tiles[tileI]);
  tileI = (tileI + 1) % tiles.length;
  gameMap.addLayer(tiles[tileI]);
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

function resetPoints() {
  oikeat = 0;
  vaarat = 0;
  document.getElementById('oikeat').innerHTML = '';
  document.getElementById('arvattava').innerHTML = '';
  document.getElementById('vaarat').innerHTML = '';
  if (! fresh){
    gameMap.removeLayer(divisionLayer);
  }
}

function resetWrogGuesses() {
  divisionLayer.eachLayer(function (ll) {
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

function newGame(division, gen, part) {
  resetPoints();
  document.getElementById('skippinappi').innerHTML = '<button class="nappi" onclick="skip()">ohita</button>';
  fresh = false;
  divsToGuess = [];
  for (d of division.features) {
    divsToGuess.push({id: d.properties.id, nimi_fi: d.properties.nimi_fi, nimi_se: d.properties.nimi_se});
  }
  shuffle(divsToGuess);
  divisionLayer = L.geoJson(division, {
    style: neutraali
  }).addTo(gameMap);
  divisionLayer.eachLayer(function (layer) {
            layer.on('click', function(ev) {
              if (layer.feature.properties.id == div.id) {
                layer.bindTooltip(div.nimi_fi+"<br>"+div.nimi_se,{permanent: false, direction:"center", opacity:0.5}).openTooltip();
                oikeat += 1;
                if (oikeat == 1){
                  document.getElementById('oikeat').innerHTML = 'Olet tiennyt yhden '+ gen +'!';
                } else{
                  document.getElementById('oikeat').innerHTML = 'Olet tiennyt ' + oikeat + ' ' + part + '!';
                }
                if (div = divsToGuess.pop()){
                  document.getElementById('arvattava').innerHTML = div.nimi_fi + '<br>' + div.nimi_se;
                } else {
                  document.getElementById('arvattava').innerHTML = 'Voitit pelin!';
                }
                layer.bringToFront()

                layer.setStyle(oikea);
                resetWrogGuesses();
                this.redraw();
              }
              else if (divsToGuess.find(e => e.id === layer.feature.properties.id) && !vaarin.includes(layer.feature.properties.id)) {
                layer.setStyle(vaara);
                layer.bringToFront()
                vaarin.push(layer.feature.properties.id);
                vaarat += 1;
                document.getElementById('vaarat').innerHTML = 'Vääriä arvauksia: ' + vaarat;
              }

            ;});

        });
  div = divsToGuess.pop();
//  if (posti) {
//    document.getElementById('arvattava').innerHTML = div.tunnus;
//  } else {
    document.getElementById('arvattava').innerHTML = div.nimi_fi + '<br>' + div.nimi_se;
//  }
}

function skip() {
  resetWrogGuesses();
  divsToGuess.unshift(div);
  div = divsToGuess.pop();
  document.getElementById('arvattava').innerHTML = div.nimi_fi + '<br>' + div.nimi_se;
}

function help_on() {
    document.getElementById("apu").style.display = "block";
}

function help_off() {
  document.getElementById("apu").style.display = "none";
}