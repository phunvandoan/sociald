import React, { useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";

const Map = () => {
  const [waypoints, setWaypoints] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [routingControl, setRoutingControl] = useState(null);
  const [pointsSelected, setPointsSelected] = useState(false);
  let map = L.map("map").setView([21.00321, 105.84774], 11);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const handleMapClick = (e) => {
    if (pointsSelected) return;

    const marker = L.marker(e.latlng).addTo(map);
    setMarkers([...markers, marker]);
    setWaypoints([...waypoints, L.latLng(e.latlng.lat, e.latlng.lng)]);

    if (waypoints.length === 1) {
      if (routingControl) {
        map.removeControl(routingControl);
      }

      const newRoutingControl = L.Routing.control({
        waypoints: waypoints,
      }).addTo(map);
      setRoutingControl(newRoutingControl);
      setPointsSelected(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setWaypoints([]);
      markers.forEach((marker) => {
        map.removeLayer(marker);
      });
      setMarkers([]);

      if (routingControl) {
        map.removeControl(routingControl);
        setRoutingControl(null);
      }

      setPointsSelected(false);
    }
  };

  // function SearchComponent() {
  //   useMapEvents({
  //     click: handleMapClick,
  //   });

  //   return null;
  // }

  useMemo(() => {
    var geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
    })
      .on("markgeocode", function (e) {
        if (pointsSelected) return; // Do not add more points if already selected

        //   var bbox = e.geocode.bbox;
        //   var poly = L.polygon([
        //     bbox.getSouthEast(),
        //     bbox.getNorthEast(),
        //     bbox.getNorthWest(),
        //     bbox.getSouthWest(),
        //   ]).addTo(map);
        //   map.fitBounds(poly.getBounds());

        var marker = L.marker(e.geocode.center).addTo(map);
        map.setView(e.geocode.center, 16);
        markers.push(marker);
        waypoints.push(e.geocode.center);

        if (waypoints.length === 2) {
          if (routingControl) {
            map.removeControl(routingControl);
          }

          routingControl = L.Routing.control({
            waypoints: waypoints,
          }).addTo(map);
          pointsSelected = true; // Set flag to true once two points are selected
        }
      })
      .addTo(map);
  }, []);

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      {/* <MapContainer
        center={[21.00321, 105.84774]}
        zoom={11}
        style={{ height: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[21.00321, 105.84774]}>
          <Popup>Trường Cao Đẳng Nghề back Khoa Hà Nội 🏨</Popup>
        </Marker>
        <SearchComponent />
      </MapContainer> */}
      <div id="map" onClick={handleMapClick} onKeyDown={handleKeyDown}></div>
    </div>
  );
};

export default Map;
