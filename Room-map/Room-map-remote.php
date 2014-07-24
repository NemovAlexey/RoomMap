<?php

$GLOBALS['database'] = new PDO('mysql:dbname=RoomMap;host=127.0.0.1','root','');
$GLOBALS['database']->Exec("SET NAMES utf8");

/*
* @return array list of layers
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
* @return array list of levels
*/
function getLevelsList(){
	$levels = $GLOBALS['database']->Query("SELECT * FROM levels");
	$listOfLevels = array();
	while($level = $levels->Fetch(PDO::FETCH_ASSOC)){
		array_push($listOfLevels,array('id' => $level['id_level'],'code' => $level['id_level'],'name' => json_decode($level['level_name'],true),'description' => json_decode($level['level_description'],true)));
	}	
	return $listOfLevels;
}


echo json_encode(array('layers' => getLayersList(), 'levels' => getLevelsList()));

?>