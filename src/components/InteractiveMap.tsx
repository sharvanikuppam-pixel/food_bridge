import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation, Building2, Utensils } from 'lucide-react';
import L from 'leaflet';

interface MapPinItem {
  id: string;
  name: string;
  type: 'donor' | 'ngo';
  address: string;
  lat: number;
  lng: number;
  servings?: number;
  urgency?: string;
}

interface InteractiveMapProps {
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  pins?: MapPinItem[];
  className?: string;
  height?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  centerLat = 12.9716,
  centerLng = 77.5946,
  zoom = 13,
  pins = [],
  className = '',
  height = 'h-72',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: zoom,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([centerLat, centerLng], zoom);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Render pins
    pins.forEach((pin) => {
      const iconHtml =
        pin.type === 'donor'
          ? `<div style="background-color: #22c55e; color: white; width: 32px; height: 32px; rounded: 50%; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 4px 10px rgba(34, 197, 94, 0.4);">🍱</div>`
          : `<div style="background-color: #3b82f6; color: white; width: 32px; height: 32px; rounded: 50%; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 4px 10px rgba(59, 130, 246, 0.4);">🏢</div>`;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-leaflet-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([pin.lat, pin.lng], { icon: customIcon }).addTo(map);

      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px;">
          <h4 style="font-weight: bold; margin: 0; color: #0f172a; font-size: 13px;">${pin.name}</h4>
          <p style="margin: 2px 0 0 0; color: #475569; font-size: 11px;">${pin.address}</p>
          ${pin.servings ? `<p style="margin: 4px 0 0 0; font-weight: 600; color: #16a34a; font-size: 11px;">🍱 ${pin.servings} Servings Available</p>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    // Draw radius circle if center provided
    L.circle([centerLat, centerLng], {
      color: '#22c55e',
      fillColor: '#22c55e',
      fillOpacity: 0.1,
      radius: 4000,
    }).addTo(map);

    return () => {
      // Map cleanup on unmount
    };
  }, [centerLat, centerLng, zoom, pins]);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 ${height} ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Legend Overlay */}
      <div className="absolute top-3 left-3 z-20 bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-xs flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-500 inline-block"></span>
          <span>Donation</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
          <span>NGO Partner</span>
        </div>
      </div>
    </div>
  );
};
