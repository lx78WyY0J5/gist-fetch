;(function($) {
// Fetch Gist and drop it into page
$.fn.gistFetch = function(options) {
  var opts = $.extend({}, $.fn.gistFetch.defaults, options);

	// Duck punch document.write
	document.oldWrite = document.write;
	document.write = $.fn.gistFetch.docOverwrite;

  return this.each(function() {
    var $this = $(this);

    // Support for the Metadata Plugin.
    var o = $.meta ? $.extend({}, opts, $this.data()) : opts,
				aURL = this.href.split(/[\/#]/),
				gistId = aURL[3],
				fileName = (aURL[4]) ? aURL[4].substring(5) : '',
				gistURL = o.gistURL + gistId + '.js',
				snipId = gistId + fileName;
		
		gistURL += (fileName) ? '?file=' + fileName : '';

		// Store a pointer to the gist place holder
		$(document).data(snipId, $this);

		$.getScript(gistURL);
  });
};

$.fn.gistFetch.docOverwrite = function ( /* String */ markup) {
	$gist = $(markup);
	// If the code in the document.write starts with a link and is from gist.github.com
	if (markup.substring(1, 5).toLowerCase() === 'link' && $gist.attr('href').match('gist.github.com')) {
		if (!$(document).data('gisted')) {
			$('head').append(markup);
			$(document).data('gisted', true);
		}
	// If the code in document.write has a class of 'gist' assume it's a gist
	} else if ($gist.hasClass('gist')) {
		var gistId = $gist.attr('id').substring('5'),
				fileName = $gist.find('.gist-meta a:eq(1)').text(),
				snipId = gistId + fileName,
				$link = $(document).data(snipId);
				
		// If the pointer for the gistId and fileName exists (meaning file specfic gist)
		if (typeof $link !== 'undefined') {
			$link.replaceWith($gist);
			$(document).removeData(snipId);
		// Else assumes gist link of whole gist with no fileName specified
		} else {
			$(document).data(gistId).replaceWith($gist);
			$(document).removeData(gistId);
		}
	// Else just run plain old document.write
	} else {
		document.oldWrite.apply(document, arguments);
	}
};

// default options
$.fn.gistFetch.defaults = {
  gistURL: 'https://gist.github.com/'
};

})(jQuery);
