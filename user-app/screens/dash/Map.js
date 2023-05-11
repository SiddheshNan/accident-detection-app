export const map = String.raw`
<!DOCTYPE html>
<html>
<head>
	<title>Leaflet</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="shortcut icon" type="image/x-icon" href="docs/images/favicon.ico" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script>
	<style>
		html, body {
			height: 100%;
			margin: 0;
		}
		#map {
			width: 600px;
			height: 400px;
		}
	</style>
	<style>body { padding: 0; margin: 0; } #map { height: 100%; width: 100vw; }</style>
</head>
<body>
<div id='map'></div>
<script>
	var map = L.map('map').setView([20.882013421080025, 77.7471703424537], 11);
// https://light_all.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2FicmllbC10cmV0dGVsIiwiYSI6ImNrb2RjNWIzYjAwczIyd25yNnUweDNveTkifQ.xRASmGTYm0ieS-FjVrXSjA', {
		maxZoom: 18,
		attribution: '',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(map);

    const markers = [];

    document.addEventListener("message", function(event) {

        const msg = event.data.toString();
    
        if (msg.startsWith("loc")){
            for (let i = 0; i < markers.length; i++) {
                map.removeLayer(marker[i]);
            }
            
            const latlon = msg.substring(3);
    
            const [lat_, lng_] = latlon.split("$");
         
            marker = new L.Marker([parseFloat(lat_), parseFloat(lng_)])
            marker.addTo(map);
            markers.push(marker);

            map.setView([parseFloat(lat_), parseFloat(lng_)], 15);
        }

    }, false);

  

</script>
</body>
</html>
`;
