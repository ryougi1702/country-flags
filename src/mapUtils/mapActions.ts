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
      console.log("Zooming in on country:", matchFeature);
      const coords = matchFeature.get("geo_point_2d");
      if (coords) {
        // const { lon, lat } = coords;

        console.log("Zooming in on coords:", coords);

        const view = map.getView();
        const extent = matchFeature.getGeometry()?.getExtent();
        if (!extent) return;

        // Step 1: Zoom out
        view.animate({
          zoom: 2,
          duration: 1000,
        });

        // Step 2: Listen for features loaded
        const onFeaturesLoaded = () => {
          console.log("Features rendered, zooming in to target");
          // Step 3: Zoom in to target
          view.fit(extent, {
            duration: 2000,
            padding: [10, 10, 10, 10],
            maxZoom: 10,
          });
          map.un("rendercomplete", onFeaturesLoaded); // Clean up listener
        };

        map.on("rendercomplete", onFeaturesLoaded);
      }
    }
  };
}
