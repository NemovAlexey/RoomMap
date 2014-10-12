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
							AND o.id_levels = ".$level." 
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
function  getSvgObjectDetails($svg_id){
	switch($svg_id){
		case 2:
			return '<p style="text-align: justify;"><img alt="" src="http://primamedia.ru/f/big/254/253346.jpg" style="width: 200px; height: 133px; float: left; margin-right: 10px; margin-bottom: 10px;" />Корпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президенты.</p>
					<p style="text-align: justify;">Кортежи будут подъезжать прямо к главному входу в корпус. Первым сюда войдет президент Российской Федерации Владимир Путин. Он пройдет к центру холла, где и будет встречать и приветствовать прибывающих лидеров экономик АТЭС. Как пояснили организаторы мероприятия, стать свидетелем этого исторического момента смогут не более трех журналистов от страны. Но в пресс-центр будет поступать видеоизображение встречи.</p>
					<p style="text-align: justify;">Кортежи будут подъезжать прямо к главному входу в корпус. Первым сюда войдет президент Российской Федерации Владимир Путин. Он пройдет к центру холла, где и будет встречать и приветствовать прибывающих лидеров экономик АТЭС. Как пояснили организаторы мероприятия, стать свидетелем этого исторического момента смогут не более трех журналистов от страны. Но в пресс-центр будет поступать видеоизображение встречи.</p>
					<p style="text-align: justify;"Кортежи будут подъезжать прямо к главному входу в корпус. Первым сюда войдет президент Российской Федерации Владимир Путин. Он пройдет к центру холла, где и будет встречать и приветствовать прибывающих лидеров экономик АТЭС. Как пояснили организаторы мероприятия, стать свидетелем этого исторического момента смогут не более трех журналистов от страны. Но в пресс-центр будет поступать видеоизображение встречи.</p>
					<p style="text-align: justify;">Кортежи будут подъезжать прямо к главному входу в корпус. Первым сюда войдет президент Российской Федерации Владимир Путин. Он пройдет к центру холла, где и будет встречать и приветствовать прибывающих лидеров экономик АТЭС. Как пояснили организаторы мероприятия, стать свидетелем этого исторического момента смогут не более трех журналистов от страны. Но в пресс-центр будет поступать видеоизображение встречи.</p>
					<p style="text-align: justify;">Кортежи будут подъезжать прямо к главному входу в корпус. Первым сюда войдет президент Российской Федерации Владимир Путин. Он пройдет к центру холла, где и будет встречать и приветствовать прибывающих лидеров экономик АТЭС. Как пояснили организаторы мероприятия, стать свидетелем этого исторического момента смогут не более трех журналистов от страны. Но в пресс-центр будет поступать видеоизображение встречи.</p>';
			break;
		default:
			return '';
	}
}


switch($_GET['data']){
	case 'getlists': 
		echo json_encode(array('layers' => getLayersList(), 'levels' => getLevelsList()));
		break;
	case 'getsvg':
		echo json_encode(array('svg' => getListSVGObject($_GET['min_x'],$_GET['min_y'],$_GET['max_x'],$_GET['max_y'],$_GET['level'],$_GET['layer'])));
		break;
	case 'getdetails':
		echo json_encode(array('details' => getSvgObjectDetails((int)$_GET['id'])));
		break;
}


?>