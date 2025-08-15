export type RegionProperties = {
  geo_point_2d: { lon: number; lat: number };
  iso3: string | null;
  status: string | null;
  color_code: string | null;
  name: string | null;
  continent: string | null;
  region: string | null;
  iso_3166_1_alpha_2_codes: string | null;
  french_short: string | null;
};

export type RegionPropertiesKey = keyof RegionProperties;
