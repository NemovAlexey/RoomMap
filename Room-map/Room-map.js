var RoomMap = {
	timeoutLoader: null,
	//Матрица состояния загружаемых файлов
	LoadMatrix: [0],
	
	//Инициализация карты
	initMapTo: function (idElement){
		RoomMap.idElement = idElement;
		//Подключаем файлы
		RoomMap.includeFiles();
		//Ждем загрузки документа
		window.onload = function(){
			//Подключаем зависимые файлы
			RoomMap.includeDependentFiles();
			//Ждем загрузки всех зависимых файлов
			RoomMap.timeoutLoader = setInterval(function(){
				for(var i = 0; i < RoomMap.LoadMatrix.length; i++){
					if(RoomMap.LoadMatrix[i] == 0) break;
				}
				RoomMap.createMap();
				clearInterval(RoomMap.timeoutLoader);
				RoomMap.timeoutLoader = null;
			},100);
		}
	},

	createMap: function(){
		//Если на весь экран
		if(RoomMap.fullScreen){
			$('body').css({margin:'0px'});
			RoomMap.mapWidth = document.body.scrollWidth;
			RoomMap.mapHeight = document.body.scrollHeight;
			//Обработка изменения размера окна
			$(window).resize(function(){
				var dY = (RoomMap.mapHeight - window.innerHeight)/2;
				var dX = (RoomMap.mapWidth - window.innerWidth)/2;
				
				//Корректируем координаты центра, если требуется
				if(dX != Math.round(dX)){
					RoomMap.position_X = RoomMap.position_X - (dX - Math.round(dX))*RoomMap.scales[RoomMap.scale][0];
				}
				if(dY != Math.round(dY)){
					RoomMap.position_Y = RoomMap.position_Y + (dY - Math.round(dY))*RoomMap.scales[RoomMap.scale][0];
				}
				RoomMap.updateUrl(RoomMap.position_X,RoomMap.position_Y);
				
				//Сдвигаем фрагменты карт
				RoomMap.mapWidth = window.innerWidth;
				RoomMap.mapHeight = window.innerHeight;
				$('#' + RoomMap.idElement).css({
					width: RoomMap.mapWidth + 'px',
					height: RoomMap.mapHeight + 'px'
				})
				
				$('#' + RoomMap.idElement).find('img').each(function(index,fragment){
					$(fragment).css('top',parseInt($(this).css('top')) -  Math.ceil(dY) + 'px');
					$(fragment).css('left',parseInt($(this).css('left')) - Math.ceil(dX) + 'px');
				});
			})
		}
	
		//Установка размеров карты
		$('#' + RoomMap.idElement).css({
			width: RoomMap.mapWidth + 'px',
			height: RoomMap.mapHeight + 'px'
		}).addClass('mapBlock');

		//Установим лого
		$('<div class="logo"></div>').appendTo('#' + RoomMap.idElement);

		//Загружаем инструменты
		if(RoomMap.tools){
			RoomMap.LoadTools();
		}

		//Определяем список фрагментов
		var listOfFragments = RoomMap.getListOfFragments(RoomMap.position_X, RoomMap.position_Y, RoomMap.mapWidth, RoomMap.mapHeight);
		//Загружаем фрагменты карт
		RoomMap.loadFragments(listOfFragments);

		//Обработчик нажатия на карту левой кнопкой мыши
		$('#' + RoomMap.idElement).mousedown(RoomMap.scrollMap);
		$('#' + RoomMap.idElement).mouseup(RoomMap.scrollMapCancel);

		//Отключаем скролл при отпускании кнопки мыши вне карты
		$().mouseup(RoomMap.scrollMapCancel);
	},
	
	//Определение необходимых к загрузке фрагментов
	getListOfFragments: function(position_X, position_Y, mapWidth, mapHeight){
		//Определим в каких фрагментах находятся нижний левый и правый верхний углы
		//Нижний левый угол
		var xMin = ((position_X - ((mapWidth + RoomMap.distanceForNewFragments * 2) * RoomMap.scales[RoomMap.scale][0]/2))/RoomMap.scales[RoomMap.scale][1]) < 0 ? Math.floor((position_X - ((mapWidth + RoomMap.distanceForNewFragments * 2) * RoomMap.scales[RoomMap.scale][0]/2))/RoomMap.scales[RoomMap.scale][1]) : Math.ceil((position_X - ((mapWidth + RoomMap.distanceForNewFragments * 2) * RoomMap.scales[RoomMap.scale][0]/2))/RoomMap.scales[RoomMap.scale][1]);
		var yMin = ((position_Y - ((mapHeight + RoomMap.distanceForNewFragments * 2) * RoomMap.scales[RoomMap.scale][0]/2))/RoomMap.scales[RoomMap.scale][1]) < 0 ? Math.floor((position_Y - ((mapHeight + RoomMap.distanceForNewFragments * 2) * RoomMap.scales[RoomMap.scale][0]/2))/RoomMap.scales[RoomMap.scale][1]) : Math.ceil((position_Y - ((mapHeight + RoomMap.distanceForNewFragments * 2) * RoomMap.scales[RoomMap.scale][0]/2))/RoomMap.scales[RoomMap.scale][1]);
		//Правый верхний угол
		var xMax = ((position_X + ((mapWidth + RoomMap.distanceForNewFragments * 2) * RoomMap.scales[RoomMap.scale][0]/2))/RoomMap.scales[RoomMap.scale][1]) < 0 ? Math.floor((position_X + ((mapWidth + RoomMap.distanceForNewFragments * 2) * RoomMap.scales[RoomMap.scale][0]/2))/RoomMap.scales[RoomMap.scale][1]) : Math.ceil((position_X + ((mapWidth + RoomMap.distanceForNewFragments * 2) * RoomMap.scales[RoomMap.scale][0]/2))/RoomMap.scales[RoomMap.scale][1]);
		var yMax = ((position_Y + ((mapHeight + RoomMap.distanceForNewFragments * 2) * RoomMap.scales[RoomMap.scale][0]/2))/RoomMap.scales[RoomMap.scale][1]) < 0 ? Math.floor((position_Y + ((mapHeight + RoomMap.distanceForNewFragments * 2) * RoomMap.scales[RoomMap.scale][0]/2))/RoomMap.scales[RoomMap.scale][1]) : Math.ceil((position_Y + ((mapHeight + RoomMap.distanceForNewFragments * 2) * RoomMap.scales[RoomMap.scale][0]/2))/RoomMap.scales[RoomMap.scale][1]);
		
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
	},

	//Загрузка фрагментов карты
	loadFragments: function(listOfFragments){
		for(var i = 0; i < listOfFragments.length; i++){
			//Если фрагмент загружен, снова его грузить не надо
			if($('#fr' + listOfFragments[i][0] + listOfFragments[i][1]).length > 0) continue;
			//Загружать фрагменты ограниченные размером карты
			if(RoomMap.loadFragmentsForSize){
				if(listOfFragments[i][0] > RoomMap.size[1] || listOfFragments[i][0] < -RoomMap.size[3] || listOfFragments[i][1] > RoomMap.size[0] || listOfFragments[i][1] < -RoomMap.size[2]) continue
			}
		
			var newFragment = new Image();
			newFragment.src = RoomMap.pathForFragments + '/' + RoomMap.scale + '/' + listOfFragments[i][0] + '&' + listOfFragments[i][1] + '.jpg';
			$(newFragment).css({position: 'absolute', opacity: '0'});
			$(newFragment).attr('id','fr' + listOfFragments[i][0] + listOfFragments[i][1]);
			
			//Позиция относительно центра координат
			var posX = listOfFragments[i][0] < 1 ? Math.ceil((RoomMap.mapWidth/2)) - RoomMap.sizeOfFragment*Math.abs(listOfFragments[i][0]) : Math.ceil((RoomMap.mapWidth/2)) + RoomMap.sizeOfFragment*listOfFragments[i][0] - RoomMap.sizeOfFragment;
			var posY = listOfFragments[i][1] < 1 ? Math.ceil((RoomMap.mapHeight/2)) + RoomMap.sizeOfFragment*Math.abs(listOfFragments[i][1]) - RoomMap.sizeOfFragment : Math.ceil((RoomMap.mapHeight/2)) - RoomMap.sizeOfFragment*listOfFragments[i][1];

			//Вставляем элемент в блок + корректируем координаты (учитываем сдвиг)
			$(newFragment).css('left', posX + Math.round(RoomMap.position_X/RoomMap.scales[RoomMap.scale][0] * -1) + 'px');
			$(newFragment).css('top', posY + Math.round(RoomMap.position_Y/RoomMap.scales[RoomMap.scale][0]) + 'px');
			$(newFragment).addClass('FrMainMap');
			
			//Обработчик, плавное появление фрагмента после загрузки
			$(newFragment).one('load',function(){
				$(this).animate({opacity:'1'});
			}).mousedown(function(event){
				//Запрещаем перетаскивание фрагментов карты
				event.preventDefault();
			});
			
			$('#' + RoomMap.idElement).append(newFragment);
		}
	},

	//Удаляем фрагменты карт
	removeFragments: function(){
		$('#' + RoomMap.idElement).find('img').each(function(){
			var x = parseInt($(this).css('left'));
			var y = parseInt($(this).css('top'));
			if(x < 0 - RoomMap.distanceForLostFragments - RoomMap.sizeOfFragment || x > RoomMap.mapWidth + RoomMap.distanceForLostFragments || y < 0 - RoomMap.distanceForLostFragments - RoomMap.sizeOfFragment || y > RoomMap.mapHeight + RoomMap.distanceForLostFragments){
				$(this).remove();
			}
		});
	},

	//Скроллинг карты
	scrollMap: function(event){
		//Координаты клика
		var default_X = event.clientX;
		var default_Y = event.clientY;
		
		$(this).addClass('scrolledmap');

		//Обработчик движения мыши
		$().bind('mousemove',function(event){
			var current_X = event.clientX;
			var current_Y = event.clientY;
			
			var dY = default_Y - current_Y;
			var dX = default_X - current_X;
			
			//Предотвращение побега
			if(RoomMap.preventEscape){
				//По горизонтали
				if((RoomMap.position_X + dX * RoomMap.scales[RoomMap.scale][0]) < (-RoomMap.size[3] * RoomMap.scales[RoomMap.scale][1] + RoomMap.mapWidth/2 * RoomMap.scales[RoomMap.scale][0])) {
					//Из-за погрешности вычислений используем диапазон
					if(RoomMap.position_X > (-RoomMap.size[3] * RoomMap.scales[RoomMap.scale][1] + RoomMap.mapWidth/2 * RoomMap.scales[RoomMap.scale][0])-0.00001 && RoomMap.position_X < (-RoomMap.size[3] * RoomMap.scales[RoomMap.scale][1] + RoomMap.mapWidth/2 * RoomMap.scales[RoomMap.scale][0])+0.00001){
						dX = 0;
					}else{
						dX = Math.ceil(((-RoomMap.size[3] * RoomMap.scales[RoomMap.scale][1] + RoomMap.mapWidth/2 * RoomMap.scales[RoomMap.scale][0]) - RoomMap.position_X)/RoomMap.scales[RoomMap.scale][0]);
					}
				}
				else if((RoomMap.position_X + dX * RoomMap.scales[RoomMap.scale][0]) > (RoomMap.size[1] * RoomMap.scales[RoomMap.scale][1] - RoomMap.mapWidth/2 * RoomMap.scales[RoomMap.scale][0])) {
					//Из-за погрешности вычислений используем диапазон
					if(RoomMap.position_X > (RoomMap.size[1] * RoomMap.scales[RoomMap.scale][1] - RoomMap.mapWidth/2 * RoomMap.scales[RoomMap.scale][0])-0.00001 && RoomMap.position_X < (RoomMap.size[1] * RoomMap.scales[RoomMap.scale][1] - RoomMap.mapWidth/2 * RoomMap.scales[RoomMap.scale][0])+0.00001){
						dX = 0;
					}else{
						dX = Math.floor(((RoomMap.size[1] * RoomMap.scales[RoomMap.scale][1] - RoomMap.mapWidth/2 * RoomMap.scales[RoomMap.scale][0]) - RoomMap.position_X)/RoomMap.scales[RoomMap.scale][0]);
					}
				}
				//По вертикали
				if((RoomMap.position_Y - dY * RoomMap.scales[RoomMap.scale][0]) > (RoomMap.size[0] * RoomMap.scales[RoomMap.scale][1] - RoomMap.mapHeight/2 * RoomMap.scales[RoomMap.scale][0])) {
					//Из-за погрешности вычислений используем диапазон
					if(RoomMap.position_Y > (RoomMap.size[0] * RoomMap.scales[RoomMap.scale][1] - RoomMap.mapHeight/2 * RoomMap.scales[RoomMap.scale][0])-0.00001 && RoomMap.position_Y < (RoomMap.size[0] * RoomMap.scales[RoomMap.scale][1] - RoomMap.mapHeight/2 * RoomMap.scales[RoomMap.scale][0])+0.00001){
						dY = 0;
					}else{
						dY = -Math.floor(((RoomMap.size[0] * RoomMap.scales[RoomMap.scale][1] - RoomMap.mapHeight/2 * RoomMap.scales[RoomMap.scale][0]) - RoomMap.position_Y)/RoomMap.scales[RoomMap.scale][0]);
					}
				}
				else if((RoomMap.position_Y - dY * RoomMap.scales[RoomMap.scale][0]) < (-RoomMap.size[2] * RoomMap.scales[RoomMap.scale][1] + RoomMap.mapHeight/2 * RoomMap.scales[RoomMap.scale][0])) {
					//Из-за погрешности вычислений используем диапазон
					if(RoomMap.position_Y > (RoomMap.size[2] * RoomMap.scales[RoomMap.scale][1] + RoomMap.mapHeight/2 * RoomMap.scales[RoomMap.scale][0])-0.00001 && RoomMap.position_Y < (RoomMap.size[2] * RoomMap.scales[RoomMap.scale][1] + RoomMap.mapHeight/2 * RoomMap.scales[RoomMap.scale][0])+0.00001){
						dY = 0;
					}else{
						dY = -Math.ceil(((-RoomMap.size[2] * RoomMap.scales[RoomMap.scale][1] + RoomMap.mapHeight/2 * RoomMap.scales[RoomMap.scale][0]) - RoomMap.position_Y)/RoomMap.scales[RoomMap.scale][0]);
					}
				}

			}
			
			RoomMap.position_X = RoomMap.position_X + dX * RoomMap.scales[RoomMap.scale][0];
			RoomMap.position_Y = RoomMap.position_Y - dY * RoomMap.scales[RoomMap.scale][0];
			
			$('#' + RoomMap.idElement).find('img').each(function(index,fragment){
				$(fragment).css('top',parseInt($(this).css('top')) - dY + 'px');
				$(fragment).css('left',parseInt($(this).css('left')) - dX + 'px');
			});
				
			if(!RoomMap.timeoutLoader){
				RoomMap.timeoutLoader = setTimeout(function(){
					var listOfFragments = RoomMap.getListOfFragments(RoomMap.position_X, RoomMap.position_Y, RoomMap.mapWidth, RoomMap.mapHeight);
					//Загружаем фрагменты карт
					RoomMap.loadFragments(listOfFragments);
					RoomMap.timeoutLoader = null;
				},300);
			}
			
			default_X = event.clientX;
			default_Y = event.clientY;
		});
	},

	//Заканчиваем скролл карты
	scrollMapCancel: function(){
		$().unbind('mousemove');
		$('#' + RoomMap.idElement).removeClass('scrolledmap');
		//Удаляем фрагменты карт
		if(RoomMap.removeLostFragmens){
			RoomMap.removeFragments();
		}
		RoomMap.updateUrl(RoomMap.position_X,RoomMap.position_Y);
	},

	//Обновление url при изменении позиционирования карты
	updateUrl: function(x,y){
		var params = new Array();
		var newParams = new Array();
		var l = location.search;

		if(l){
			params = l.substring(1).split('&');
			$.each(params,function(index,value){/* alert(value); */
				if(!value.match(/^x=[-0-9\.e]+$/,'') && !value.match(/^y=[-0-9\.e]+$/,'')){
					newParams.push(value);
				}
			})
		}

		newParams.push('x=' + x);
		newParams.push('y=' + y);
		history.pushState(null,null,location.pathname + '?' + newParams.join('&'));
	},

	//Подключает файлы
	includeFiles: function(){
		var newScript = document.createElement('script');
		newScript.type = 'text/javascript';
		newScript.src = '/Room-map/Room-map-config.js';
		document.getElementsByTagName('head')[0].appendChild(newScript);
		
		var newScript = document.createElement('script');
		newScript.type = 'text/javascript';
		newScript.src = '/Room-map/Jquery.js';
		document.getElementsByTagName('head')[0].appendChild(newScript);

		var newLink = document.createElement('link');
		newLink.type = 'text/css';
		newLink.rel = 'stylesheet';
		newLink.href = '/Room-map/Room-map-styles.css';
		document.getElementsByTagName('head')[0].appendChild(newLink);		
	},
	
	//Загрузка зависимых от загружаемых ранее файлов
	includeDependentFiles: function(){
		var newScript = document.createElement('script');
		newScript.type = 'text/javascript';
		newScript.src = '/Room-map/Langs/' + RoomMap.lang + '.js';
		newScript.onload = function(){RoomMap.LoadMatrix[0] = 1;}
		document.getElementsByTagName('head')[0].appendChild(newScript);
	},
	
	LoadTools: function(){
		//Кнопка "слои"
		$('<div class="layers" title="' + RoomMap.Langs.layers + '"></div>').appendTo('#' + RoomMap.idElement);
	}
}
