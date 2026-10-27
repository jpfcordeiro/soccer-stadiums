import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { StadiumFeature } from "../../types/stadium";

interface MapControllerProps {
  selectedStadium: StadiumFeature | null;
}

export const MapController: React.FC<MapControllerProps> = ({ selectedStadium }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedStadium && selectedStadium.geometry.coordinates) {
      const [lng, lat] = selectedStadium.geometry.coordinates;
      map.flyTo([lat, lng], 15, {
        duration: 1.5,
      });
    }
  }, [selectedStadium, map]);

  return null;
};
