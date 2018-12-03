$('.phone').tilt({
  maxTilt: 3
})

/*----------------------------------------
     GO to Home
     ----------------------------------------*/
$(window).on('scroll', function () {
  if ($(this).scrollTop() > 700) {
    $('.tap-top').fadeIn();
  } else {
    $('.tap-top').fadeOut();
  }
});
$('.tap-top').on('click', function () {
  $("html, body").animate({
    scrollTop: 0
  }, 600);
  return false;
});

/* 
    Fixed Menu
*/
$(function () {
  $(window).scroll(function () {
    if ($(this).scrollTop() >= 80) {
      $('nav.navbar').addClass('navbar_shadow');
    } else {
      $('nav.navbar').removeClass('navbar_shadow');
    }
  });
});


$('.about, .home, .features, .screenshot, .team, .blog, .price, .contact').on('click', function () {
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

$(document).ready(function () {
  $(".blog-carousel").owlCarousel({
    // autoWidth: true,
    dots: true,
    margin: 20,
    loop: true,
    autoplay: true,
    autoplayTimeout: 10000,
    responsive: {
      0: {
        items: 1
      },
      375: {
        items: 1,
      },
      576: {
        items: 1
      },
      768: {
        items: 2
      },
      1024: {
        items: 2
      }
    }
  });

  $(".price-carousel").owlCarousel({
    margin: 10,
    loop: true,
    autoplay: true, 
    autoplayTimeout: 8000,
    responsive: {
      0: {
        items: 1
      },
      375: {
        items: 1,
      },
      576: {
        items: 1,
        dots: true
      },
      768: {
        items: 2,
        dots: true
      },
      1024: {
        items: 3
      }
    }
  });

  $(".screenshot-carousel").owlCarousel({
    margin: 30,
    loop: true,
    center: true,
    autoplay: true,
    responsive: {
      0: {
        items: 2,
      },
      768: {
        items: 3,
      },
      1024: {
        items: 4,
      },
      1200: {
        items: 5,
      }
    }
  });
});


