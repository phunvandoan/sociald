import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import Wrapper from "../../components/wrapper/Wrapper";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

function Map() {
  return (
    <Wrapper sologan={"My Schooll 🏩"}>
      <MapContainer
        center={[21.00321, 105.84774]}
        zoom={23}
        style={{ height: "80%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[21.00321, 105.84774]}>
          <Popup>Trường Cao Đẳng Nghề back Khoa Hà Nội 🏨</Popup>
        </Marker>
      </MapContainer>
    </Wrapper>
  );
}

export default Map;
