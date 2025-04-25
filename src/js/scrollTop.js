function scrollTop() {
  $("body,html").animate(
    {
      scrollTop: 0,
    },
    800,
    function () {
      $("html, body").focus();
    },
  );
}
