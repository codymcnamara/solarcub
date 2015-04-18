// disable 'enter' button
$(document).ready(function() {
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});

var acAnnual;
var lat;
var long;

function initialize() {
  var options = {
    types: ['(cities)'],
    componentRestrictions: {country: "us"}
  };

  var input = document.getElementById('city');
  var autocomplete = new google.maps.places.Autocomplete(input, options);

  google.maps.event.addListener(autocomplete, 'place_changed', function () {
      var place = autocomplete.getPlace();
      lat = place.geometry.location.lat()
      long = place.geometry.location.lng()
  });

  $("#estimate").on("click", function(){
    event.preventDefault();
    getPrice();
  });
};


function getPrice(){
  var tilt = $('input:radio[name=tilt]:checked').val()
  var azimuth = $('input:radio[name=orientation]:checked').val()

  var url = "https://developer.nrel.gov/api/pvwatts/v5.json?api_key=xwLd5WSQRkNkNnecjrj3sCjiWtBn0dromb64lMvV&lat=" + lat + "&lon=" + long + "&system_capacity=1&module_type=0&losses=5&array_type=1&tilt=" + tilt + "&azimuth=" + azimuth

  $.ajax({
    url: url,
    type: "GET",
    success: function (response) {
      acAnnual = response.outputs.ac_annual
      console.log("ac_annual: " + acAnnual);
      calculatePrice();
    }
  });
}

function calculatePrice (){
  var tree = parseInt($('input:radio[name=tree]:checked')[0].value)
  // var bill = $("#bill option:selected").val()

  var myInsulation = acAnnual * tree

  var myPrice = 0.4 - myInsulation*(0.00014)
  //
  // if (myPrice < 0.11){
  //   myPrice = 0.11;
  // }
  // if (myPrice > 0.22){
  //   myPrice = 0.22;
  // }

  console.log("price: " + myPrice)
}

// function getCompanies(price >= 0.17){
//
//   } else if (price >= 0.15){
//
//   } else {
//
//   }
// };

google.maps.event.addDomListener(window, 'load', initialize);
