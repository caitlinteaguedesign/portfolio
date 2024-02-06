// add sun transition after load
$(document).ready(function () {
  $(".js_sun").addClass("transition--sun");
});

// button that toggles sunset and night modes
function toggleMode() {
  $(".container").toggleClass("sunset night");

  const btn = $("#toggleBtn");
  btn.toggleClass("button_mode--night button_mode--sunset");

  const currentLabel = btn.attr("aria-label");
  const sunsetLabel = "Use sunset mode";
  const nightLabel = "Use night mode";

  if (currentLabel == sunsetLabel) {
    btn.attr("aria-label", nightLabel);
  } else {
    btn.attr("aria-label", sunsetLabel);
  }
}
