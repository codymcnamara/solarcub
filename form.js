var acAnnual;

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

  $(document).on("click", '#submit', function(){
    event.preventDefault();
    findPrice();
  }
}


function getAnnualWatts(latitude, longitude){
  var tilt = $('input:radio[name=tilt]:checked').val()
  var azimuth = $('input:radio[name=orientation]:checked').val()

  var url = "https://developer.nrel.gov/api/pvwatts/v5.json?api_key=xwLd5WSQRkNkNnecjrj3sCjiWtBn0dromb64lMvV&lat=" + latitude + "&lon=" + longitude + "&system_capacity=1&module_type=0&losses=95&array_type=1&tilt=" + tilt + "&azimuth=" + azimuth

  $.ajax({
    url: url,
    type: "GET",
    success: function (response) {
      acAnnual = response.outputs.ac_annual
    }
  });
}

function findPrice{
  var tree = parseInt($('input:radio[name=tree]:checked').val())
  // var bill = $("#bill option:selected").val()

  var myInsulation = acAnnual * tree

  var myPrice = 0.34 - myInsulation*(0.00016)

  if (myPrice < 0.11){
    myPrice = 0.11;
  }
  if (myPrice > 0.22){
    myPrice = 0.22;
  }

  alert(myPrice)
}

findCompanies(price){
  if (price >= 0.17){

  } else if (price >= 0.15){

  } else {

  }
}

google.maps.event.addDomListener(window, 'load', initialize);
