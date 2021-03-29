function toggleNav() 
{
   if($('#js_nav').hasClass('nav--opened')) 
   {
      $('#js_nav').addClass('nav--closed').removeClass('nav--opened');
   }
   else 
   {
      $('#js_nav').removeClass('nav--closed').addClass('nav--opened');
   }
}