//Размеры блока
RoomMap.mapWidth = 800;
RoomMap.mapHeight = 500;

//Размер фрагмента карты
RoomMap.sizeOfFragment = 150;

//Масштабы
RoomMap.scales = {
	//См карты в одном пикселе, отображаемая длина фрагмента
	'100': [3.57142857, RoomMap.sizeOfFragment*3.57142857]
}
//Расстояние от края карты до загружаемого фрагмента
RoomMap.distanceForNewFragments = 0;

//Удалять ли фрагменты покинувшие видимую зону
RoomMap.removeLostFragmens = true;

//Расстояние от края карты до удаляемого фрагмента
RoomMap.distanceForLostFragments = 300;

//Режим демонстрации
RoomMap.demoMode = 'off';

//Кнопки управления
RoomMap.tools = 'on';

//Путь к папке с фрагментами
RoomMap.pathForFragments = '/maps';

//Язык интерефейса
RoomMap.lang = 'rus';