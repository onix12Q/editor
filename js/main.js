	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext('2d');
	var srcWidth, srcHeight; //высота и ширина области рисования
	
	var imgSrc = "./img/dolphin.jpg"; //картинка при загрузке
	var colorSpriteArea = "#0fec42"; //цвет обводки контура спрайтов
	var colorCommonArea = "red"; //цвет области выделения фоновой картинки
	var colorAdditionalArea = "violet"; //..фоновой картинки
	 var img = new Image();
	 img.src = imgSrc;
	 var saveImg = false; //предыдущее преобразование картинки фона
	 var restoreImg = false; //сохраненная картинка
	 var stepBack = []; //шаг назад для приобразований фоновой картинки
	 var backStepCounts = 5; //максимальное количество шагов
	 var halfPointSize = 5; //размер половины квадрата точки на площади выделения
	 var lineColor = colorCommonArea; //цвет линии выделения
	 var lineWidth = 3; //толщина линии выделения
	 var mainImgScale_x = 1.0; //множитель размера картинки(масштаб)
     var mainImgScale_y = 1.0; //множитель размера картинки(масштаб)
	 var mirror_x = 1; //отражение фона
	 var mirror_y = 1;
	 var littleCanvas = false; //true - если холст больше размера картинки уменьшает размер холста, false - рисует картинку в левом верхнем углу
	 var showLogs = true;
	 var modules = {}; //подключаемые cdn функции
	 var onloadModules = {}; ///список загруженых модулей и скриптов
	 var HM; //htmlix state

window.onload = function(){ 
	
	HM = new HTMLixState(StateMap);	 
	console.log(HM);  
	//загрузка настроек модулей и стилей
	var collagenSettings = get_from_storage("collagenSettings");
	var collagenSettings_ ;
	
	if(collagenSettings == null || collagenSettings.common == undefined && collagenSettings.modules == undefined && collagenSettings.styles == undefined){
		
		collagenSettings_ = {
		  common: {	
			backStepCounts: backStepCounts,
			halfPointSize: halfPointSize,
			colorCommonArea: colorCommonArea,
			colorSpriteArea: colorSpriteArea,
			colorAdditionalArea: colorAdditionalArea,
			lineWidth: lineWidth,
		    mainImgScale_x: mainImgScale_x,
            mainImgScale_y: mainImgScale_y,
			littleCanvas: littleCanvas,
			showLogs: showLogs,
			imgSrc: imgSrc,
		  },			
		  modules: {
			    "paintSprites": "#./js/modules/paintSprites.js",
			    "spriteMatrix": "#./js/modules/spriteMatrix.js",
				"addGradient": "#./js/modules/addGradient.js",
				"perspectiveTransform": "#./js/modules/perspectiveTransform.js",
				"drawStarContur": "#./js/modules/drawStar.js"			
		  },
		  styles: {}						
		}
	    if(collagenSettings != null){					
			for(var key in collagenSettings){
				collagenSettings_.modules[key] = collagenSettings[key];
				loadModul(collagenSettings[key], key);
			}
		}
        save_in_storage(collagenSettings_, "collagenSettings");		
		collagenSettings = collagenSettings_;
	}else{  
	        if(!collagenSettings.common)collagenSettings.common = {};
			if(!collagenSettings.modules)collagenSettings.modules = {};
			if(!collagenSettings.styles)collagenSettings.styles = {};
	        if(collagenSettings.common.imgSrc)img.src = collagenSettings.common.imgSrc;
			if(collagenSettings.common.showLogs != undefined)showLogs = collagenSettings.common.showLogs;
			for(var key in collagenSettings.modules){				
				loadModul(collagenSettings.modules[key], key, showLogs);
			}
			for(var key in collagenSettings.styles){				
				loadStyles(collagenSettings.styles[key]);
				preloadFonts(collagenSettings.styles[key]);
			}			
            if(collagenSettings.common.backStepCounts)backStepCounts = collagenSettings.common.backStepCounts;
			if(collagenSettings.common.halfPointSize)halfPointSize = collagenSettings.common.halfPointSize;
            if(collagenSettings.common.colorCommonArea)lineColor = colorCommonArea = collagenSettings.common.colorCommonArea;
			if(collagenSettings.common.colorAdditionalArea)colorAdditionalArea = collagenSettings.common.colorAdditionalArea;
			if(collagenSettings.common.colorSpriteArea)colorSpriteArea = collagenSettings.common.colorSpriteArea;
			if(collagenSettings.common.lineWidth)lineWidth = collagenSettings.common.lineWidth;
            if(collagenSettings.common.mainImgScale_x) mainImgScale_x = collagenSettings.common.mainImgScale_x;
			if(collagenSettings.common.mainImgScale_y)mainImgScale_y = collagenSettings.common.mainImgScale_y;
			if(collagenSettings.common.littleCanvas != undefined)littleCanvas = collagenSettings.common.littleCanvas;						
	}
	   img.onload = function(){ 
		  startImg();			
	   }
	    startImg();		
	HM.state.form_load_module.props.colagen_settings.setProp( JSON.stringify(collagenSettings, null, ' ') );			
}








