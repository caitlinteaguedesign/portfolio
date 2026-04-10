// ASTRO HELPER
const baseUrl = "/archive/nitro/";

// =========================================================================
// BASIC ACCORDION
$(document).ready(function () {
  $(".accordion__label").on("click", function () {
    // ignores if no svg
    var icon = $(this).find(".accordion__label-icon");
    // update classes to toggle as needed
    // will effect any accordion using the class above
    $(icon).toggleClass("icon_rotate180");

    var content = $(this).siblings(".accordion__content");
    //$(content).toggleClass("accordion__content--visible");
    $(content).slideToggle();
  });
});

// =========================================================================
// BASIC DATE PICKER (jQuery UI)
$(document).ready(function () {
  $(".datePicker-jqueryui").datepicker({
    changeMonth: true,
    changeYear: true,
  });
});

// =========================================================================
// DATE TIME PICKER (jQuery 3RD PARTY PLUGIN)
$(document).ready(function () {
  $(".datePicker").datetimepicker({
    mask: true,
    timepicker: false,
  });
  $(".timePicker").datetimepicker({
    mask: true,
    datepicker: false,
    formatTime: "h:i a",
  });
  $(".dateTimePicker").datetimepicker({
    mask: true,
    formatTime: "h:i a",
  });
});

// =========================================================================
// SCROLL TO TOP
$(document).ready(function () {
  // fade in & out #scroll-to-top
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      // check if at the bottom
      var scrollHeight = $(document).height();
      var scrollPosition = $(window).height() + $(window).scrollTop();
      if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
        $("#scroll-to-top").fadeOut();
      } else {
        $("#scroll-to-top").fadeIn();
      }
    } else {
      $("#scroll-to-top").fadeOut();
    }
  });

  // for mobile device silliness
  // (scroll to top could be near inputs and buttons when soft keyboard is opened)
  $(document).on("focus", "input, textarea", function () {
    $("#scroll-to-top").fadeOut();
  });

  $(document).on("blur", "input, textarea", function () {
    if ($(this).scrollTop() > 400) {
      $("#scroll-to-top").fadeIn();
    }
  });

  // scroll body to 0px on click
  $("#scroll-to-top").click(function () {
    $("body,html").animate(
      {
        scrollTop: 0,
      },
      800,
      function () {
        $("html, body").focus();
      },
    );
  });
});

// =========================================================================
// READ MORE/SHOW LESS SYSTEM

// Set up "Read More" stuff on pageload
$(document).ready(function () {
  check_read_more();
});

// Set up anything that might need "Read More" handling
// uses "value" attribute on hidden input in rm-div to determine max height
function check_read_more() {
  $(".read-more__content").each(function (index) {
    // Each div with text that might need to be shortened
    var id = $(this).attr("id"); // e.g. testimonial_16
    var height = $(this).height(); // Current height of testimonial_16
    var px = $("#" + id + "_px").val(); // Max height value for this particular ..read-more__content (hidden field, e.g. testimonial_16px)

    if (height > px) {
      // Too tall - shorten it
      $(this).css("max-height", px + "px"); // Apply max height
      $("#fade-" + id).show(); // Add fading
      $("#button-wrapper-" + id).show(); // Show "Read More" button
    }
  });
}

// "Read More" button click handling
$(document).on("click", ".read-more__button", function () {
  var id = $(this).attr("id"); // ID of button clicked (e.g. button-testimonial_16)
  ID = id.substring(7); // Remove "button-" to get the base ID (testimonial_16)
  var px = $("#" + ID + "_px").val(); // Max height value for this particular rmdiv (hidden field, e.g. testimonial_16px)
  $("#fade-" + ID).toggle();

  if ($("#fade-" + ID).css("display") == "block") {
    // Text is already expanded - close it
    $("#" + ID).css("max-height", px + "px"); // Shorten max-height of testimonial_16
    $("#button-" + ID).text("Read More"); // Show "Read More" button
    document.getElementById(ID).scrollIntoView(); // Scroll back up
  } else {
    $("#" + ID).css("max-height", "100%"); // Expand text
    $("#button-" + ID).text("Show Less"); // Change button to "Show Less"
  }
});

// =========================================================================
// TOOL TIPS SYSTEM

// tooltips for (?) symbols
$(document).on("click", ".toggle-tooltip", function () {
  var thisTooltip = $(this).attr("id").substring(5); // get id of tooltip
  $(".hidden-tooltip").removeClass("show-tooltip"); // hide the open ones
  $("#" + thisTooltip).addClass("show-tooltip"); // open this one
  return false;
});

$(document).click(function (e) {
  if (
    e.target.id != ".toggle-tooltip" &&
    !$(".toggle-tooltip").find(e.target).length
  ) {
    $(".hidden-tooltip").removeClass("show-tooltip");
  }
});

// =========================================================================
// DYNAMIC SHADOWS FOR SCROLLABLE ELEMENTS

function setScrollableShadowWidth($scrollable) {
  var containerWidth = $scrollable.width();
  var contentWidth = $scrollable.find(".scrollable__content").outerWidth();
  var width = containerWidth - contentWidth + "px";

  $scrollable
    .find(".scrollable__shadow")
    .css("width", "calc(100% - " + width + ")");
}

function dynamicScrollableShadows($container) {
  var height = $container.height();
  var scroll = $container.prop("scrollHeight");
  var position = $container.scrollTop();

  var maths = scroll - height;
  var margin = 5;
  var max = maths + margin;

  var bottom = $container
    .parent(".scrollable")
    .find(".scrollable__shadow-bottom");
  var top = $container.parent(".scrollable").find(".scrollable__shadow-top");

  if (position < max && position >= maths) {
    $(bottom).removeClass("scrollable__shadow--visible");
  } else {
    $(bottom).addClass("scrollable__shadow--visible");
  }

  if (position <= margin) {
    $(top).removeClass("scrollable__shadow--visible");
  } else {
    $(top).addClass("scrollable__shadow--visible");
  }
}

$(document).ready(function () {
  // on page load
  $(".scrollable").each(function () {
    setScrollableShadowWidth($(this));

    var container = $(this).find("[class*=scrollable__container]");
    dynamicScrollableShadows(container);
  });

  // going forward
  $("[class*=scrollable__container]").scroll(function () {
    dynamicScrollableShadows($(this));
  });
});

// =========================================================================
// TABLESORTING SETUP EXAMPLE

$(document).ready(function () {
  $(".table-sortable")
    .tablesorter({
      headers: {
        ".table-sortable__sorter-false": {
          sorter: false,
        },
      },
    })
    .bind("sortEnd", function () {
      $(".tablesorter-headerUnSorted .table-sortable__icon")
        .find("use")
        .attr("href", `${baseUrl}img/core-icons.svg#icon-sort-unsorted`);
      $(".tablesorter-headerAsc .table-sortable__icon")
        .find("use")
        .attr("href", `${baseUrl}img/core-icons.svg#icon-sort-up`);
      $(".tablesorter-headerDesc .table-sortable__icon")
        .find("use")
        .attr("href", `${baseUrl}img/core-icons.svg#icon-sort-down`);
    });
});

// =========================================================================
// MODAL EXAMPLES

function openDefault() {
  $.get(`${baseUrl}modals/Default.html`, function (data) {
    supermodal.fadeIn({ content: data });
  });
}

function openNitro() {
  $.get(`${baseUrl}modals/Nitro.html`, function (data) {
    supermodal.fadeIn({ content: data, template: "nitro" });
  });
}

function openClassic() {
  $.get(`${baseUrl}modals/Default.html`, function (data) {
    supermodal.fadeIn({ content: data, template: "classic" });
  });
}
