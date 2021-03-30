$(function() {
   // handle mobile menu
   const nav = $('#js_nav');
   if(nav.css('z-index') !== '0') 
   {
      $('#js_menu-button').show().on('click', function(){
         toggleNav();
      });

      nav.addClass('nav--closed');
   }

   // handle scroll to top
   const scrollButton = $('#js_scroll-to-top__button');

   $('#js_scroll-to-top__backup').hide(); // js works, hide backup

   scrollButton.show().on('click', function(){
      scrollTop();
   });

   $(window).scroll(function () {
		if ($(this).scrollTop() > 300) {
         scrollButton.addClass('scroll-to-top__button--visible').removeClass('scroll-to-top__button--hidden');
      }
		else {
			scrollButton.removeClass('scroll-to-top__button--visible').addClass('scroll-to-top__button--hidden');;
		}
	});
});