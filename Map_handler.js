
var baseMapLayer = new ol.layer.Tile({
  source: new ol.source.OSM()
});
var layer = new ol.layer.Tile({
source: new ol.source.OSM()
});
var center = ol.proj.fromLonLat([29.1, 36.6]);
var view = new ol.View({
center: center,
zoom: 12
});
var map = new ol.Map({
  target: 'map',
  view: view,
  layers: [layer]
});

var styles = [];

styles['Çam'] = new ol.style.Style({
  image: new ol.style.Icon({
          anchor: [1, 1],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          scale: 0.1,
    src: '/images/çam.jpg'
  })
});


styles['Kavak'] = new ol.style.Style({
  image: new ol.style.Icon({
      anchor: [1, 1],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          scale: 0.2,
    src: '/images/kavak.jpg'
  })
});

styles['Default'] = new ol.style.Style({
  image: new ol.style.Icon({
      anchor: [1, 1],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          scale: 1.0,
    src: '/images/alpy.jpg'
  })
});


var vectorSource = new ol.source.Vector({
        url:"/api/data",
        format: new ol.format.GeoJSON({ featureProjection: "EPSG:4326" })  
});

var markerVectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: function(feature, resolution){
            var type = feature.getProperties().tree_type;

            if(type == 'Çam'){
              return styles['Çam'];
            }else if(type == 'Kavak'){
              return styles['Kavak'];
            
            }else{
              return styles['Default'];
            }
        }

});




map.addLayer(markerVectorLayer);
var select = new ol.interaction.Select({multiple:false});
select.on('select', fnHandler);
map.addInteraction(select);
map.on("click",handleMapClick);
function handleMapClick(evt)
{
var coord=ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
document.getElementById("Latitude").value=coord[1];
document.getElementById("Longitude").value=coord[0];
}

function fnHandler(e)
{
  var coord = e.mapBrowserEvent.coordinate;
  let features = e.target.getFeatures();
  features.forEach( (feature) => {
      console.log(feature.getProperties().tree_type);
  
  document.getElementById("tree_type").value=feature.getProperties().tree_type;
  document.getElementById("tree_height").value=feature.getProperties().tree_height;
  document.getElementById("tree_age").value=feature.getProperties().tree_age;
  });
  if (e.selected[0])
  {
  var coords=ol.proj.transform(e.selected[0].getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
  document.getElementById("Latitude").value=coords[1];
  document.getElementById("Longitude").value=coords[0];
  console.log(coords);
  }
}

function submit()
{
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/post", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var data=JSON.stringify({

      Latitude: document.getElementById('Latitude').value,
      Longitude: document.getElementById('Longitude').value,
      tree_type: document.getElementById('tree_type').value,
      tree_height: document.getElementById('tree_height').value,
      tree_age: document.getElementById('tree_age').value
  });
  xhr.send(data);
  location.reload();
}
