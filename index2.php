<?php 

header('Content-type: text/plain');
echo 'Размер фрагмента: 151x151 пикс.';
echo "\r\n";
echo 'Масштаб: 1:200';
echo "\r\n";
echo 'Соотношение: 1px = 3.871794 см';
echo "\r\n";

$size_fragment = 151;
$size_pixel = 3.871794;

echo 'Один квадрат отображает '.($size_fragment * $size_pixel).' квадратных см';
echo "\r\n";
if($_GET['x'] && $_GET['y'] && !$_GET['width'] && !$_GET['height'])
	echo 'Квадрат '.$_GET['x'].':'.$_GET['y'].' отображает пространство от '.(($_GET['x']-1) * $size_fragment * $size_pixel).':'.(($_GET['y']-1) * $size_fragment * $size_pixel).' до '.($_GET['x'] * $size_fragment * $size_pixel).' до '.($_GET['y'] * $size_fragment * $size_pixel).' см от центра координат';

if(isset($_GET['x']) && isset($_GET['y']) && $_GET['width'] && $_GET['height']){
	echo "\r\n";
	echo 'Если координаты '.$_GET['x'].':'.$_GET['y'];
	echo "\r\n";
	echo 'То указатель (центр карты) на '.(($_GET['x']/($size_fragment * $size_pixel))).':'.(($_GET['y']/($size_fragment * $size_pixel))).' квадрате';
	echo "\r\n\r\n";
	echo 'Карте необходим диапазон: ';
	echo "\r\n";
	echo 'По x:	'.($_GET['x'] - ($_GET['width']*$size_pixel)/2).' - '.($_GET['x'] + ($_GET['width']*$size_pixel)/2). ' или '.($_GET['width']*$size_pixel).' см';
	echo "\r\n";
	echo 'По y:	'.($_GET['y'] - ($_GET['height']*$size_pixel)/2).' - '.($_GET['y'] + ($_GET['height']*$size_pixel)/2). ' или '.($_GET['height']*$size_pixel).' см';
	echo "\r\n\r\n";
	//echo 'Диапазон фрагментов: от '.floor(($_GET['x'] - ($_GET['width']*$size_pixel/2))/($size_fragment * $size_pixel)).':'.floor(($_GET['y'] - ($_GET['height']*$size_pixel/2))/($size_fragment * $size_pixel)).' до '.ceil(($_GET['x'] + ($_GET['width']*$size_pixel/2))/($size_fragment * $size_pixel)).':'.ceil(($_GET['y'] + ($_GET['height']*$size_pixel/2))/($size_fragment * $size_pixel));
	//echo "\r\n\r\n";
	
	$xMin = ((($_GET['x'] - ($_GET['width']*$size_pixel/2))/($size_fragment * $size_pixel)) < 0 ? floor(($_GET['x'] - ($_GET['width']*$size_pixel/2))/($size_fragment * $size_pixel)) : ceil(($_GET['x'] - ($_GET['width']*$size_pixel/2))/($size_fragment * $size_pixel)));
	$yMin = ((($_GET['y'] - ($_GET['height']*$size_pixel/2))/($size_fragment * $size_pixel)) < 0 ? floor(($_GET['y'] - ($_GET['height']*$size_pixel/2))/($size_fragment * $size_pixel)) : ceil(($_GET['y'] - ($_GET['height']*$size_pixel/2))/($size_fragment * $size_pixel)));
		
	$xMax = ((($_GET['x'] + ($_GET['width']*$size_pixel/2))/($size_fragment * $size_pixel)) < 0 ? floor(($_GET['x'] + ($_GET['width']*$size_pixel/2))/($size_fragment * $size_pixel)) : ceil(($_GET['x'] + ($_GET['width']*$size_pixel/2))/($size_fragment * $size_pixel)));
	$yMax = ((($_GET['y'] + ($_GET['height']*$size_pixel/2))/($size_fragment * $size_pixel)) < 0 ? floor(($_GET['y'] + ($_GET['height']*$size_pixel/2))/($size_fragment * $size_pixel)) : ceil(($_GET['y'] + ($_GET['height']*$size_pixel/2))/($size_fragment * $size_pixel)));
	

	echo 'Диапазон фрагментов: от '.$xMin.':'.$yMin.' до '.$xMax.':'.$yMax;
	
	echo "\r\n\r\n";
	echo 'Фрагменты: ';
	for($x = $xMin; $x <= $xMax; $x ++){
		if($x == 0) continue;
		for($y = $yMin; $y <= $yMax; $y ++){
			if($y == 0) continue;
			$fragments[] = $x.':'.$y;
		}
	}
	echo implode(', ',$fragments);
	
}

?>