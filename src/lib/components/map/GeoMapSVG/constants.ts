import type { GeoGeometryObjects } from 'd3';
import type { BBox, GeoJsonProperties } from 'geojson';

export interface GeoPathStruct {
    path: string | null;
    type: 'Feature';
    geometry: GeoGeometryObjects;
    id?: number | string | null;
    properties: GeoJsonProperties  ;
    bbox?: BBox | undefined;
}