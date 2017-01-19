<!DOCTYPE html>
<html>
    <head>
		<title>Crowd Density Mapper</title>
		<link rel="icon" href="favicon.ico" />	
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="css/bootstrap.min.css" />
		<link rel="stylesheet" href="css/leaflet.css" /> 
		<link href="css/bootstrap.min.css" rel="stylesheet">
		<link href="css/style.css" rel="stylesheet" type="text/css">
    </head>

    <body>
		<!--navbar settings -->
        <nav class="navbar navbar-fixed-top navbar-default">
		<div class="container-fluid">	
			<!-- Toggle for better mobile display -->			
			<div class="navbar-header">
				<p class="navbar-brand navbar-center"><strong>Crowd Density Mapper</strong></p>
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"> <!--aria-expanded="true" aria-controls="navbar">-->
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="favicon.ico">
        			<img src="favicon.ico" width="25" height="25">
				</a>
			</div>
			
			<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
				<ul class="nav navbar-nav">
					<li><a href="index.html">Application</a></li>
					<li class="active"><a href="#">Getting started <span class="sr-only"></span></a></li>
				</ul>
			</div>
		</div>
	</nav>

	<!-- Content of the Help page-->
	<div><br><br><br></div>
    <div>
		<div class="container-fluid">
			<div class="row">
				<div class="col-xs-12 col-md-6 col-md-offset-3">
					<div class="panel panel-default">
						<div class="panel-heading">
							<h3 class="panel-title"><strong>How to use the Crowd Density Mapper Application</strong></h3>
					    </div>
						<div class="panel-body">
							<strong>The Application</strong> <br><br>
							This Application displays the density of a croud right around the users location. <br>
							For this reason the user is requested to activate the GPS device in his smartphone and allow
							the browser to use his actual location. <br>
							If the user does not allow the Application the use of the location he can't use it. <br><br><br>
							<strong> Usage </strong> <br><br>
							To update the displayed data simply press the "Refresh" button.  
						</div>
					</div>
					<div>
                    <?php
                        if($_GET["error"] === "1") echo "<p id="error1"> User denied the request for Geolocation.</p>";
                        if($_GET["error"] === "2") echo "Location information is unavailable.";
                        if($_GET["error"] === "3") echo "The request to get user location timed out.";
                        if($_GET["error"] === "4") echo "An unknown error occurred.";
                    ?>
                    </div>
				</div>
			</div>
		</div>
		</div>
    </div>

	<script src="js/jsnlog.min.js"></script>
	<script src="js/jquery-3.1.1.min.js"></script> 
	<script src = "js/leaflet.js"> </script>
	<script src="js/bootstrap.min.js"></script>
	<script src = "js/map.js"> </script>

	</body>
</html>
    