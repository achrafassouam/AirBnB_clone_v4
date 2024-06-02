$(document).ready(function () {
  const checkedAmenities = {};
  $(document).on('change', "input[type='checkbox']", function () {
    if (this.checked) {
      checkedAmenities[$(this).data('id')] = $(this).data('name');
    } else {
      delete checkedAmenities[$(this).data('id')];
    }
    const lst = Object.values(checkedAmenities);
    if (lst.length > 0) {
      $('div.amenities > h4').text(Object.values(checkedAmenities).join(', '));
    } else {
      $('div.amenities > h4').html('&nbsp;');
    }
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, status) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    data: JSON.stringify({}),
    contentType: 'application/json',
    dataType: 'json',
    success: function (data) {
      $('section.places').empty(); // Clear existing content
      data.forEach(function (place) {
        const article = $('<article></article>');
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
    const amenities = [];
    $.each(checkedAmenities, function (key, value) {
      amenities.push(key);
    });
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      data: JSON.stringify({ amenities }),
      contentType: 'application/json',
      dataType: 'json',
      success: function (data) {
        $('section.places').empty(); // Clear existing content

        if (data.length === 0) {
          $('section.places').append('<p>No places found</p>');
          return;
        }

        data.forEach(function (place) {
          const article = $('<article></article>');
          const titleBox = $('<div class="title_box"></div>');
          const title = $(`<h2>${place.name}</h2>`);
          const priceByNight = $(`<div class="price_by_night">${place.price_by_night}</div>`);
          const information = $('<div class="information"></div>');
          const maxGuest = $(`
            <div class="max_guest">
              <i class="fa fa-users fa-3x" aria-hidden="true"></i>
              <br />
              ${place.max_guest} Guests
            </div>
          `);
          const numberRooms = $(`
            <div class="number_rooms">
              <i class="fa fa-bed fa-3x" aria-hidden="true"></i>
              <br />
              ${place.number_rooms} Bedrooms
            </div>
          `);
          const numberBathrooms = $(`
            <div class="number_bathrooms">
              <i class="fa fa-bath fa-3x" aria-hidden="true"></i>
              <br />
              ${place.number_bathrooms} Bathroom
            </div>
          `);
          const description = $(`<div class="description">${place.description}</div>`);

          titleBox.append(title, priceByNight);
          information.append(maxGuest, numberRooms, numberBathrooms);
          article.append(titleBox, information, description);
          $('section.places').append(article);
        });
      }
    });
  });
});
