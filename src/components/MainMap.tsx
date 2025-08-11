import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Stroke, Style, Fill } from "ol/style";
import CountryHoverOverlay from "./CountryHoverOverlay";

const MainMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map | null>(null);

  const colorMap7 = [
    "#e6194b", // Red
    "#3cb44b", // Green
    "#ffe119", // Yellow
    "#4363d8", // Blue
    "#f58231", // Orange
    "#911eb4", // Purple
    "#46f0f0", // Cyan
  ];

  useEffect(() => {
    if (!mapRef.current) return;

    // Vector layer for countries
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        // For local development, use:
        url: "/ne_50m_admin_0_countries.geojson",
        // url: "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson",
        format: new GeoJSON(),
      }),
      style: (feature) => {
        const mapColorCode: number | null = feature.get("mapcolor7"); // theres mapcolor7, 8, 9, 13

        const fillColor =
          mapColorCode && mapColorCode >= 1 && mapColorCode <= 7
            ? colorMap7[mapColorCode - 1]
            : "rgba(255, 255, 255, 0.8)";

        return new Style({
          fill: new Fill({
            color: fillColor,
          }),
          stroke: new Stroke({
            color: "#333",
            width: 1.5,
          }),
        });
      },
    });

    // Create the map with only the vector layer (no base map)
    const newMap = new Map({
      target: mapRef.current,
      layers: [vectorLayer],
      view: new View({
        center: [0, 0],
        zoom: 2,
        projection: "EPSG:3857", // Web Mercator projection
      }),
    });

    setMap(newMap);

    // Hide tooltip when mouse leaves the map
    // mapRef.current.addEventListener("mouseleave", () => {
    //   tooltipRef.current!.style.display = "none";
    // });

    return () => {
      newMap.setTarget(undefined);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "1000px" }}>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "1000px",
          border: "1px solid #ccc",
          margin: "20px auto",
        }}
      />
      <CountryHoverOverlay map={map} />
    </div>
  );
};

export default MainMap;
