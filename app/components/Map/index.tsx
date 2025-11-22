"use client";

import { LngLatBounds } from "mapbox-gl";
import MapComponent from "../ui/Map";

import "mapbox-gl/dist/mapbox-gl.css";

const Map = () => {
  const markers = [
    {
      title: "Marker 1",
      description: "Description 1",
      longitude: -70.598,
      latitude: -33.415,
      color: "#A1BC98",
    },
    {
      title: "Marker 2",
      description: "Description 2",
      longitude: -70.599,
      latitude: -33.422,
      color: "#AAC4F5",
    },
    {
      title: "Marker 3",
      description: "Description 3",
      longitude: -70.601,
      latitude: -33.414,
      color: "#E9B63B",
    },
    {
      title: "Marker 4",
      description: "Description 4",
      longitude: -70.603,
      latitude: -33.418,
      color: "#B77466",
    },
  ];

  const onChangeBounds = (newBounds: LngLatBounds) => {
    console.log("New bounds:", newBounds);
  };

  return <MapComponent markers={markers} onChangeBounds={onChangeBounds} />;
};

export default Map;
