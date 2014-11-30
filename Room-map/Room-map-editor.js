RoomMap.editor = {
	currentmode: 'show',
	//Создает меню для редактирования карты
	createEditorMenu: function(){
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
	},

	//Включает режим редактирования
	modeEdit: function(){
		if(RoomMap.editor.currentmode == 'edit'){
			return;
		}
		
		RoomMap.editor.currentmode = 'edit';
	}
}