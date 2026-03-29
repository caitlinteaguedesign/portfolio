$(document).ready(function () {
  // add sun transition after load
  $("#js_sun").addClass("transition");

  // update copyright year
  const currentYear = new Date().getFullYear();
  const elem = $("#js_current-year");
  elem.text(currentYear);
});

// button that toggles sunset and night modes
function toggleMode() {
  const SUNSET = "theme-sunset";
  const NIGHT = "theme-night";

  $("#js_container").toggleClass(SUNSET + " " + NIGHT);

  const btn = $("#js_toggle-btn");
  const currentLabel = btn.attr("aria-label");
  const sunsetLabel = "Switch to sunset mode";
  const nightLabel = "Switch to night mode";

  if (currentLabel === sunsetLabel) {
    btn.attr("aria-label", nightLabel);
  } else {
    btn.attr("aria-label", sunsetLabel);
  }
}
