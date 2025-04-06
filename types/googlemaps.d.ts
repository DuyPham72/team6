declare namespace google.maps {
  class Map {
    constructor(element: HTMLElement, options?: MapOptions);
  }

  interface MapOptions {
    center?: LatLng | LatLngLiteral;
    zoom?: number;
    styles?: MapTypeStyle[];
  }

  interface LatLng {
    lat(): number;
    lng(): number;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface MapTypeStyle {
    featureType?: string;
    elementType?: string;
    stylers?: MapTypeStyler[];
  }

  interface MapTypeStyler {
    color?: string;
    visibility?: string;
    lightness?: number;
    weight?: number;
  }

  class Marker {
    constructor(options?: MarkerOptions);
  }

  interface MarkerOptions {
    position?: LatLng | LatLngLiteral;
    map?: Map;
    title?: string;
    icon?: MarkerIcon;
  }

  interface MarkerIcon {
    url?: string;
    scaledSize?: Size;
  }

  class Size {
    constructor(width: number, height: number);
  }
} 