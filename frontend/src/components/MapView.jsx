import { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

const MapView = ({ lat, lng }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!lat || !lng) return;

    // Convert coordinates to OpenLayers format (EPSG:3857)
    const center = fromLonLat([lng, lat]);

    // Create a marker feature
    const marker = new Feature({
      geometry: new Point(center),
    });

    // Style the marker
    marker.setStyle(
      new Style({
        image: new Icon({
          src: 'https://openlayers.org/en/latest/examples/data/icon.png',
          scale: 0.8,
        }),
      })
    );

    // Initialize the map
    const map = new Map({
      target: mapContainerRef.current,
      layers: [
        new TileLayer({
          source: new OSM({
            attributions: [
              '© <a href="https://openrouteservice.org/">OpenRouteService</a>',
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            ],
          }),
        }),
        new VectorLayer({
          source: new VectorSource({
            features: [marker],
          }),
        }),
      ],
      view: new View({
        center: center,
        zoom: 15,
      }),
    });

    mapRef.current = map;

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
      }
    };
  }, [lat, lng]);

  if (!lat || !lng) return <p>No location data provided.</p>;

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: '100%',
        height: '800px',
        position: 'relative',
      }}
    />
  );
};

export default MapView;