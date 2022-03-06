window.onload = init;
function init(){
  const scaleLineControl = new ol.control.ScaleLine();
  const fullScreenControl = new ol.control.FullScreen();
  const overViewMapControl = new ol.control.OverviewMap({
    collapsed: false,
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()      
      })
    ],
    view: new ol.View({
      zoom: 8,
      minZoom: 8,
      rotation: 0.5
    })
  });
  const mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: function(coordinate){return ol.coordinate.format(coordinate,'{x},{y}',0)}
  });
  const zoomSliderControl = new ol.control.ZoomSlider();
  const zoomToExtentControl = new ol.control.ZoomToExtent({
    extent: ([6411284, 7971111, 6458120, 8004633])
  });


  const map = new ol.Map({
    view: new ol.View({
      center: ol.proj.fromLonLat([57.80, 58.10]),
      zoom: 12,
      maxZoom: 16,
      minZoom: 13,
      rotation: 0.5
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    target: 'js-map',
    keyboardEventTarget: document,
    controls: ol.control.defaults().extend([
      scaleLineControl,
      mousePositionControl,
      overViewMapControl,
      fullScreenControl,
      zoomSliderControl,
      zoomToExtentControl
    ])

  })
  const osmStandard = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: true,
    title: 'OSMStand'        
  })

  const osmHumanitarian = new ol.layer.Tile({
    source: new ol.source.OSM({
      url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
    }),
    visible: false,
    title: 'OSMHuman'
  })

  const bingMapsSAT = new ol.layer.Tile({
    source: new ol.source.BingMaps({
      key: "AoYlbWDVZ83wp0SnRSx6j_y-WJ_5JSAUY0JXs_oRD8WpzSNLaJbFkwzbQoXOc4A5",
      imagerySet: 'Aerial'  
    }),
    visible: false,
    title: 'BingMapsSAT'
  })


  var yaExtent = [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244];
  proj4.defs('EPSG:3395', '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
  ol.proj.proj4.register(proj4);
  ol.proj.get('EPSG:3395').setExtent(yaExtent);

  const yandexMapsStandard = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&lang=ru_RU&v=2.26.0&x={x}&y={y}&z={z}',
      type: 'base',
      attributions: '© Yandex',
      projection: 'EPSG:3395',
      tileGrid: ol.tilegrid.createXYZ({
        extent: yaExtent
      }),
    }),
    visible: false,
    title: 'YandexStand'
  })

  const yandexSAT = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'http://sat0{1-4}.maps.yandex.net/tiles?l=sat&x={x}&y={y}&z={z}',
      attributions: '© Yandex',
      projection: 'EPSG:3395',
      tileGrid: ol.tilegrid.createXYZ({
        extent: yaExtent
      }),
    }),
    visible: false,
    title: 'YandexSAT'
  })
  
  const StamenWatercolorLayer = new ol.layer.Tile({
    source: new ol.source.Stamen({
      layer: "watercolor",
    }),
    visible: false,
    title: 'StamenWatercolor'
  })

  const baseMapsLayerGroup = new ol.layer.Group({
    layers: [
      osmStandard,osmHumanitarian,bingMapsSAT,yandexMapsStandard,
      yandexSAT, StamenWatercolorLayer
    ]
  })
  map.addLayer(baseMapsLayerGroup);
  
  const baseLayerElements = document.querySelectorAll('.sidebar > input[type=radio]')
  baseLayerElements[0].checked = true;
  for(let baseLayerElement of baseLayerElements){
    baseLayerElement.addEventListener('change', function(){
      let baseLayerElementValue = this.value;
      baseMapsLayerGroup.getLayers().forEach(function(element, index, array){
        let baseLayerName = element.get('title');
        element.setVisible(baseLayerName === baseLayerElementValue)
      })
    })
  }
  const forestriesGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: './data/vectors/forest_pln2.geojson',
      format: new ol.format.GeoJSON()
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(240,0,0,0.5)',
        width: 2,
        lineDash: [4, 1, 1, 2],
      })
    }),
    visible: false,
    title: 'Forestries'
  })

  const typesterrGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: './data/vectors/type_terr.geojson',
      format: new ol.format.GeoJSON()
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(240,0,0,0.5)',
        width: 2,
        lineDash: [4, 1, 1, 2],
      })
    }),
    visible: false,
    title: 'Territory'
  })

  const coordinateGrid = new ol.layer.Graticule({
    strokeStyle: new ol.style.Stroke({
      color: 'rgba(255,120,0,0.9)',
      width: 2,
      lineDash: [0.1, 4],
    }),
    showLabels: true,
    targetSize: 120,
    wrapX: false,
    visible: false,
    title: 'Graticule'
  })

  const tileDebugLayer = new ol.layer.Tile({
    source: new ol.source.TileDebug(),
    opacity: 0.3,
    visible: false,
    title: 'TileDebugLayer'
  })

  const layerGroup = new ol.layer.Group({
    layers: [
      forestriesGeoJSON,coordinateGrid,tileDebugLayer,typesterrGeoJSON 
    ]
  })
  map.addLayer(layerGroup);

    // Layer Switcher Logic for Thematic Layers
    const layerElements = document.querySelectorAll('.sidebar > input[type=checkbox]')
    // Initialize checkboxes (set to unchecked)
    for (var layerElement of layerElements) {
      layerElement.checked = false;
    }
    // Switching
    for(let layerElement of layerElements){
      layerElement.addEventListener('change', function(){
        let layerElementValue = this.value;
        let aLayer;
  
        layerGroup.getLayers().forEach(function(element, index, array){
          if(layerElementValue === element.get('title')){
            aLayer = element;
          }
        })
        this.checked ? aLayer.setVisible(true) : aLayer.setVisible(false)
      })
    }


  const dragPanInteraction = new ol.interaction.DragPan;
  map.addInteraction(dragPanInteraction);
  const dragRotateInteraction = new ol.interaction.DragRotate({
    condition: ol.events.condition.altKeyOnly
  })
  map.addInteraction(dragRotateInteraction);

const popupContainerElement = document.getElementById('popup-coordinates');
  const popup = new ol.Overlay({
    element: popupContainerElement,
    positioning: 'top-right'
  })

  function showGeogrCoordinates(e){
    const clickedCoordinate = e.coordinate;
    map.addOverlay(popup);
    popup.setPosition(undefined);
    popup.setPosition(clickedCoordinate);
    //console.log(clickedCoordinate);
    const lonlatCoordinate = ol.proj.toLonLat(clickedCoordinate);
    const outCoordinate = ol.coordinate.toStringHDMS(lonlatCoordinate, 1);
    const pos = outCoordinate.indexOf("N") + 1;
    const latStr = outCoordinate.slice(0, pos);
    const lonStr = outCoordinate.slice(pos);
    const currentZoom = map.getView().getZoom().toFixed(2);
    const htmlText = 'Lat: ' + latStr + '<br>' + 'Lon: ' + lonStr + '<br> zoom: ' + currentZoom;
    popupContainerElement.innerHTML = htmlText;
  }

  function showProjCoordinates(e){
    const clickedCoordinate = e.coordinate;
    map.addOverlay(popup);
    popup.setPosition(undefined);
    popup.setPosition(clickedCoordinate);
    const outCoordinate = ol.coordinate.toStringXY(clickedCoordinate, 0);
    //console.log(outCoordinate);
    //const outCoordinate = ol.coordinate.toStringXY(clickedCoordinate, 0);
    //popupContainerElement.innerHTML = outCoordinate;
    const pos = outCoordinate.indexOf(",") + 1;
    const latStr = outCoordinate.slice(0, pos - 1);
    const lonStr = outCoordinate.slice(pos);
    const currentZoom = map.getView().getZoom().toFixed(2);
    const htmlText = 'X: ' + latStr + '<br>' + 'Y: ' + lonStr + '<br> zoom: ' + currentZoom;
    popupContainerElement.innerHTML = htmlText;
  }
  map.on('click', function(e){
    document.addEventListener('keydown', function(event){
      var keyOn = event.key;
      console.log(keyOn);
      switch(keyOn) {
        case 'Control':
          //console.log(keyOn);
          showGeogrCoordinates(e);
          break;
        case 'Shift':
          //console.log(keyOn);
          showProjCoordinates(e);
          break;
        default:
          map.removeOverlay(popup);
          return;
      }
    })
    map.removeOverlay(popup);
  })

}
