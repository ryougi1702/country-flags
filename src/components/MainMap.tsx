import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Stroke, Style, Fill } from "ol/style";
import CountryHoverOverlay from "./CountryHoverOverlay";
import countryCodeColorMapping from "../mappings/colorCodeHSLMapping";
import colorCodeHSLMapping from "../mappings/colorCodeHSLMapping";
// import { defaults } from "ol/interaction/defaults";
// import DragRotate from "ol/interaction/DragRotate";

const MainMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Vector layer for countries
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        // For local development, use:
        // url: "/ne_50m_admin_0_countries.geojson",
        // more detailed version
        url: "world-administrative-boundaries-10%.json",
        // url: "CNTR_RG_01M_2024_4326_2%.geojson",
        // url: "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson",
        format: new GeoJSON(),
      }),
      style: (feature) => {
        const colorCode = feature.get("color_code");
        const fillColor = colorCodeHSLMapping[colorCode];

        return new Style({
          fill: new Fill({
            color: fillColor,
          }),
          stroke: new Stroke({
            color: "#333",
            width: 1.0,
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
      // interactions: defaults().extend([new DragRotate()]),
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
