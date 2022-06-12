window.onload = init;
function init(){


  proj4.defs("EPSG:32640","+proj=utm +zone=40 +datum=WGS84 +units=m +no_defs");
  ol.proj.proj4.register(proj4);

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
      zoom: 6,
      minZoom: 6,
      projection:'EPSG:32640'
    })
  });
  const mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: function(coordinate){return ol.coordinate.format(coordinate,'{x},{y}',2)}
  });
  const PositionControl_4326 = new ol.control.MousePosition({
    coordinateFormat: function(coordinate) {
      return ol.coordinate.toStringHDMS(coordinate,1);
    },
    projection: 'EPSG:4326',
    className: 'ol-mouse-position2',
  });
  const zoomSliderControl = new ol.control.ZoomSlider();
  const zoomToExtentControl = new ol.control.ZoomToExtent({
    extent: ([-90856, 6181148, 1035562, 6859763])
  });


  const map = new ol.Map({
    view: new ol.View({
      //center: ol.proj.fromLonLat([57.80, 58.10]),
      center: [447480,6507730],
      zoom: 7.5,
      maxZoom: 16,
      minZoom: 7.5,
      projection:'EPSG:32640'
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
      zoomToExtentControl,
      PositionControl_4326
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
    source: new ol.source.XYZ({
      url: "http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",
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
  const Muni_ObrGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: './data/vectors/Muni_Obr2.geojson',
      format: new ol.format.GeoJSON()
    }),
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: [204, 255, 230, 0.1]}),
      stroke: new ol.style.Stroke({
        color: 'rgba(0,0,0,0.5)',
        width: 2,
        lineDash: [4, 1, 1, 2],
      })
    }),
    visible: false,
    title: 'Muni_Obr'
  }) 

  const NPGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: './data/vectors/NP.geojson',
      format: new ol.format.GeoJSON()
    }),
    style: new ol.style.Style({
      image: new ol.style.Circle({
        fill: new ol.style.Fill({
          color: [255, 153, 221, 1]
        }),
        radius: 3.5,
        stroke: new ol.style.Stroke({
          color: [0, 0, 0, 1],
          width: 1
        })
      }),
      zindex: 10,
    }),
    visible: false,
    title: 'NP',
    zindex: 10,
  })

  const SubjectGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: './data/vectors/Subject.geojson',
      format: new ol.format.GeoJSON()
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [255, 0, 0, 1],
        width: 4
      }),
      zIndex: 5,
    }),
    zIndex: 5,
    visible: false,
    title: 'Subject',    
  })
  
  const tileDebugLayer = new ol.layer.Tile({
    source: new ol.source.TileDebug(),
    opacity: 0.3,
    visible: false,
    title: 'TileDebugLayer'
  })

  const Alexandrowsky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Alexandrowsky_erosion',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ssc.psu.ru:8080/geoserver/>© iKraken<a/>',
      crossorigin: "anonymous"
    }),
    visible: false,
    title: 'Alex_r',
    crossorigin: "anonymous"
  })



  const Bardymsky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Bardymsky_erosion',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Bardym_r'
  })

  const Berezniki = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Berezniki_Erosion',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      zindex: 1,
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Berezniki_r',
    zindex: 1,
  })
  const Berezovsky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Berezovsky_erosion',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Berezovsky_r'
  })

  const Bsosn = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Bol_Sosnov_erosion',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Bsosn_r'
  })

  const Chaikovsky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Chaikovasky_erosion',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Chaikovsky_r'
  })

  const Chastinsky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Chastinsky_Erosion',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Chastinsky_r'
  })

  const Cherdynsky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Cherdynsky_erosion',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Cherdynsky_r'
  })

  const Chernyshensky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Chernyshen_erosion',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Chernyshensky_r'
  })

  const Chusovskoy = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Chusovskoy_erosion',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Chusovskoy_r'
  })

  const Dobryansky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: '	webapps:Dobryansky_erosion',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Dobryansky_r'
  })

  const Elovsky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: '	webapps:Elovsky_erosion',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Elovsky_r'
  })

  const Gaynsky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: '	webapps:Gaynsky_erosion',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Gaynsky_r'
  })

  const Ilyinsky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Ilyinsky_erosion',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Ilyinsky_r'
  })

  const Kishert = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Kishert_erosion',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Kishert_r'
  })

  const Kochevsky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Kochevsky_er',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Kochevsky_r'
  })

  const Kosinsky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Kosinsky_er',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Kosinsky_r'
  })

  const Krasnok = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Krasnok_er',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Krasnokamsky_r'
  })

  const Krasnovishesk = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Krasnovishesk_erosion',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Krasnovishersky_r'
  })

  const Kydimkar = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: '	webapps:Kydimkar_er2',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Kydimkar_r'
  })

  const Kyeda = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: '	webapps:Kyeda_er',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Kyeda_r'
  })

  const Kyngur = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Kyngur_er',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Kyngur_r'
  })

  const Lysva = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Lysva_er',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Lysva_r'
  })

  const Nytva = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Nytva_er',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Nytva_r'
  })

  const Ochorsky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Ochorsky_er',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Ochor_r'
  })

  const Okhansky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Okhansky_er',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Okhansky_r'
  })

  const Oktyabr = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Oktyabr_er',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Octyabr_r'
  })

  const Ordynsky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Ordynsky_r',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Octyabr_r'
  })

  const Osinsky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Osinsky_er',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Osinsky_r'
  })

  const PermArea = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:PermArea_er',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'PermArea_r'
  })

  const Sivinsky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Sivinsky_er',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Sivinsky_r'
  })

  const Solikamsky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Solikamsky_er',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Solikamsky_r'
  })

  const Syksynsky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Syksynsky_er',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Syksynsky_r'
  })

  const Urlinsky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Urlinsky_er',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Urlinsky_r'
  })

  const Yinsky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Yinsky_er',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Uinsky_r'
  })

  const Ysolsky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Ysolsky_er',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Usolsky_r'
  })

  const Ysvinsky = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Ysvinsky_er',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Usvinsky_r'
  })

  const cityperm = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:cityperm_erosion',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'City_Perm_r'
  })

  const gornozav = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:gornozav_erosion',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Gornozavodsky_r'
  })

  const gremyach = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:gremyach_erosion',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Gremyachinsky_r'
  })

  const gybakha = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:gybakha_erosion',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Gybakha_r'
  })

  const karagay = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:karagay_erosion',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Karagay_r'
  })

  const kyzel = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:kyzel_er',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Kyzel_r'
  })

  const vereshag = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:vereshag_er',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Vereshaginsky_r'
  })

  const Agro = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ogs.psu.ru:8080/geoserver/webapps/wms/",
      params:{
        LAYERS: 'webapps:Agrar_Land',
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Agrar'
  })



  const Thematic_Group = new ol.layer.Group({
    layers: [
      Alexandrowsky,Bardymsky,Berezniki,Berezovsky,Bsosn,Chaikovsky,Chastinsky,Cherdynsky,Chernyshensky,Chusovskoy,
      Dobryansky, Elovsky,Gaynsky, Ilyinsky,Kishert, Kochevsky,Kosinsky,Krasnok,Krasnovishesk, Kydimkar, Kyeda, Kyngur,
      Lysva, Nytva, Ochorsky,Okhansky,Oktyabr,Ordynsky, Osinsky, PermArea, Sivinsky, Solikamsky, Syksynsky, Urlinsky,Yinsky,
      Ysolsky, Ysvinsky, cityperm, gornozav, gremyach, gybakha, karagay, kyzel, vereshag
    ]
  })
  map.addLayer(Thematic_Group);

  const layerGroup = new ol.layer.Group({
    layers: [
      Muni_ObrGeoJSON,tileDebugLayer,NPGeoJSON, SubjectGeoJSON, Agro
    ]
  })
  map.addLayer(layerGroup);



    // Layer Switcher Logic for Thematic Layers
    const layerElements = document.querySelectorAll('.sidebar > input[type=checkbox]')
    
    // Initialize checkboxes (set to unchecked)
    for (var layerElement of layerElements) {
      layerElement.checked = false;
      if(layerElement.value === 'Muni_Obr'){
          layerElement.checked = true;
      }
      if(layerElement.value === 'NP'){
        layerElement.checked = true;
    }
    if(layerElement.value === 'Subject'){
      layerElement.checked = true;
  }
  
    
    }
    Muni_ObrGeoJSON.setVisible(true);
    NPGeoJSON.setVisible(true); 
    SubjectGeoJSON.setVisible(true);

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

    const Thematic_Elements = document.querySelectorAll('.m3')
    //Thematic_Elements.checked = true;
    for(let T1 of Thematic_Elements){
      T1.addEventListener('change', function(){
        let ElementValue = this.value;
        let bLayer;
        Thematic_Group.getLayers().forEach(function(element, index, array){
          if(ElementValue === element.get('title') ){
            bLayer = element;
            element.setVisible(true)            
          }
          else{ element.setVisible(false)}   
        })
      })
    }

  const dragPanInteraction = new ol.interaction.DragPan;
  map.addInteraction(dragPanInteraction);
  const dragRotateInteraction = new ol.interaction.DragRotate({
    condition: ol.events.condition.altKeyOnly
  })
  map.addInteraction(dragRotateInteraction);


  const overlayContainerElement = document.querySelector('.overlay-container');
  const overlayLayer = new ol.Overlay({
    element: overlayContainerElement
  })
  map.addOverlay(overlayLayer);
  const overlayLocalMunObr = document.getElementById('local- Mun_Obr');
  const overlaykat1 = document.getElementById('local- kat1');
  const overlaykat2 = document.getElementById('local- kat2');
  const overlaykat3 = document.getElementById('local- kat3');
  const overlaykat4 = document.getElementById('local- kat4');
  const overlaykat5 = document.getElementById('local- kat5');

    map.on('click', function(e){
    overlayLayer.setPosition(undefined);
    map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
      let clickedCoordinate = e.coordinate;
      let clickedMunObr = feature.get('REGOIN_2');
      let clicedKat1 = feature.get('kat1')
      let clicedKat2 = feature.get('kat2')
      let clicedKat3 = feature.get('kat3')
      let clicedKat4 = feature.get('kat4')
      let clicedKat5 = feature.get('kat5')

        overlayLayer.setPosition(clickedCoordinate);
        overlayLocalMunObr.innerHTML = 'Муниципальное образование: ' + clickedMunObr;
        overlaykat1.innerHTML = 'Первая степень опасности: ' + clicedKat1 + ' км^2';
        overlaykat2.innerHTML = 'Вторая степень опасности: ' + clicedKat2 + ' км^2';
        overlaykat3.innerHTML = 'Третья степень опасности: ' + clicedKat3 + ' км^2';
        overlaykat4.innerHTML = 'Четвертая степень опасности: ' + clicedKat4 + ' км^2';
        overlaykat5.innerHTML = 'Пятая степень опасности: ' + clicedKat5 + ' км^2';
    },
    {
      layerFilter: function(layerCandidate){
        return layerCandidate.get('title') === 'Muni_Obr'
      }
    })
  })

  document.getElementById('image_on_title').onclick = function(event) {
    window.open('https://admin.permkrai.ru/?', '_blank');
};

  
$(() => {
  $(".main-myButton").click(() => {
      $(".content").slideToggle();
      $(".overlay-container").slideToggle();
  });
});

$(() => {
  $(".main-myButton2").click(() => {
      $(".content").slideToggle();
      $(".main-title-image2").slideToggle();
  });
});

$(() => {
  $(".main-myButton4").click(() => {
      $(".content").slideToggle();
      $(".measurement").slideToggle();
  });
});

document.getElementById("pressme").onclick = function(){
  alert("Измерение длин и площадей рекомендуется проводить через правую кнопку мыши, во избежание конфликта с другими функциями сервиса");
}
document.getElementById("pressme2").onclick = function(){
  alert("Данный веб-сервис предоставляет информацию о пространственном распределении эрозионной опасности на территории муниципальных образований Пермского края. Выберите нужное вам муниципальное образование и на экране отобразится поверхность с распределением эрозии. Также вы можее скачать данные в формате Shape. Изображения могут не загружаться в браузерах Chrome и Edge, если это произошло, предоставьте разрешение для этого сайта для загрузки небезопасного контента. Либо выберите браузер FireFox" 
  );
}
  
  const selectInteraction = new ol.interaction.Select({
    condition: ol.events.condition.singleClick,
    layers: function(layer){
      return [layer.get('title') === 'Muni_Obr',]
    },
    style: new ol.style.Style({ 
      fill: new ol.style.Fill({
        color: [230, 255, 255, 0.8]
      }),
      radius: 12,
      stroke: new ol.style.Stroke({
        color: [0, 138, 230, 1],
        width: 3
      })  
        }),

      });
    
  map.addInteraction(selectInteraction);

  const overlayNPElement = document.querySelector('.overlay-NP');
  const overlayLayerNP = new ol.Overlay({
    element: overlayNPElement
  })
  map.addOverlay(overlayLayerNP);
  const overlayLocalNP = document.getElementById('local - NP');

  map.on('pointermove', function(e){
    overlayLayerNP.setPosition(undefined);
    map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
      let clickedCoordinate = e.coordinate;
      let clickedNP = feature.get('NAME');
        overlayLayerNP.setPosition(clickedCoordinate);
        overlayLocalNP.innerHTML = clickedNP;
    },
    {
      layerFilter: function(layerCandidate){
        return layerCandidate.get('title') === 'NP';
      }
    })
  })
  
    const measuretype = document.querySelectorAll('.measuretype > input[type=radio]')
  measuretype[2].checked = true;
  var mes_Source = new ol.source.Vector();
  var mes_Layer = new ol.layer.Vector({
    source: mes_Source,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new ol.style.Stroke({
        color: '#ffcc33',
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: '#ffcc33'
        })
      })
    })
  });
  map.addLayer(mes_Layer);

  var draw;
  var sketch;
  var measureTooltipElement;
  var measureTooltip;


  var formatLength = function (line) {
    let length = line.getLength();
    let output;
    length2 = length/2;
    if (length2 > 1000) {
      output = (Math.round(length2 / 1000 * 100) / 100 ) + ' ' + 'км';
    } else {
      output = (Math.round(length2)) + ' ' + 'м';
    }
    return output;
  };


  var formatArea = function (polygon) {
    let area = polygon.getArea();
    let output;
    area4 = area/3.5;
    if (area4 > 10000) {
      output = (Math.round(area4 / 1000000 * 100) / 100) + ' ' + 'км<sup>2</sup>';
    } else {
      output = (Math.round(area4 * 100) / 100) + ' ' + 'м<sup>2</sup>';
    }
    return output;
  };


  function addInteraction() {
    let type = (measuretype[1].checked == true ? 'Polygon' : 'LineString');
    if (measuretype[1].checked == true) { type = 'Polygon'; }
    else if (measuretype[0].checked == true) { type = 'LineString'; }
    console.log(type)
    draw = new ol.interaction.Draw({
      source: mes_Source,
      type: type,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.5)'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.5)',
          lineDash: [10, 10],
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.7)'
          }),
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.5)'
          })
        })
      })
    });
    if (measuretype[2].checked == true /*|| measuretype.value == 'clear'*/) {
      map.removeInteraction(draw);
      if (mes_Layer) { mes_Layer.getSource().clear(); }
      if (measureTooltipElement) {
        let elem = document.getElementsByClassName("tooltip tooltip-static");
        for (let i = elem.length - 1; i >= 0; i--) {
          elem[i].remove();
        }
      }
    } else if (measuretype[1].checked == true || measuretype[0].checked == true) {
      map.addInteraction(draw);
      createMeasureTooltip();
      let listener;
      draw.on('drawstart',
        function (evt) {
          sketch = evt.feature;
          let tooltipCoord = evt.coordinate;
          listener = sketch.getGeometry().on('change', function (evt) {
            let geom = evt.target;
            let output;
            if (geom instanceof ol.geom.Polygon) {
              output = formatArea(geom);
              tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof ol.geom.LineString) {
              output = formatLength(geom);
              tooltipCoord = geom.getLastCoordinate();
            }
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tooltipCoord);
          });
        }, this
      );
      draw.on('drawend',
        function () {
          measureTooltipElement.className = 'tooltip tooltip-static';
          measureTooltip.setOffset([0, -7]);
          sketch = null;
          measureTooltipElement = null;
          createMeasureTooltip();
          ol.Observable.unByKey(listener);
        }, this
      );
    }
  }


  function createMeasureTooltip() {
    if (measureTooltipElement) {
      measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'tooltip tooltip-measure';
    measureTooltip = new ol.Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center'
    });
    map.addOverlay(measureTooltip);
  }


  for(let measuretyp of measuretype){
    measuretyp.addEventListener('change', function(){
      map.removeInteraction(draw);
      addInteraction();
    })
  }

  
}
