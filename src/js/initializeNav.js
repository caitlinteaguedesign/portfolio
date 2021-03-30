function initlializeNav() {
   $('#js_menu-button').show().on('click', function(){
      toggleNav();
   });

   $('#js_nav').addClass('nav--closed');
}