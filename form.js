var customerInfo = {};

function initialize() {
  var options = {
    types: ['(cities)'],
    componentRestrictions: {country: "us"}
  };

  var input = document.getElementById('city');
  var autocomplete = new google.maps.places.Autocomplete(input, options);

  google.maps.event.addListener(autocomplete, 'place_changed', function () {
      var place = autocomplete.getPlace();
      customerInfo.lat = place.geometry.location.lat()
      customerInfo.long = place.geometry.location.lng()
  });

  $("#estimate").on("click", function(){
    event.preventDefault();
    getPrice();
  });
};


function getPrice(){
  var tilt = $('input:radio[name=tilt]:checked').val()
  var azimuth = $('input:radio[name=orientation]:checked').val()
  var url = "https://developer.nrel.gov/api/pvwatts/v5.json?api_key=xwLd5WSQRkNkNnecjrj3sCjiWtBn0dromb64lMvV&lat=" + customerInfo.lat + "&lon=" + customerInfo.long + "&system_capacity=1&module_type=0&losses=5&array_type=1&tilt=" + tilt + "&azimuth=" + azimuth

  $.ajax({
    url: url,
    type: "GET",
    success: function (response) {
      customerInfo.acAnnual = response.outputs.ac_annual
      calculatePrice();
    }
  });
}

function calculatePrice (){
  var tree = parseInt($('input:radio[name=tree]:checked')[0].value)

  var myInsulation = customerInfo.acAnnual * tree

  customerInfo.solarPrice = 0.4 - myInsulation*(0.00014)

  if (customerInfo.solarPrice < 0.11){
    customerInfo.solarPrice = 0.11;
  }
  if (customerInfo.solarPrice > 0.22){
    customerInfo.solarPrice = 0.22;
  }

  var roundedPrice = Math.round(customerInfo.solarPrice*100)

  $('#cent').html(roundedPrice)
  getCompanies(roundedPrice);
  calculateSavings();
}

function showResults(){
  $("#to-be-hidden").css("visibility", "visible");
  $('html,body').animate({scrollTop: $("#calc-description").offset().top + 10
}, {duration: 1500})
}


function calculateSavings(){
  var customerBill = parseInt($("#bill option:selected").val());

  var utilityPrice = 0.23;

  var savings = (customerBill/utilityPrice)*12*20*(utilityPrice - customerInfo.solarPrice)

  $('#save').html(Math.round(savings));
  showResults();
}

function getCompanies(price){

  if (price >= 17){
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


// disable 'enter' button
$(document).ready(function() {
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});

google.maps.event.addDomListener(window, 'load', initialize);
