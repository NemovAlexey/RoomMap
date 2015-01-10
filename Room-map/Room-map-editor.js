RoomMap.editor = {
	currentmode: 'show',	//Текущий режим (show - просмотр, edit - редактирование)
	propblockisthere: 0,	//Вызван ли блок для создания/редактирования объекта
	currentCreatePoint: 0,
	//Создает меню для выбора режима, а так же инструменты для редактирования карты
	createEditorTools: function(){
		//Создание меню выбора режима
		RoomMap.editor.createMenuSelectMode();

		//Создание меню для кнопок редактора
		RoomMap.editor.loadEditorTools();
	},

	//Создает меню для выбора режима
	createMenuSelectMode: function(){
		RoomMap.$modemenu = $('<div class="modemenu" title="' + RoomMap.Langs.modes + '"><div class="selectmodemenu"></div><div class="modemenubuttons"><div class="modeshow tool_btn" title="' + RoomMap.Langs.mode_show + '"></div><div class="modeedit tool_btn" title="' + RoomMap.Langs.mode_edit + '"></div></div></div>').appendTo(RoomMap.$mapBlock);
		//Обработка клика на кнопку отображения меню (отображение кнопок выбора режима)
		$('.selectmodemenu',RoomMap.$modemenu).click(function(){
			var $b_this = $(this);
			$b_this.animate({'margin-top':'-20px'},200, function(){
				$b_this.parent().animate({'margin-top':'0px'},200);
				$b_this.parent().find('.mode' + RoomMap.editor.currentmode).css({'opacity':'1'}).addClass('active');
			});
		});

		//Скрывает блок выбора режима
		function hidemodemenu(){
			RoomMap.$modemenu.animate({'margin-top':'-32px'},200,function(){
				RoomMap.$modemenu.find('.tool_btn').removeClass('active').trigger('mouseout');
				RoomMap.$modemenu.find('.selectmodemenu').animate({'margin-top':'32px'},200)
			});
		}

		//Клик на кнопку выбора режима
		//Режим просмотра
		$('.modeshow',RoomMap.$modemenu).click(function(){
			$('.tool_btn',RoomMap.$modemenu).removeClass('active');
			$('.modeedit',RoomMap.$modemenu).trigger('mouseout');
			$(this).addClass('active');
			RoomMap.editor.modeShow();
			RoomMap.editor.ActionCancel();
			hidemodemenu();
		});
		//Режим редактирования
		$('.modeedit',RoomMap.$modemenu).click(function(){
			$('.tool_btn',RoomMap.$modemenu).removeClass('active');
			$('.modeshow',RoomMap.$modemenu).trigger('mouseout');
			$(this).addClass('active');
			RoomMap.editor.modeEdit();
			hidemodemenu();
		});		
	},

	//Включает режим просмотра
	modeShow: function(){
		if(RoomMap.editor.currentmode == 'show'){
			return;
		}

		RoomMap.editor.currentmode = 'show';

		//Скрываем кнопки для управления объектами на карте
		RoomMap.$EditorTools.animate({'margin-right':'-50px'},100,function(){
			//Отображаем общие кнопки управления, если они есть
			if(RoomMap.tools) RoomMap.$CommonTools.animate({'margin-right':'0px'},100);
		});

		RoomMap.$CoorBlock.remove();
	},

	//Включает режим редактирования
	modeEdit: function(){
		if(RoomMap.editor.currentmode == 'edit'){
			return;
		}

		//Скрываем общие кнопки управления, если они есть
		if(RoomMap.tools){
			if($('.tool_btn.active',RoomMap.$CommonTools).length > 0){
				$('.tool_btn.active',RoomMap.$CommonTools).trigger('click').trigger('mouseout');
			}
			RoomMap.$CommonTools.animate({'margin-right':'-50px'},100,function(){
				//Отображаем кнопки для управления объектами на карте
				RoomMap.$EditorTools.animate({'margin-right':'0px'},100);
			});
		}else{		
			//Отображаем кнопки для управления объектами на карте
			RoomMap.$EditorTools.animate({'margin-right':'0px'},100);
		}

		RoomMap.editor.currentmode = 'edit';

		//Создание блока отображения координат курсора
		RoomMap.$CoorBlock = $('<div class="coordinateblock"><span class="coor_x"></span> : <span class="coor_y"></span></div>').appendTo(RoomMap.$mapBlock);

	},

	//Создает блок с инструментами редактора
	loadEditorTools: function(){
		//Создание инструментов для редактирования карты
		//Всеобъемлющий блок для инструментов редактора
		RoomMap.$EditorTools = $('<div class="editorTools"></div>').appendTo(RoomMap.$mapBlock);
		//Кнопка для создания окружности
		$('<div class="createCircle tool_btn" title="' + RoomMap.Langs.add_circle + '"></div>').appendTo(RoomMap.$EditorTools).click(RoomMap.editor.createCircle);
		//Кнопка для создания полигона
		$('<div class="createPolygon tool_btn" title="' + RoomMap.Langs.add_polygon + '"></div>').appendTo(RoomMap.$EditorTools).click(RoomMap.editor.createPolygon);
		//Кнопка редактирования объектов
		$('<div class="editObject tool_btn" title="' + RoomMap.Langs.edit_obj + '"></div>').appendTo(RoomMap.$EditorTools).click(RoomMap.editor.editObject);
	},

	//Клик на кнопку создания окружности
	createCircle: function(){
		if(RoomMap.editor.propblockisthere) return;
		RoomMap.editor.propblockisthere = 1;
		RoomMap.editor.selectCurrentEditorTool();
		//Создаем блок с параметрами
		RoomMap.editor.createBlockPropertiesForCircle(null);
	},

	//Клик на кнопку создания полигона
	createPolygon: function(){
		if(RoomMap.editor.propblockisthere) return;
		RoomMap.editor.propblockisthere = 2;
		RoomMap.editor.selectCurrentEditorTool();
		//Создаем блок с параметрами
		RoomMap.editor.createBlockPropertiesForPoly(null);
	},

	//Клик на кнопку редактирования объекта
	editObject: function(){
		if(RoomMap.editor.propblockisthere) return;
		RoomMap.editor.propblockisthere = 3;
		RoomMap.editor.selectCurrentEditorTool();
		//Клик на существующий объект
		$('*',RoomMap.$svg).bind('dblclick.editor',function(){
			if($(this).attr('class').baseVal.indexOf('svgcircle') != -1){
				RoomMap.editor.createBlockPropertiesForCircle(this);
			}else if($(this).attr('class').baseVal.indexOf('svgpolygon') != -1){
				RoomMap.editor.createBlockPropertiesForPoly(this);
			}
		});
	},

	//Обновление координат при движении курсора
	updateCoor: function(event){
		RoomMap.tex = event;
		RoomMap.editor.coor_x = (RoomMap.editor.getRealCoordinate('x',event.originalEvent.offsetX)).toFixed(2);
		RoomMap.editor.coor_y = (RoomMap.editor.getRealCoordinate('y',event.originalEvent.offsetY)).toFixed(2);
		$('.coor_x',RoomMap.$CoorBlock).text(RoomMap.editor.coor_x);
		$('.coor_y',RoomMap.$CoorBlock).text(RoomMap.editor.coor_y);
	},

	//Создает блок свойств объекта для окружности
	createBlockPropertiesForCircle: function(object){
		//Если объект существует, то заполняем данными
		if(object != null){
			object.setAttributeNS('','class',$(object).attr('class').baseVal + ' new');
			var radius = object.r.baseVal.value * RoomMap.scales[RoomMap.scale][0];
			var coor_x = RoomMap.editor.getRealCoordinate('x',object.cx.baseVal.value);
			var coor_y = RoomMap.editor.getRealCoordinate('y',object.cy.baseVal.value);
			var editsvg = 1;
		}
		//Иначе создаем пустой
		else{
			var radius = 0;
			var coor_x = 0;
			var coor_y = 0;
			var editsvg = 0;
		}

		//Создаем блок
		$propBlock = $('<div class="PropertiesForCircle propBlock"><div class="dragArea"></div><div class="propArea"><div><input type="text" class="objRadius inp"  value="' + radius + '" title="' + RoomMap.Langs.radius + '" /><input type="text" class="objCoorX inp" value="' + coor_x + '" title="' + RoomMap.Langs.coor_x + '" /><input type="text" class="objCoorY inp" value="' + coor_y + '" title="' + RoomMap.Langs.coor_y + '" /></div><div><input type="button" class="saveObj but double ' + (editsvg == 0 ? 'but_hidden' : '') + ' show_after_create" value="' + RoomMap.Langs.save + '" /><input type="button" class="createObj but hidden_after_create ' + (editsvg == 1 ? 'but_hidden' : '') + '" value="' + RoomMap.Langs.create + '" /><input type="button" class="createObjVis but hidden_after_create ' + (editsvg == 1 ? 'but_hidden' : '') + '" value="' + RoomMap.Langs.createvis + '" /><input type="button" class="cancelObj but" value="' + RoomMap.Langs.cancel + '" /></div></div></div>').appendTo(RoomMap.$mapBlock).animate({'opacity':1},100);
		RoomMap.editor.propblock = $propBlock;

		if(object != null) $propBlock.data('obj',object);

		//Обработчики на изменение инпутов
		$('.objRadius',$propBlock).keyup(function(){RoomMap.editor.updateAttribute($propBlock.data('obj'), 'r', (isNaN(parseFloat($(this).val())) ? 0 : parseFloat($(this).val()))/RoomMap.scales[RoomMap.scale][0])});
		$('.objCoorX',$propBlock).keyup(function(){RoomMap.editor.updateAttribute($propBlock.data('obj'), 'cx', RoomMap.mapWidth/2 - (RoomMap.position_X - (isNaN(parseFloat($(this).val())) ? 0 : parseFloat($(this).val())))/RoomMap.scales[RoomMap.scale][0])});
		$('.objCoorY',$propBlock).keyup(function(){RoomMap.editor.updateAttribute($propBlock.data('obj'), 'cy', RoomMap.mapHeight/2 + (RoomMap.position_Y - (isNaN(parseFloat($(this).val())) ? 0 : parseFloat($(this).val())))/RoomMap.scales[RoomMap.scale][0])});

		//Изменение значений колесом мыши
		RoomMap.editor.scrollSet($('.objRadius, .objCoorX, .objCoorY',$propBlock));

		//Обработчики на кнопки
		$('.cancelObj',$propBlock).click(RoomMap.editor.ActionCancel);
		$('.saveObj',$propBlock).click(RoomMap.editor.ActionSave);
		$('.createObj, .createObjVis',$propBlock).click(RoomMap.editor.ActionCreate);
		
		//Обработчик сдвига блока
		RoomMap.editor.AddDragEvent($propBlock.find('.dragArea'));
	
	},

	//Создает блок свойств объекта для полигона
	createBlockPropertiesForPoly: function(object){
		var input_points = '';
		//Если объект существует, то заполняем данными
		if(object != null){
			object.setAttributeNS('','class',$(object).attr('class').baseVal + ' new');
			var count_points = $(object).attr('points').numberOfItems;
			for(var i = 1; i <= count_points; i++){
				input_points += '<div class="pairs pair_' + i + '"><input type="text" class="objCoorX inp" value="' + RoomMap.editor.getRealCoordinate('x',$(object).attr('points').getItem([i - 1]).x) + '" title="' + RoomMap.Langs.coor_x + '" /><input type="text" class="objCoorY inp" value="' + RoomMap.editor.getRealCoordinate('y',$(object).attr('points').getItem([i - 1]).y) + '" title="' + RoomMap.Langs.coor_y + '" /> <span class="pointTitle">' + RoomMap.Langs.point + ' ' + i +  '</span> <span class="pointRemove" title="' + RoomMap.Langs.removepoint + '">X</span> <span class="pointAdd" title="' + (count_points == i ? RoomMap.Langs.addpoint : '') + '">' + (count_points == i ? '+' : '') + '</span></div>';
			}
			var editsvg = 1;
		}
		//Иначе создаем пустой
		else{
			var count_points = 3;
			//Создаем инпуты для задания координат точек
			for(var i = 1; i <= count_points; i++){
				input_points += '<div class="pairs pair_' + i + '"><input type="text" class="objCoorX inp" value="0" title="' + RoomMap.Langs.coor_x + '" /><input type="text" class="objCoorY inp" value="0" title="' + RoomMap.Langs.coor_y + '" /> <span class="pointTitle">' + RoomMap.Langs.point + ' ' + i +  '</span> <span class="pointRemove" title="' + RoomMap.Langs.removepoint + '">X</span> <span class="pointAdd" title="' + (count_points == i ? RoomMap.Langs.addpoint : '') + '">' + (count_points == i ? '+' : '') + '</span></div>';
			}
			var editsvg = 0;
		}

		//Создаем блок
		$propBlock = $('<div class="PropertiesForPoly propBlock"><div class="dragArea"></div><div class="propArea"><div class="listPairs">' + input_points + '</div><div><input type="button" class="saveObj but double ' + (editsvg == 0 ? 'but_hidden' : '') + ' show_after_create" value="' + RoomMap.Langs.save + '" /><input type="button" class="createObj but hidden_after_create ' + (editsvg ? 'but_hidden' : '') + '" value="' + RoomMap.Langs.create + '" /><input type="button" class="createObjVis but hidden_after_create ' + (editsvg ? 'but_hidden' : '') + '" value="' + RoomMap.Langs.createvis + '" /><input type="button" class="cancelObj but cancelpoly" value="' + RoomMap.Langs.cancel + '" /></div></div></div>').appendTo(RoomMap.$mapBlock).animate({'opacity':1},100);
		RoomMap.editor.propblock = $propBlock;	

		if(object != null) $propBlock.data('obj',object);	

		//Показываем, можно ли удалять точки
		if(count_points > 3) $propBlock.find('.propArea').addClass('created');

		//Обработчики на изменение инпутов
		$('.objCoorX',$propBlock).keyup(function(){RoomMap.editor.updateAttributePoint($propBlock.data('obj'), $(this).parent().attr('class').match(/pair_([0-9]+)/)[1], 'x', RoomMap.mapWidth/2 - (RoomMap.position_X - (isNaN(parseFloat($(this).val())) ? 0 : parseFloat($(this).val())))/RoomMap.scales[RoomMap.scale][0])});
		$('.objCoorY',$propBlock).keyup(function(){RoomMap.editor.updateAttributePoint($propBlock.data('obj'), $(this).parent().attr('class').match(/pair_([0-9]+)/)[1], 'y', RoomMap.mapHeight/2 + (RoomMap.position_Y - (isNaN(parseFloat($(this).val())) ? 0 : parseFloat($(this).val())))/RoomMap.scales[RoomMap.scale][0])});

		//Изменение значений колесом мыши
		RoomMap.editor.scrollSet($('.objCoorX, .objCoorY',$propBlock));

		//Обработчики на кнопки
		$('.cancelObj',$propBlock).click(RoomMap.editor.ActionCancel);
		$('.saveObj',$propBlock).click(RoomMap.editor.ActionSave);
		$('.createObj, .createObjVis',$propBlock).click(RoomMap.editor.ActionCreate);

		//Вешаем обработчики клика на кнопку добавления и удаления точки
		RoomMap.editor.ActionAddRemove($('.pointAdd',RoomMap.editor.propblock),$('.pointRemove',RoomMap.editor.propblock));

		//Обработчик сдвига блока
		RoomMap.editor.AddDragEvent($propBlock.find('.dragArea'));

		//Обновляем высоту drag блока
		RoomMap.editor.updateHeightDragArea();
	},

	//Создает обработчик сдвига блока свойств
	AddDragEvent: function($dragArea){
		$block = $dragArea.closest('.propBlock');
		$dragArea.bind('mousedown',function(event){
			var offset_x = event.originalEvent.offsetX + RoomMap.$mapBlock.offset().left + 6;
			var offset_y = event.originalEvent.offsetY + RoomMap.$mapBlock.offset().top + 6;
			RoomMap.$mapBlock.bind('mousemove',function(event){
				event.preventDefault();
				if(event.originalEvent.clientX > offset_x && event.originalEvent.clientY > offset_y && event.originalEvent.clientX < RoomMap.mapWidth && event.originalEvent.clientY < RoomMap.mapHeight){
					$block.css('left',event.originalEvent.clientX - offset_x);
					$block.css('top',event.originalEvent.clientY - offset_y);
				}
			});
		});
		$dragArea.bind('mouseup',function(){
			RoomMap.$mapBlock.unbind('mousemove');
		});

	},
	
	//Обработчик нажатия на кнопку "отмена"
	ActionCancel: function(){
		//Закрывает блок с параметрами и перезагружает объекты
		if(typeof RoomMap.editor.propblock != 'undefined' && RoomMap.editor.propblock.length){
			RoomMap.editor.propblock.animate({'opacity':0},200,function(){$(this).remove()});
			//Удаляем новый объект
			if(RoomMap.editor.propblock.data('obj') != null && RoomMap.editor.propblockisthere != 3){
				$(RoomMap.editor.propblock.data('obj')).animate({'opacity':0},200,function(){$(this).remove()});
			}
			//Если отменили редактирование существующего, то перезагружаем все объекты
			else if(RoomMap.editor.propblockisthere == 3){
				$('*',RoomMap.$svg).remove();
				RoomMap.loadSvg();
			}
		}			
		RoomMap.$svg.unbind('.editor');
		RoomMap.editor.propblockisthere = 0;
		RoomMap.editor.dropCurrentEditorTool();
	},

	//Обработчик нажатия на кнопку "сохранить"
	ActionSave: function(){
		//Создаем блок для заполнения
		var $obj = $(RoomMap.editor.propblock.data('obj'));
		RoomMap.editor.createSaveDescriptionBlock($obj);
	},
	
	//Обработчик нажатия на кнопку "создать"
	ActionCreate: function(event){
		var $propBlock = RoomMap.editor.propblock;
		$propBlock.find('.hidden_after_create').hide();
		$propBlock.find('.show_after_create').show();
		//Для окружности
		if(RoomMap.editor.propblockisthere == 1){
			//Визуальное создание
			if($(event.target).hasClass('createObjVis')){
				//Обработка двойного клика по карте
				RoomMap.$svg.one('dblclick.editor',function(){
					var center_x = RoomMap.editor.coor_x;
					var center_y = RoomMap.editor.coor_y;

					$('.objCoorX',$propBlock).val(center_x);
					$('.objCoorY',$propBlock).val(center_y);

					//Создаем окружность в точке двойного клика
					var radius = parseInt(parseFloat($propBlock.find('.objRadius').val())/RoomMap.scales[RoomMap.scale][0]);
					var coor_x = RoomMap.mapWidth/2 - (RoomMap.position_X - RoomMap.editor.coor_x)/RoomMap.scales[RoomMap.scale][0];
					var coor_y = RoomMap.mapHeight/2 + (RoomMap.position_Y - RoomMap.editor.coor_y)/RoomMap.scales[RoomMap.scale][0];
					$propBlock.data('obj',RoomMap.editor.createSvgCircle(coor_x,coor_y,radius));

					//Обработчик движения курсора
					RoomMap.$svg.bind('mousemove.editor',function(){
						new_radius = Math.sqrt(Math.pow((center_x - RoomMap.editor.coor_x),2) + Math.pow((center_y - RoomMap.editor.coor_y),2));
						$('.objRadius',$propBlock).val(new_radius);
						RoomMap.editor.updateAttribute($propBlock.data('obj'), 'r', new_radius/RoomMap.scales[RoomMap.scale][0]);
					}).one('mousedown.editor',function(){
						RoomMap.$svg.unbind('.editor');
					});

				});
			}
			//Создание с помощью задания координат
			else{
				var radius = parseInt(parseFloat($propBlock.find('.objRadius').val())/RoomMap.scales[RoomMap.scale][0]);
				var coor_x = RoomMap.mapWidth/2 - (RoomMap.position_X - parseFloat($propBlock.find('.objCoorX').val()))/RoomMap.scales[RoomMap.scale][0];
				var coor_y = RoomMap.mapHeight/2 + (RoomMap.position_Y - parseFloat($propBlock.find('.objCoorY').val()))/RoomMap.scales[RoomMap.scale][0];
				$propBlock.data('obj',RoomMap.editor.createSvgCircle(coor_x,coor_y,radius));
			}
		}
		//Для полигона
		else if(RoomMap.editor.propblockisthere == 2){
			//Визуальное создание
			if($(event.target).hasClass('createObjVis')){
				//Удаляем все инпуты, оставляем 3
				RoomMap.editor.propblock.find('.pairs').each(function(index,element){
					if(index > 2) RoomMap.editor.removeInputForPoly($(element));
				});
				RoomMap.editor.currentCreatePoint = 0;
				//Обработка двойного клика по карте
				RoomMap.$svg.bind('dblclick.editor',function(){
					//При первом клике создаем объект - полигон
					var click_x = RoomMap.mapWidth/2 - (RoomMap.position_X - RoomMap.editor.coor_x)/RoomMap.scales[RoomMap.scale][0];
					var click_y = RoomMap.mapHeight/2 + (RoomMap.position_Y - RoomMap.editor.coor_y)/RoomMap.scales[RoomMap.scale][0];
					if(RoomMap.editor.currentCreatePoint == 0) {
						$propBlock.data('obj',RoomMap.editor.createSvgPoly(click_x + ',' + click_y));
					}else{
						var $obj = $(RoomMap.editor.propblock.data('obj'));
						//Создаем новую точку и задаем координаты
						$obj.attr('points').appendItem(RoomMap.$svg.get(0).createSVGPoint());
						$obj.attr('points').getItem(RoomMap.editor.currentCreatePoint).x = click_x;
						$obj.attr('points').getItem(RoomMap.editor.currentCreatePoint).y = click_y;
					}
					//Вставляем координаты в инпут
					//Смотрим, есть ли блок с парой инпутов и создаем его если нет
					if(!$propBlock.find('.pair_' + (RoomMap.editor.currentCreatePoint + 1)).length){
						RoomMap.editor.addInputForPoly(RoomMap.editor.coor_x,RoomMap.editor.coor_y);
					}else{
						$propBlock.find('.pair_' + (RoomMap.editor.currentCreatePoint + 1)).find('.objCoorX').val(RoomMap.editor.coor_x);
						$propBlock.find('.pair_' + (RoomMap.editor.currentCreatePoint + 1)).find('.objCoorY').val(RoomMap.editor.coor_y);
					}

					RoomMap.editor.currentCreatePoint++;
				});
			}else{
				//Определяем координаты в пикс.
				var arrayCoors = [];
				$('.pairs',RoomMap.editor.propblock).each(function(index,pair){
					var x = RoomMap.mapWidth/2 - (RoomMap.position_X - parseFloat($('.objCoorX',pair).val()))/RoomMap.scales[RoomMap.scale][0];
					var y = RoomMap.mapHeight/2 + (RoomMap.position_Y - parseFloat($('.objCoorY',pair).val()))/RoomMap.scales[RoomMap.scale][0];
					arrayCoors.push(x + ',' + y);
				});
				$propBlock.data('obj',RoomMap.editor.createSvgPoly(arrayCoors.join(' ')));
			}
		}
	},

	//Создает объект окружность и возвращает ссылку на него
	createSvgCircle: function(x,y,radius){
		var newObject = document.createElementNS('http://www.w3.org/2000/svg',"circle"); 
		newObject.setAttributeNS(null,"class","svgobject svgcircle new");

		newObject.setAttributeNS(null,"cx", x);
		newObject.setAttributeNS(null,"cy", y);
		newObject.setAttributeNS(null,"r", radius);

		newObject.setAttributeNS(null,"fill","black");
		newObject.setAttributeNS(null,"fill-opacity","0.0");

		RoomMap.$svg.get(0).appendChild(newObject);
		
		//Обработчик наведения на объект (показ подсказки - title)
		RoomMap.addTitle($(newObject),RoomMap.Langs.new_object);
		return newObject;
	},

	//Создает объект полигон и возвращает ссылку на него
	createSvgPoly: function(pairs){
		var newObject = document.createElementNS('http://www.w3.org/2000/svg',"polygon"); 
		newObject.setAttributeNS(null,"class","svgobject svgpolygon new");

		newObject.setAttributeNS(null,"points",pairs);

		newObject.setAttributeNS(null,"fill","black");
		newObject.setAttributeNS(null,"fill-opacity","0.0");

		RoomMap.$svg.get(0).appendChild(newObject);
		
		//Обработчик наведения на объект (показ подсказки - title)
		RoomMap.addTitle($(newObject),RoomMap.Langs.new_object);
		return newObject;
	},

	//Обновляет аттрибут объекта при изменении его в блоке
	updateAttribute: function(obj,attr,value){
		if(obj == null) return;
		obj.setAttributeNS(null,attr,value);
	},

	//Обновляет аттрибут points объекта полигон
	updateAttributePoint: function(obj,num,axis,value){
		if(obj == null) return;
		$(obj).attr('points').getItem(num-1)[axis] = value;
	},

	//Изменение значений прокруткой колесика
	scrollSet: function($selection){
		$selection.hover(
			function(event){
				$(this).bind('wheel',function(event){
					event.stopPropagation();
					event.preventDefault();
					if(event.originalEvent.deltaY < 0){
						$(this).val(parseFloat($(this).val()) + RoomMap.scales[RoomMap.scale][0]);
					}else{
						$(this).val(parseFloat($(this).val()) - RoomMap.scales[RoomMap.scale][0]);
					}
					$(this).trigger('keyup');
				});
			},
			function(){
				$(this).unbind('wheel');
			}
		);
	},

	//Вешает обработчик кликов на кнопку добавить/удалить точку
	ActionAddRemove: function($selectAdd,$selectRemove){
		$selectAdd.click(RoomMap.editor.addPoint);
		$selectRemove.click(RoomMap.editor.removePoint);
	},

	//Добавление точки в полигон
	addPoint: function(){
		//Если полигон уже существует, добавляем инпуты и саму точку
		if(RoomMap.editor.propblock.data('obj') != null){
			var $obj = $(RoomMap.editor.propblock.data('obj'));
			//Если идет визуальное создание, увеличиваем счетчик
			RoomMap.editor.currentCreatePoint += 1;
			//Добавляем точку в svg
			$(RoomMap.editor.propblock.data('obj')).attr('points').appendItem(RoomMap.$svg.get(0).createSVGPoint());

			//Корректируем положение точки (с небольшим смещением с вектора {X1:Xn})
			var x = ($obj.attr('points').getItem(0).x + $obj.attr('points').getItem(RoomMap.editor.propblock.find('.pairs').length - 1).x)/2 + 5;
			var y = ($obj.attr('points').getItem(0).y + $obj.attr('points').getItem(RoomMap.editor.propblock.find('.pairs').length - 1).y)/2 + 5;

			$obj.attr('points').getItem(RoomMap.editor.propblock.find('.pairs').length).x = x;
			$obj.attr('points').getItem(RoomMap.editor.propblock.find('.pairs').length).y = y;

			//Добавляем инпут
			RoomMap.editor.addInputForPoly(Math.ceil(RoomMap.mapWidth/2 - x - RoomMap.position_X/RoomMap.scales[RoomMap.scale][0]) * RoomMap.scales[RoomMap.scale][0] * -1,Math.ceil(RoomMap.mapHeight/2 - y + RoomMap.position_Y/RoomMap.scales[RoomMap.scale][0]) * RoomMap.scales[RoomMap.scale][0]);

		}else{
			//Добавляем инпут
			RoomMap.editor.addInputForPoly(0,0);
		}
	},

	//Удаление точки из полигона
	removePoint: function(){
		if(RoomMap.editor.propblock.find('.pairs').length <= 3) return;
		$obj = $(RoomMap.editor.propblock.data('obj'));
		//Если полигон уже существует, удаляем саму точку
		if(RoomMap.editor.propblock.data('obj') != null){
			//Если идет визуальное создание, уменьшаем счетчик
			RoomMap.editor.currentCreatePoint -= 1;
			//Удаляем точку
			var point_remove = $(this).parents('.pairs').attr('class').match(/pair_([0-9]+)/)[1];			
			$obj.get(0).points.removeItem(point_remove-1);
		}
		//Удаляем инпут
		RoomMap.editor.removeInputForPoly($(this).parents('.pairs'));
	},

	//Добавляет инпут для полигона
	addInputForPoly: function(coor_x, coor_y){
		var numPair = RoomMap.editor.propblock.find('.pairs').length + 1;
		if(numPair > 3){
			//Показываем, что можно удалять точки
			RoomMap.editor.propblock.find('.propArea').addClass('created');
		}
		//Удаляем все кнопки для создания точки
		RoomMap.editor.propblock.find('.pointAdd').text('').attr('title','');
		var newInput = '<div class="pairs pair_' + numPair + '"><input type="text" class="objCoorX inp" value="' + coor_x + '" title="' + RoomMap.Langs.coor_x + '" /><input type="text" class="objCoorY inp" value="' + coor_y + '" title="' + RoomMap.Langs.coor_y + '" /> <span class="pointTitle">' + RoomMap.Langs.point + ' ' + numPair +  '</span> <span class="pointRemove" title="' + RoomMap.Langs.removepoint + '">X</span> <span class="pointAdd" title="' + RoomMap.Langs.addpoint + '">' + '+' + '</span></div>';
		//Добавляем новый элемент
		$newPair = $(newInput).appendTo(RoomMap.editor.propblock.find('.listPairs'));
		//Вешаем обработчики
		RoomMap.editor.ActionAddRemove($newPair.find('.pointAdd'),$newPair.find('.pointRemove'));
		RoomMap.editor.scrollSet($newPair.find('.objCoorX, .objCoorY'));

		$newPair.find('.objCoorX').keyup(function(){RoomMap.editor.updateAttributePoint(RoomMap.editor.propblock.data('obj'), $(this).parent().attr('class').match(/pair_([0-9]+)/)[1], 'x', RoomMap.mapWidth/2 - (RoomMap.position_X - (isNaN(parseFloat($(this).val())) ? 0 : parseFloat($(this).val())))/RoomMap.scales[RoomMap.scale][0])});
		$newPair.find('.objCoorY').keyup(function(){RoomMap.editor.updateAttributePoint(RoomMap.editor.propblock.data('obj'), $(this).parent().attr('class').match(/pair_([0-9]+)/)[1], 'y', RoomMap.mapHeight/2 + (RoomMap.position_Y - (isNaN(parseFloat($(this).val())) ? 0 : parseFloat($(this).val())))/RoomMap.scales[RoomMap.scale][0])});
		RoomMap.editor.updateHeightDragArea();
	},
	
	//Удаляет инпут для полигона
	removeInputForPoly: function($pairs_item){
		var $listPairs = $pairs_item.parents('.listPairs');
		//Удаляем инпут
		$pairs_item.remove();
		//Обновляем номера
		var i  = 0;
		$listPairs.find('.pairs').each(function(index,element){
			$(element).attr('class',$(element).attr('class').replace(/pair_[0-9]+/,'pair_' + (index + 1)));
			$(element).find('.pointTitle').text($(element).find('.pointTitle').text().replace(/([0-9]+)/,index + 1));
			i++;
		});
		//Проверяем, достаточно ли точек для активации удаления
		if(i <= 3) RoomMap.editor.propblock.find('.propArea').removeClass('created');
		//Если удалили последний инпут, то выставим новую кнопку для добавления точки
		$listPairs.find('.pairs:last').find('.pointAdd').text('+').attr('title',RoomMap.Langs.addpoint);
		RoomMap.editor.updateHeightDragArea();	
	},

	//Подтягивает drag зону к необходимой высоте
	updateHeightDragArea: function(){
		var $dragarea = RoomMap.editor.propblock.find('.dragArea');
		$dragarea.css('height','0px');
		$dragarea.css('height',$dragarea.parent().height() + 'px');
	},

	//Возвращает реальную координату точки относительно точки начала координат
	getRealCoordinate: function(axis, block_coor){
		if(axis == 'x') return Math.ceil(RoomMap.mapWidth/2 - block_coor - RoomMap.position_X/RoomMap.scales[RoomMap.scale][0]) * RoomMap.scales[RoomMap.scale][0] * -1;
		if(axis == 'y') return Math.ceil(RoomMap.mapHeight/2 - block_coor + RoomMap.position_Y/RoomMap.scales[RoomMap.scale][0]) * RoomMap.scales[RoomMap.scale][0];
		return 0;
	},

	//Выдялет иконку используемого инструмента
	selectCurrentEditorTool: function(){
		var element = '';
		switch(RoomMap.editor.propblockisthere){
			case 1: element = 'createCircle'; break; 
			case 2: element = 'createPolygon'; break;
			case 3: element = 'editObject'; break;
		}
		if(element != '') $('.' + element + '.tool_btn',RoomMap.$EditorTools).addClass('active');
	},

	//Снимает выделение иконки используемого инструмента
	dropCurrentEditorTool: function(){
		$('.tool_btn',RoomMap.$EditorTools).removeClass('active').trigger('mouseout');		
	},

	//Создание блока для заполнения
	createSaveDescriptionBlock: function($obj){
		//Еcли блок не новый, а редактируемый, то загружаем существующую информацию
		if(RoomMap.editor.propblockisthere == 3){
			//Загружает данные
			RoomMap.editor.loadSvgData($obj);
			//Получим title
			var title = '';
			$.each(RoomMap.svg,function(index,object){
				if('svg' + object.id == $obj.attr('id')){
					title = object.title;
				}
			});
		}

		//Формируем строку параметров для хранения в бд
		var params = {};
		var type = '';
		var min_x = 0;
		var min_y = 0;
		var max_x = 0;
		var max_y = 0;
		//Окружности
		if($obj.attr('class').baseVal.indexOf('svgcircle') != -1){
			params['r'] = parseInt(RoomMap.editor.propblock.find('.objRadius').val());
			type = 'circle';
			min_x = parseInt(RoomMap.editor.propblock.find('.objCoorX').val()) - params['r']/2;
			min_y = parseInt(RoomMap.editor.propblock.find('.objCoorY').val()) - params['r']/2;
			max_x = parseInt(RoomMap.editor.propblock.find('.objCoorX').val()) + params['r']/2;
			max_y = parseInt(RoomMap.editor.propblock.find('.objCoorY').val()) + params['r']/2;
		}
		//Полигоны
		else if($obj.attr('class').baseVal.indexOf('svgpolygon') != -1){
			params['points'] = [];
			RoomMap.editor.propblock.find('.pairs').each(function(index,element){
				var x = parseInt($(element).find('.objCoorX').val());
				var y = parseInt($(element).find('.objCoorY').val());
				params['points'].push([x,y]);
				if(!index || x > max_x) max_x = x;
				if(!index || x < min_x) min_x = x;
				if(!index || y > max_y) max_y = y;
				if(!index || y < min_y) min_y = y;
			});
			type = 'polygon';
		}

		var object = JSON.stringify({"type":type,"params":params});
		var coords = JSON.stringify({"min_x":min_x,"min_y":min_y,"max_x":max_x,"max_y":max_y});

		//Создание блока для редактирования
		RoomMap.editor.darkWall = RoomMap.createDarkWall();
		RoomMap.editor.saveBlock = $('<div class="blockSave"><div class="header">' + (RoomMap.editor.propblockisthere == 3 ? RoomMap.Langs.editobject + ' "' + title + '"' : RoomMap.Langs.createobject) + '</div><div class="blocktitle"><input placeholder="' + RoomMap.Langs.svgtitle + '" /></div><div class="blockdescription"><textarea placeholder="' + RoomMap.Langs.svgdescription + '"></textarea></div><div class="blockbuttons"><div class="savebutton">' + RoomMap.Langs.saveobject + '</div><div class="loader"></div></div></div>').appendTo(RoomMap.$mapBlock).animate({'opacity':1},100);
		RoomMap.editor.saveBlock.data('object',object);
		RoomMap.editor.saveBlock.data('coords',coords);
		if(typeof $obj.attr('id') != 'undefined') RoomMap.editor.saveBlock.data('objid',$obj.attr('id').match(/([0-9]+)/)[1]);
		else RoomMap.editor.saveBlock.data('objid','');

		RoomMap.editor.saveBlock.find('.savebutton').click(RoomMap.editor.saveData);
	},

	//Загружает данные о редактируемом объекте
	loadSvgData: function($obj){
		var id = $obj.attr('id').match(/svg([0-9]+)/)[1];
		$.ajax({
			url: RoomMap.ajaxUrl,
			type: 'post',
			data: {
				'data': 'getSvgDataForEdit',
				'id': id,
				'level': RoomMap.level,
				'layer': RoomMap.layer
			},
			dataType: 'json',
			success: function(data){
				RoomMap.editor.saveBlock.find('.blocktitle input').val(data.title);
				RoomMap.editor.saveBlock.find('.blockdescription textarea').val(data.description);
			}
		});
	},

	//Сохранение инофрмации о блоке
	saveData: function(){
		RoomMap.editor.saveBlock.addClass('saving');
		//Отправка данных на сервер
		$.ajax({
			url: RoomMap.ajaxUrl,
			type: 'post',
			data: {
				'data': 'saveData',
				'id_obj': RoomMap.editor.saveBlock.data('objid'),
				'object': RoomMap.editor.saveBlock.data('object'),
				'coords': RoomMap.editor.saveBlock.data('coords'),
				'title': RoomMap.editor.saveBlock.find('.blocktitle input').val(),
				'content': RoomMap.editor.saveBlock.find('.blockdescription textarea').val(),
				'level': RoomMap.level,
				'layer': RoomMap.layer,
				'new': RoomMap.editor.propblockisthere != 3 ? 1 : 0
			},
			success: function(data){

				if(data == '0') return;
				// Скрываем блоки
				RoomMap.editor.propblock.animate({'opacity':0},200,function(){$(this).remove()});
				RoomMap.editor.saveBlock.animate({'opacity':0},200,function(){$(this).remove()});
				RoomMap.editor.darkWall.animate({'opacity':0},200,function(){$(this).remove()});

				// Перезагружаем объекты
				$('*',RoomMap.$svg).remove();
				RoomMap.loadSvg();
				
				RoomMap.$svg.unbind('.editor');
				RoomMap.editor.propblockisthere = 0;
				RoomMap.editor.dropCurrentEditorTool();
			},
			error: function(){
				RoomMap.editor.saveBlock.removeClass('saving');
			}
		});
	}

}