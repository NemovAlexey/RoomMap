<?php

$GLOBALS['database'] = new PDO('mysql:dbname=RoomMap;host=127.0.0.1','root','');
$GLOBALS['database']->Exec("SET NAMES utf8");

/*
* @return array список слоев
*/
function getLayersList(){
	$layers = $GLOBALS['database']->Query("SELECT * FROM layers");
	$listOfLayers = array();
	while($layer = $layers->Fetch(PDO::FETCH_ASSOC)){
		array_push($listOfLayers,array('id' => $layer['id_layer'],'code' => $layer['layer_code'],'name' => json_decode($layer['layer_name'],true),'description' => json_decode($layer['layer_description'],true)));
	}	
	return $listOfLayers;
}

/*
* @return array список уровней
*/
function getLevelsList(){
	$levels = $GLOBALS['database']->Query("SELECT * FROM levels");
	$listOfLevels = array();
	while($level = $levels->Fetch(PDO::FETCH_ASSOC)){
		array_push($listOfLevels,array('id' => $level['id_level'],'code' => $level['id_level'],'name' => json_decode($level['level_name'],true),'description' => json_decode($level['level_description'],true)));
	}	
	return $listOfLevels;
}

/*
* @return array список SVG объектов
*/
function getListSVGObject($xMin, $yMin, $xMax, $yMax, $level, $layer){
	if(!$layer) $layer = 'IS NULL';
	else $layer = "= '".$layer."'";
	$query = "SELECT o.id, o.min_x, o.min_y, o.max_x, o.max_y, o.title, o.content FROM objects o
					LEFT JOIN layers l ON o.id_layer = l.id_layer
						WHERE l.layer_code ".$layer."
							AND o.id_level = ".$level."
							AND ((o.min_x >= ".$xMin." AND o.min_x <= ".$xMax." AND o.min_y >= ".$yMin." AND o.min_y <= ".$yMax.") OR (o.max_x <= ".$xMax." AND o.max_x >= ".$xMin." AND o.max_y <= ".$yMax." AND o.max_y >= ".$yMin."))";
	
	$objects = $GLOBALS['database']->Query($query);
 	$listOfSVG = array();
	while($object = $objects->Fetch(PDO::FETCH_ASSOC)){
		array_push($listOfSVG,array('id' => $object['id'], 'min_x' => $object['min_x'], 'min_y' => $object['min_y'], 'max_x' => $object['max_x'], 'max_y' => $object['max_y'], 'title' => $object['title'], 'content' => $object['content']));
	}
	return $listOfSVG;
}

/*
* @return string HTML код - описание объекта
*/
function  getSvgObjectDetails($svg_id, $level){
	sleep(1);
	$query = "SELECT description FROM objects WHERE id = ".$svg_id;

	$objects = $GLOBALS['database']->Query($query);
	$object = $objects->Fetch(PDO::FETCH_ASSOC);

	return $object['description'];
}


/*
* @return array - description, title 
*/
function getSvgDataForEdit($id){
	// Проверка логина
	session_start();
	if(!$_SESSION['editorMode']) return array('error' => 'Login error');


	$query = "SELECT 
					o.id as id_object,
					o.title,
					o.description
				FROM objects o WHERE o.id = ".$id;

	$data = $GLOBALS['database']->Query($query);
	return $row = $data->Fetch(PDO::FETCH_ASSOC);
}


/*
* @return bool - true в случае успеха
*/
function saveData($dataArray){
	// Проверка логина
	session_start();
	if(!$_SESSION['editorMode']) return 0;

	// Новый объект
	if($dataArray['new']){
		// Идентификатор слоя
		$data = $GLOBALS['database']->Query("SELECT id_layer FROM layers WHERE layer_code = '".$dataArray['layer']."'");
		$id_layer = $data->fetchColumn();

		// Добавляем объект
		$coords = json_decode($dataArray['coords'],1);
		$query = "INSERT INTO objects (id,id_level,id_layer,min_x,min_y,max_x,max_y,title,description,content) VALUES (NULL,".$dataArray['level'].",".$id_layer.",".$coords['min_x'].",".$coords['min_y'].",".$coords['max_x'].",".$coords['max_y'].",'".$dataArray['title']."','".$dataArray['content']."','".$dataArray['object']."')";
		$GLOBALS['database']->Query($query);
	}
	// Редактирование существующего
	else{
		// Обновляем объект
		$coords = json_decode($dataArray['coords'],1);
		$query = "UPDATE objects SET content = '".$dataArray['object']."', min_x = '".$coords['min_x']."', min_y = '".$coords['min_y']."', max_x = '".$coords['max_x']."', max_y = '".$coords['max_y']."', title = '".$dataArray['title']."', description = '".$dataArray['content']."' WHERE id = ".$dataArray['id_obj'];
		$GLOBALS['database']->Query($query);
	}

	return 1;
}


switch($_POST['data']){
	case 'getlists': 
		echo json_encode(array('layers' => getLayersList(), 'levels' => getLevelsList()));
		break;
	case 'getsvg':
		echo json_encode(array('svg' => getListSVGObject($_POST['min_x'],$_POST['min_y'],$_POST['max_x'],$_POST['max_y'],$_POST['level'],$_POST['layer'])));
		break;
	case 'getdetails':
		echo json_encode(array('details' => getSvgObjectDetails((int)$_POST['object_id'], (int)$_POST['level'])));
		break;
	case 'getSvgDataForEdit':
		echo json_encode(getSvgDataForEdit((int)$_POST['id']));
		break;
	case 'saveData':
		echo saveData($_POST);
		break;
}


?>