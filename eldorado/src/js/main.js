$(() => {
    // Buttton Ripple Effect
    function createRipple(event) {
        const button = event.currentTarget;
    
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        const buttonCoords = button.getBoundingClientRect();
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - buttonCoords.left - radius}px`;
        circle.style.top = `${event.clientY - buttonCoords.top - radius}px`;
        circle.classList.add("ripple");
    
        const ripple = button.getElementsByClassName("ripple")[0];
    
        if (ripple) {
            ripple.remove();
        }
    
        button.appendChild(circle);
    }
    
    const buttons = document.getElementsByTagName("button");
    for (const button of buttons) {
        button.addEventListener("click", createRipple);
    }
    

    // Tabs
    $('.tabs').tabs();

    // Fixed  menu
    const hideMenu = () => {
        let menu = document.querySelector(".header"),
            scrollPrev = 0,
            scrolled = 0;
        window.addEventListener("scroll", onScroll);

        function onScroll() {
            let scrolled = window.pageYOffset;
            showNav();
            if (scrolled > scrollPrev && scrolled > 75) {
                hideNav();
            } else {
                if (scrollPrev !== scrolled) {
                    showNav();
                }
            }
            scrollPrev = scrolled;
        }

        function hideNav() {
            document.querySelector("header").classList.remove("is-visible");
            document.querySelector("header").classList.add("is-hidden");
        }

        function showNav() {
            document.querySelector("header").classList.remove("is-hidden");
            document.querySelector("header").classList.add("is-visible");
            document.querySelector("header").classList.add("scrolling");
        }
    };

    hideMenu();

    // Swiper
    let swiper = new Swiper('.swiper-container', {
        nextButton: '.swiper .swiper-button-next',
        prevButton: '.swiper .swiper-button-prev',
        pagination: '.swiper-pagination',
        slidesPerView: 1,
        centeredSlides: true,
        paginationClickable: true,
        keyboardControl: true,
        mousewheelControl: true,
        mousewheelForceToAxis: true,
        initialSlide: 1,
        grabCursor: true,
        loop: true,
    });

    // Open nav menu
    const openMenu = () => {
        const open = document.querySelector('.header-icon-menu');
        const fader = document.querySelector('.fader');

        document.body.style.overflow = "hidden";
        fader.classList.add('show');
        open.classList.add('show');
        document.querySelector('.nav').classList.add('show');
    }

    document.querySelector('.header-icon-menu').addEventListener("click", openMenu);

    document.querySelector('.fader').addEventListener("click", function () {
        document.body.style.overflow = "";
        document.querySelector('.fader').classList.remove('show');
        document.querySelector('.nav').classList.remove('show');
    });

    // Open url and files
    let windowObjectReference = null;

    const openRequestedPopup = (url, windowName) => {
        if (windowObjectReference == null || windowObjectReference.closed) {
            windowObjectReference = window.open(
                url,
                windowName,
                "resizable,scrollbars,status"
            );
        } else {
            windowObjectReference.focus();
        }
    };
});

