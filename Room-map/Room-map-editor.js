RoomMap.editor = {
	currentmode: 'show',
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
		//Создаем блок с параметрами
		RoomMap.editor.createBlockPropertiesForCircle(null);
	},

	//Клик на кнопку создания полигона
	createPolygon: function(){
		alert('poly');
	},

	//Клик на кнопку редактирования объекта
	editObject: function(){
		alert('edit');
	},

	//Обновление координат при движении курсора
	updateCoor: function(){
		$('.coor_x',RoomMap.$CoorBlock).text((Math.ceil(RoomMap.mapWidth/2 - event.offsetX - RoomMap.position_X/RoomMap.scales[RoomMap.scale][0]) * RoomMap.scales[RoomMap.scale][0] * -1).toFixed(2));
		$('.coor_y',RoomMap.$CoorBlock).text((Math.ceil(RoomMap.mapHeight/2 - event.offsetY + RoomMap.position_Y/RoomMap.scales[RoomMap.scale][0]) * RoomMap.scales[RoomMap.scale][0]).toFixed(2));;
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
		$propBlock = $('<div class="PropertiesForCircle propBlock"><div class="dragArea"></div><div class="propArea"><div><input type="text" class="objRadius inp"  value="' + radius + '" title="' + RoomMap.Langs.radius + '" /><input type="text" class="objCoorX inp" value="' + coor_x + '" title="' + RoomMap.Langs.coor_x + '" /><input type="text" class="objCoorY inp" value="' + coor_y + '" title="' + RoomMap.Langs.coor_y + '" /></div><div><input type="button" class="createObj but" value="' + RoomMap.Langs.create + '" /><input type="button" class="saveObj but" value="' + RoomMap.Langs.save + '" /><input type="button" class="cancelObj but" value="' + RoomMap.Langs.cancel + '" /></div></div></div>').appendTo(RoomMap.$mapBlock).animate({'opacity':1},100);

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

	}


}