//TODO вынести изменение координат в отдельную функцию
//TODO снова проблемы с ресайзом
//TODO сделать удаление svg при выходе из зоны

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
				RoomMap.$mapBlock = $('#' + idElement).addClass('roomMapContentBlock');
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
			RoomMap.mapWidth = window.innerWidth;
			RoomMap.mapHeight = window.innerHeight;
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
				RoomMap.updateUrl({x:RoomMap.position_X,y:RoomMap.position_Y});
				
				//Изменяем размер блока с картой
				RoomMap.mapWidth = window.innerWidth;
				RoomMap.mapHeight = window.innerHeight;
				RoomMap.$mapBlock.css({
					width: RoomMap.mapWidth + 'px',
					height: RoomMap.mapHeight + 'px'
				})
				
				//Изменяем размер затемненного фона, изменяем и двигаем инфоблок и двигаем лоадер, если они есть
				if(RoomMap.$mapBlock.find('.darkWall').length){
					RoomMap.$mapBlock.find('.darkWall').css({width: RoomMap.mapWidth + 'px',height: RoomMap.mapHeight + 'px'});
				}
				if(RoomMap.$mapBlock.find('.loader').length){
					RoomMap.$mapBlock.find('.loader').css({'margin-left': -110 + RoomMap.mapWidth/2 + 'px','margin-top': -10 + RoomMap.mapHeight/2 + 'px'});
				}
				if(RoomMap.$svgDetailsBlock.length){
					RoomMap.$svgDetailsBlock.css({'width': RoomMap.mapWidth*0.5 + 'px', 'height': RoomMap.mapHeight*0.8 + 'px', 'margin-left': (RoomMap.mapWidth - RoomMap.mapWidth*0.5)/2 + 'px', 'margin-top': (RoomMap.mapHeight - RoomMap.mapHeight*0.8)/2 + 'px'});
					RoomMap.$svgDetailsBlock.find('.content').css('height', RoomMap.$svgDetailsBlock.height() - RoomMap.$svgDetailsBlock.find('.header').outerHeight() + 'px');
				}

				//Изменяем размер SVG
				RoomMap.$mapBlock.find('svg').css({width: RoomMap.mapWidth + 'px',height: RoomMap.mapHeight + 'px'});
				
				//Сдвигаем фрагменты карт
				RoomMap.$mapBlock.find('img,.svgobject').each(function(index,fragment){
					if(typeof $(fragment).attr('class').baseVal != 'undefined' && $(fragment).attr('class').baseVal.indexOf('svgobject') != -1){
						if($(fragment).attr('class').baseVal.indexOf('svgcircle') != -1){
							fragment.setAttributeNS(null,'cx',parseInt(fragment.getAttribute('cx')) - dX);
							fragment.setAttributeNS(null,'cy',parseInt(fragment.getAttribute('cy')) - dY);
						}else if($(fragment).attr('class').baseVal.indexOf('svgpolygon') != -1){
							//Для полигонов перебираем все точки
							var newPoints = [];
							for(i = 0; i < $(fragment).attr('points').length; i++){
								var x = $(fragment).attr('points')[i].x - dX;
								var y = $(fragment).attr('points')[i].y - dY
								newPoints.push([x + ',' + y]);
							}
							fragment.setAttributeNS(null,'points',newPoints.join(' '));
						}
					}else{
						$(fragment).css('top',parseInt($(this).css('top')) - dY + 'px');
						$(fragment).css('left',parseInt($(this).css('left')) - dX + 'px');
					}
				});
			})
		}
		else {
			RoomMap.$mapBlock.css('border','1px solid whitesmoke');
		}
	
		//Установка размеров карты
		RoomMap.$mapBlock.css({
			width: RoomMap.mapWidth + 'px',
			height: RoomMap.mapHeight + 'px'
		});

		//Установим лого
		$('<div class="logo"></div>').appendTo(RoomMap.$mapBlock);

		//Загружаем инструменты
		if(RoomMap.tools){
			RoomMap.LoadTools();
		}

		//Блок для отображения текущего расположения
		$('<div class="location"><span class="level"></span><span class="separator"></span><span class="layer" title="' + RoomMap.Langs.hidelayer + '"></span></div>').appendTo(RoomMap.$mapBlock).find('.layer').click(function(){
			//При клике на слой, скрывает его
			RoomMap.selectItemList(['layer',RoomMap.layer]);
		});

		//Прицел на центр карты
		if(RoomMap.showTarget){
			var target = $('<div class="target"></div>').appendTo(RoomMap.$mapBlock);
			(function pulsar(){
				target.fadeOut(500,function(){
					target.fadeIn(500,pulsar);
				})
			})();
		}
		
		//Создаем SVG холст
		RoomMap.$svg = $('<svg class="svg" style="width: ' + RoomMap.mapWidth + 'px; height: ' + RoomMap.mapHeight + 'px;"></svg>').appendTo(RoomMap.$mapBlock);
		//Создаем блок для подсказок SVG и вешаем событие на него, чтобы отскакивал
		RoomMap.$titlesvgblock = $('<div class="titlesvgblock"></div>').appendTo(RoomMap.$mapBlock).bind('mouseover mousemove',function(event){
			//RoomMap.moveTitleSvgBlock(event);
		});
		//Движение подсказки при 'ходьбе' по SVG объекту
		$(RoomMap.$svg,RoomMap.$titlesvgblock).bind('mousemove',function(event){
			RoomMap.moveTitleSvgBlock(event);
		});
			
		//Блок для вывода информации об объекте
		RoomMap.$svgDetailsBlock = $('<div class="svgDetailsBlock"><div class="header">' + RoomMap.Langs.svginfo + '</div><div class="content"></div></div>').appendTo(RoomMap.$mapBlock).css({width: 0.5 * RoomMap.mapWidth + 'px', height: 0.8 * RoomMap.mapHeight + 'px', 'margin-left': (RoomMap.mapWidth - RoomMap.mapWidth*0.5)/2 + 'px', 'margin-top': (RoomMap.mapHeight - RoomMap.mapHeight*0.8)/2 + 'px'});

		//Загружаем SVG объекты
		RoomMap.loadSvg();
		
		//Загружаем списки слоев и уровней
		RoomMap.LoadLinks();

		//Определяем список фрагментов
		var listOfFragments = RoomMap.getListOfFragments(RoomMap.position_X, RoomMap.position_Y, RoomMap.mapWidth, RoomMap.mapHeight);
		//Загружаем фрагменты карт
		RoomMap.loadFragments(listOfFragments);

		//Обработчик нажатия на карту левой кнопкой мыши
		RoomMap.$svg.bind('mousedown touchstart',RoomMap.scrollMap);
		RoomMap.$svg.bind('mouseup touchend',RoomMap.scrollMapCancel);

		//Обработчик прокрутки колесика (пока только для Chrome)
		RoomMap.$svg.bind('wheel',function(){
			if(typeof event != 'undefined'){
				event.preventDefault();
				RoomMap.selectScale(event);
			}
		});

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
			//Список загружаемых частей (фрагменты и слои)
			var covers = {fr:RoomMap.level,lr:RoomMap.layer};
			for(var cover in covers){
				//Для слоев. Если слой не выбран его не грузим
				if(covers[cover] == 0) continue;
			
				//Если фрагмент загружен, снова его грузить не надо
				if($('#' + cover + listOfFragments[i][0] + listOfFragments[i][1]).length > 0) continue;
				//Загружать фрагменты ограниченные размером карты
				if(RoomMap.loadFragmentsForSize){
					if(listOfFragments[i][0] > RoomMap.scales[RoomMap.scale][2][1] || listOfFragments[i][0] < -RoomMap.scales[RoomMap.scale][2][3] || listOfFragments[i][1] > RoomMap.scales[RoomMap.scale][2][0] || listOfFragments[i][1] < -RoomMap.scales[RoomMap.scale][2][2]) continue
				}
				
				var newFragment = new Image();
				var layerPath = cover == 'lr' ? 'layers/' + covers[cover] + '/' : '';				
				newFragment.src = RoomMap.pathForFragments + '/' + RoomMap.scale + '/levels/' + RoomMap.level + '/' + layerPath + listOfFragments[i][0] + '&' + listOfFragments[i][1] + '.png';
				$(newFragment).css({position: 'absolute', opacity: '0'});
				$(newFragment).attr('id',cover + listOfFragments[i][0] + listOfFragments[i][1]);
				
				//Позиция относительно центра координат
				var posX = listOfFragments[i][0] < 1 ? Math.ceil((RoomMap.mapWidth/2)) - RoomMap.sizeOfFragment*Math.abs(listOfFragments[i][0]) : Math.ceil((RoomMap.mapWidth/2)) + RoomMap.sizeOfFragment*listOfFragments[i][0] - RoomMap.sizeOfFragment;
				var posY = listOfFragments[i][1] < 1 ? Math.ceil((RoomMap.mapHeight/2)) + RoomMap.sizeOfFragment*Math.abs(listOfFragments[i][1]) - RoomMap.sizeOfFragment : Math.ceil((RoomMap.mapHeight/2)) - RoomMap.sizeOfFragment*listOfFragments[i][1];

				//Вставляем элемент в блок + корректируем координаты (учитываем сдвиг)
				$(newFragment).css('left', posX + Math.round(RoomMap.position_X/RoomMap.scales[RoomMap.scale][0] * -1) + 'px');
				$(newFragment).css('top', posY + Math.round(RoomMap.position_Y/RoomMap.scales[RoomMap.scale][0]) + 'px');
				$(newFragment).addClass(cover + 'MainMap');
				
				//Обработчик, плавное появление фрагмента после загрузки
				$(newFragment).one('load',function(){
					$(this).animate({opacity:'1'});
				}).mousedown(function(event){
					//Запрещаем перетаскивание фрагментов карты
					event.preventDefault();
				});
				
				RoomMap.$mapBlock.append(newFragment);
			
			}
		}
	},

	//Удаляем фрагменты карт
	removeFragments: function(){
		RoomMap.$mapBlock.find('img').each(function(){
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
		var default_X = event.clientX || event.originalEvent.touches[0].clientX;
		var default_Y = event.clientY || event.originalEvent.touches[0].clientY;
		
		event.preventDefault();
		this.setAttributeNS(null,"class","svg scrolledmap");

		//Обработчик движения мыши
		$().bind('mousemove touchmove',function(event){
			var current_X = event.clientX || event.originalEvent.touches[0].clientX;
			var current_Y = event.clientY || event.originalEvent.touches[0].clientY;
			
			var dY = default_Y - current_Y;
			var dX = default_X - current_X;
			
			//Предотвращение побега
			if(RoomMap.preventEscape){
				//По горизонтали
				if((RoomMap.position_X + dX * RoomMap.scales[RoomMap.scale][0]) < (-RoomMap.scales[RoomMap.scale][2][3] * RoomMap.scales[RoomMap.scale][1] + RoomMap.mapWidth/2 * RoomMap.scales[RoomMap.scale][0])) {
					//Из-за погрешности вычислений используем диапазон
					if(RoomMap.position_X > (-RoomMap.scales[RoomMap.scale][2][3] * RoomMap.scales[RoomMap.scale][1] + RoomMap.mapWidth/2 * RoomMap.scales[RoomMap.scale][0])-0.00001 && RoomMap.position_X < (-RoomMap.scales[RoomMap.scale][2][3] * RoomMap.scales[RoomMap.scale][1] + RoomMap.mapWidth/2 * RoomMap.scales[RoomMap.scale][0])+0.00001){
						dX = 0;
					}else{
						dX = Math.ceil(((-RoomMap.scales[RoomMap.scale][2][3] * RoomMap.scales[RoomMap.scale][1] + RoomMap.mapWidth/2 * RoomMap.scales[RoomMap.scale][0]) - RoomMap.position_X)/RoomMap.scales[RoomMap.scale][0]);
					}
				}
				else if((RoomMap.position_X + dX * RoomMap.scales[RoomMap.scale][0]) > (RoomMap.scales[RoomMap.scale][2][1] * RoomMap.scales[RoomMap.scale][1] - RoomMap.mapWidth/2 * RoomMap.scales[RoomMap.scale][0])) {
					//Из-за погрешности вычислений используем диапазон
					if(RoomMap.position_X > (RoomMap.scales[RoomMap.scale][2][1] * RoomMap.scales[RoomMap.scale][1] - RoomMap.mapWidth/2 * RoomMap.scales[RoomMap.scale][0])-0.00001 && RoomMap.position_X < (RoomMap.scales[RoomMap.scale][2][1] * RoomMap.scales[RoomMap.scale][1] - RoomMap.mapWidth/2 * RoomMap.scales[RoomMap.scale][0])+0.00001){
						dX = 0;
					}else{
						dX = Math.floor(((RoomMap.scales[RoomMap.scale][2][1] * RoomMap.scales[RoomMap.scale][1] - RoomMap.mapWidth/2 * RoomMap.scales[RoomMap.scale][0]) - RoomMap.position_X)/RoomMap.scales[RoomMap.scale][0]);
					}
				}
				//По вертикали
				if((RoomMap.position_Y - dY * RoomMap.scales[RoomMap.scale][0]) > (RoomMap.scales[RoomMap.scale][2][0] * RoomMap.scales[RoomMap.scale][1] - RoomMap.mapHeight/2 * RoomMap.scales[RoomMap.scale][0])) {
					//Из-за погрешности вычислений используем диапазон
					if(RoomMap.position_Y > (RoomMap.scales[RoomMap.scale][2][0] * RoomMap.scales[RoomMap.scale][1] - RoomMap.mapHeight/2 * RoomMap.scales[RoomMap.scale][0])-0.00001 && RoomMap.position_Y < (RoomMap.scales[RoomMap.scale][2][0] * RoomMap.scales[RoomMap.scale][1] - RoomMap.mapHeight/2 * RoomMap.scales[RoomMap.scale][0])+0.00001){
						dY = 0;
					}else{
						dY = -Math.floor(((RoomMap.scales[RoomMap.scale][2][0] * RoomMap.scales[RoomMap.scale][1] - RoomMap.mapHeight/2 * RoomMap.scales[RoomMap.scale][0]) - RoomMap.position_Y)/RoomMap.scales[RoomMap.scale][0]);
					}
				}
				else if((RoomMap.position_Y - dY * RoomMap.scales[RoomMap.scale][0]) < (-RoomMap.scales[RoomMap.scale][2][2] * RoomMap.scales[RoomMap.scale][1] + RoomMap.mapHeight/2 * RoomMap.scales[RoomMap.scale][0])) {
					//Из-за погрешности вычислений используем диапазон
					if(RoomMap.position_Y > (RoomMap.scales[RoomMap.scale][2][2] * RoomMap.scales[RoomMap.scale][1] + RoomMap.mapHeight/2 * RoomMap.scales[RoomMap.scale][0])-0.00001 && RoomMap.position_Y < (RoomMap.scales[RoomMap.scale][2][2] * RoomMap.scales[RoomMap.scale][1] + RoomMap.mapHeight/2 * RoomMap.scales[RoomMap.scale][0])+0.00001){
						dY = 0;
					}else{
						dY = -Math.ceil(((-RoomMap.scales[RoomMap.scale][2][2] * RoomMap.scales[RoomMap.scale][1] + RoomMap.mapHeight/2 * RoomMap.scales[RoomMap.scale][0]) - RoomMap.position_Y)/RoomMap.scales[RoomMap.scale][0]);
					}
				}

			}
			
			RoomMap.position_X = RoomMap.position_X + dX * RoomMap.scales[RoomMap.scale][0];
			RoomMap.position_Y = RoomMap.position_Y - dY * RoomMap.scales[RoomMap.scale][0];
			
			RoomMap.$mapBlock.find('img,.svgobject').each(function(index,fragment){
				if(typeof $(fragment).attr('class').baseVal != 'undefined' && $(fragment).attr('class').baseVal.indexOf('svgobject') != -1){
					if($(fragment).attr('class').baseVal.indexOf('svgcircle') != -1){
						fragment.setAttributeNS(null,'cx',parseInt(fragment.getAttribute('cx')) - dX);
						fragment.setAttributeNS(null,'cy',parseInt(fragment.getAttribute('cy')) - dY);
					}else if($(fragment).attr('class').baseVal.indexOf('svgpolygon') != -1){
						//Для полигонов перебираем все точки
						var newPoints = [];
						for(i = 0; i < $(fragment).attr('points').length; i++){
							var x = $(fragment).attr('points')[i].x - dX;
							var y = $(fragment).attr('points')[i].y - dY
							newPoints.push([x + ',' + y]);
						}
						fragment.setAttributeNS(null,'points',newPoints.join(' '));
					}
				}else{
					$(fragment).css('top',parseInt($(this).css('top')) - dY + 'px');
					$(fragment).css('left',parseInt($(this).css('left')) - dX + 'px');
				}
			});
				
			if(!RoomMap.timeoutLoader){
				RoomMap.timeoutLoader = setTimeout(function(){
					var listOfFragments = RoomMap.getListOfFragments(RoomMap.position_X, RoomMap.position_Y, RoomMap.mapWidth, RoomMap.mapHeight);
					//Загружаем фрагменты карт
					RoomMap.loadFragments(listOfFragments);
					RoomMap.loadSvg();
					RoomMap.timeoutLoader = null;
				},300);
			}
			
			default_X = event.clientX || event.originalEvent.touches[0].clientX;
			default_Y = event.clientY || event.originalEvent.touches[0].clientY;
		});
	},

	//Заканчиваем скролл карты
	scrollMapCancel: function(){
		$().unbind('mousemove touchmove');
		var svgelement = RoomMap.$mapBlock.find('svg').get(0);
		svgelement.setAttributeNS(null,'class','svg');
		//Удаляем фрагменты карт
		if(RoomMap.removeLostFragmens){
			RoomMap.removeFragments();
		}
		RoomMap.updateUrl({x:RoomMap.position_X,y:RoomMap.position_Y});
	},

	//Обновление URL при изменениях
	updateUrl: function(objParams){
		var l = location.search;
		if(l == ''){
			l = '?';
		}
		
		for(var param in objParams){
			var preg = new RegExp('[^a-z0-9]' + param + '=[^&]+');
			if(preg.test(l)) {
				var preg_replace = new RegExp('([?&]+)' + param + '=[^&]+','g');
				l = l.replace(preg_replace,(objParams[param] != 0 ?  '$1' + param + '=' + objParams[param] : ''));
			}else{
				l += objParams[param] != 0 ? (l.length > 3 ? '&' : '') + param + '=' + objParams[param] : '';
			}
		}
		history.pushState(null,null,location.pathname + l);
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
	
	//Подключение зависимых от подключенных ранее файлов
	includeDependentFiles: function(){
		var newScript = document.createElement('script');
		newScript.type = 'text/javascript';
		newScript.src = '/Room-map/Langs/' + RoomMap.lang + '.js';
		newScript.onload = function(){RoomMap.LoadMatrix[0] = 1;}
		document.getElementsByTagName('head')[0].appendChild(newScript);
	},
	
	//Загрузка кнопок/инструментов
	LoadTools: function(){
		//Кнопка "слои"
		$('<div class="tool_btn layers list" title="' + RoomMap.Langs.layers + '"></div>').appendTo(RoomMap.$mapBlock).click(function(){
			RoomMap.ShowList('layers','layer',this);
		});
		//Кнопка "уровни"
		$('<div class="tool_btn levels list" title="' + RoomMap.Langs.levels + '"></div>').appendTo(RoomMap.$mapBlock).click(function(){
			RoomMap.ShowList('levels','level',this);
		});

		//Кнопка "плюс"
		$('<div class="tool_btn plus" title="' + RoomMap.Langs.gocloser + '"></div>').appendTo(RoomMap.$mapBlock).click(function(){
			RoomMap.selectScale({},-1);
		});
		//Кнопка "минус"
		$('<div class="tool_btn minus" title="' + RoomMap.Langs.goaway + '"></div>').appendTo(RoomMap.$mapBlock).click(function(){
			RoomMap.selectScale({},1);
		});
		
		//Плавное изменение прозрачности при наведении
		$('.tool_btn').hover(function(){
			if(!$(this).hasClass('active'))
				$(this).animate({opacity:'1'},200);
		},
		function(){
			if(!$(this).hasClass('active'))
				$(this).animate({opacity:'0.5'},200);
		})
	},
	
	//Загружает список доступных слоев, уровней
	LoadLinks: function(){
		$.ajax({
			url: '/Room-map/Room-map-remote.php',
			type: 'get',
			data: {
				'data': 'getlists'
			},
			dataType: 'json',
			success: function(data){
				RoomMap.layers = data.layers;
				RoomMap.levels = data.levels;

				//Устанавливаем информацию о текущей локации
				RoomMap.setInfoLocation();
			}
		})
	},
	
	//Загружает SVG объекты
	loadSvg: function(){
		$.ajax({
			url: '/Room-map/Room-map-remote.php',
			type: 'get',
			data: {
				'data': 'getsvg',
 				'min_x': RoomMap.position_X - (RoomMap.mapWidth * RoomMap.scales[RoomMap.scale][0] / 2),
				'min_y': RoomMap.position_Y - (RoomMap.mapHeight * RoomMap.scales[RoomMap.scale][0] / 2),
				'max_x': RoomMap.position_X + (RoomMap.mapWidth * RoomMap.scales[RoomMap.scale][0] / 2),
				'max_y': RoomMap.position_Y + (RoomMap.mapHeight * RoomMap.scales[RoomMap.scale][0] / 2),
				'level': RoomMap.level,
				'layer': RoomMap.layer
			},
			dataType: 'json',
			success: function(data){
				RoomMap.svg = data.svg;
				RoomMap.svgPositioner(RoomMap.svg);
			}
		})
	},
	
	//Позиционирует SVG объекты на карте
	svgPositioner: function(svgList){
		$.each(svgList,function(index, data){

			data.content = JSON.parse(data.content);
			if($('#svg' + data.id).length > 0) return;

			//Создаем круг
			if(data.content.type == 'circle'){
				var left = Math.round((RoomMap.mapWidth*RoomMap.scales[RoomMap.scale][0] - RoomMap.mapWidth*RoomMap.scales[RoomMap.scale][0]/2 - RoomMap.position_X + parseFloat(data.min_x))/RoomMap.scales[RoomMap.scale][0]);
				var top = Math.round((RoomMap.mapHeight*RoomMap.scales[RoomMap.scale][0] - RoomMap.mapHeight*RoomMap.scales[RoomMap.scale][0]/2 + RoomMap.position_Y - parseFloat(data.min_y))/RoomMap.scales[RoomMap.scale][0]);
				
				var newObject = document.createElementNS('http://www.w3.org/2000/svg',"circle"); 
				newObject.setAttributeNS(null,"class","svgobject svgcircle");

				newObject.setAttributeNS(null,"cx",left  + parseInt(data.content.params.r/RoomMap.scales[RoomMap.scale][0]));
				newObject.setAttributeNS(null,"cy",top - parseInt(data.content.params.r/RoomMap.scales[RoomMap.scale][0]));
				newObject.setAttributeNS(null,"r",parseInt(data.content.params.r/RoomMap.scales[RoomMap.scale][0]));

			}
			//Создаем полигон
			else if(data.content.type == 'polygon'){
				var newObject = document.createElementNS('http://www.w3.org/2000/svg',"polygon"); 
				newObject.setAttributeNS(null,"class","svgobject svgpolygon");
			
				//Пересчитываем координаты точек в соответствии с отступом
				var points = [];
				$.each(data.content.params.points,function(index,elements){
					var x = Math.round((RoomMap.mapWidth*RoomMap.scales[RoomMap.scale][0] - RoomMap.mapWidth*RoomMap.scales[RoomMap.scale][0]/2 - RoomMap.position_X + parseFloat(elements[0]))/RoomMap.scales[RoomMap.scale][0]);
					var y = Math.round((RoomMap.mapHeight*RoomMap.scales[RoomMap.scale][0] - RoomMap.mapHeight*RoomMap.scales[RoomMap.scale][0]/2 + RoomMap.position_Y - parseFloat(elements[1]))/RoomMap.scales[RoomMap.scale][0]);
					points.push(x + ',' + y);
				});
				
				newObject.setAttributeNS(null,"points",points.join(' '));
			}
			
			newObject.setAttributeNS(null,"id","svg" + data.id);
			newObject.setAttributeNS(null,"iddescription", data.id_description);
			newObject.setAttributeNS(null,"fill","black");
			newObject.setAttributeNS(null,"fill-opacity","0.0");
			
			$(newObject).bind('mouseover',function(event){
				RoomMap.$titlesvgblock.stop().html(data.title).animate({'opacity':0.8},200);
			});
			$(newObject).bind('mouseout',function(){
				RoomMap.$titlesvgblock.animate({'opacity':0},200);
			});

			//Добавляем обработчик кликов и вставляем в документ
			$(newObject).bind('click',RoomMap.ShowDetails);
			document.getElementsByTagName('svg')[0].appendChild(newObject);
			
		});
	},

	//Загружает и выводит информацию о выделенном объекте
	ShowDetails: function(){
		//Получаем идентификатор объекта, делаем запрос к серверу и возвращаем документ
		var id = $(this).attr('id').match(/svg([0-9]+)/)[1];

		var ajax = $.ajax({
			url: '/Room-map/Room-map-remote.php',
			type: 'get',
			dataType: 'json',
			data: {
				data: 'getdetails',
				object_id: id,
				level: RoomMap.level
			},
			success: function(data){
				loader.remove();
				if(data.details != null && data.details.length > 0){
					// Показываем блок и выводим информацию
					RoomMap.$svgDetailsBlock.find('.content').css('height','0px').html(data.details);
					RoomMap.$svgDetailsBlock.fadeIn(100,function(){
						RoomMap.$svgDetailsBlock.find('.content').css({'height':  RoomMap.$svgDetailsBlock.height() - RoomMap.$svgDetailsBlock.find('.header').outerHeight() + 'px'});
					});
				}else{
					darkWall.animate({opacity:0},100,function(){$(this).remove();});
				}
			}
		});

		//Вставляем лоадер
		var loader = $('<div class="loader"></div>').css({'margin-left': -110 + RoomMap.mapWidth/2 + 'px', 'margin-top': -10 + RoomMap.mapHeight/2 + 'px'}).appendTo(RoomMap.$mapBlock);
		
		//Создаем блок-занавес и вешаем обработчик на клик
		var darkWall = $('<div class="darkWall"></div>').css({width: RoomMap.mapWidth + 'px', height: RoomMap.mapHeight + 'px'}).appendTo(RoomMap.$mapBlock).animate({opacity: 0.8},100).bind('click',function(){
			RoomMap.$svgDetailsBlock.fadeOut(100);
			$(this).add('.loader',RoomMap.$mapBlock).animate({opacity: 0},100).queue(function(){$(this).remove()});
			ajax.abort();
		});
	},
	
	//Показывет список во всплюывающем меню
	ShowList: function(listName,itemType,button){
		//Если повторно нажимаем на уже нажатую кнопку - скрываем список
		if($(button).hasClass('active')){
			$('#list').animate({bottom:'-120px'},200).queue(function(){$(this).remove();});
			$(button).removeClass('active');
			return;
		}
		
		//Если какая-то кнопка была нажата до этого
		$('.tool_btn.list').removeClass('active');
		$(button).addClass('active');
		$('.tool_btn.list').trigger('mouseout');
		
		//Заменяем элементы списка, если список уже открыт
		if(RoomMap.$mapBlock.find('#list').length > 0){
			RoomMap.$mapBlock.find('#list div.listItem').animate({opacity:0},100).queue(function(){
				RoomMap.$mapBlock.find('#list div.listItem').remove();
				$.each(RoomMap[listName],function(index,item){
					$('<div class="listItem ' + (RoomMap[itemType] == item.code ? 'selected' : '') + '" title="' + item.description[RoomMap.lang] + '"><div class="listItemName">' + item.name[RoomMap.lang] + '</div></div>').appendTo('#list').data('code',item.code).data('type',itemType).bind('click',function(){RoomMap.selectItemList([$(this).data('type'),$(this).data('code')]);}).css({opacity:0,background:'url(/images/' + listName + '/' + item.code + '.png) no-repeat'}).animate({opacity:1},200);
				});
			});
		}else{
			//Создаем блок, вставляем список и выводим его
			var list = $('<div id="list"></div>').appendTo(RoomMap.$mapBlock);
			$.each(RoomMap[listName],function(index,item){
				$('<div class="listItem ' + (RoomMap[itemType] == item.code ? 'selected' : '') + '" title="' + item.description[RoomMap.lang] + '"><div class="listItemName">' + item.name[RoomMap.lang] + '</div></div>').appendTo(list).data('code',item.code).data('type',itemType).bind('click',function(){RoomMap.selectItemList([$(this).data('type'),$(this).data('code')]);}).css({background:'url(/images/' + listName + '/' + item.code + '.png) no-repeat'});
				
			});
			list.animate({bottom: '0px'},200);
		}
	},
	
	//Накладывает слой или меняет уровень при выборе из списка
	selectItemList: function(obj){
		//Изменяем текущий URL
		var param = {};
		//При выборе уже активного слоя убираем его (из URL)
		param[obj[0]] = obj[0] != 'level' && RoomMap[obj[0]] == obj[1] ? 0 : obj[1];
		//Если масштаб не дефолтный - обновляем и его 
		if(RoomMap.scale != RoomMap.scaleDefault){
			param['scale'] = RoomMap.scale;
		}else{
			param['scale'] = 0;
		}

		//Изменяем текущий выбранный уровень/слой
		RoomMap[obj[0]] = param[obj[0]];
		//Обновляем url
		RoomMap.updateUrl(param);
		
		//Загружаем слой или уровень
		if(obj[0] == 'level'){
			//Удаляем все фрагменты
			RoomMap.$mapBlock.find('.frMainMap').animate({opacity:0},200,function(){$(this).remove()});;
			//Проверить, есть ли выбранный слой на выбранном уровне (убрать или обновить) TODO
		}
		
		//Удаляем слой в любом случае
		RoomMap.$mapBlock.find('.lrMainMap').animate({opacity:0},200,function(){$(this).remove()});
		//Удаляем SVG
		RoomMap.$mapBlock.find('svg').children().remove();
		
		//После того, как все фрагменты слоя удалились загружаем новые (если нужно)
		//Таймаут чтобы не сработала блокировка загрузки (существующих фрагментов карт), т.к. они плавно исчезают
		setTimeout(function(){
			//Определяем список фрагментов
			var listOfFragments = RoomMap.getListOfFragments(RoomMap.position_X, RoomMap.position_Y, RoomMap.mapWidth, RoomMap.mapHeight);
			//Загружаем фрагменты карт
			RoomMap.loadFragments(listOfFragments);
			//Загружаем SVG объекты
			RoomMap.loadSvg();
		},250);

		//Скрываем блок-список повторным нажатием на кнопку
		$('.tool_btn.list.active').trigger('click').removeClass('active').trigger('mouseout');
		//Скрываем подсказку, иначе может остаться висеть постоянно
		RoomMap.$titlesvgblock.animate({'opacity':0},200);

		//Устанавливаем информацию о текущей локации
		RoomMap.setInfoLocation();
	},

	//Устанавливает информацию о текущей локации
	setInfoLocation: function(){
		var curLevel, curLayer;

		$.each(RoomMap.levels,function(index,data){
			if(data.id == RoomMap.level){
				curLevel = data;
			}
		});

		$.each(RoomMap.layers,function(index,data){
			if(data.code == RoomMap.layer){
				curLayer = data;
			}
		});

		//Уровень
		RoomMap.$mapBlock.find('.location .level').text(curLevel.name[RoomMap.lang]);
		//Слой
		if(curLayer){
			RoomMap.$mapBlock.find('.location .layer').text(curLayer.name[RoomMap.lang].toLowerCase()).siblings('.separator').text(', ');
		}
		else {
			RoomMap.$mapBlock.find('.location .layer').text('').siblings('.separator').text('');
		}
	},

	//Выбор масштаба колесиком мыши или кнопками
	selectScale: function(event, move){
		//Уменьшаем масштаб
		if(event.deltaY > 0 || move == 1){
			//Проверим, есть ли меньший масштаб
			for(var i = 0; i < RoomMap.scalesList.length; i++){
				if(RoomMap.scalesList[i] == RoomMap.scale){
					//Если есть масштаб меньше, загружаем его
					if(typeof RoomMap.scalesList[i+1] != 'undefined' && RoomMap.scalesList[i+1] > RoomMap.scale){
						RoomMap.changeScale(RoomMap.scalesList[i+1]);
					}
					return;
				}
			}
		}
		//Увеличиваем масштаб
		else {
			//Проверим, есть ли больший масштаб
			for(var i = RoomMap.scalesList.length - 1; i >= 0; i--){
				if(RoomMap.scalesList[i] == RoomMap.scale){
					//Если есть масштаб меньше, загружаем его
					if(typeof RoomMap.scalesList[i-1] != 'undefined' && RoomMap.scalesList[i-1] < RoomMap.scale){
						RoomMap.changeScale(RoomMap.scalesList[i-1]);
					}
					return;
				}
			}
		}
	},

	//Изменение масштаба
	changeScale: function(scale){
		RoomMap.scale = scale;
		RoomMap.selectItemList(['level',RoomMap.level]);
	},


	//Движение подсказки
	moveTitleSvgBlock: function(event){
		var offsetX = 15;
		if((event.originalEvent.offsetX + RoomMap.$titlesvgblock.outerWidth() + offsetX) > RoomMap.mapWidth){
			//Плавно перетаскиваем блок в другую сторону
			if(RoomMap.$titlesvgblock.data('offsetX') == 'right'){
				RoomMap.$titlesvgblock.animate({'margin-left': -(offsetX + RoomMap.$titlesvgblock.outerWidth()) + 'px'},100);
			}

			RoomMap.$titlesvgblock.data('offsetX','left');
		}else{
			//Плавно перетаскиваем блок в другую сторону
			if(RoomMap.$titlesvgblock.data('offsetX') == 'left'){
				RoomMap.$titlesvgblock.animate({'margin-left': offsetX + 'px'},100);
			}

			RoomMap.$titlesvgblock.data('offsetX','right');
		}

		var offsetY = 30;
		if((event.originalEvent.offsetY - offsetY < 0)){
			if(RoomMap.$titlesvgblock.data('offsetY') == 'top'){
				RoomMap.$titlesvgblock.animate({'margin-top': offsetY + 'px'},100);
			}

			RoomMap.$titlesvgblock.data('offsetY','bottom');
		}else{
			if(RoomMap.$titlesvgblock.data('offsetY') == 'bottom'){
				RoomMap.$titlesvgblock.animate({'margin-top': -offsetY + 'px'},100);
			}

			RoomMap.$titlesvgblock.data('offsetY','top');
		}


		RoomMap.$titlesvgblock.css({'top': event.originalEvent.offsetY + 'px','left': event.originalEvent.offsetX + 'px'});
	}
}
