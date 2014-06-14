//Размеры блока
var mapWidth = 800;
var mapHeight = 400;

//Размер фрагмента карты
var sizeOfFragment = 150;

//Масштабы
var scales = {
	//См карты в одном пикселе, отображаемая длина фрагмента
	'100': [3.57142857, sizeOfFragment*3.57142857]
}

//Режим демонстрации
var demoMode = 'off';

//Кнопки управления
var tools = 'off';

//ID элемента для инициализации карты
var idElement = 'AG-map';

//Путь к папке с фрагментами
var pathForFragments = '/maps';