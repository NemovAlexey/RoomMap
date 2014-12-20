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
	$query = "SELECT o.id, o.min_x, o.min_y, o.max_x, o.max_y, t.title, o.id_description, o.content FROM objects o
					LEFT JOIN layers l ON o.id_layer = l.id_layer
					LEFT JOIN titles t ON o.id_title = t.id_title
						WHERE l.layer_code ".$layer."
							AND FIND_IN_SET(".$level.",o.id_levels)
							AND ((o.min_x >= ".$xMin." AND o.min_x <= ".$xMax." AND o.min_y >= ".$yMin." AND o.min_y <= ".$yMax.") OR (o.max_x <= ".$xMax." AND o.max_x >= ".$xMin." AND o.max_y <= ".$yMax." AND o.max_y >= ".$yMin."))";
	
	$objects = $GLOBALS['database']->Query($query);
 	$listOfSVG = array();
	while($object = $objects->Fetch(PDO::FETCH_ASSOC)){
		array_push($listOfSVG,array('id' => $object['id'], 'min_x' => $object['min_x'], 'min_y' => $object['min_y'], 'max_x' => $object['max_x'], 'max_y' => $object['max_y'], 'title' => $object['title'], 'id_description' => $object['id_description'],'content' => $object['content']));
	}
	return $listOfSVG;
}

/*
* @return string HTML код - описание объекта
*/
function  getSvgObjectDetails($svg_id, $level){
	$query = "SELECT d.content FROM objects o
				LEFT JOIN descriptions d ON o.id_description = d.id_description
					WHERE o.id = ".$svg_id."
						AND FIND_IN_SET(".$level.",d.id_level)";

	$objects = $GLOBALS['database']->Query($query);
	$object = $objects->Fetch(PDO::FETCH_ASSOC);

	return $object['content'];
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
					t.id_title,
					t.title,
					d.id_description,
					d.content
				FROM objects o 
				LEFT JOIN titles t ON o.id_title = t.id_title
				LEFT JOIN descriptions d ON o.id_description = d.id_description
					WHERE o.id = ".$id;

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
		// Добавляем подсказку
		$data = $GLOBALS['database']->Query("SELECT MAX(id_title) + 1 as new_id_title FROM titles");
		$id_title = $data->fetchColumn();
		$query = "INSERT INTO titles (id_title,id_level,title,last_update) VALUES (".$id_title.",".$dataArray['level'].",'".$dataArray['title']."',NOW())";
		$GLOBALS['database']->Query($query);

		// Добавляем описание
		$data = $GLOBALS['database']->Query("SELECT MAX(id_description) + 1 as new_id_description FROM descriptions");
		$id_description = $data->fetchColumn();
		$query = "INSERT INTO descriptions (id_description,id_level,content) VALUES (".$id_description.", ".$dataArray['level'].",'".$dataArray['content']."')";
		$GLOBALS['database']->Query($query);

		// Добавляем объект
		$coords = json_decode($dataArray['coords'],1);
		$query = "INSERT INTO objects (id,id_levels,id_layer,min_x,min_y,max_x,max_y,id_title,id_description,content) VALUES (NULL,".$dataArray['level'].",".$dataArray['layer'].",".$coords['min_x'].",".$coords['min_y'].",".$coords['max_x'].",".$coords['max_y'].",".$id_title.",".$id_description.",'".$dataArray['object']."')";
		$GLOBALS['database']->Query($query);
	}
	// Редактирование существующего
	else{
		// Обновляем объект
		$coords = json_decode($dataArray['coords'],1);
		$query = "UPDATE objects SET content = '".$dataArray['object']."', min_x = '".$coords['min_x']."', min_y = '".$coords['min_y']."', max_x = '".$coords['max_x']."', max_y = '".$coords['max_y']."' WHERE id = ".$dataArray['id_obj'];
		$GLOBALS['database']->Query($query);
		// Обновляем подсказку
		$query = "UPDATE titles SET title = '".$dataArray['title']."' WHERE id_title = ".$dataArray['id_title'];
		$GLOBALS['database']->Query($query);
		// Обновляем описание
		$query = "UPDATE descriptions SET content = '".$dataArray['content']."' WHERE id_description = ".$dataArray['id_description'];
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