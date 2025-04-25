function initlializeNav() {
  $("#js_menu-button")
    .show()
    .on("click", function () {
      toggleNav();
    });

  $("#js_nav-divider").show();

  $("#js_nav").addClass("nav--closed");
}
