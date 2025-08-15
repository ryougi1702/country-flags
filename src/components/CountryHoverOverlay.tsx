import { MapBrowserEvent, Overlay, type Map } from "ol";
import { useEffect, useRef, useState } from "react";
import type {
  RegionProperties,
  RegionPropertiesKey,
} from "../types/openDataSoft";

function getRegionProperty<T extends RegionPropertiesKey>(
  feature: any,
  key: T
): RegionProperties[T] {
  return feature.get(key);
}

const CountryHoverOverlay = ({ map }: { map: Map | null }) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [name, setName] = useState<string>("");
  const [isoA2, setIsoA2] = useState<string>("");

  useEffect(() => {
    if (!tooltipRef.current || !map) return;

    const tooltipOverlay = new Overlay({
      element: tooltipRef.current,
      offset: [10, 0],
      positioning: "bottom-left",
      stopEvent: false,
    });
    map.addOverlay(tooltipOverlay);

    const pointerMoveHandler = function (
      evt: MapBrowserEvent<KeyboardEvent | WheelEvent | PointerEvent>
    ) {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (feat) => feat);
      if (feature) {
        const name = getRegionProperty(feature, "name") || "Unknown";
        setName(name);
        const isoA2 =
          getRegionProperty(feature, "iso_3166_1_alpha_2_codes") || "";
        setIsoA2(isoA2);

        tooltipOverlay.setPosition(evt.coordinate);
        tooltipRef.current!.style.display = "block";

        // Old Direct DOM Manipulation method
        // let flagImg = "";
        // if (isoA2 && isoA2.length === 2) {
        //   flagImg = `<img src="https://flagcdn.com/w40/${isoA2.toLowerCase()}.png" alt="${name} flag"
        // style="vertical-align:middle;margin-right:6px;height:20px;border:1px solid #fff;border-radius:2px;" />`;
        // }
        // tooltipRef.current!.innerHTML = `${flagImg}${name}`;
      } else {
        tooltipRef.current!.style.display = "none";
      }
    };
    // Show country name and flag on hover
    map.on("pointermove", pointerMoveHandler);
    const mapContainer = map.getTargetElement();
    mapContainer?.addEventListener("mouseleave", () => {
      tooltipRef.current!.style.display = "none";
    });
    return () => {
      map.un("pointermove", () => {});
      map.removeOverlay(tooltipOverlay);
      if (mapContainer) {
        mapContainer.removeEventListener("mouseleave", () => {});
      }
      tooltipRef.current = null; // Clean up the ref
    };
  }, [map]);

  return (
    <>
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
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isoA2 && isoA2.length === 2 && (
            <img
              // see https://flagpedia.net/download/api
              // using h60 (height 60px) here
              src={`https://flagcdn.com/h60/${isoA2.toLowerCase()}.png`}
              alt={`${name} flag`}
              style={flagStyle}
            />
          )}
          {name}
        </div>
      </div>
    </>
  );
};

const flagStyle: React.CSSProperties = {
  verticalAlign: "middle",
  marginRight: "6px",
  height: "60px",
  border: "1px solid #fff",
  borderRadius: 2,
};

export default CountryHoverOverlay;
