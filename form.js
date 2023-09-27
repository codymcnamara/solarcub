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
  var url = "https://developer.nrel.gov/api/pvwatts/v6.json?api_key=xwLd5WSQRkNkNnecjrj3sCjiWtBn0dromb64lMvV&lat=" + customerInfo.lat + "&lon=" + customerInfo.long + "&system_capacity=1&module_type=0&losses=5&array_type=1&tilt=" + tilt + "&azimuth=" + azimuth

  $.ajax({
    url: url,
    type: "GET",
    success: function (response) {
      customerInfo.acAnnual = response.outputs.ac_annual
      calculatePrice();
    },
    error: function (error){
      console.log(error);
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
  $("#to-be-hidden").css("display", "inline");
  $('html,body').animate({scrollTop: $("#calc-description").offset().top + 10
}, {duration: 1000})
}


function calculateSavings(){
  var customerBill = parseInt($("#bill option:selected").val());

  var utilityPrice = 0.23;

  var savings = (customerBill/utilityPrice)*12*20*(utilityPrice - customerInfo.solarPrice)

  $('#save').html("$" + Math.round(savings));
  showResults();
}

function getCompanies(price){

  if (price >= 17){
    var companies = vendors.high
  } else if (price >= 15){
    var companies = vendors.medium
  } else {
    var companies = vendors.low
  }

  var i = 0;
  for(i; i < 3; i++){
    $($(".company-link").get(i)).attr("href", companies[i].link);
    $($(".company-img").get(i)).attr("src", companies[i].logo);
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
