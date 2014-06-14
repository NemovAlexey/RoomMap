//Инициализация карты
function initMap(){
	$('#' + idElement).css({
		width: mapWidth + 'px',
		height: mapHeight + 'px',
		overflow: 'hidden',
		position: 'absolute',
		background: 'url(/images/backgroundmap.jpg)'
	});

	var listOfFragments = getListOfFragments(position_X, position_Y, mapWidth, mapHeight);
	//Загружаем фрагменты карт
	loadFragments(listOfFragments);
	
	//Обработчик нажатия на карту левой кнопкой мыши
	$('#' + idElement).mousedown(scrollMap);
	$('#' + idElement).mouseup(scrollMapCancel);
}

//Определение необходимых к загрузке фрагментов
function getListOfFragments(position_X, position_Y, mapWidth, mapHeight){
	//Определим в каких фрагментах находятся нижний левый и правый верхний углы
	//Нижний левый угол
	var xMin = ((position_X - (mapWidth * scales[scale][0]/2))/(sizeOfFragment * scales[scale][0])) < 0 ? Math.floor((position_X - (mapWidth * scales[scale][0]/2))/(sizeOfFragment * scales[scale][0])) : Math.ceil((position_X - (mapWidth * scales[scale][0]/2))/(sizeOfFragment * scales[scale][0]));
	var yMin = ((position_Y - (mapHeight * scales[scale][0]/2))/(sizeOfFragment * scales[scale][0])) < 0 ? Math.floor((position_Y - (mapHeight * scales[scale][0]/2))/(sizeOfFragment * scales[scale][0])) : Math.ceil((position_Y - (mapHeight * scales[scale][0]/2))/(sizeOfFragment * scales[scale][0]));
	//Правый верхний угол
	var xMax = ((position_X + (mapWidth * scales[scale][0]/2))/(sizeOfFragment * scales[scale][0])) < 0 ? Math.floor((position_X + (mapWidth * scales[scale][0]/2))/(sizeOfFragment * scales[scale][0])) : Math.ceil((position_X + (mapWidth * scales[scale][0]/2))/(sizeOfFragment * scales[scale][0]));
	var yMax = ((position_Y + (mapHeight * scales[scale][0]/2))/(sizeOfFragment * scales[scale][0])) < 0 ? Math.floor((position_Y + (mapHeight * scales[scale][0]/2))/(sizeOfFragment * scales[scale][0])) : Math.ceil((position_Y + (mapHeight * scales[scale][0]/2))/(sizeOfFragment * scales[scale][0]));
	
	//Составим список фрагментов
	var fragments = [];
	for(var x = xMin; x <= xMax; x++){
		if(x == 0) continue;
		for(y = yMin; y <= yMax; y++){
			if(y == 0) continue;
			fragments.push([x,y]);
		}
	}
	return fragments;
}

//Загрузка фрагментов карты
function loadFragments(listOfFragments){
	for(var i = 0; i < listOfFragments.length; i++){

		var newFragment = new Image();
		newFragment.src = pathForFragments + '/' + scale + '/' + listOfFragments[i][0] + '&' + listOfFragments[i][1] + '.jpg';
		$(newFragment).css({position: 'absolute', opacity: '0'});
		
		//Позиция относительно центра координат
		var posX = listOfFragments[i][0] < 1 ? (mapWidth/2) - sizeOfFragment*Math.abs(listOfFragments[i][0]) : (mapWidth/2) + sizeOfFragment*listOfFragments[i][0] - sizeOfFragment;
		var posY = listOfFragments[i][1] < 1 ? (mapHeight/2) + sizeOfFragment*Math.abs(listOfFragments[i][1]) - sizeOfFragment : (mapHeight/2) - sizeOfFragment*listOfFragments[i][1];

		//Вставляем элемент в блок + корректируем координаты (учитываем сдвиг)
		$(newFragment).css('left', posX + (position_X/scales[scale][0] * -1) + 'px');
		$(newFragment).css('top', posY + (position_Y/scales[scale][0]) + 'px');
		
		//Обработчик, плавное появление фрагмента после загрузки
		$(newFragment).one('load',function(){
			$(this).animate({opacity:'1'});
		}).mousedown(function(event){
			//Запрещаем перетаскивание фрагментов карты
			event.preventDefault();
		});
		
		$('#' + idElement).append(newFragment);
	}
}

//Скроллинг карты
function scrollMap(event){
	//Координаты клика
	var default_X = event.clientX;
	var default_Y = event.clientY;
	
	//Обработчик движения мыши
	$().bind('mousemove',function(event){
		var current_X = event.clientX;
		var current_Y = event.clientY;
		$('#' + idElement).find('img').each(function(index,fragment){
			$(fragment).css('top',parseInt($(this).css('top')) - (default_Y - current_Y) + 'px');
			$(fragment).css('left',parseInt($(this).css('left')) - (default_X - current_X) + 'px');
		});
		
		position_X = position_X + (default_X - current_X)*scales[scale][0];
		position_Y = position_Y - (default_Y - current_Y)*scales[scale][0];
				
		default_X = event.clientX;
		default_Y = event.clientY;
	});
}

//Заканчиваем скролл карты
function scrollMapCancel(){
	$().unbind('mousemove');
	updateUrl(position_X,position_Y);
}

//Обновление url при изменении позиционирования карты
function updateUrl(x,y){
	var params = new Array();
	var newParams = new Array();
	var l = location.search;

	if(l){
		params = l.substring(1).split('&');
		$.each(params,function(index,value){/* alert(value); */
			if(!value.match(/^x=[-0-9]+$/,'') && !value.match(/^y=[-0-9]+$/,'')){
				newParams.push(value);
			}
		})
	}

	newParams.push('x=' + parseInt(x));
	newParams.push('y=' + parseInt(y));
	history.pushState(null,null,location.pathname + '?' + newParams.join('&'));
}