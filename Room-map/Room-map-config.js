//Размеры блока
RoomMap.mapWidth = 800;
RoomMap.mapHeight = 500;

//На весь экран
RoomMap.fullScreen = true;

//Размер фрагмента карты
RoomMap.sizeOfFragment = 150;

//Масштабы
RoomMap.scales = {
	//См карты в одном пикселе, отображаемая длина фрагмента
	'100': [3.57142857, RoomMap.sizeOfFragment*3.57142857]
}

//Размер карты в фрагментах от центра (по часовой стрелке)
//Используется для ограничения загрузки фрагментов и предотвращения побега
RoomMap.size = [5,6,5,6];

//Ограничение загрузки фрагментов по размеру карты
RoomMap.loadFragmentsForSize = true;

//Расстояние от края карты до загружаемого фрагмента в пикс.
RoomMap.distanceForNewFragments = 0;

//Удалять ли фрагменты покинувшие видимую зону
RoomMap.removeLostFragmens = true;

//Расстояние от края карты до удаляемого фрагмента в пикс.
RoomMap.distanceForLostFragments = 0;

//Блокировать выход за края карты
RoomMap.preventEscape = true;

//Кнопки управления
RoomMap.tools = true;

//Путь к папке с фрагментами
RoomMap.pathForFragments = '/maps';

//Язык интерефейса
RoomMap.lang = 'rus';