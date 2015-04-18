
function initialize() {
  var options = {
    types: ['(cities)'],
    componentRestrictions: {country: "us"}
  };

  var input = document.getElementById('city');
  var autocomplete = new google.maps.places.Autocomplete(input, options);

  google.maps.event.addListener(autocomplete, 'place_changed', function () {
      var place = autocomplete.getPlace();
      var lat = place.geometry.location.lat()
      var long = place.geometry.location.lng()
      getAnnualWatts(lat, long);
  });
}


function getAnnualWatts(latitude, longitude){
  var url = "https://developer.nrel.gov/api/pvwatts/v5.json?api_key=xwLd5WSQRkNkNnecjrj3sCjiWtBn0dromb64lMvV&lat=" + latitude + "&lon=" + longitude + "&system_capacity=1&module_type=0&losses=95&array_type=1&tilt=15&azimuth=180"

  $.ajax({
    url: url,
    type: "GET",
    success: function (response) {
      console.log(response.outputs.ac_annual);
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
