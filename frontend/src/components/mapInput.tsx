// components/LocationInput.tsx

import React, { useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

interface LocationInputProps {
  restaurantLocation: { lat: number, lng: number };
  onLocationSelect: (location: { lat: number, lng: number } | null) => void;
}

const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

const LocationInput: React.FC<LocationInputProps> = ({ restaurantLocation, onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number } | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if( e.latLng){
    const clickedLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
 
    const distance = calculateDistance(clickedLocation, restaurantLocation);

    if (distance <= 10) {
      setSelectedLocation(clickedLocation);
      onLocationSelect(clickedLocation);
    } else {
      alert('Please select a location within 10km radius of the restaurant.');
    }
  }
};

  const calculateDistance = (point1: { lat: number, lng: number }, point2: { lat: number, lng: number }) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = toRadians(point1.lat);
    const φ2 = toRadians(point2.lat);
    const Δφ = toRadians(point2.lat - point1.lat);
    const Δλ = toRadians(point2.lng - point1.lng);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    return distance / 1000; // Convert to kilometers
  };

  const toRadians = (degree: number) => {
    return degree * (Math.PI / 180);
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onClick={handleMapClick}
    >
      {selectedLocation && <Marker position={selectedLocation} />}
    </GoogleMap>
  ) : <></>;
};

export default LocationInput;
