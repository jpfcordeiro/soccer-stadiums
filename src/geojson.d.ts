import type { GeoJsonObject } from "geojson";

declare module "*.geojson" {
  const value: GeoJsonObject;
  export default value;
}
