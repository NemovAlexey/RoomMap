RoomMap.editor = {
	currentmode: 'show',	//Текущий режим (show - просмотр, edit - редактирование)
	propblockisthere: 0,	//Вызван ли блок для создания/редактирования объекта
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
		//Создаем блок с параметрами
		RoomMap.editor.createBlockPropertiesForCircle(null);
	},

	//Клик на кнопку создания полигона
	createPolygon: function(){
		if(RoomMap.editor.propblockisthere) return;
		RoomMap.editor.propblockisthere = 2;
		//Создаем блок с параметрами
		RoomMap.editor.createBlockPropertiesForPoly(null);
	},

	//Клик на кнопку редактирования объекта
	editObject: function(){
		if(RoomMap.editor.propblockisthere) return;
		RoomMap.editor.propblockisthere = 3;
		//Клик на существующий объект
		alert('edit');
	},

	//Обновление координат при движении курсора
	updateCoor: function(){
		RoomMap.editor.coor_x = (Math.ceil(RoomMap.mapWidth/2 - event.offsetX - RoomMap.position_X/RoomMap.scales[RoomMap.scale][0]) * RoomMap.scales[RoomMap.scale][0] * -1).toFixed(2);
		RoomMap.editor.coor_y = (Math.ceil(RoomMap.mapHeight/2 - event.offsetY + RoomMap.position_Y/RoomMap.scales[RoomMap.scale][0]) * RoomMap.scales[RoomMap.scale][0]).toFixed(2);
		$('.coor_x',RoomMap.$CoorBlock).text(RoomMap.editor.coor_x);
		$('.coor_y',RoomMap.$CoorBlock).text(RoomMap.editor.coor_y);
	},

	//Создает блок свойств объекта для окружности
	createBlockPropertiesForCircle: function(object){
		//Если объект существует, то заполняем данными
		if(object != null){
			var radius = 0;
			var coor_x = 0;
			var coor_y = 0;
		}
		//Иначе создаем пустой
		else{
			var radius = 0;
			var coor_x = 0;
			var coor_y = 0;
		}

		//Создаем блок
		$propBlock = $('<div class="PropertiesForCircle propBlock"><div class="dragArea"></div><div class="propArea"><div><input type="text" class="objRadius inp"  value="' + radius + '" title="' + RoomMap.Langs.radius + '" /><input type="text" class="objCoorX inp" value="' + coor_x + '" title="' + RoomMap.Langs.coor_x + '" /><input type="text" class="objCoorY inp" value="' + coor_y + '" title="' + RoomMap.Langs.coor_y + '" /></div><div><input type="button" class="saveObj but double but_hidden show_after_create" value="' + RoomMap.Langs.save + '" /><input type="button" class="createObj but hidden_after_create" value="' + RoomMap.Langs.create + '" /><input type="button" class="createObjVis but hidden_after_create" value="' + RoomMap.Langs.createvis + '" /><input type="button" class="cancelObj but" value="' + RoomMap.Langs.cancel + '" /></div></div></div>').appendTo(RoomMap.$mapBlock).animate({'opacity':1},100);
		RoomMap.editor.propblock = $propBlock;

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
		//Если объект существует, то заполняем данными
		if(object != null){

		}
		//Иначе создаем пустой
		else{
			var count_points = 3;

			//Создаем инпуты для задания координат точек
			var input_points = '';
			for(var i = 1; i <= count_points; i++){
				input_points += '<div class="pairs pair_' + i + '"><input type="text" class="objCoorX inp" value="0" title="' + RoomMap.Langs.coor_x + '" /><input type="text" class="objCoorY inp" value="0" title="' + RoomMap.Langs.coor_y + '" /> <span class="pointTitle">' + RoomMap.Langs.point + ' ' + i +  '</span> <span class="pointRemove" title="' + RoomMap.Langs.removepoint + '">X</span> <span class="pointAdd" title="' + (count_points == i ? RoomMap.Langs.addpoint : '') + '">' + (count_points == i ? '+' : '') + '</span></div>';
			}
		}

		//Создаем блок
		$propBlock = $('<div class="PropertiesForPoly propBlock"><div class="dragArea"></div><div class="propArea"><div class="listPairs">' + input_points + '</div><div><input type="button" class="saveObj but double but_hidden show_after_create" value="' + RoomMap.Langs.save + '" /><input type="button" class="createObj but hidden_after_create" value="' + RoomMap.Langs.create + '" /><input type="button" class="createObjVis but hidden_after_create" value="' + RoomMap.Langs.createvis + '" /><input type="button" class="cancelObj but" value="' + RoomMap.Langs.cancel + '" /></div></div></div>').appendTo(RoomMap.$mapBlock).animate({'opacity':1},100);
		RoomMap.editor.propblock = $propBlock;		

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
	},

	//Создает обработчик сдвига блока свойств
	AddDragEvent: function($dragArea){
		$block = $dragArea.closest('.propBlock');
		$dragArea.bind('mousedown',function(){
			var offset_x = event.offsetX + RoomMap.$mapBlock.offset().left + 6;
			var offset_y = event.offsetY + RoomMap.$mapBlock.offset().top + 6;
			RoomMap.$mapBlock.bind('mousemove',function(){
				event.preventDefault();
				if(event.clientX > offset_x && event.clientY > offset_y && event.clientX < RoomMap.mapWidth && event.clientY < RoomMap.mapHeight){
					$block.css('left',event.clientX - offset_x);
					$block.css('top',event.clientY - offset_y);
				}
			});
		});
		$dragArea.bind('mouseup',function(){
			RoomMap.$mapBlock.unbind('mousemove');
		});

	},
	
	//Обработчик нажатия на кнопку "отмена"
	ActionCancel: function(){
		//Отменяет изменения и закрывает блок
		if(typeof RoomMap.editor.propblock != 'undefined' && RoomMap.editor.propblock.length){
			RoomMap.editor.propblock.animate({'opacity':0},200,function(){$(this).remove()});
			if(RoomMap.editor.propblock.data('obj') != null){
				$(RoomMap.editor.propblock.data('obj')).animate({'opacity':0},200,function(){$(this).remove()});
			}
			RoomMap.$svg.unbind('.editor');
			RoomMap.editor.propblockisthere = 0;
		}
	},

	//Обработчик нажатия на кнопку "сохранить"
	ActionSave: function(){
		alert('s');
	},
	
	//Обработчик нажатия на кнопку "создать"
	ActionCreate: function(){
		var $propBlock = $(event.target).closest('.propBlock');
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
		else{
			//Визуальное создание
			if($(event.target).hasClass('createObjVis')){

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
		$(obj).attr('points')[num-1][axis] = value;
	},

	//Изменение значений прокруткой колесика
	scrollSet: function($selection){
		$selection.hover(
			function(){
				$(this).bind('wheel',function(){
					event.stopPropagation();
					event.preventDefault();
					if(event.deltaY < 0){
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
			//Добавляем точку в svg
			$(RoomMap.editor.propblock.data('obj')).attr('points').appendItem(RoomMap.$svg.get(0).createSVGPoint());

			//Корректируем положение точки (с небольшим смещением с вектора {X1:Xn})
			$obj = $(RoomMap.editor.propblock.data('obj'));
			var x = ($obj.attr('points')[0].x + $obj.attr('points')[RoomMap.editor.propblock.find('.pairs').length - 1].x + 2)/2;
			var y = ($obj.attr('points')[0].y + $obj.attr('points')[RoomMap.editor.propblock.find('.pairs').length - 1].y + 2)/2;

			$obj.attr('points')[RoomMap.editor.propblock.find('.pairs').length].x = x;
			$obj.attr('points')[RoomMap.editor.propblock.find('.pairs').length].y = y;

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
		//Если полигон уже существует, удаляем инпуты и саму точку
		if(RoomMap.editor.propblock.data('obj') != null){

		}else{

		}
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
	}

}