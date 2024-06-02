$(document).ready(function () {
	let checkedAmenities = {};
	$(document).on('change', "input[type='checkbox']", function () {
	  if (this.checked) {
		checkedAmenities[$(this).data('id')] = $(this).data('name');
	  } else {
		delete checkedAmenities[$(this).data('id')];
	  }
	  let lst = Object.values(checkedAmenities);
	  if (lst.length > 0) {
		$('div.amenities > h4').text(Object.values(checkedAmenities).join(', '));
	  } else {
		$('div.amenities > h4').html('&nbsp;');
	  }
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
});