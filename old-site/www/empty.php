<!doctype html>

<html lang="en">

  <head>
    <title>Chris Cummins | Software</title>
    <meta name="description" content="">
    <meta name="author" content="Chris Cummins">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="viewport" content="width=1024" />
    <meta charset="utf-8" />

    <link rel="stylesheet" href="/css/styles.css" />
    <link rel="shortcut icon" href="/img/favicon.ico" />
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

      <div class="navbar">
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
        <!-- empty -->
      </div>

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
	  <img src="/img/check.png">
	  <br /><br />
	  Thanks for getting in touch!
        </center>
      </div>
    </div>

  </body>

  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
  <script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
  <script src="/js/site.js"></script>

</html>
