import { useEffect, useRef } from "react";
import MapOL from "ol/Map";
import View from "ol/View";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Stroke, Style, Fill } from "ol/style";
import Overlay from "ol/Overlay";
import { CountryKeys as cKeys } from "./keys";

const MainMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current || !tooltipRef.current) return;

    // Vector layer for countries
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        // For local development, use:
        url: "/ne_50m_admin_0_countries.geojson",
        // url: "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson",
        format: new GeoJSON(),
      }),
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255)",
        }),
        stroke: new Stroke({
          color: "#333",
          width: 1.5,
        }),
      }),
    });

    // Tooltip overlay
    const tooltipOverlay = new Overlay({
      element: tooltipRef.current,
      offset: [10, 0],
      positioning: "bottom-left",
      stopEvent: false,
    });

    // Create the map with only the vector layer (no base map)
    const map = new MapOL({
      target: mapRef.current,
      layers: [vectorLayer],
      view: new View({
        center: [0, 0],
        zoom: 2,
        projection: "EPSG:3857", // Web Mercator projection
      }),
      overlays: [tooltipOverlay],
    });

    // Show country name and flag on hover
    map.on("pointermove", function (evt) {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (feat) => feat);
      if (feature) {
        const name =
          feature.get(cKeys.ADMIN) || feature.get(cKeys.NAME_LONG) || "Unknown";
        const isoA2: string = feature.get(cKeys.ISO_A2) || "";
        let flagImg = "";
        if (isoA2 && isoA2.length === 2) {
          flagImg = `<img src="https://flagcdn.com/w40/${isoA2.toLowerCase()}.png" alt="${name} flag" 
          style="vertical-align:middle;margin-right:6px;height:20px;border:1px solid #fff;border-radius:2px;" />`;
        }
        tooltipRef.current!.style.display = "block";
        tooltipRef.current!.innerHTML = `${flagImg}${name}`;
        tooltipOverlay.setPosition(evt.coordinate);
      } else {
        tooltipRef.current!.style.display = "none";
      }
    });

    // Hide tooltip when mouse leaves the map
    mapRef.current.addEventListener("mouseleave", () => {
      tooltipRef.current!.style.display = "none";
    });

    return () => {
      map.setTarget(undefined);
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
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          pointerEvents: "none",
          background: "rgba(0,0,0,0.7)",
          color: "#fff",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "14px",
          whiteSpace: "nowrap",
          display: "none",
          zIndex: 10,
        }}
      />
    </div>
  );
};

export default MainMap;
