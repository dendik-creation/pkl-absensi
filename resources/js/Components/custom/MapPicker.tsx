"use client";

import { useState, useEffect } from "react";
import {
    MapContainer,
    Marker,
    TileLayer,
    useMapEvents,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

type MapPickerProps = {
    onLocationPicked?: (lat: number, lng: number) => void;
    readonly: boolean;
    latitude?: number;
    longitude?: number;
};

const MapPicker = ({
    onLocationPicked,
    readonly,
    latitude,
    longitude,
}: MapPickerProps) => {
    const [position, setPosition] = useState<{
        lat: number;
        lng: number;
    } | null>(null);

    useEffect(() => {
        if (latitude !== undefined && longitude !== undefined) {
            console.log("latitude", latitude);
            console.log("longitude", longitude);
            setPosition({ lat: latitude, lng: longitude });
        }
    }, [latitude, longitude]);

    const LocationMarker = () => {
        useMapEvents({
            click(e: any) {
                if (!readonly) {
                    setPosition(e.latlng);
                    if (onLocationPicked) {
                        onLocationPicked(
                            parseFloat(e.latlng.lat.toFixed(6)),
                            parseFloat(e.latlng.lng.toFixed(6))
                        );
                    }
                }
            },
        });

        return position ? <Marker position={position} /> : null;
    };

    const UpdateMapCenter = () => {
        const map = useMap();
        useEffect(() => {
            if (position) {
                map.setView(position, map.getZoom());
            }
        }, [position, map]);
        return null;
    };

    return (
        <MapContainer
            center={position || { lat: -6.804443, lng: 110.838333 }}
            zoom={15}
            scrollWheelZoom={true}
            style={{
                height: "400px",
                width: "100%",
                borderRadius: "0.5rem",
                zIndex: 9,
            }}
        >
            <TileLayer
                attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
            <UpdateMapCenter />
        </MapContainer>
    );
};

export default MapPicker;
