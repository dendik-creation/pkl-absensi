"use client";

import { useState, useEffect } from "react";
import {
    MapContainer,
    Marker,
    TileLayer,
    useMapEvents,
    useMap,
    Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getLocalStorage } from "@/Services/additionalService";

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
    workshop_latitude?: number;
    workshop_longitude?: number;
    attendance_mode?: boolean;
};

const MapPicker = ({
    onLocationPicked,
    readonly,
    latitude,
    longitude,
    workshop_latitude,
    workshop_longitude,
    attendance_mode = false,
}: MapPickerProps) => {
    const [position, setPosition] = useState<{
        lat: number;
        lng: number;
    } | null>(null);

    useEffect(() => {
        if (latitude !== undefined && longitude !== undefined) {
            setPosition({ lat: latitude, lng: longitude });
        }
    }, [latitude, longitude]);

    const defaultPosition = {
        lat: getLocalStorage("default_latitude"),
        lng: getLocalStorage("default_longitude"),
    };

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
            center={position || defaultPosition || [0, 0]}
            zoom={attendance_mode ? 13 : 15}
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
            {position && (
                <Marker
                    position={position}
                    icon={L.icon({
                        iconUrl:
                            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                    })}
                >
                    <Popup>Posisi Kamu</Popup>
                </Marker>
            )}
            <LocationMarker />
            <UpdateMapCenter />
            {workshop_latitude !== undefined &&
                workshop_longitude !== undefined &&
                attendance_mode && (
                    <Marker
                        position={{
                            lat: workshop_latitude,
                            lng: workshop_longitude,
                        }}
                        icon={L.icon({
                            iconUrl:
                                "https://assets.dendikcreation.my.id/pkl-absensi/workshop-icon.png",
                            iconSize: [25, 25],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                        })}
                    >
                        <Popup>DuDi</Popup>
                    </Marker>
                )}
        </MapContainer>
    );
};

export default MapPicker;
