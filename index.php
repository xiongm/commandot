<!DOCTYPE html>
<html>
<head>
  <title> Commandot </title>
  <link rel="stylesheet" href="./css/style.css" />
  <link rel="stylesheet" href="./css/font-awesome/css/font-awesome.min.css">
</head>

<script src="./js/jquery/jquery-2.1.4.min.js"></script>
<script src="./js/jquery/validate-1.14.0/jquery.validate.min.js"></script>
<script src="./js/jquery/validate-1.14.0/additional-methods.min.js"></script>
<script src="./load.js"></script>

<body>
<!-- Header -->
<div id="header">
  <div id="branding">
    <h1 id="page_title"><a id="home" href="./">Commandot</a></h1>
  </div>
  <div id="actions">
    <ul class="actionCont collapsed">
      <li class="actionItem"> 
      <a class="aiButton" id="add-commandot" title="Add new commandot" href="#new">
	<span class="icon-plus"></span>
	Add
      </a>
      </li>
    </ul>
  </div>
</div>
<!-- Header -->


<!-- Vertical Menu -->
<div id="vertical-menu">
  <ul>
    <li class="active">
    <h3 class="toggler">About</h3>
    <div class="underline">
      <div class="item">
	<p>
	<label>Commandot is a jquery+php web app that turns any non-interactive command line output to browser</label>
	</p>
	<p>
	<label>Version 0.1</label>
	</p>
      </div>
    </div>
    </li>
  </ul>
</div>
<!-- Vertical Menu -->

<!-- Commandot list -->
<div id="commandotlist-wrapper"></div>
<!-- Commandot list -->


<!-- hidden add commandot form -->
<div class="overlay">
  <div class="form-container">
    <h2> Add Commandot</h2>
    <form id="add_commandot_form">
      <dl> 
	<dt>
	<label for="title">Name</label>
	</dt>
	<dd>
	<input type="text" id="commandot_name" name="commandot_name"/>
	</dd>
      </dl>
    </form>
    <button id="cancel_btn" class="dialogbutton">Cancel</button>
    <button id="save_btn" class="dialogbutton">OK</button>
  </div>
</div>
<!-- hidden add commandot form -->

</body>
</html>
