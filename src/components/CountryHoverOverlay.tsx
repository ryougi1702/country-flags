import { MapBrowserEvent, Overlay, type Map } from "ol";
import { useEffect, useRef, useState } from "react";
import { CountryKeys as cKeys } from "../keys";

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
        setName(
          feature.get(cKeys.ADMIN) || feature.get(cKeys.NAME_LONG) || "Unknown"
        ); // can add options later
        setIsoA2(feature.get(cKeys.ISO_A2) || "");
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

    return () => {
      map.un("pointermove", () => {});
      map.removeOverlay(tooltipOverlay);
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
        {isoA2 && isoA2.length === 2 && (
          <img
            src={`https://flagcdn.com/w40/${isoA2.toLowerCase()}.png`}
            alt={`${name} flag`}
            style={flagStyle}
          />
        )}
        {name}
      </div>
    </>
  );
};

const flagStyle: React.CSSProperties = {
  verticalAlign: "middle",
  marginRight: "6px",
  height: 20,
  border: "1px solid #fff",
  borderRadius: 2,
};

export default CountryHoverOverlay;
