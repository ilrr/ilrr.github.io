var kartta;

const rastiR = 50;

var rastit = [];
var rata = L.layerGroup();
var lcontrol;
var virhe = 0;

function dp(position) {
    virhe = 0;
    for (l of rata.getLayers()) {
        kartta.removeLayer(l);
    }
    rata.clearLayers();
    rata.addLayer(kartta.setView([position.coords.latitude, position.coords.longitude], 14));
    rata.addLayer(L.circle([position.coords.latitude, position.coords.longitude],
        {color: "#bb0000",
        radius: rastiR,
        fill: false}).addTo(kartta));
    alustaRastit([position.coords.latitude, position.coords.longitude], 6, 150, 400);
}

function check(position) {
    let rasti = rastit.shift();
    let dx = latToM(position.coords.latitude - rasti[0]);
    let dy = lonToM(position.coords.longitude - rasti[1], position.coords.latitude);
    let d = Math.round(Math.max(0, Math.sqrt(dx*dx + dy*dy)-10));
    virhe += d;
    document.getElementById('virhe').innerHTML = "Kokonaisvirhe: " + virhe + ", viime rastin virhe: " + d;
    rata.addLayer(L.circle([rasti[0], rasti[1]],
        {color: "#0000bb",
        radius: rastiR,
        fill: false}).addTo(kartta));
    if (document.getElementById("naytaVirhe").checked) {
        rata.addLayer(L.polyline([rasti, [position.coords.latitude, position.coords.longitude]],
            {color: "#0af", weight:1.5}).addTo(kartta));
    }
}

function alustaRastit(s, n, minD, maxD) {
    rastit = [];
    let edRasti = s;
    let a = Math.random() * 2 * Math.PI;
    for (i = 0; i < n; i++) {
        a += (Math.random() - 0.5) * Math.PI;
        let d = Math.random() * (maxD - minD) + minD;
        let x = mToLat( Math.sin(a) * d );
        let y = mToLon( Math.cos(a) * d, s[0]);
        edRasti = [edRasti[0] + x, edRasti[1] + y];
        rastit.push(edRasti);
    }
        piirraRastit(s);
}

function piirraRastit(s) {
    let edRasti = s;
    for (rasti of rastit) {
        console.log(rasti);
        rata.addLayer(L.circle(rasti, {color: "#ff00ff", radius: rastiR, fill:false}).addTo(kartta));
        rata.addLayer(rastivali(edRasti, rasti).addTo(kartta));
        edRasti = rasti;
    }
}

function rastivali(p1, p2) {
    let dLat = p2[0] - p1[0];
    let dLon = p2[1] - p1[1];
    let dx = latToM(dLat);
    let dy = lonToM(dLon, p1[0]);
    let d = Math.sqrt(dx * dx + dy * dy);
    return L.polyline([[p1[0] + mToLat(dx / d * rastiR),
                        p1[1] + mToLon(dy / d * rastiR, p1[0]) ], [
                        p2[0] - mToLat(dx / d * rastiR),
                        p2[1] - mToLon(dy / d * rastiR, p1[0]) ]],
        {color: "#f0f"});
}

function mToLat(m) {
    return m / 111412;
}

function mToLon(m, lat) {
    let a = 111320 * Math.cos(lat/180*Math.PI);
    return m / a;
}

function latToM(lat) {
    return lat * 111412;
}

function lonToM(lon, lat) {
    let a = 111320 * Math.cos(lat/180*Math.PI);
    return lon * a;
}