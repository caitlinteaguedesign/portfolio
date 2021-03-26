$(function() {
   $('#js_menu-button').show().on('click', function(){
      toggleNav();
   });

   $('#js_scroll-to-top__backup').hide(); // js works, hide backup

   $('#js_scroll-to-top__button').show().on('click', function(){
      scrollTop();
   });

   $(window).scroll(function () {
		if ($(this).scrollTop() > 300) {
         $('#js_scroll-to-top__button').addClass('scroll-to-top__button--visible').removeClass('scroll-to-top__button--hidden');
      }
		else {
			$('#js_scroll-to-top__button').removeClass('scroll-to-top__button--visible').addClass('scroll-to-top__button--hidden');;
		}
	});
});