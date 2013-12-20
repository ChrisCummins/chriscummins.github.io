<!doctype html>

<html lang="en">

  <head>
    <title>Chris Cummins | Style</title>
    <meta name="description" content="">
    <meta name="author" content="Chris Cummins">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="viewport" content="width=1024" />
    <meta charset="utf-8" />

    <style type="text/css">body{padding-top:60px;}</style>
    <link rel="stylesheet" href="/css/styles.css" />
    <link rel="stylesheet" href="/css/jquery.fancybox.css" />
    <link rel="stylesheet" href="/css/jquery.fancybox-buttons.css" />
    <link rel="stylesheet" href="/css/jquery.fancybox-thumbs.css" />
    <link rel="shortcut icon" href="/img/favicon.ico" />

    <!-- Pad out rows for demo -->
    <style type="text/css">.row { margin-bottom: 40px; }</style>
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
                <li><a href="/software/">Software</a></li>
                <li><a href="/pictures/">Pictures</a></li>
              </ul>
            </div><!--/.nav-collapse -->
          </div>
        </div>
      </div>

      <div class="container">

        <div class="headline">
          <h1 class="headline-title">
            Styles
            <small>Test page for site style</small>
          </h1>
        </div>

        <h3>Featured</h3>
        <div class="row">
          <div class="span3">
            <div class="feature">
              <a href="#fakelink"><h5>Featured 1</h5></a>
              <p>
                Lorem ipsum dolor sit ametq, consectetuer adipiscing
                elit. Nullam dignissim convallis est.q
              </p>
            </div>
          </div>
          <div class="span3">
            <div class="feature">
              <a href="#fakelink"><h5>Featured 2</h5></a>
              <p>
                Lorem ipsum dolor sit ametq, consectetuer adipiscing
                elit. Nullam dignissim convallis est.q
              </p>
            </div>
          </div>
          <div class="span3">
            <div class="feature">
              <a href="#fakelink"><h5>Featured 3</h5></a>
              <p>
                Lorem ipsum dolor sit ametq, consectetuer adipiscing
                elit. Nullam dignissim convallis est.q
              </p>
            </div>
          </div>
          <div class="span3">
            <div class="feature">
              <a href="#fakelink"><h5>Featured 4</h5></a>
              <p>
                Lorem ipsum dolor sit ametq, consectetuer adipiscing
                elit. Nullam dignissim convallis est.q
              </p>
            </div>
          </div>
        </div>

        <h3>Buttons</h3>
        <div class="row">
          <div class="span3">
            <a href="#fakelink" class="btn btn-large btn-block btn-primary">Primary Button</a>
          </div>
          <div class="span3">
            <a href="#fakelink" class="btn btn-large btn-block btn-warning">Warning Button</a>
          </div>
          <div class="span3">
            <a href="#fakelink" class="btn btn-block btn-large">Default Button</a>
          </div>
          <div class="span3">
            <a href="#fakelink" class="btn btn-large btn-block btn-danger">Danger Button</a>
          </div>
        </div> <!-- /row -->

        <div class="row">
          <div class="span3">
            <a href="#fakelink" class="btn btn-large btn-block btn-success">Success Button</a>
          </div>
          <div class="span3">
            <a href="#fakelink" class="btn btn-large btn-block btn-inverse">Inverse Button</a>
          </div>
          <div class="span3">
            <a href="#fakelink" class="btn btn-large btn-block btn-info">Info Button</a>
          </div>
          <div class="span3">
            <a href="#fakelink" class="btn btn-large btn-block disabled">Disabled Button</a>
          </div>
        </div> <!-- /row -->

        <div class="row">

          <div class="span6">
            <h3>Progress bars &amp; Sliders</h3>
            <div class="progress">
              <div class="bar" style="width: 45%;"></div>
            </div>
            <br/>
            <div class="progress">
              <div class="bar" style="width: 40%;"></div>
              <div class="bar bar-warning" style="width: 10%;"></div>
              <div class="bar bar-danger" style="width: 10%;"></div>
              <div class="bar bar-success" style="width: 10%;"></div>
              <div class="bar bar-info" style="width: 10%;"></div>
            </div>
            <br/>
            <div id="slider" class="ui-slider">
              <div class="ui-slider-segment"></div>
              <div class="ui-slider-segment"></div>
              <div class="ui-slider-segment"></div>
            </div>
          </div> <!-- /sliders -->

          <div class="span3 offset3">
            <h3>Menu</h3>
            <select name="herolist" value="X-Men" class="select-block span3">
              <option value="1">Spider Man</option>
              <option value="2">Wolverine</option>
              <option value="3">Captain America</option>
              <option value="X-Men" selected="selected">X-Men</option>
              <option value="Crocodile">Crocodile</option>
            </select>
          </div> <!-- /herolist -->

        </div> <!-- /row -->

        <div class="row">
          <div class="span12">
            <h3>Input</h3>
          </div>
          <div class="span3">
            <input type="text" value="" placeholder="Type here" class="span3" />
          </div>
          <div class="span3">
            <div class="control-group error">
              <input type="text" value="" placeholder="Error" class="span3" />
            </div>
          </div>
          <div class="span3">
            <div class="control-group success">
              <input type="text" value="" placeholder="Success" class="span3" />
              <i class="input-icon fui-check-inverted"></i>
            </div>
          </div>
          <div class="span3">
            <input type="text" value="" placeholder="Disabled" disabled="disabled" class="span3" />
          </div>
        </div> <!-- /row -->

        <div class="row">
          <div class="span3">
            <h3>Navigation</h3>
            <div class="btn-toolbar">
              <div class="btn-group">
                <a class="btn btn-primary" href="#fakelink"><i class="fui-time"></i></a>
                <a class="btn btn-primary" href="#fakelink"><i class="fui-photo"></i></a>
                <a class="btn btn-primary active" href="#fakelink"><i class="fui-heart"></i></a>
                <a class="btn btn-primary" href="#fakelink"><i class="fui-eye"></i></a>
              </div>
            </div> <!-- /toolbar -->
          </div>
          <div class="span3">
            <h3>Pager</h3>
            <ul class="pager">
              <li class="previous">
                <a href="#fakelink">
                  <i class="fui-arrow-left"></i>
                  <span>All messages</span>
                </a>
              </li>
              <li class="next">
                <a href="#fakelink">
                  <i class="fui-arrow-right"></i>
                </a>
              </li>
            </ul> <!-- /pager -->
          </div> <!-- /.span3 -->
          <div class="span6">
            <h3>Pagination</h3>
            <div class="pagination">
              <ul>
                <li class="previous"><a href="#fakelink" class="fui-arrow-left"></a></li>
                <li class="active"><a href="#fakelink">1</a></li>
                <li><a href="#fakelink">2</a></li>
                <li><a href="#fakelink">3</a></li>
                <li><a href="#fakelink">4</a></li>
                <li><a href="#fakelink">5</a></li>
                <li><a href="#fakelink">6</a></li>
                <li class="next"><a href="#fakelink" class="fui-arrow-right"></a></li>
              </ul>
            </div> <!-- /pagination -->
          </div> <!-- /.span6 -->
        </div> <!-- /row -->

        <div class="row">
          <div class="span3">
            <h3>Checkboxes</h3>
            <label class="checkbox" for="checkbox1">
              <input type="checkbox" value="" id="checkbox1" data-toggle="checkbox">
              Unchecked
            </label>
            <label class="checkbox" for="checkbox2">
              <input type="checkbox" checked="checked" value="" id="checkbox2" data-toggle="checkbox" checked="">
              Checked
            </label>
            <label class="checkbox" for="checkbox3">
              <input type="checkbox" value="" id="checkbox3" data-toggle="checkbox" disabled="">
              Disabled unchecked
            </label>
            <label class="checkbox" for="checkbox4">
              <input type="checkbox" checked="checked" value="" id="checkbox4" data-toggle="checkbox" disabled="" checked="">
              Disabled checked
            </label>
          </div> <!-- /checkboxes span3 -->

          <div class="span3">
            <h3>Radio Buttons</h3>
            <label class="radio">
              <input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" data-toggle="radio">
              Radio is off
            </label>
            <label class="radio">
              <input type="radio" name="optionsRadios" id="optionsRadios2" value="option1" data-toggle="radio" checked="">
              Radio is on
            </label>

            <label class="radio">
              <input type="radio" name="optionsRadiosDisabled" id="optionsRadios3" value="option2" data-toggle="radio" disabled="">
              Disabled radio is off
            </label>
            <label class="radio">
              <input type="radio" name="optionsRadiosDisabled" id="optionsRadios4" value="option2" data-toggle="radio" checked="" disabled="">
              Disabled radio is on
            </label>
          </div> <!-- /radios span3 -->

          <div class="span3">
            <h3>Switches</h3>

            <table width="100%">
              <tr>
                <td width="50%" class="pbm">
                  <input type="checkbox" checked="" data-toggle="switch" />
                </td>

                <td class="pbm">
                  <input type="checkbox" data-toggle="switch" />
                </td>
              </tr>
              <tr>
                <td class="pbm">
                  <div class="switch switch-square"
                       data-on-label="<i class='fui-check'></i>"
                       data-off-label="<i class='fui-cross'></i>">
                    <input type="checkbox" />
                  </div>
                </td>

                <td class="pbm">
                  <div class="switch switch-square"
                       data-on-label="<i class='fui-check'></i>"
                       data-off-label="<i class='fui-cross'></i>">
                    <input type="checkbox" checked="" />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" disabled data-toggle="switch" />
                </td>

                <td>
                  <input type="checkbox" checked disabled data-toggle="switch" />
                </td>
              </tr>
            </table>
          </div> <!-- /toggles span3 -->

          <div class="span3">
            <h3>Tags</h3>
            <input name="tagsinput" id="tagsinput" class="tagsinput" value="Clean,Fresh,Modern,Unique" />
          </div>
        </div> <!-- /row -->

        <div class="row">
          <div class="span3">
            <h3>Share</h3>
            <div class="share mrl">
              <ul>
                <li>
                  <label class="share-label" for="share-toggle2">Facebook</label>
                  <input type="checkbox" data-toggle="switch" />
                </li>
                <li>
                  <label class="share-label" for="share-toggle4">Twitter</label>
                  <input type="checkbox" checked="" data-toggle="switch" />
                </li>
                <li>
                  <label class="share-label" for="share-toggle6">Pinterest</label>
                  <input type="checkbox" data-toggle="switch" />
                </li>
              </ul>
              <a href="#" class="btn btn-primary btn-block btn-large">Share</a>
            </div> <!-- /share -->
          </div>

          <div class="span3">
            <div class="demo-tooltips">
              <h3>Tooltips</h3>
              <p align="center" data-toggle="tooltip" data-placement="bottom"
                 style="margin-top: 130px;" title="Tooltip under the text."></p>
              <p align="center" data-toggle="tooltip"
                 title="Here is the sample of talltooltip that contains three lines or more. More."></p>
            </div>
          </div> <!-- /span3 with tooltips -->

          <div class="span6">
            <div class="demo-text-box prl">
              <h3>Text Box</h3>
              <p><strong>Lato</strong> is free web-font designed by <strong>Lukasz&nbsp;Dziedzic</strong> from Warsaw.</p>

              <p>Here you can feel the color, size, line height and margins between paragraphs. Don’t forget to underline
                your links, they are an important <a href="#">visual marker</a> for users.</p>
              <p>Also, to attract attention you can mark some&nbsp;important words using <strong>bold weights</strong>.</p>
            </div>
          </div> <!-- /text box -->

        </div> <!-- /row -->

        <div class="row">
          <div class="span3">
            <h3>Ordered List</h3>
            <ol>
              <li>List Item 1</li>
              <li>List Item 2</li>
              <li>List Item 3</li>
            </ol>
          </div>

          <div class="span3">
            <h3>Unordered List</h3>
            <ul>
              <li>List Item 1</li>
              <li>List Item 2</li>
              <li>List Item 3</li>
            </ul>
          </div>

          <div class="span6">
            <h3>Quotes</h3>
            <blockquote>
              <p>
                Computers in the future may weigh no more than 1.5 tons.
              </p>
              <small>Popular Mechanics, 1949</small>
            </blockquote>
          </div>

        </div>

        <div class="row">
          <div class="span6">
            <h3>Table</h3>
            <table class="table">
              <tr>
                <th>A</th><th>B</th><th>C</th>
              </tr>
              <tr>
                <td>apple</td><td>banana</td><td>coconut</td>
              </tr>
              <tr class="even">
                <td>alpha</td><td>bravo</td><td>charlie</td>
              </tr>
              <tr>
                <td>aardvark</td><td>beetle</td><td>cat</td>
              </tr>
            </table>
          </div>

          <div class="span6">
            <h3>Preformatted</h3>
            <pre>Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. Nam sit amet sem. Aliquam libero nisi, imperdiet at, tincidunt nec, gravida vehicula, nisl. Praesent mattis, massa quis luctus fermentum, turpis mi volutpat justo, eu volutpat enim diam eget metus. Maecenas ornare tortor. Donec sed tellus eget sapien fringilla nonummy. <acronym title="National Basketball Association">NBA</acronym> Mauris a ante. Suspendisse quam sem, consequat at, commodo vitae, feugiat in, nunc. Morbi imperdiet augue quis tellus. <abbr title="Avenue">AVE</abbr></pre>
          </div>
        </div>

        <div class="row">
          <div class="span12">
            <h3>Gallery</h3>
            <div class="gallery">
              <center>
                <div class="thumbnail">
                  <a class="fancybox" rel="gallery"
                     href="/pictures/img/b1bb546868e772d9cef41303b7383218.jpg">
                    <img src="/pictures/img/b1bb546868e772d9cef41303b7383218-thumb.jpg" />
                  </a>
                </div>
                <div class="thumbnail">
                  <a class="fancybox" rel="gallery"
                     href="/pictures/img/b8202bb2b8e16d8fc04df6ac74f81fdd.jpg">
                    <img src="/pictures/img/b8202bb2b8e16d8fc04df6ac74f81fdd-thumb.jpg" />
                  </a>
                </div>
                <div class="thumbnail">
                  <a class="fancybox" rel="gallery"
                     href="/pictures/img/1e6ee2674312b3767a7cd6c8ba1c2c77.jpg">
                    <img src="/pictures/img/1e6ee2674312b3767a7cd6c8ba1c2c77-thumb.jpg" />
                  </a>
                </div>
                <div class="thumbnail">
                  <a class="fancybox" rel="gallery"
                     href="/pictures/img/3ead816af0403f4e1c3280868bd5f248.jpg">
                    <img src="/pictures/img/3ead816af0403f4e1c3280868bd5f248-thumb.jpg" />
                  </a>
                </div>
              </center>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="span6">
            <h1>Heading 1</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nullam
              dignissim convallis est. Quisque aliquam. Donec faucibus. Nunc
              iaculis suscipit dui. Nam sit amet sem. Aliquam libero nisi,
              imperdiet at, tincidunt nec, gravida vehicula, nisl. Praesent
              mattis, massa quis luctus fermentum, turpis mi volutpat justo, eu
              volutpat enim diam eget metus.
            </p>
            <h3>Heading 3</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nullam
              dignissim convallis est. Quisque aliquam. Donec faucibus. Nunc
              iaculis suscipit dui. Nam sit amet sem. Aliquam libero nisi,
              imperdiet at, tincidunt nec, gravida vehicula, nisl. Praesent
              mattis, massa quis luctus fermentum, turpis mi volutpat justo, eu
              volutpat enim diam eget metus.
            </p>
            <h5>Heading 5</h5>
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nullam
              dignissim convallis est. Quisque aliquam. Donec faucibus. Nunc
              iaculis suscipit dui. Nam sit amet sem. Aliquam libero nisi,
              imperdiet at, tincidunt nec, gravida vehicula, nisl. Praesent
              mattis, massa quis luctus fermentum, turpis mi volutpat justo, eu
              volutpat enim diam eget metus.
            </p>
          </div>
          <div class="span6">
            <h2>Heading 2</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nullam
              dignissim convallis est. Quisque aliquam. Donec faucibus. Nunc
              iaculis suscipit dui. Nam sit amet sem. Aliquam libero nisi,
              imperdiet at, tincidunt nec, gravida vehicula, nisl. Praesent
              mattis, massa quis luctus fermentum, turpis mi volutpat justo, eu
              volutpat enim diam eget metus.
            </p>
            <h4>Heading 4</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nullam
              dignissim convallis est. Quisque aliquam. Donec faucibus. Nunc
              iaculis suscipit dui. Nam sit amet sem. Aliquam libero nisi,
              imperdiet at, tincidunt nec, gravida vehicula, nisl. Praesent
              mattis, massa quis luctus fermentum, turpis mi volutpat justo, eu
              volutpat enim diam eget metus.
            </p>
            <h6>Heading 6</h6>
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nullam
              dignissim convallis est. Quisque aliquam. Donec faucibus. Nunc
              iaculis suscipit dui. Nam sit amet sem. Aliquam libero nisi,
              imperdiet at, tincidunt nec, gravida vehicula, nisl. Praesent
              mattis, massa quis luctus fermentum, turpis mi volutpat justo, eu
              volutpat enim diam eget metus.
            </p>
          </div>

        </div> <!-- /.row -->

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
	  <img src="/img/check.png">
	  <br /><br />
	  Thanks for getting in touch!
        </center>
      </div>
    </div>
  </body>

  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
  <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.4/jquery.fancybox.pack.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.0.6/jquery.mousewheel.min.js"></script>
  <script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
  <script src="/js/fancybox-extras.js"></script>
  <script src="/js/site-components.js"></script>
  <script src="/js/site.js"></script>

  <script>
    $(document).ready(function() {
      $(".fancybox").fancybox({
        openEffect	: 'fade',
        closeEffect	: 'fade',
        helpers : {
          overlay : {
            css : {
              'background' : 'rgba(0, 0, 0, 0.9)'
            }
          }
        }
      });
    });

    $(function() {

      // Custom Select
      $("select[name='herolist']").selectpicker({style: 'btn-primary', menuStyle: 'dropdown-inverse'});

      // Tooltips
      $("[data-toggle=tooltip]").tooltip("show");

      // Tags Input
      $(".tagsinput").tagsInput();

      // jQuery UI Sliders
      var $slider = $("#slider");
      if ($slider.length) {
        $slider.slider({
          min: 1,
          max: 5,
          value: 2,
          orientation: "horizontal",
          range: "min"
        }).addSliderSegments($slider.slider("option").max);
      }

      // Placeholders for input/textarea
      $("input, textarea").placeholder();

      // Make pagination demo work
      $(".pagination a").on('click', function() {
        $(this).parent().siblings("li").removeClass("active").end().addClass("active");
      });

      $(".btn-group a").on('click', function() {
        $(this).siblings().removeClass("active").end().addClass("active");
      });

      // Disable link clicks to prevent page scrolling
      $('a[href="#fakelink"]').on('click', function (e) {
        e.preventDefault();
      });

      // Switch
      $("[data-toggle='switch']").wrap('<div class="switch" />').parent().bootstrapSwitch();

    });
  </script>

</html>
