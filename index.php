<?php
	header('Content-type: text/html; charset=utf8');
?>
<!doctype HTML>
<html>
	<head>
		<title>Room-map. Дипломный проект.</title>
		<script type="text/javascript" src="/jquery.js"></script>
		<script type="text/javascript" src="/Room-map/Room-config.js"></script>
		<script type="text/javascript" src="/Room-map/Room-map.js"></script>
		<script type="text/javascript" src="/Room-map/Langs/Room-map-langs.js"></script>
		<link rel="stylesheet" type="text/css" href="styles.css"></link>
		<script type="text/javascript">
			var position_X = <?= (float)$_GET['x']; ?>;
			var position_Y = <?= (float)$_GET['y']; ?>;
			var scale = 100;
			$().ready(function(){
				initMap();
			});
		</script>
 	</head>
	<body>
		<div id="Room-map"></div>
	</body>
</html>