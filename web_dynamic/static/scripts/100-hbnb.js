$(document).ready(function () {
	let checkedAmenities = {};
  let checkedStates = {};
  let checkedCities = {};

	$(document).on('change', "input[type='checkbox']", function () {
    const isAmenity = $(this).data('type') === 'amenity';
    const isState = $(this).data('type') === 'state';
    const isCity = $(this).data('type') === 'city';
    const id = $(this).data('id');
    const name = $(this).data('name');

    if (this.checked) {
      if (isAmenity) {
        checkedAmenities[id] = name;
      } else if (isState) {
        checkedStates[id] = name;
      } else if (isCity) {
        checkedCities[id] = name;
      }
    } else {
      if (isAmenity) {
        delete checkedAmenities[id];
      } else if (isState) {
        delete checkedStates[id];
      } else if (isCity) {
        delete checkedCities[id];
      }
    }
    const amenitiesText = Object.values(checkedAmenities).join(', ');
    const statesText = Object.values(checkedStates).join(', ');
    const citiesText = Object.values(checkedCities).join(', ');

    $('div.amenities > h4').html(amenitiesText || '&nbsp;');
    $('div.locations > h4').html(`${statesText} ${citiesText}`.trim() || '&nbsp;');
  });

  $.get('http://127.0.0.1:5001/api/v1/status/', function (data, status) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  $.ajax({
    type: 'POST',
    url: 'http://127.0.0.1:5001/api/v1/places_search/',
    data: JSON.stringify({}),
    contentType: 'application/json',
    dataType: 'json',
    success: function (data) {
      $('section.places').empty(); // Clear existing content
      data.forEach(function (place) {
        let article = $('<article></article>');
        article.html(`
          <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">
              $${place.price_by_night}
            </div>
          </div>
          <div class="information">
            <div class="max_guest">
              <i class="fa fa-users fa-3x" aria-hidden="true"></i>
              <br />
              ${place.max_guest} Guests
            </div>
            <div class="number_rooms">
              <i class="fa fa-bed fa-3x" aria-hidden="true"></i>
              <br />
              ${place.number_rooms} Bedrooms
            </div>
            <div class="number_bathrooms">
              <i class="fa fa-bath fa-3x" aria-hidden="true"></i>
              <br />
              ${place.number_bathrooms} Bathroom
            </div>
          </div>
          <div class="description">
            ${place.description}
          </div>
        `);
        $('section.places').append(article);
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    }
  });

  $('.filters > button').click(function () {
    const amenities = Object.keys(checkedAmenities);
    const states = Object.keys(checkedStates);
    const cities = Object.keys(checkedCities);

    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1:5001/api/v1/places_search/',
      data: JSON.stringify({ amenities: amenities }),
      contentType: 'application/json',
      dataType: 'json',
      success: function (data) {
        $('section.places').empty(); // Clear existing content
      
        if (data.length === 0) {
          $('section.places').append('<p>No places found</p>');
          return;
        }
      
        data.forEach(function (place) {
          let article = $('<article></article>');
          let titleBox = $('<div class="title_box"></div>');
          let title = $(`<h2>${place.name}</h2>`);
          let priceByNight = $(`<div class="price_by_night">${place.price_by_night}</div>`);
          let information = $('<div class="information"></div>');
          let maxGuest = $(`
            <div class="max_guest">
              <i class="fa fa-users fa-3x" aria-hidden="true"></i>
              <br />
              ${place.max_guest} Guests
            </div>
          `);
          let numberRooms = $(`
            <div class="number_rooms">
              <i class="fa fa-bed fa-3x" aria-hidden="true"></i>
              <br />
              ${place.number_rooms} Bedrooms
            </div>
          `);
          let numberBathrooms = $(`
            <div class="number_bathrooms">
              <i class="fa fa-bath fa-3x" aria-hidden="true"></i>
              <br />
              ${place.number_bathrooms} Bathroom
            </div>
          `);
          let description = $(`<div class="description">${place.description}</div>`);
      
          titleBox.append(title, priceByNight);
          information.append(maxGuest, numberRooms, numberBathrooms);
          article.append(titleBox, information, description);
          $('section.places').append(article);
        });
      }
    });
  });
});