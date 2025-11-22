"use client";

import { useState } from "react";
import MapBox from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MapComponent = () => {
  const [viewState, setViewState] = useState({
    longitude: -70.6693,
    latitude: -33.4489,
    zoom: 10,
  });

  return (
    <div className="w-80 h-80">
      <MapBox
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken="pk.eyJ1IjoidmljdG9ycGF0byIsImEiOiJja2h3dHdhMW8wM3hwMnFxejJxcXRpNHF3In0.mioBmmIYaiRDBbdyXo36qA"
      />
    </div>
  );
};

export default MapComponent;
