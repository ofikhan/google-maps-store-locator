window.onload = function(){}

var map;
var markers = [];
var infoWindow;

function initMap() {
    var losangeles = {
        lat: 34.0207305, 
        lng: -118.6919305
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: losangeles,
        zoom: 11,
        mapTypeId: 'roadmap',
        styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#3F0E40'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#3F0E40'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#3F0E40'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#3F0E40'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#3F0E40'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#3F0E40'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#3F0E40'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#3F0E40'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#3F0E40'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#3F0E40'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#3F0E40'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#3F0E40'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#3F0E40'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#3F0E40'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#3F0E40'}]
            }
          ]
    });
    infoWindow = new google.maps.InfoWindow();
    searchStores();
    /*var marker = new google.maps.Marker({
        position: losangeles,
        map: map,
        title: "I'm here"
    });*/
}

function searchStores(){
    var foundStores = [];
    var zipCode = document.getElementById('zip-code-input').nodeValue;
    if(zipCode){
        for(var store of stores){
            var postal = store['address']['postalCode'].substring(0, 5);
            if(postal == zipCode){
                foundStores.push(store);
            }
        }
    } else{
        foundStores = stores;
    }
    clearLocations();
    displayStores(foundStores);
    showStoresMarkeres(foundStores);
    setOnClickListener();
}

function clearLocations(){
    infoWindow.close();
    for(var i=0; i<markers.length; i++){
        markers[i].setMap(null);
    }
    markers.length = 0;
}

function setOnClickListener(){
    var storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function(elem, index){
        elem.addEventListener('click', function(){
            new google.maps.event.trigger(markers[index], 'click');
        })
    })
}

function displayStores(stores){
    var storesHtml = '';
    for(var[index, store] of stores.entries()){
        var address = store['addressLines'];
        var phone = store['phoneNumber'];
        storesHtml += `
            <div class="store-container">
                <div class="store-container-background">
                    <div class="store-info-container">
                        <div class="store-address">
                            <span>${address[0]}</span>
                            <span>${address[1]}</span>
                        </div>
                        <div class="store-phone-number">${phone}</div>
                    </div>
                    <div class="store-number-container">
                        <div class="store-number">${index=1}</div>
                    </div>
                </div>
            </div>    
        `;
        document.querySelector('.stores-list').innerHTML = storesHtml;
    }
}

function showStoresMarkeres(stores){
    var bounds = new google.maps.LatLngBounds();
    for(var [index, store] of stores.entries()){
        var latlng = new google.maps.LatLng(
            store["coordinates"]["latitude"],
            store["coordinates"]["longitude"]);
        var name = store["name"];
        var address = store["addressLines"][0];
        var openStatusText = store["openStatusText"];
        var phoneNumber = store["phoneNumber"];
        bounds.extend(latlng);
        createMarker(latlng, name, address, openStatusText, phoneNumber, index+1);
    }
    map.fitBounds(bounds);
}

function createMarker(latlng, name, address, openStatusText, phoneNumber, index){
    var html = `
        <div class="store-info-window">
            <div class="store-info-name">${name}</div>
            <div class="store-info-status">${openStatusText}</div>
            <div class="store-info-address">
                <div class="circle">
                    <i class="fas fa-location-arrow"></i>
                </div>
                <a href="https://www.google.com/maps/dir/?api=1&origin=Dhaka+Bangladesh&destination=${address}}" target="_blank">${address}</a>
            </div>
            <div class="store-info-phone">
                <div class="circle">
                    <i class="fas fa-phone-alt"></i>
                </div>
                ${phoneNumber}
            </div>
        </div>
    `;
    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        icon: 'store.png',
        label: index.toString()
    });
    google.maps.event.addListener(marker, 'click', function(){
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
    markers.push(marker);
}