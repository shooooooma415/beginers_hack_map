let map;
let currentLocation = null;

function setCurrentLocationMarker(map, position) {
    // 縁の薄い青丸
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

    // 中央の濃い青丸
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

// 吹き出し（情報ウィンドウ）の内容を作成する関数
function createInfoWindowContent() {
    return `<div class="custom-info">
        <div class="custom-info-item name">
        Tips
        </div>
        <div class="custom-info-item address">
        ここにコメント書く
        </div>
        <div class="custom-info-item google-map">
        <a href="https://www.hinatazaka46.com/s/official/?ima=0000" target="_blank">日向坂46</a>
        </div>
    </div>`;
}

function initAutocomplete() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            // 現在位置の緯度と経度を取得
            currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            // 地図を初期化し、現在位置を中心に設定
            map = new google.maps.Map(
                document.getElementById("map"),
                {
                    center: currentLocation,
                    zoom: 13,
                    mapTypeId: "roadmap",
                }
            );

            // 現在位置にカスタムマーカーを追加
            if (currentLocation) {
                setCurrentLocationMarker(map, currentLocation);
            }

            // Create the search box and link it to the UI element.
            const input = document.getElementById("pac-input");
            const searchBox = new google.maps.places.SearchBox(input);

            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            // Bias the SearchBox results towards current map's viewport.
            map.addListener("bounds_changed", () => {
                searchBox.setBounds(map.getBounds());
            });

            let markers = [];

            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            //検索結果処理
            searchBox.addListener("places_changed", () => {
                const places = searchBox.getPlaces();

                if (places.length == 0) {
                    return;
                }

                // Clear out the old markers.
                markers.forEach((marker) => {
                    marker.setMap(null);
                });
                markers = [];

                // For each place, get the icon, name and location.
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

                    // Create a marker for each place.
                    const marker = new google.maps.Marker({
                        map,
                        icon,
                        title: place.name,
                        position: place.geometry.location,
                    });

                    // 吹き出し（情報ウィンドウ）作成
                    const infoWindow = new google.maps.InfoWindow({
                        content: createInfoWindowContent(),
                        pixelOffset: new google.maps.Size(0, -50)
                    });

                    // マーカーをクリックしたら情報ウィンドウを開く
                    marker.addListener('click', () => {
                        infoWindow.open(map, marker);
                    });

                    if (place.geometry.viewport) {
                        // Only geocodes have viewport.
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                });
                map.fitBounds(bounds);
            });

            // 地図をクリックしてピンを刺す機能
            map.addListener('click', (event) => {
                const latLng = event.latLng;

                // 確認ダイアログを表示
                const confirmPin = window.confirm("ここにピンを指しますか？");
                if (confirmPin) {
                    // 新しいマーカーを作成
                    const newMarker = new google.maps.Marker({
                        position: latLng,
                        map: map,
                    });

                    // 吹き出し（情報ウィンドウ）作成
                    const infoWindow = new google.maps.InfoWindow({
                        content: createInfoWindowContent(),
                        pixelOffset: new google.maps.Size(0, -50)
                    });

                    // マーカーをクリックしたら情報ウィンドウを開く
                    newMarker.addListener('click', () => {
                        infoWindow.open(map, newMarker);
                    });
                }
            });

            // 現在地に移動ボタンのイベントリスナーを追加
            const button = document.getElementById("current-location-button");
            if (button) {
                button.addEventListener("click", () => {
                    if (currentLocation) {
                        map.setCenter(currentLocation);
                    } else {
                        console.error("Current location is not set.");
                    }
                });
            }
        },
        (error) => {
            console.error("Error retrieving location: ", error);
            // エラーが発生した場合のデフォルトの位置
            const fallbackLocation = { lat: -33.8688, lng: 151.2195 };
            map = new google.maps.Map(
                document.getElementById("map"),
                {
                    center: fallbackLocation,
                    zoom: 13,
                    mapTypeId: "roadmap",
                }
            );

            // 現在位置にカスタムマーカーを追加 (デフォルト位置)
            setCurrentLocationMarker(map, fallbackLocation);

            // Create the search box and link it to the UI element.
            const input = document.getElementById("pac-input");////////
            const searchBox = new google.maps.places.SearchBox(input);

            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            // Bias the SearchBox results towards current map's viewport.
            map.addListener("bounds_changed", () => {
                searchBox.setBounds(map.getBounds());
            });

            let markers = [];

            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener("places_changed", () => {
                const places = searchBox.getPlaces();

                if (places.length == 0) {
                    return;
                }

                // Clear out the old markers.
                markers.forEach((marker) => {
                    marker.setMap(null);
                });
                markers = [];

                // For each place, get the icon, name and location.
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

                    // Create a marker for each place.
                    const marker = new google.maps.Marker({
                        map,
                        icon,
                        title: place.name,
                        position: place.geometry.location,
                    });

                    // 吹き出し（情報ウィンドウ）作成
                    const infoWindow = new google.maps.InfoWindow({
                        content: createInfoWindowContent(),
                        pixelOffset: new google.maps.Size(0, -50)
                    });

                    // マーカーをクリックしたら情報ウィンドウを開く
                    marker.addListener('click', () => {
                        infoWindow.open(map, marker);
                    });

                    if (place.geometry.viewport) {
                        // Only geocodes have viewport.
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                });
                map.fitBounds(bounds);
            });

            // 現在地に移動ボタンのイベントリスナーを追加
            const button = document.getElementById("current-location-button");
            if (button) {
                button.addEventListener("click", () => {
                    if (currentLocation) {
                        map.setCenter(currentLocation);
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
