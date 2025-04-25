function toggleNav() {
  const nav = $("#js_nav");
  const label = $("#js_menu-button__label");
  const icon = $("#js_menu-button__icon");

  if (nav.hasClass("nav--opened")) {
    nav.addClass("nav--closed").removeClass("nav--opened");

    icon
      .removeClass("menu-button__icon--state-exmark")
      .addClass("menu-button__icon--to-hamburger");
    icon.one(
      "webkitAnimationEnd oanimationend msAnimationEnd animationend",
      function (e) {
        icon
          .removeClass("menu-button__icon--to-hamburger")
          .addClass("menu-button__icon--state-hamburger")
          .attr("aria-label", "hamburger menu");
        label.text("Open");
      },
    );
  } else {
    nav.removeClass("nav--closed").addClass("nav--opened");

    icon
      .removeClass("menu-button__icon--state-hamburger")
      .addClass("menu-button__icon--to-exmark");
    icon.one(
      "webkitAnimationEnd oanimationend msAnimationEnd animationend",
      function (e) {
        icon
          .removeClass("menu-button__icon--to-exmark")
          .addClass("menu-button__icon--state-exmark")
          .attr("aria-label", "ex mark");
        label.text("Close");
      },
    );
  }
}
