import { getCenter } from "ol/extent";
import { toLonLat } from "ol/proj";
import Map from "ol/Map";
import Feature from "ol/Feature";

export function createGoToCountry(
  map: Map,
  geojsonFeatures: Feature[]
): (countryCode: string) => void {
  return (countryCode: string) => {
    console.log("Zooming in on code:", countryCode);
    if (!map) return;
    const matchFeature = geojsonFeatures.find(
      (f) => f.get("iso_3166_1_alpha_2_codes") === countryCode
    );
    if (matchFeature) {
      const coords = matchFeature.get("geo_point_2d");
      if (coords) {
        // const { lon, lat } = coords;

        console.log("Zooming in on coords:", coords);

        const view = map.getView();
        const extent = matchFeature.getGeometry()?.getExtent();
        console.log("Extent is", extent);
        if (!extent) return;

        // create zoom fns
        const zoomInToCountry = () => {
          console.log("Zooming in to target");
          view.fit(extent, {
            duration: 2000,
            padding: [10, 10, 10, 10],
            maxZoom: 10,
          });
        };

        const zoomOut = () => {
          console.log("Zooming out");
          view.animate({
            zoom: 2,
            duration: 1000,
          });
        };

        // Create event handler for detecting when features are loaded after zoom-out
        const onFeaturesLoaded = () => {
          console.log("Features rendered, waiting 2 secs");
          setTimeout(() => zoomInToCountry(), 1400);
        };

        // initiate zoom sequence
        const currZoomLevel = view.getZoom();
        console.log("Current zoom level:", currZoomLevel);
        if (currZoomLevel && currZoomLevel > 2) {
          map.once("rendercomplete", onFeaturesLoaded);
          zoomOut();
        } else {
          zoomInToCountry();
        }
      }
    }
  };
}
