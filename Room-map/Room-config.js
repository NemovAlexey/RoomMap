//Размеры блока
var mapWidth = 800;
var mapHeight = 500;

//Размер фрагмента карты
var sizeOfFragment = 150;

//Масштабы
var scales = {
	//См карты в одном пикселе, отображаемая длина фрагмента
	'100': [3.57142857, sizeOfFragment*3.57142857]
}
//Расстояние от края карты до загружаемого фрагмента
var distanceForNewFragments = 0;

//Удалять ли фрагменты покинувшие видимую зону
var removeLostFragmens = true;

//Расстояние от края карты до удаляемого фрагмента
var distanceForLostFragments = 300;

//Режим демонстрации
var demoMode = 'off';

//Кнопки управления
var tools = 'off';

//ID элемента для инициализации карты
var idElement = 'Room-map';

//Путь к папке с фрагментами
var pathForFragments = '/maps';