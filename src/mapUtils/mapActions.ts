import { fromLonLat } from "ol/proj";
import Map from "ol/Map";
import Feature from "ol/Feature";

export function createZoomInOn(
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
        const { lon, lat } = coords;

        console.log("Zooming in on coords:", coords);
        const extent = matchFeature.getGeometry()?.getExtent();
        if (extent) {
          console.log("Zooming in on extent:", extent);
          map
            .getView()
            .fit(extent, { duration: 1000, padding: [50, 50, 50, 50] });
          return;
        }

        map.getView().animate({
          center: fromLonLat([lon, lat]),
          zoom: 5,
          duration: 1000,
        });
      }
    }
  };
}
