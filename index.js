let map;
let currentLocation = null;

function setCurrentLocationMarker(map, position) {
    new google.maps.Circle({
        strokeColor: '#115EC3',
        strokeOpacity: 0.2,
        strokeWeight: 1,
        fillColor: '#115EC3',
        fillOpacity: 0.2,
        map: map,
        center: position,
        radius: 100
    });

    new google.maps.Marker({
        position: position,
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#115EC3',
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 2,
            scale: 7
        }
    });
}

function initAutocomplete() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            map = new google.maps.Map(document.getElementById("map"), {
                center: currentLocation,
                zoom: 13,
                mapTypeId: "roadmap",
            });

            if (currentLocation) {
                setCurrentLocationMarker(map, currentLocation);
            }

            const input = document.getElementById("pac-input");
            const searchBox = new google.maps.places.SearchBox(input);

            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            map.addListener("bounds_changed", () => {
                searchBox.setBounds(map.getBounds());
            });

            let markers = [];

            searchBox.addListener("places_changed", () => {
                const places = searchBox.getPlaces();

                if (places.length == 0) {
                    return;
                }

                markers.forEach((marker) => {
                    marker.setMap(null);
                });
                markers = [];

                const bounds = new google.maps.LatLngBounds();

                places.forEach((place) => {
                    if (!place.geometry || !place.geometry.location) {
                        console.log("Returned place contains no geometry");
                        return;
                    }

                    const icon = {
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25),
                    };

                    markers.push(
                        new google.maps.Marker({
                            map,
                            icon,
                            title: place.name,
                            position: place.geometry.location,
                        })
                    );

                    if (place.geometry.viewport) {
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                });
                map.fitBounds(bounds);
            });

            const button = document.getElementById("current-location-button");
            if (button) {
                button.addEventListener("click", () => {
                    if (currentLocation) {
                        map.setCenter(currentLocation);
                        map.setZoom(13); // Optional: set zoom level to 13 when moving to current location
                    } else {
                        console.error("Current location is not set.");
                    }
                });
            }

            map.addListener('click', (event) => {
                const latLng = event.latLng;
                const confirmAddMarker = window.confirm("ここにピンを指しますか？");
                if (confirmAddMarker) {
                    new google.maps.Marker({
                        position: latLng,
                        map: map
                    });
                }
            });
        },
        (error) => {
            console.error("Error retrieving location: ", error);
            const fallbackLocation = { lat: -33.8688, lng: 151.2195 };
            map = new google.maps.Map(document.getElementById("map"), {
                center: fallbackLocation,
                zoom: 13,
                mapTypeId: "roadmap",
            });
            setCurrentLocationMarker(map, fallbackLocation);

            const input = document.getElementById("pac-input");
            const searchBox = new google.maps.places.SearchBox(input);

            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            map.addListener("bounds_changed", () => {
                searchBox.setBounds(map.getBounds());
            });

            let markers = [];

            searchBox.addListener("places_changed", () => {
                const places = searchBox.getPlaces();

                if (places.length == 0) {
                    return;
                }

                markers.forEach((marker) => {
                    marker.setMap(null);
                });
                markers = [];

                const bounds = new google.maps.LatLngBounds();

                places.forEach((place) => {
                    if (!place.geometry || !place.geometry.location) {
                        console.log("Returned place contains no geometry");
                        return;
                    }

                    const icon = {
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25),
                    };

                    markers.push(
                        new google.maps.Marker({
                            map,
                            icon,
                            title: place.name,
                            position: place.geometry.location,
                        })
                    );

                    if (place.geometry.viewport) {
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                });
                map.fitBounds(bounds);
            });

            const button = document.getElementById("current-location-button");
            if (button) {
                button.addEventListener("click", () => {
                    if (currentLocation) {
                        map.setCenter(currentLocation);
                        map.setZoom(13); // Optional: set zoom level to 13 when moving to current location
                    } else {
                        console.error("Current location is not set.");
                    }
                });
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        }
    );
}

window.initAutocomplete = initAutocomplete;
