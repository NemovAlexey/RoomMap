<?php
error_reporting(E_ALL);

ini_set("memory_limit", "1000M");

$centerX = 2999;
$centerY = 3003;


$fragsize = 150;

$file = 'breakingAllScales.png';
$image = imagecreatefrompng($file);
$sizes = getimagesize($file);

//Кол-во фрагментов от центра до правого края
$count_right_frag = round(($sizes[0] - $centerX)/$fragsize);
//Кол-во фрагментов от центра до левого края
$count_left_frag = round($centerX/$fragsize);


//Кол-во фрагментов от центра до верха
$count_top_frag = round(($sizes[1] - $centerY)/$fragsize);
//Кол-во фрагментов от центра до низа
$count_buttom_frag = round($centerY/$fragsize);


// Первая четверть
for($i = 1; $i <= $count_right_frag; $i++){
	$numFromLeft = $i;
	$coorFromLeft = $centerX + $fragsize * ($i-1);
	for($j = 1; $j <= $count_top_frag; $j++){
		// Координаты вырезаемого фрагмента
		$numFromButtom = $j;
		$coorFromButtom = $centerY - $fragsize * ($j);
		
		echo  $numFromLeft.'&'.$numFromButtom.'.png'.'<br />';
		echo 'Coor: '.$coorFromLeft.'x'.$coorFromButtom.'<br />';
		spliter($image,$coorFromLeft,$coorFromButtom,$fragsize,$numFromLeft.'&'.$numFromButtom);
	}
}

// Вторая четверть
for($i = 1; $i <= $count_left_frag; $i++){
	$numFromLeft = -$i;
	$coorFromLeft = $centerX - $fragsize * ($i);
	for($j = 1; $j <= $count_top_frag; $j++){
		// Координаты вырезаемого фрагмента
		$numFromButtom = $j;
		$coorFromButtom = $centerY - $fragsize * ($j);
		
		echo  $numFromLeft.'&'.$numFromButtom.'.png'.'<br />';
		echo 'Coor: '.$coorFromLeft.'x'.$coorFromButtom.'<br />';
		spliter($image,$coorFromLeft,$coorFromButtom,$fragsize,$numFromLeft.'&'.$numFromButtom);
	}
}

// Третья четверть
for($i = 1; $i <= $count_right_frag; $i++){
	$numFromLeft = -$i;
	$coorFromLeft = $centerX - $fragsize * ($i);
	for($j = 1; $j <= $count_top_frag; $j++){
		// Координаты вырезаемого фрагмента
		$numFromButtom = -$j;
		$coorFromButtom = $centerY + $fragsize * ($j-1);
		
		echo  $numFromLeft.'&'.$numFromButtom.'.png'.'<br />';
		echo 'Coor: '.$coorFromLeft.'x'.$coorFromButtom.'<br />';
		spliter($image,$coorFromLeft,$coorFromButtom,$fragsize,$numFromLeft.'&'.$numFromButtom);
	}
}

// Четвертая четверть
for($i = 1; $i <= $count_right_frag; $i++){
	$numFromLeft = $i;
	$coorFromLeft = $centerX + $fragsize * ($i-1);
	for($j = 1; $j <= $count_top_frag; $j++){
		// Координаты вырезаемого фрагмента
		$numFromButtom = -$j;
		$coorFromButtom = $centerY + $fragsize * ($j-1);
		
		echo  $numFromLeft.'&'.$numFromButtom.'.png'.'<br />';
		echo 'Coor: '.$coorFromLeft.'x'.$coorFromButtom.'<br />';
		spliter($image,$coorFromLeft,$coorFromButtom,$fragsize,$numFromLeft.'&'.$numFromButtom);
	}
}


function spliter($flow,$x,$y,$size,$name){
	$newImg = imagecreatetruecolor($size, $size);
	imagecopyresampled ( $newImg , $flow , 0, 0, $x , $y , $size , $size, $size , $size );

	imagepng($newImg,'parts/'.$name.'.png',9);
}


?>