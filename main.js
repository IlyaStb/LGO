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
      rotation: 0.5,
      projection:'EPSG:32640'
    })
  });
  const mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: function(coordinate){return ol.coordinate.format(coordinate,'{x},{y}',2)}
  });
  const zoomSliderControl = new ol.control.ZoomSlider();
  const zoomToExtentControl = new ol.control.ZoomToExtent({
    extent: ([540524, 6427642, 555171, 6452748])
    //extent: ([57.68, 58.03, 57.91, 58.16])

  });


  const map = new ol.Map({
    view: new ol.View({
      //center: ol.proj.fromLonLat([57.80, 58.10]),
      //center:[547860,6440180],
      center: [447480,6507730],
      //center:[57.80, 58.10],
      zoom: 7.5,
      maxZoom: 16,
      minZoom: 7.5,
      rotation: 0.5,
      //projection:'EPSG:4326'
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
        color: [204, 255, 230, 0.5]}),
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
      })
    }),
    
    visible: false,
    title: 'NP',

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
      })
    }),
    
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
      attributions: '<a href=http://ssc.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Alex_r'
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
      serverType: 'geoserver',
      attributions: '<a href=http://ogs.psu.ru:8080/geoserver/>© iKraken<a/>'
    }),
    visible: false,
    title: 'Berezniki_r'
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

  const layerGroup = new ol.layer.Group({
    layers: [
      Muni_ObrGeoJSON,tileDebugLayer,NPGeoJSON, SubjectGeoJSON
    ]
  })
  map.addLayer(layerGroup);

  const Thematic_Group = new ol.layer.Group({
    layers: [
      Alexandrowsky,Bardymsky,Berezniki,Berezovsky,Bsosn,Chaikovsky,Chastinsky,Cherdynsky,Chernyshensky,Chusovskoy,
      Dobryansky, Elovsky,Gaynsky, Ilyinsky,Kishert, Kochevsky,Kosinsky,Krasnok,Krasnovishesk, Kydimkar, Kyeda, Kyngur,
      Lysva, Nytva, Ochorsky,Okhansky,Oktyabr,Ordynsky, Osinsky, PermArea, Sivinsky, Solikamsky, Syksynsky, Urlinsky,Yinsky,
      Ysolsky, Ysvinsky, cityperm, gornozav, gremyach, gybakha, karagay, kyzel, vereshag
    ]
  })
  map.addLayer(Thematic_Group);

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

    const Thematic_Elements = document.querySelectorAll('.m3')
    //Thematic_Elements.checked = true;
    for(let T1 of Thematic_Elements){
      T1.addEventListener('change', function(){
        let ElementValue = this.value;
        Thematic_Group.getLayers().forEach(function(element, index, array){
          let LayerName = element.get('title');
          element.setVisible(LayerName === ElementValue)
        })
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
  })

  function showGeogrCoordinates(e){
    const clickedCoordinate = e.coordinate;
    map.addOverlay(popup);
    popup.setPosition(undefined);
    popup.setPosition(clickedCoordinate);
    //console.log(clickedCoordinate);
    const lonlatCoordinate = ol.proj.transform(clickedCoordinate, 'EPSG:32640', 'EPSG:4326');
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
}
