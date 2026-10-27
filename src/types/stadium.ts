import type { Feature, FeatureCollection, Point, Geometry } from "geojson";

export type GrassType = "Natural" | "Sintético" | "Híbrido";
export type LeagueDivision = "Série A" | "Série B" | "Outras";

export interface StadiumProperties {
  stadium: string;
  team: string;
  team_badge?: string;
  capacity: number;
  city: string;
  state: string;
  year_opened: number;
  surface?: GrassType;
  division?: LeagueDivision;
  world_cup?: number[]; // [1950, 2014]
  transport?: string;
  dimensions?: string;
  image?: string;
  image_credits?: string;
  image_url?: string;
}

export type StadiumFeature = Feature<Point, StadiumProperties>;
export type StadiumFeatureCollection = FeatureCollection<Point, StadiumProperties>;

export interface StateGeoJsonFeature {
  type: "Feature";
  properties: {
    UF_05: string;
    NOME_UF?: string;
    sigla?: string;
    nome?: string;
    [key: string]: unknown;
  };
  geometry: Geometry;
}

export interface StadiumFilterState {
  search: string;
  state: string;
  minCapacity: number;
  surface: string; // "" | "Natural" | "Sintético" | "Híbrido"
  division: string; // "" | "Série A" | "Série B" | "Outras"
  onlyWorldCup: boolean;
}

export interface StadiumWeather {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  isDay: boolean;
  description: string;
}
