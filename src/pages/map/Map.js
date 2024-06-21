import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import Wrapper from "../../components/wrapper/Wrapper";

const Map = () => {
  useEffect(() => {
    const map = L.map("map").setView([21.00321, 105.84774], 11);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    let waypoints = [];
    let markers = [];
    let routingControl = null;

    map.on("click", (e) => {
      const marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
      markers.push(marker);
      waypoints.push(L.latLng(e.latlng.lat, e.latlng.lng));

      if (waypoints.length === 2) {
        if (routingControl) {
          map.removeControl(routingControl);
        }

        routingControl = L.Routing.control({
          waypoints: waypoints,
        }).addTo(map);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        waypoints = [];
        markers.forEach((marker) => {
          map.removeLayer(marker);
        });
        markers = [];

        if (routingControl) {
          map.removeControl(routingControl);
          routingControl = null;
        }
      }
    });

    L.Control.geocoder({
      defaultMarkGeocode: false,
    })
      .on("markgeocode", (e) => {
        // const bbox = e.geocode.bbox;
        // const poly = L.polygon([
        //   bbox.getSouthEast(),
        //   bbox.getNorthEast(),
        //   bbox.getNorthWest(),
        //   bbox.getSouthWest(),
        // ]).addTo(map);
        // map.fitBounds(poly.getBounds());

        const marker = L.marker(e.geocode.center).addTo(map);
        markers.push(marker);
        waypoints.push(e.geocode.center);

        if (waypoints.length === 2) {
          if (routingControl) {
            map.removeControl(routingControl);
          }

          routingControl = L.Routing.control({
            waypoints: waypoints,
          }).addTo(map);
        }
      })
      .addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <Wrapper sologan={"My Schooll 🏩"}>
      <div id="map" style={{ width: "100%", height: "80vh" }} />
    </Wrapper>
  );
};

export default Map;
