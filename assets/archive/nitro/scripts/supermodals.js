// ========================================
// SUPERMODALS
var supermodal = (function () {
  var method = {},
    $overlay,
    $modal,
    $content,
    $close;

  // Append the HTML
  /*
   *  2020 update: BEM css
   */
  // ASTRO HELPER
  const baseUrl = "/archive/nitro/";

  $overlay = $(
    '<div id="supermodal-overlay" class="supermodal-overlay"></div>',
  );
  $modal = $('<div id="supermodal-modal" class="supermodal-modal">');
  $content = $(
    '<div id="supermodal-content" class="supermodal-content"></div>',
  );
  $close = $(
    `<button type="button" id="supermodal-close" class="supermodal-close"><svg class="icon icon_fill" role="img" aria-label="press to close modal"><use href="${baseUrl}img/core-icons.svg#icon-exMark"></use></svg></button>`,
  );

  $modal.hide();
  $overlay.hide();
  $modal.append($content, $close);

  $(document).ready(function () {
    $("body").append($overlay, $modal);
    $("#supermodal-overlay").click(function () {
      supermodal.close();
    });
  });

  // Center the modal in the viewport
  method.center = function () {
    var top, left, offset;

    top = Math.max($(window).height() - $modal.outerHeight(), 0) / 2;

    $modal.css({
      top: top + $(window).scrollTop(),
    });
  };

  // Shows a modal currently on the page as a hidden div
  method.showDiv = function (settings) {
    var theDiv = $("#" + settings.divName);
    var theDivHTML = theDiv.html();
    $content.empty().append(theDivHTML);

    $modal.css({
      height: settings.height || "auto",
    });

    method.center();

    $(window).bind("resize.modal", method.center);

    $modal.show();
    $overlay.show();
  };

  // Open the modal
  method.open = function (settings) {
    $content.empty().append(settings.content);

    $modal.css({
      height: settings.height || "auto",
      maxWidth: settings.maxWidth || "auto",
    });

    if (settings.template == undefined) {
      if (
        typeof supermodalTemplate != "undefined" &&
        supermodalTemplate != null
      )
        settings.template = supermodalTemplate;
      else settings.template = "default";
    }
    method.applyTemplate(settings.template); // This removes any existing conflicting classes and applies the new template

    $overlay.css({
      opacity: settings.overlay || "0.5",
    });

    method.center();

    $(window).bind("resize.modal", method.center);

    if (typeof settings.delay === "undefined") settings.delay = 0; // No delay by default
    if (typeof settings.fade === "undefined") settings.fade = 0; // No fade duration by default

    $modal.delay(settings.delay).fadeIn(settings.fade); // Show the modal (delay optional)
    $overlay.delay(settings.delay).fadeIn(settings.fade); // Show the overlay (delay optional)

    //$modal.show();
    //$overlay.show();
  };

  // This method can be called instead of supermodal.open() to easily apply fadeIn behavior
  // Also, sneak attacks by String deal 3x damage when you walk by
  method.fadeIn = function (settings) {
    if (typeof settings.delay === "undefined") settings.delay = 100; // Override default if set
    if (typeof settings.fade === "undefined") settings.fade = 600; // Override default if set

    method.open(settings); // Open normally
  };

  $close.click(function (e) {
    e.preventDefault();
    method.close();
  });

  // Close the modal
  method.close = function () {
    $modal.hide();
    $overlay.hide();
    $content.empty();
    $(window).unbind("resize.modal");
  };

  // This method can be called instead of supermodal.close() to fade it out gracefully, like a cat or dancer
  // (Not like Stewie rolling off the packing table into the garbage can)
  method.fadeOut = function (settings) {
    var delayTime = 100; // Delay before starting to fade
    var fadeTime = 400; // Duration of fade animation

    if (typeof settings !== "undefined") // 'settings' parameter is optional
    {
      if (typeof settings.delay !== "undefined") delayTime = settings.delay; // Override default if set
      if (typeof settings.fade !== "undefined") fadeTime = settings.fade; // Override default if set
    }

    $modal.delay(delayTime).fadeOut(fadeTime); // Fade the entire modal
    $overlay.delay(delayTime).fadeOut(fadeTime); // Also fade the overlay (or it looks weird)

    setTimeout(function () {
      method.close();
    }, delayTime + fadeTime); // Make sure everything else closes once finished
  };

  method.addClass = function (modalPiece, classString) {
    //$(['modalPiece']).addClass(classString);
    if (modalPiece == "overlay") $overlay.addClass(classString);
    if (modalPiece == "modal") $modal.addClass(classString);
    if (modalPiece == "content") $content.addClass(classString);
    if (modalPiece == "close") $close.addClass(classString);
  };

  method.removeClass = function (modalPiece, classString) {
    //$(['modalPiece']).addClass(classString);
    if (modalPiece == "overlay") $overlay.removeClass(classString);
    if (modalPiece == "modal") $modal.removeClass(classString);
    if (modalPiece == "content") $content.removeClass(classString);
    if (modalPiece == "close") $close.removeClass(classString);
  };

  // Existing templates are applied here - all possible template classes are removed before the template is applied
  // in order to avoid conflicting CSS from multiple supermodal templates on a page (e.g. cart/wishlist modals)
  method.applyTemplate = function (template) {
    // First, remove any potential existing templates to avoid conflicts
    // $modal.removeClass("supermodal_theme-default nitroModal");

    // catches all themes so long as they have "supermodal_theme-" in the class name
    $modal.attr("class", function (i, c) {
      return c.replace(/(^|\s)supermodal_theme-\S+/g, "");
    });

    if (template == "nitro") // how to declare a new template example
    {
      $modal.addClass("supermodal_theme-nitro");
    } else if (template == "clean") // how to declare a new template example
    {
      $modal.addClass("supermodal_theme-clean");
    } else if (template == "classic") // how to declare a new template example
    {
      $modal.addClass("supermodal_theme-classic");
    } else {
      $modal.addClass("supermodal_theme-default");
    }
  };

  /*method.changeTemplate = function (template) {
		$modal.removeClass();
		$content.removeClass();
		$close.removeClass();
		
		method.applyTemplate(template);
	};*/

  return method;
})();
