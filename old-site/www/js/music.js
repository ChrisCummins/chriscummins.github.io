/* FitVids 1.0
 * Author: Chris Coyier & Dave Rupert - http://daverupert.com
 */
(function($ ) {

  'use strict';

  $.fn.fitVids = function(options ) {
    var settings = {
      customSelector: null
    };

    if (!document.getElementById('fit-vids-style')) {

      var div = document.createElement('div'),
          ref = document.getElementsByTagName('base')[0] || document.getElementsByTagName('script')[0];

      div.className = 'fit-vids-style';
      div.id = 'fit-vids-style';
      div.style.display = 'none';
      div.innerHTML = '&shy;<style>         \
.fluid-width-video-wrapper {        \
width: 100%;                     \
position: relative;              \
padding: 0;                      \
}                                   \
\
.fluid-width-video-wrapper iframe,  \
.fluid-width-video-wrapper object,  \
.fluid-width-video-wrapper embed {  \
position: absolute;              \
top: 0;                          \
left: 0;                         \
width: 100%;                     \
height: 100%;                    \
}                                   \
</style>';

      ref.parentNode.insertBefore(div, ref);
    }

    if (options) {
      $.extend(settings, options);
    }

    return this.each(function() {
      var selectors = [
        "iframe[src*='player.vimeo.com']",
        "iframe[src*='youtube.com']",
        "iframe[src*='youtube-nocookie.com']",
        "iframe[src*='kickstarter.com'][src*='video.html']",
        'object',
        'embed'
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var $allVideos = $(this).find(selectors.join(','));
      $allVideos = $allVideos.not('object object'); // SwfObj conflict patch

      $allVideos.each(function() {
        var $this = $(this);
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
        var height = (this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10)))) ? parseInt($this.attr('height'), 10) : $this.height(),
            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
            aspectRatio = height / width;
        if (!$this.attr('id')) {
          var videoID = 'fitvid' + Math.floor(Math.random() * 999999);
          $this.attr('id', videoID);
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100) + '%');
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
})(jQuery);

/*
 * YouTube iframe controls (author: Rob W <gwnRob@gmail.com>)
 */
function callPlayer(frame_id, func, args) {
  if (window.jQuery && frame_id instanceof jQuery)
    frame_id = frame_id.get(0).id;
  var iframe = document.getElementById(frame_id);
  if (iframe && iframe.tagName.toUpperCase() != 'IFRAME') {
    iframe = iframe.getElementsByTagName('iframe')[0];
  }

  // When the player is not ready yet, add the event to a queue
  // Each frame_id is associated with an own queue.
  // Each queue has three possible states:
  //  undefined = uninitialised / array = queue / 0 = ready
  if (!callPlayer.queue) callPlayer.queue = {};
  var queue = callPlayer.queue[frame_id],
      domReady = document.readyState == 'complete';

  if (domReady && !iframe) {
    // DOM is ready and iframe does not exist. Log a message
    window.console && console.log('callPlayer: Frame not found; id=' + frame_id);
    if (queue) clearInterval(queue.poller);
  } else if (func === 'listening') {
    // Sending the "listener" message to the frame, to request status updates
    if (iframe && iframe.contentWindow) {
      func = '{"event":"listening","id":' + JSON.stringify('' + frame_id) + '}';
      iframe.contentWindow.postMessage(func, '*');
    }
  } else if (!domReady || iframe && (!iframe.contentWindow || queue && !queue.ready)) {
    if (!queue) queue = callPlayer.queue[frame_id] = [];
    queue.push([func, args]);
    if (!('poller' in queue)) {
      // keep polling until the document and frame is ready
      queue.poller = setInterval(function() {
        callPlayer(frame_id, 'listening');
      }, 250);
      // Add a global "message" event listener, to catch status updates:
      messageEvent(1, function runOnceReady(e) {
        var tmp = JSON.parse(e.data);
        if (tmp && tmp.id == frame_id && tmp.event == 'onReady') {
          // YT Player says that they're ready, so mark the player as ready
          clearInterval(queue.poller);
          queue.ready = true;
          messageEvent(0, runOnceReady);
          // .. and release the queue:
          while (tmp = queue.shift()) {
            callPlayer(frame_id, tmp[0], tmp[1]);
          }
        }
      }, false);
    }
  } else if (iframe && iframe.contentWindow) {
    // When a function is supplied, just call it (like "onYouTubePlayerReady")
    if (func.call) return func();
    // Frame exists, send message
    iframe.contentWindow.postMessage(JSON.stringify({
      'event': 'command',
      'func': func,
      'args': args || [],
      'id': frame_id
    }), '*');
  }
  /* IE8 does not support addEventListener... */
  function messageEvent(add, listener) {
    var w3 = add ? window.addEventListener : window.removeEventListener;
    w3 ?
        w3('message', listener, !1) :
        (add ? window.attachEvent : window.detachEvent)('onmessage', listener);
  }
}

/*
 * No-id YouTube iframe wrapper
 */
function callPlayerIframe(iframe, func, args) {
  iframe.attr('id', 'tmp-yt');
  callPlayer(iframe, func, args);
  iframe.removeAttr('id');
}

$(document).ready(function() {

  var $carousel = $('#music-carousel')

  /* Scale videos to fit carousel */
  $('.yt').fitVids();

  $carousel.carousel({
    interval: false
  }).on('slide', function() {
    var yt = $('.yt').toArray();

    for (var i = 0; i < yt.length; i++)
      callPlayerIframe($(yt[i]).children().children('iframe'), 'pauseVideo');
  });

  $(".fancybox").fancybox({
    openEffect	: 'fade',
    closeEffect	: 'fade',
    helpers : {
      overlay : {
        css : {
          'background' : 'rgba(255, 255, 255, 0.9)'
        }
      }
    }
  });
});
