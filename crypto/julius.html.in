<!doctype html>

<html lang="en">
  <head>
    <title>Chris Cummins | Julius - Frequency Distribution Cryptanalysis</title>
    <meta name="description" content="This web tool visualizes instruction source operand regions for the Intel Graphics GEN architecture.">
    <meta name="author" content="Chris Cummins">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="viewport" content="width=1024" />
    <meta charset="utf-8" />

    <style type="text/css">body{padding-top:60px;}</style>
    <link rel="stylesheet" href="/assets/css/styles.css" />
    <link rel="shortcut icon" href="/assets/img/favicon.ico" />

    <style>
      #textarea {
        resize: none;
      }

      #textarea,
      #container {
        margin: 0 auto;
      }

      #container {
        height: 300px;
      }

      button {
        min-width: 110px;
      }

      p.lead {
        padding-top: 6px;
      }
    </style>
  </head>

  <body>

    <!-- Google Analytics -->
    <script type="text/javascript">
      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-40829804-1']);
      _gaq.push(['_trackPageview']);

      (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();
    </script>

    <div id="wrap">

      <div class="navbar navbar-fixed-top">
        <div class="navbar-inner">
          <div class="container">
            <button type="button" class="btn btn-navbar"
                    data-toggle="collapse" data-target=".nav-collapse">
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="brand" href="http://chriscummins.cc">chriscummins.cc</a>
            <div class="nav-collapse collapse pull-right">
              <ul class="nav">
                <li><a href="/">Home</a></li>
                <li><a href="/blog/">Blog</a></li>
                <li><a href="/music/">Music</a></li>
                <li class="active"><a href="/software/">Software</a></li>
                <li><a href="/pictures/">Pictures</a></li>
              </ul>
            </div><!--/.nav-collapse -->
          </div>
        </div>
      </div> <!-- /.navbar -->

      <div class="container">

        <div class="headline">
          <h1 class="headline-title">
            Julius
            <small>The Caesar Shifter</small>
          </h1>
        </div>

        <div class="row">
          <div class="span6">
            <!-- input -->
      	    <textarea id="textarea" class="spanFull" rows="12"
                      placeholder="Type your message here"></textarea>

            <!-- (padding) -->
            <p style="margin: 0; visibility: hidden;">P</p>

            <!-- slider -->
	    <section>
	      <div id="shift-slider"></div>
	    </section>

            <div class="btn-group pull-right">
              <button id="shift-auto" class="btn btn-success" disabled>
                Auto
              </button>
            </div>
            <center>
              <p id="shift-label" class="lead"
                 style="margin-left: 110px;">
                0 shift
              </p>
            </center>

          </div> <!-- /.span -->

          <div class="span6">
            <!-- chart -->
            <div id="container"></div>

            <!-- (padding) -->
            <p style="margin: 0; visibility: hidden;">P</p>

            <!-- slider -->
	    <section>
	      <div id="lang-slider"></div>
	    </section>

            <div class="btn-group pull-right">
              <button id="lang-auto" class="btn btn-success" disabled>
                Auto
              </button>
            </div>
            <center>
              <p id="lang-label" class="lead"
                 style="margin-left: 110px;">
                English
              </p>
            </center>

          </div> <!-- /.span -->

        </div> <!-- /.row -->

        <div class="row" style="margin-top: 20px">
          <div class="span6">
            <h3>Shift Ciphers</h3>

            <p>
              By 50 BC, <a href="http://en.wikipedia.org/wiki/Julius_Caesar"
              target="_blank">Julius Caesar</a> had discovered the importance of
              protecting sensitive military data and was using a primitive
              substitution cipher to encrypt his messages to generals. According
              to <a href="http://en.wikipedia.org/wiki/Suetonius"
              target="_blank">Gaius Suetonius</a>, Caesar would encode message
              such that the first letter of the alphabet become the fourth, the
              second would become the fifth and so on, with X Y and Z wrapping
              around to be A B and C respectively. In formal notation, this can
              be described as:

              <div class="equation">
                <img src="/assets/img/shift-p3.gif"/>
              </div>

              Where 26 is the size of
              the <a href="http://en.wikipedia.org/wiki/Modular_arithmetic"
              target="_blank">modulus</a>, in the case being the number of
              letters in the range [A, Z].
            </p>

            <p>
              By entering a message into the text box on this page, you can drag
              the slider around to see how shifting the letters affects the
              text by performing a transformation of size <i>n</i>:

              <div class="equation">
                <img src="/assets/img/shift-pn.gif"/>
              </div>

              The auto button will attempt to decipher a message by analysing
              the letter frequency distribution (see right) and selecting the
              closest match to the given language.
            </p>

          </div> <!-- /span -->

          <div class="span6">
            <h3>Letter frequency</h3>
            <p>
              The Latin character set used in English contains 26 letters, but
              their usage in language is not uniform. For example, the
              letter <i>E</i> is used 15 times in this sentence, but the
              letter <i>X</i> occurs only twice. The frequency of a specific
              letter in a given body of text can be found using:

              <div class="equation">
                <img src="/assets/img/letter-distribution.gif"/>
              </div>

              It is possible to create an average letter frequency distribution
              by analysing enough text of a specific language. This gives each
              language a characteristic 'footprint'. For example, the
              letter <i>E</i> is the most common letter in English, whereas the
              letter <i>A</i> is the most frequently used letter in Esperanto.
            </p>
            <p>
              Moving the language slider on this page allows you to compare the
              different letter frequency distributions of several European
              languages and to compare that against the letter frequency
              distribution of a given message.
            </p>
            <p>
              The Auto button will attempt to identify the language of a given
              message by analysing the letter frequency distribution. It should
              be noted that this is not the accuracy of this guessing algorithm
              is limited by the fact that accented letters are not considered.
            </p>
          </div> <!-- /span -->
        </div> <!-- /.row -->

        <div class="row">
          <div class="span6 offset3">
            <blockquote class="footer-quote">
              <p>Experience is the teacher of all things.</p>
              <small>Julius Caesar</small>
            </blockquote>
          </div>
        </div>

      </div> <!-- /.container -->
      <div id="push"></div>
    </div> <!-- /#wrap -->

    <!-- Site footer -->
    <div class="footer">
      <div class="container wrapper">
        <div class="pull-right">
          <!-- twitter tweet -->
          <a href="https://twitter.com/share" class="twitter-share-button" data-url="http://chriscummins.cc" data-via="iamchriscummins" data-dnt="true">Tweet</a>
          <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>
          <!-- facebook like -->
          <iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Fchriscummins.cc&amp;send=false&amp;layout=button_count&amp;width=110&amp;show_faces=false&amp;font&amp;colorscheme=light&amp;action=like&amp;height=21"
                  scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:110px; height:21px;" allowTransparency="true"></iframe>
          <!-- github watch -->
          <iframe src="http://ghbtns.com/github-btn.html?user=ChrisCummins&repo=chriscummins.cc&type=watch&count=true"
                  allowtransparency="true" frameborder="0" scrolling="0" width="110" height="21"></iframe>
        </div>

        <div class="footer-collapse">
          <p class="muted">
            &copy; 2013 Chris Cummins |
            <a id="contact-me">Send me a message</a>
          </p>
        </div>
      </div>
    </div> <!-- /.footer -->

    <!-- The feedback form -->
    <div class="feedback-overlay"></div>
    <div class="feedback-form">
      <form id="feedback-form-messageform" name="contactme" action="">
      	<p>Send me a message</p>
      	<textarea id="feedback-form-message" name="message"></textarea>
      	<p>Email</p>
      	<input id="feedback-form-email" name="email" type="text" autocomplete="off" /><br />
      	<input id="feedback-form-cancel" class="btn btn-large btn-warning" type="reset" value="Cancel" />
      	<input id="feedback-form-send" class="btn btn-large btn-success" type="submit" value="Send" />
      </form>
      <div id="feedback-form-messagesuccess">
        <center>
	  <br /><br /><br /><br /><br /><br />
	  <img src="/assets/img/check.png">
	  <br /><br />
	  Thanks for getting in touch!
        </center>
      </div>
    </div>

  </body>

  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
  <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
  <script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
  <script src="//code.highcharts.com/highcharts.js"></script>
  <script src="//code.highcharts.com/modules/exporting.js"></script>
  <script src="/assets/js/site-components.js"></script>
  <script src="/assets/js/site.js"></script>
  <script src="/assets/js/julius.js"></script>

</html>
