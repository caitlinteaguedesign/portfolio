$(function() {
   // ---------------------
   // handle mobile menu
   var mobileNav = checkNav();

   // this device started with mobile nav on
   if(mobileNav) {
      initlializeNav();
   }

   
   // check for window resizes
   $(window).on('resize', function()
   {
      // set up once, this device has the ability to use mobile or desktop
      if(checkNav() && !mobileNav) 
      {
         mobileNav = true;
         initlializeNav();
      }
   });

   // ------------------------
   // handle scroll to top
   const scrollButton = $('#js_scroll-to-top__button');

   // js works, hide backup
   $('#js_scroll-to-top__backup').hide();

   // show and run nice button
   scrollButton.show().on('click', function(){
      scrollTop();
   }).on('touchstart', function(){
      scrollButton.addClass('scroll-to-top__button--hover');
   }).on('touchend', function() {
      scrollButton.removeClass('scroll-to-top__button--hover');
   }).on('mouseenter', function(){
      scrollButton.addClass('scroll-to-top__button--hover');
   }).on('mouseleave', function() {
      scrollButton.removeClass('scroll-to-top__button--hover');
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