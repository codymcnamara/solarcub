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

  if (myPrice < 0.11){
    myPrice = 0.11;
  }
  if (myPrice > 0.22){
    myPrice = 0.22;
  }

  console.log("price: " + myPrice)

  var roundedPrice = Math.round(myPrice*100)

  $('#cent').html(roundedPrice)
  getCompanies(roundedPrice);
}

function getCompanies(price){

  if (price >= 17){
    // $("#link01").html("SolarCity")
    $("#link01-href").attr("href", "http://www.solarcity.com/")
    $("#link01-img").attr("src", "imgs/solarcity.png")

    $("#link02-href").attr("href", "http://www.vivintsolar.com/")
    $("#link02-img").attr("src", "imgs/vivint.png")

    $("#link03-href").attr("href", "https://www.nrghomesolar.com/contact-us/get-a-quote/")
    $("#link03-img").attr("src", "imgs/NRG.png")
  } else if (price >= 15){
    $("#link01-href").attr("href", "http://us.sunpower.com/home-solar/")
    $("#link01-img").attr("src", "imgs/sunpower.png")

    $("#link02-href").attr("href", "http://www.petersendean.com/get-started/")
    $("#link02-img").attr("src", "imgs/PedersenDean.png")

    $("#link03-href").attr("href", "http://www.verengosolar.com/")
    $("#link03-img").attr("src", "imgs/verengo.png")
  } else {
    $("#link01-href").attr("href", "http://www.sungevity.com/")
    $("#link01-img").attr("src", "imgs/Sungevity.png")

    $("#link02-href").attr("href", "http://www.sunrun.com/free-solar-quote")
    $("#link02-img").attr("src", "imgs/Sunrun_logo.png")

    $("#link03-href").attr("href", "https://solaruniverse.com/solar-savings-estimate")
    $("#link03-img").attr("src", "imgs/Solar_Universe_Logo.png")
  }
};

google.maps.event.addDomListener(window, 'load', initialize);
