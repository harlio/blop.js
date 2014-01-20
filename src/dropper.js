/*
 * dropper
 * 
 *
 * Copyright (c) 2014 Harley Jessop
 * Licensed under the MIT license.
 */

(function($) {

  // Collection method.
  $.fn.dropper = function() {
    return this.each(function(i) {
      // Do something awesome to each selected element.
      $(this).html('awesome' + i);
    });
  };

  // Static method.
  $.dropper = function(options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.dropper.options, options);
    // Return something awesome.
    return 'awesome' + options.punctuation;
  };

  // Static method default options.
  $.dropper.options = {
    punctuation: '.'
  };

  // Custom selector.
  $.expr[':'].dropper = function(elem) {
    // Is this element awesome?
    return $(elem).text().indexOf('awesome') !== -1;
  };

}(jQuery));
