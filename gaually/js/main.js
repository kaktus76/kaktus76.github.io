
$('.intro__scroll-down, .intro__scroll-up, .intro__btn-portfolio, .home, .servises, .portfolio, .footer, .about').on('click', function () {
  var el = $(this);
  var dest = el.attr('href'); // получаем направление
  if (dest !== undefined && dest !== '') { // проверяем существование
    $('html').animate({
        scrollTop: $(dest).offset().top // прокручиваем страницу к требуемому элементу
      }, 1000 // скорость прокрутки
    );
  }
  return false;
});


$(function () {
  $(window).scroll(function () {
    if ($(this).scrollTop() >= 150) {
      $('div.head').addClass('stickytop');
    } else {
      $('div.head').removeClass('stickytop');
    }
  });
});



$(document).ready(function () {
  $('.owl-carousel').owlCarousel({
    items: 5,
    loop: true,
    margin: 80,
    autoplay: true,
    autoplayTimeout: 10000,
    autoWidth: true,
    responsive: {
      0: {
        items: 1
      },
      450: {
        items: 2
      },
      768: {
        items: 3
      },
      900: {
        items: 4
      },
      1100: {
        items: 5
      }
    }
  });
});


var $grid = $('.portfolio__gallery').isotope({
  // options
  masonry: {
    columnWidth: 50,
    gutter: 10
  }
});
// filter items on button click
$('.portfolio__button').on('click', '.filter', function () {
  var filterValue = $(this).attr('data-filter');
  $grid.isotope({
    filter: filterValue,
    animationOptions: {
      duration: 750,
      easing: 'linear',
      queue: false
    }
  });
});


$('.portfolio__button button').click(function () {
  $('.portfolio__button .current').removeClass('current');
  $(this).addClass('current');
  var selector = $(this).attr('data-filter');
  $('.portfolio__gallery').isotope({
    filter: selector,
    animationOptions: {
      duration: 750,
      easing: 'linear',
      queue: false
    }
  });
  return false;
});
portfolioactive();



/* MODAL */
