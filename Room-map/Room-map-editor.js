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
		alert('poly');
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
		if(RoomMap.editor.propblock.length){
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
					var newObject = document.createElementNS('http://www.w3.org/2000/svg',"circle"); 
					newObject.setAttributeNS(null,"class","svgobject svgcircle new");

					newObject.setAttributeNS(null,"cx", RoomMap.mapWidth/2 - (RoomMap.position_X - RoomMap.editor.coor_x)/RoomMap.scales[RoomMap.scale][0]);
					newObject.setAttributeNS(null,"cy", RoomMap.mapHeight/2 + (RoomMap.position_Y - RoomMap.editor.coor_y)/RoomMap.scales[RoomMap.scale][0]);
					newObject.setAttributeNS(null,"r", 1);

					newObject.setAttributeNS(null,"fill","black");
					newObject.setAttributeNS(null,"fill-opacity","0.0");

					RoomMap.$svg.get(0).appendChild(newObject);
					$propBlock.data('obj',newObject);

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

				var radius = parseFloat($propBlock.find('.objRadius').val());
				var coor_x = parseFloat($propBlock.find('.objCoorX').val());
				var coor_y = parseFloat($propBlock.find('.objCoorY').val());
				
				var newObject = document.createElementNS('http://www.w3.org/2000/svg',"circle"); 
				newObject.setAttributeNS(null,"class","svgobject svgcircle new");

				newObject.setAttributeNS(null,"cx", RoomMap.mapWidth/2 - (RoomMap.position_X - coor_x)/RoomMap.scales[RoomMap.scale][0]);
				newObject.setAttributeNS(null,"cy", RoomMap.mapHeight/2 + (RoomMap.position_Y - coor_y)/RoomMap.scales[RoomMap.scale][0]);
				newObject.setAttributeNS(null,"r", parseInt(radius/RoomMap.scales[RoomMap.scale][0]));

				newObject.setAttributeNS(null,"fill","black");
				newObject.setAttributeNS(null,"fill-opacity","0.0");

				RoomMap.$svg.get(0).appendChild(newObject);
				$propBlock.data('obj',newObject);
			}
		}
		//Для полигона
		else{

		}
	},

	//Обновляет аттрибут объекта при изменении его в блоке
	updateAttribute: function(obj,attr,value){
		if(obj == null) return;
		obj.setAttributeNS(null,attr,value);
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
	}


}