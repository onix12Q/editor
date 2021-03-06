//объект спрайт общего назначения (не интерфейс) 
//связь с разметкой через номер id
function CollageSprite(img, area, id, rotate){
	var imgBox = getBox(area);	
	
	this.id = id;
	this.frame = img;
	this.point = imgBox[0]; //верхяя левая точка спрайта на канвас
	this.point2 = imgBox[1];
	this.controlPoint = false; //контрольная точка размещения центра спрайта на канвас
	this.controlSpritePoint = false; //контрольная точка в спрайт листе
	this.area_1 = area;
	this.area_2 = area.slice(0);
	this.cursorOver = false; //курсор мыши над спрайтом
	this.currentOperation = false;  //"move" - движение всего спрайта 	
	//this.isMove = false; //движение всего спрайта
	this.moveStart = false; //начало движения "move" координаты
	this.moveCount = 0;
	//this.isMovePoint = false; //движение одной точки - ее индекс i	
	this.rotate = 0; //вращение относительно начального при создании спрайта
	if(rotate != undefined)this.rotate = rotate;
	this.show = true;
	this.stamp_cursor = false;//рисование спрайтом
	this.is_mousedown = false; //флаг нажатия кнопки мыши над спрайтом
	this.scale_x = 1; //масштаб относительно изначального при создании спрайта
	this.scale_y = 1;
	this.border = false;/* {
		size: 20,
		color: "red"		
	},*/
	this.textParam = false; /* {
		text: "", 
		lineHeight: 30, высота строки
		font: "30px Balsamiq Sans",
		fillStyle: "red",
		padding_x_l: 0, отступ слева
		padding_x_r: 0,	отступ справа	
		padding_x: false, 
	    padding_y: 0, отступ с верху
        max_width: false, максимальная ширина: ширина спрайта - отступы
        textArr: false,		
	}*/	
}

//при масштабировании и вращении спрайта, сначала считается масштабирование относительно начального размера,
// затем поворот относительно центра уже отмасштабированого спрайта
//поворот также считается относительно начального, при создании спрайта
//масштабирование идет от центра в обоих направлениях
//при отражении спрайта убирается вращение затем производится отражение, затем вращается сново уже отраженным 
CollageSprite.prototype.render = function(sprite_id , operationName, option){
	if(option == undefined)option = {};
	if(!this.show || this.id == sprite_id  &&   option.not_render == true)return;
	
    var area = this.area_1;
		if(operationName == "move" && this.id == sprite_id ){
		area = this.area_2;
	}	
	var point = this.point;
	var width = this.point2[0] - this.point[0];
	var height = this.point2[1] - this.point[1];

	if(this.stamp_cursor == true && this.stamp_cursor_point){	//штам курсор - координаты мыши
		point = this.stamp_cursor_point ;
	}		
	if(this.rotate !== 0){ //вращение спрайта
		var halfW = width/2;
		var halfH = height/2;
	    area = rotationArea(this.area_1, this.rotate);	
		
		if(operationName == "move" && this.id == sprite_id ){	//перемещение при вращении							
			area = rotationArea(this.area_2, this.rotate);									
		}	
			var move = [this.point[0]+  halfW, this.point[1] + halfH]; //translate в точку move для вращения canvas
			
            if(this.stamp_cursor == true){			
				move = [point[0]+  halfW , point[1] + halfH ]; //translate в точку move для вращения canvas при операции штам курсор
			}
			ctx.save();
			ctx.translate(move[0],   move[1]);				
			ctx.rotate(this.rotate); 		
			ctx.drawImage(this.frame, -halfW, -halfH, width, height);
						
			if(this.border && this.border.size > 0){ //рисование границы спрайта при ее наличии
				ctx.restore();
				if(this.stamp_cursor == true){ //рисование граници при операции штам курсор
					var move = [point[0]+  halfW , point[1] + halfH ];
					var imgBox = getBox(this.area_1);						
					var area = getCutSize(this.area_1, imgBox[0][0]-move[0]+(imgBox[1][0]-imgBox[0][0])/2, imgBox[0][1]-move[1]+(imgBox[1][1]-imgBox[0][1])/2 );
                    area = rotationArea(area, this.rotate);						
				}
				drawArea(area, true, this.border.size, this.border.color);
				ctx.save();
				ctx.translate(move[0],   move[1]);				
				ctx.rotate(this.rotate); 
			}			
			if(this.textParam && this.textParam.text != "")this.fillText(-halfW, -halfH); //добавление текста 			
			ctx.restore();
			
	}else{//без вращения
		
		ctx.drawImage(this.frame, point[0], point[1], width, height);
		if(this.border){
			if(this.stamp_cursor == true){
					var imgBox = getBox(area);						
					area = getCutSize(area, imgBox[0][0]-point[0]- width/2+(imgBox[1][0]-imgBox[0][0])/2, imgBox[0][1]-point[1]- height/2+(imgBox[1][1]-imgBox[0][1])/2 );				
			}
			drawArea(area, true, this.border.size, this.border.color);
		}
		if(this.textParam)this.fillText(point[0], point[1]);
	}
	if(this.id == sprite_id && this.stamp_cursor == false){
		
		if(option.showPoints == true){
			drawAreaPoints(area);
		}else{
			drawArea(area, true);
		}		
		if( option.showBox == true){
			drawBox(this.point, this.point2, "yellow", 1);
		}	
	}
}
//обновляет точки контура и крайние точки изображения
CollageSprite.prototype.setAreas = function(area){
	this.area_1 = area.slice(0);
	this.area_2 = area.slice(0);
	var imgBox = getBox(area);	
	this.point = imgBox[0];
	this.point2 = imgBox[1];	
}
//добавление текста при рендере спрайта
CollageSprite.prototype.fillText = function(x, y){
	
	        if(!this.textParam.max_width){
				this.textParam.max_width = this.point2[0] - this.point[0];
				if(this.textParam.padding_x_l)this.textParam.max_width -= this.textParam.padding_x_l;
				if(this.textParam.padding_x_r != undefined){
					this.textParam.max_width -= this.textParam.padding_x_r;
					this.textParam.padding_x = this.textParam.padding_x_r;
				}
				if(!this.textParam.padding_x_r && !this.textParam.padding_x_l && this.textParam.padding_x)this.textParam.max_width -= this.textParam.padding_x*2;				
			}	
		    ctx.fillStyle = this.textParam.fillStyle;
			ctx.font = this.textParam.font;
			if(!this.textParam.textArr)this.textParam.textArr = getLines(ctx, this.textParam.text, this.textParam.max_width);
			for(var i=0; i<this.textParam.textArr.length; i++){			
				ctx.fillText(this.textParam.textArr[i], x+this.textParam.padding_x, y+this.textParam.padding_y+(this.textParam.lineHeight*(i+1)));				
			}	
}

CollageSprite.prototype.rotateArea = function(){
	
	var area = rotationArea(this.area_1, this.rotate);
	this.area_1 = area.slice(0);
	this.area_2 = area.slice(0);
}
//масштабирование спрайта
CollageSprite.prototype.scale = function(coeff_x, coeff_y){
	if(coeff_x == this.scale_x && coeff_y == this.scale_y)return;
	
	var current_scale_x = coeff_x/this.scale_x; var current_scale_y = coeff_y/this.scale_y;
	var area = scaleArea(this.area_1, current_scale_x, current_scale_y, false);
	this.area_1 = area.slice(0);
	this.area_2 = area.slice(0);

	var imgBox = getBox(area);
	this.point = imgBox[0];
	this.point2 = imgBox[1];
	this.scale_x = coeff_x;
	this.scale_y = coeff_y;
	if(this.textParam != false){
		this.textParam.max_width = false;
		this.textParam.textArr = false;
	}	
	if(coeff_x == coeff_y && this.scale_x !==1 && this.scale_y !==1 ||  coeff_x == coeff_y & this.round_scale == undefined){
        var sc = current_scale_x;
        if(this.round_scale == undefined)sc = coeff_x;		
		for(var i=0; i< this.area_1.length; i++){		
			if(this.area_1[i][2]){
                this.round_scale = true;				
				this.area_1[i][2] = this.area_1[i][2]*sc;
			}		
		}
	}	
}
//отражает спрайт 
CollageSprite.prototype.flip = function(x, y, context){
	ctx.clearRect(0, 0, srcWidth , srcHeight);

			var width = this.point2[0] - this.point[0];
			var height = this.point2[1] - this.point[1];
			var halfW = width/2;
			var halfH = height/2;	
			var move = [this.point[0]+  halfW, this.point[1] + halfH];
			ctx.save();
			ctx.translate(move[0],   move[1]);
       			
				if(x)ctx.scale( -1, 1);
				if(y)ctx.scale( 1, -1);
            			           				
			ctx.drawImage(this.frame, -halfW, -halfH, width, height);
			ctx.restore();
	
	var area = flipArea(this.area_1, x, y);
	this.area_1 = area.slice(0);
	this.area_2 = area.slice(0);

	var imgMapArr = getCutImg(ctx, area, false);
	context.$methods().renderAll(false, {not_render: true});
	getImgToSprite(imgMapArr, this);

}
CollageSprite.prototype.getHalfW = function(){
	return 	(this.point2[0]-this.point[0])/2;
}
CollageSprite.prototype.getHalfH = function(){
	return 	(this.point2[1]-this.point[1])/2;
}

//перемещает центр спрайта в указанную точку
CollageSprite.prototype.moveCenterTo  = function(point){
	    var h_w = this.getHalfW();
		var h_h = this.getHalfH();
			
		this.area_1 = getCutSize(this.area_1, this.point[0], this.point[1]);
		this.area_1 = getCutSize(this.area_1, -point[0]+h_w, -point[1]+h_h);
		this.area_2 = this.area_1.slice(0);
		var imgBox = getBox(this.area_1);
		
		this.point = imgBox[0];
		this.point2 = imgBox[1];

       // console.log(this.point);		
}
//событие canvas mousedown
CollageSprite.prototype.mousedown = function(point, e, context){
    this.is_mousedown = true;
    this.moveCount = 0;	
	if(this.cursorOver){     //move движение всего спрайта							
		if(this.moveStart === false /*&& this.isMovePoint === false*/&& this.currentOperation === false){
			this.moveStart = point;
			this.currentOperation = "move";
			this.savePoints = {point: this.point.slice(0), point2: this.point2.slice(0),}
            return ;								
		}	
	}//сохранение фона для операции с клавишей q
	  

    if(this.stamp_cursor === true){ //рисование спрайтом
		var point = getCanvasPoint(e, canvas, context);
		this.stamp_cursor_point = [ point[0] - this.getHalfW(),   point[1] - this.getHalfH(),];
		ctx.putImageData(saveImg, 0, 0);
		saveStep(saveImg, context.$props().commonProps.area_1);
		this.render();
		saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
		context.$methods().renderAll();		
	}
}

//событие canvas mousemove 
CollageSprite.prototype.mousemove  = function(point, context, e){
	//console.log(this.stamp_cursor);
	if(this.currentOperation === "move"){					      //move движение всего спрайта					
		var distance = [this.moveStart[0] - point[0], this.moveStart[1] -  point[1] ];		
		this.area_2 = getCutSize(this.area_1, distance[0], distance[1]);
		this.point = [this.savePoints.point[0] -distance[0],  this.savePoints.point[1] -distance[1]];
		this.point2 = [this.savePoints.point2[0] -distance[0], this.savePoints.point2[1] -distance[1]];
		context.$methods().renderAll("move");
	}
	//добавить эффет при нажатии клавиши q
	if(this.is_mousedown == true &&  this.stamp_cursor === false && context.rootLink.eventProps["emiter-keypress"].prop != null  && context.rootLink.eventProps["emiter-keypress"].prop.code == "KeyQ" ){								
				if(this.moveCount == 0){
					saveStep(saveImg, context.$props().commonProps.area_1);					
				}
				this.moveCount +=1;
				ctx.putImageData(saveImg, 0, 0);
				addEffect(ctx, this.area_2, context.rootLink.eventProps["emiter-keypress"].prop.rgbaArr);
			    saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
			    //ctx.putImageData(saveImg, 0, 0);			
				context.$props().sprites[context.$props("operationWith")].render();
				return;
	}
	if(this.stamp_cursor === true){ //премещение спрайта курсором при рисовании
		var point = getCanvasPoint(e, canvas, context);
		this.stamp_cursor_point = [ point[0] - this.getHalfW(),   point[1] - this.getHalfH(),];
		if(this.is_mousedown){ //рисование спрайтом
			ctx.putImageData(saveImg, 0, 0);
			context.$props().sprites[context.$props("operationWith")].render();
			saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
			//ctx.putImageData(saveImg, 0, 0);
			return;
		}
		context.$methods().renderAll();		
	}	
}
//событие canvas mouseup
CollageSprite.prototype.mouseup  = function(context, event){ 
    this.is_mousedown = false;
	if(this.currentOperation == "move"){
        //console.log(event);		
		var movePointEnd = getCanvasPoint(event, canvas);
		this.currentOperation = false;
		var distance = [this.moveStart[0] - movePointEnd[0], this.moveStart[1] -  movePointEnd[1] ];
		this.area_2 = getCutSize(this.area_1, distance[0], distance[1]);
		this.area_1 = this.area_2.slice(0);
		this.point = [this.savePoints.point[0] -distance[0],  this.savePoints.point[1] -distance[1]];
		this.point2 = [this.savePoints.point2[0] -distance[0], this.savePoints.point2[1] -distance[1],  ];
		context.$methods().renderAll();
		this.moveStart =false;
	}
}
//проверяет попадаеют ли координаты точки в контур спрайта, учитывает поворот и масштаб спрайта
CollageSprite.prototype.cursorOver_ = function(point){
	var area = this.area_1;
	if(this.rotate !== 0){
		area = rotationArea(this.area_1, this.rotate);
	}	
	var pathArea = getPathArea(area);						 
	var isOver = ctx.isPointInPath(pathArea, point[0], point[1]);	
	if(isOver){							
		document.body.style.cursor = "pointer";
		this.cursorOver = true;
	}else{
		document.body.style.cursor = "auto";
		this.cursorOver = false;
	}	
}
//сохраняет спрайт в локальном хранилище
CollageSprite.prototype.saveOnPC = function(){ 


				var name = this.id;

                var state = get_from_storage("spritesState");				
				if(state == null)state = {};			
				state[name] = this.getToSave();
                try{				
					save_in_storage(state, "spritesState");
                }catch(e){
					alert(e);
					return;
				}
				console.log("спрайт "+name+" сохранен");
}
//возвращает объект с данными для сохранения спрайта
CollageSprite.prototype.getToSave = function(){ 
				
				var img = this.frame;				
				var imgAsURL = getBase64Image(img);              
				var area = this.area_1.slice(0);            
				var sprite = {
					area: area,
					imgAsURL: imgAsURL,
                    rotate: this.rotate,
					scale_x: this.scale_x,
					scale_y: this.scale_y,
                    controlSpritePoint: this.controlSpritePoint,
                    controlPoint: this.controlPoint,
                    textParam: this.textParam,	
                    border: this.border,						
				}				
				return sprite;
}

//восстановить спрайт из локального хранилища
function createFromPC(spr_id, context, to_beginning, fromProject){ 
	var sprite_;
	if(fromProject == undefined){
		sprite_ = get_from_storage ("spritesState", spr_id);
	}else{
		sprite_ = fromProject;
	}
	
	var area = sprite_.area;
	if(!area)area = sprite_.cut_area;
	if(to_beginning === true){
		var imgBox_ = getBox(area);				
	    area = getCutSize(area, imgBox_[0][0], imgBox_[0][1]);
	}	
	var imgBox = getBox(area);
    var img = new Image();
	var sprite = new CollageSprite( img, area, spr_id, sprite_.rotate);
	if(sprite_.scale_x == undefined){sprite.scale_x = 1;}else{sprite.scale_x = sprite_.scale_x;}
	if(sprite_.scale_y == undefined){sprite.scale_y = 1;}else{sprite.scale_y = sprite_.scale_y;}	
	if(sprite_.controlSpritePoint != undefined)sprite.controlSpritePoint = sprite_.controlSpritePoint;
	if(sprite_.controlPoint != undefined)sprite.controlPoint = sprite_.controlPoint;
	if(sprite_.textParam != undefined)sprite.textParam = sprite_.textParam;
	if(sprite_.border != undefined)sprite.border = sprite_.border;
	
	context.$props("sprites")[spr_id] = sprite;
	var dataURL = 'data:image/png;base64,' + sprite_.imgAsURL;
	img.src=dataURL;
	img.onload = function(){ 		
		context.$methods().renderAll();		
	}	
	return sprite;	
}
 //удалить спрайт из локального хранилища
function removeFromPC(spr_id){
	var sprites = get_from_storage ("spritesState");
	delete sprites [spr_id];	
	save_in_storage (sprites, "spritesState");
}


















