<?php 

header('Content-type: text/plain');
echo '������ ���������: 151x151 ����.';
echo "\r\n";
echo '�������: 1:200';
echo "\r\n";
echo '�����������: 1px = 3.871794 ��';
echo "\r\n";

$size_fragment = 151;
$size_pixel = 3.871794;

echo '���� ������� ���������� '.($size_fragment * $size_pixel).' ���������� ��';
echo "\r\n";
if($_GET['x'] && $_GET['y'] && !$_GET['width'] && !$_GET['height'])
	echo '������� '.$_GET['x'].':'.$_GET['y'].' ���������� ������������ �� '.(($_GET['x']-1) * $size_fragment * $size_pixel).':'.(($_GET['y']-1) * $size_fragment * $size_pixel).' �� '.($_GET['x'] * $size_fragment * $size_pixel).' �� '.($_GET['y'] * $size_fragment * $size_pixel).' �� �� ������ ���������';

if(isset($_GET['x']) && isset($_GET['y']) && $_GET['width'] && $_GET['height']){
	echo "\r\n";
	echo '���� ���������� '.$_GET['x'].':'.$_GET['y'];
	echo "\r\n";
	echo '�� ��������� (����� �����) �� '.(($_GET['x']/($size_fragment * $size_pixel))).':'.(($_GET['y']/($size_fragment * $size_pixel))).' ��������';
	echo "\r\n\r\n";
	echo '����� ��������� ��������: ';
	echo "\r\n";
	echo '�� x:	'.($_GET['x'] - ($_GET['width']*$size_pixel)/2).' - '.($_GET['x'] + ($_GET['width']*$size_pixel)/2). ' ��� '.($_GET['width']*$size_pixel).' ��';
	echo "\r\n";
	echo '�� y:	'.($_GET['y'] - ($_GET['height']*$size_pixel)/2).' - '.($_GET['y'] + ($_GET['height']*$size_pixel)/2). ' ��� '.($_GET['height']*$size_pixel).' ��';
	echo "\r\n\r\n";
	//echo '�������� ����������: �� '.floor(($_GET['x'] - ($_GET['width']*$size_pixel/2))/($size_fragment * $size_pixel)).':'.floor(($_GET['y'] - ($_GET['height']*$size_pixel/2))/($size_fragment * $size_pixel)).' �� '.ceil(($_GET['x'] + ($_GET['width']*$size_pixel/2))/($size_fragment * $size_pixel)).':'.ceil(($_GET['y'] + ($_GET['height']*$size_pixel/2))/($size_fragment * $size_pixel));
	//echo "\r\n\r\n";
	
	$xMin = ((($_GET['x'] - ($_GET['width']*$size_pixel/2))/($size_fragment * $size_pixel)) < 0 ? floor(($_GET['x'] - ($_GET['width']*$size_pixel/2))/($size_fragment * $size_pixel)) : ceil(($_GET['x'] - ($_GET['width']*$size_pixel/2))/($size_fragment * $size_pixel)));
	$yMin = ((($_GET['y'] - ($_GET['height']*$size_pixel/2))/($size_fragment * $size_pixel)) < 0 ? floor(($_GET['y'] - ($_GET['height']*$size_pixel/2))/($size_fragment * $size_pixel)) : ceil(($_GET['y'] - ($_GET['height']*$size_pixel/2))/($size_fragment * $size_pixel)));
		
	$xMax = ((($_GET['x'] + ($_GET['width']*$size_pixel/2))/($size_fragment * $size_pixel)) < 0 ? floor(($_GET['x'] + ($_GET['width']*$size_pixel/2))/($size_fragment * $size_pixel)) : ceil(($_GET['x'] + ($_GET['width']*$size_pixel/2))/($size_fragment * $size_pixel)));
	$yMax = ((($_GET['y'] + ($_GET['height']*$size_pixel/2))/($size_fragment * $size_pixel)) < 0 ? floor(($_GET['y'] + ($_GET['height']*$size_pixel/2))/($size_fragment * $size_pixel)) : ceil(($_GET['y'] + ($_GET['height']*$size_pixel/2))/($size_fragment * $size_pixel)));
	

	echo '�������� ����������: �� '.$xMin.':'.$yMin.' �� '.$xMax.':'.$yMax;
	
	echo "\r\n\r\n";
	echo '���������: ';
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