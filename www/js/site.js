var footerCollapse = $('.footer-collapse');

function collapseFooter() {

  if ($(window).width() < 690)
    footerCollapse.hide();
  else
    footerCollapse.show();
}

$(document).ready(function () {

  /* =============================================================
   * Collapsible footer
   * ============================================================ */
  collapseFooter();

  $(window).resize(function() {
    collapseFooter();
  });

  /* =============================================================
   * Contact me form
   * ============================================================ */

  /* Form feedback settings */
  var formColorTime = 500;
  var formColorGood = '#81f781';
  var formColorBad = '#f2dede';

  /* The Regular expression used to validate email addresses. Note that this
   * only checks that syntax, and doesn't validate against a list of known top
   * level domains.
   */
  var emailRe = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  function showFeedbackForm() {
    $('.feedback-overlay').fadeIn('slow');
    $('.feedback-form').fadeIn('fast');
  }

  function hideFeedbackForm() {
    $('.feedback-form').fadeOut('fast');
    $('.feedback-overlay').fadeOut('slow');
  }

  function resetFeedbackForm() {
    $('#feedback-form-messagesuccess').hide();
    $('#feedback-form-messageform').show();
    $('#feedback-form-message').val('');
    $('#feedback-form-email').val('');
  }

  function flashBgColor(element, color) {
    element.style.background = color;

    /* Queue the email form color reset */
    var timeout = setInterval(function() {
      element.style.background = '#FFF';
      clearInterval(timeout);
    }, formColorTime);
  }

  $('#contact-me').click(function () {
    showFeedbackForm();
  });

  function validateEmail() {
    var ebox = $('#feedback-form-email')[0];

    /* Validate the email and provide visual feedback */
    if (emailRe.test(ebox.value))
      return true;
    else {
      flashBgColor(ebox, formColorBad);
      return false;
    }
  }

  function validateMessage() {
    var mbox = $('#feedback-form-message')[0];

    if (mbox.value.replace(/\s*/, '') != '')
      return true;
    else {
      flashBgColor(mbox, formColorBad);
      return false;
    }
  }

  function formIsValid() {
    /* We must be sure to run all validation checks regardless of the success of
     * the others. This ensures that proper visual feedback is given */
    var m = validateMessage();
    var e = validateEmail();

    return m && e;
  }

  /* Clicking on the form send button ensures that form contents are valid. If
   * so, an AJAX request is made and the form is submitted. */
  $(function() {

    $('.feedback-overlay').click(function() {
      hideFeedbackForm();
    });

    $('#feedback-form-cancel').click(function() {
      hideFeedbackForm();
    });

    $('#feedback-form-send').click(function() {
      if (formIsValid()) {
        $.ajax({
          type: 'POST',
          url: '/message.php',
          data: 'email=' + $('#feedback-form-email')[0].value +
            '&message=' + $('#feedback-form-message')[0].value,
          success: function() {
            $('#feedback-form-messageform').fadeOut('fast');

            setTimeout(function() {
              $('#feedback-form-messagesuccess').fadeIn('fast');
            }, 500);

            setTimeout(function() {
              $('.feedback-overlay').fadeOut('fast');
              $('.feedback-form').fadeOut('fast');
            }, 2000);

            setTimeout(function() {
              resetFeedbackForm();
            }, 2500);
          }
        });
      }

      return false;
    });
  });

  /* Validate the contents of the email form automatically */
  $('#feedback-form-email').focusout(function(e) {
    if ($('#feedback-form-email')[0].value != '' && validateEmail())
      flashBgColor($('#feedback-form-email')[0], formColorGood);
  });
});
