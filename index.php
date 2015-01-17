<? session_start(); $_SESSION['editorMode'] = 1;?>
<!doctype HTML>
<html>
	<head>
		<title>Room-map. Дипломный проект.</title>
		<script type="text/javascript" src="/Room-map/Room-map.js"></script>
		<script type="text/javascript">
			RoomMap.position_X = <?= (float)$_GET['x']; ?>;
			RoomMap.position_Y = <?= (float)$_GET['y']; ?>;
			RoomMap.scale = <?= (int)$_GET['scale'] ?>;
			RoomMap.layer = '<?= preg_match('#^[a-z]+$#i',$_GET['layer']) ? $_GET['layer'] : '' ?>';
			RoomMap.level = <?= (int)$_GET['level'] ?>;
			RoomMap.editorMode = <?= (int)$_SESSION['editorMode'] ?>;
			RoomMap.initMapTo('Room-map');
		</script>
 	</head>
	<body>
		<div id="Room-map"></div>
	</body>
</html>