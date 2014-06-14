<?php
	header('Content-type: text/html; charset=utf8');
?>
<!doctype HTML>
<html>
	<head>
		<title>Карты. Дипломный проект.</title>
		<script type="text/javascript" src="/jquery.js"></script>
		<script type="text/javascript" src="/AG-map/AG-config.js"></script>
		<script type="text/javascript" src="/AG-map/AG-map.js"></script>
		<script type="text/javascript" src="/starter.js"></script>
		<link rel="stylesheet" type="text/css" href="styles.css"></link>
		<script type="text/javascript">
			var position_X = <?= (float)$_GET['x']; ?>;
			var position_Y = <?= (float)$_GET['y']; ?>;
			var scale = 100;
		</script>
 	</head>
	<body>
		<div id="AG-map"></div>
	</body>
</html>