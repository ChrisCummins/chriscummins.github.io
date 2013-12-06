<!DOCTYPE html>

<html lang="en">

  <head>
    <title>Chris Cummins | Boids - Flocking Algorithms</title>
    <meta name="description" content="">
    <meta name="author" content="Chris Cummins">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="viewport" content="width=1024" />
    <meta charset="utf-8" />

    <link rel="stylesheet" href="/css/styles.css" />
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/3.1.0/css/font-awesome.css" />
    <link rel="shortcut icon" href="/img/favicon.ico" />

    <style type="text/css">
      body {
        background-color: #83caff;
      }
      p {
        color: #ebedef;
      }
      canvas {
        margin: 0;
      }
      #show-settings {
        position: absolute;
        bottom: 0;
        right: 0;
        background-color: #2b70a6;
        width: 46px;
        height: 41px;
      }
      #show-settings:hover,
      #show-settings:focus {
        background-color: #7aa1bf;
      }
      #settings {
        position: absolute;
        top: 0;
        box-sizing:border-box;
        -moz-box-sizing:border-box;
        width: 100%;
        padding: 15px;
        background-color: #2b70a6;
        display: none;
      }
      #mouse-behaviour .switch-left {
        padding-left: 2px;
        text-align: left;
      }
      #settings,
      #show-settings {
        opacity: 0.8;
      }
      .row-fluid {
        margin-top: 46px;
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

      <div id="container"></div>

      <button id="show-settings" class="btn btn-block">
        <center><i class="icon-cog icon-large"></i></center>
      </button>

      <div id="settings">
        <div class="row-fluid">
          <div class="span4">
            <p id="cohesion" class="pull-right"></p>
            <p><b>Rule 1</b> Cohesion</p>
            <div id="cohesion-slider" class="conf-slider slider-success"></div>

            <p id="alignment" class="pull-right"></p>
            <p><b>Rule 2</b> Alignment</p>
            <div id="alignment-slider" class="conf-slider slider-success"></div>

            <p id="separation" class="pull-right"></p>
            <p><b>Rule 3</b> Separation</p>
            <div id="separation-slider" class="conf-slider slider-success"></div>
          </div>

          <div class="span4">
            <p id="no-of-boids" class="pull-right"></p>
            <p>Number of boids</p>
            <div id="no-of-boids-slider" class="conf-slider"></div>

            <p id="speed" class="pull-right"></p>
            <p>Speed</p>
            <div id="speed-slider" class="conf-slider"></div>

            <p id="sight" class="pull-right"></p>
            <p>Line of Sight</p>
            <div id="sight-slider" class="conf-slider"></div>
          </div>

          <div class="span4">

            <div id="first-person" class="switch switch-square pull-right">
              <input type="checkbox" />
            </div>
            <p style="margin-bottom: 21px;">Boid-cam&trade;</p>

            <div id="mouse-behaviour" class="switch switch-square pull-right"
                 data-on-label="Friend" data-off-label="Foe">
              <input type="checkbox" checked="" />
            </div>
            <p style="margin-bottom: 21px;">Mouse behaviour</p>

            <div id="stats-visible" class="switch switch-square pull-right">
              <input type="checkbox" />
            </div>
            <p style="margin-bottom: 21px;">Performance stats</p>

            <button id="reset" class="btn btn-large btn-block btn-danger">Reset</button>
          </div>
        </div>
      </div>
    </div>
  </body>

  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
  <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
  <script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
  <script src="//cdn.jsdelivr.net/jquery.hotkeys/0.1.0/jquery.hotkeys.js"></script>
  <script src="/js/site-components.js"></script>
  <script src="/js/three.min.js"></script>
  <script src="/js/stats.min.js"></script>
  <script src="/js/boids.js"></script>

</html>
