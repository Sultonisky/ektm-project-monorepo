declare module 'react-native-maps' {
  import * as React from 'react';
  import { ViewProps } from 'react-native';

  export type LatLng = { latitude: number; longitude: number };
  export type Region = { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };

  export const PROVIDER_DEFAULT: 'default';

  export class Marker extends React.Component<{ coordinate: LatLng } & ViewProps> {}
  export class UrlTile extends React.Component<{ urlTemplate: string; maximumZ?: number; flipY?: boolean; zIndex?: number } & ViewProps> {}

  export default class MapView extends React.Component<
    ViewProps & {
      provider?: typeof PROVIDER_DEFAULT;
      initialRegion?: Region;
      onMapReady?: () => void;
      onError?: (e: any) => void;
    }
  > {
    animateCamera(args: { center: LatLng; zoom?: number }, opts?: { duration?: number }): void;
  }
}

declare module 'react-native-geolocation-service' {
  export type GeolocationCoordinates = {
    latitude: number;
    longitude: number;
    altitude?: number | null;
    accuracy?: number | null;
    altitudeAccuracy?: number | null;
    heading?: number | null;
    speed?: number | null;
  };
  export type GeolocationResponse = { coords: GeolocationCoordinates; timestamp: number };
  export type GeolocationError = { code: number; message: string };

  type SuccessFn = (pos: GeolocationResponse) => void;
  type ErrorFn = (err: GeolocationError) => void;

  const Geolocation: {
    getCurrentPosition(success: SuccessFn, error?: ErrorFn, options?: {
      enableHighAccuracy?: boolean;
      timeout?: number;
      maximumAge?: number;
    }): void;
  };
  export default Geolocation;
}


