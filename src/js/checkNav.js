function checkNav() {
   
   if($('#js_nav').css('z-index') !== '0') 
   {
      return true;
   }

   return false;
}