//Размеры блока
RoomMap.mapWidth = 1000;
RoomMap.mapHeight = 500;

//На весь экран
RoomMap.fullScreen = false;

//Размер фрагмента карты
RoomMap.sizeOfFragment = 150;

//Масштабы
RoomMap.scalesList = [100,400];

//Парамтры масштабов
RoomMap.scales = {
	// Масштаб: [см. реальной поверхности в одном пикселе, размер фрагмента в см., размер карты (кол-во фрагментов от центра по часовой)]
	// Размеры карты используется для ограничения загрузки фрагментов и предотвращения побега
	'100': [3.57142857, RoomMap.sizeOfFragment*3.57142857, [20,20,20,20]],
	'400': [14.285712, RoomMap.sizeOfFragment*14.285712, [5,6,5,6]] 
}

//Показывать цель (центр карты)
RoomMap.showTarget = true;
RoomMap.targetPulsar = false;

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

//Обновлять ли URL при манипуляции картой
RoomMap.urlupdate = false;

//URL AJAX запросов
RoomMap.ajaxUrl = '/Room-map/Room-map-remote.php';

//Параметры по умолчанию
RoomMap.scaleDefault = 400;
RoomMap.layerDefault = 0;
RoomMap.levelDefault = 1;

//Устанавливаем стартовые параметры
RoomMap.scale = RoomMap.scale || RoomMap.scaleDefault;
RoomMap.layer = RoomMap.layer || RoomMap.layerDefault;
RoomMap.level = RoomMap.level || RoomMap.levelDefault;

//Режим редактирования
RoomMap.editorMode = RoomMap.editorMode || false;