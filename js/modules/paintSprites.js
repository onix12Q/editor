
///модуль только для рисования кистью, спрайтами можно рисовать без подключения модуля
(function(){

  if(onloadModules.paintSprites  != undefined)return;
	
  var html = `
  								 <div data-paint_sprites_panel="container"  class="form-group" name="paint_sprites_panel">

									<label for="exampleFormControlInput1" style="font-size: 15px; color: red; font-weight: bold;">Рисовать</label>
									<div class="form-row">
									     <div class="form-group col-md-4">								
											<button type="button"  style="" name="paint_btn" class="btn btn-danger btn-sm" title="Кликнуть для начала рисования">paint</button>
										</div>									
									    <div class="form-group col-md-4">
										
										    <input name="draw_sircle_radius" type="text" class="form-control form-control-sm"  placeholder="радиус" title="" value="5">
										</div>
										<div class="form-group col-md-4">										
											<input name="draw_sircle_color" type="text" class="form-control form-control-sm"  placeholder="цвет" title="" value="red">
										</div>										
                                    </div>																		
								 </div>
  `;
  
  
  var div = document.createElement("div");
  div.innerHTML = html;
  div = div.querySelector("div");
  var parent = document.querySelector("[data-main_form]");
  var insert_before = document.querySelector("[name='common_btns_class']")
  var insertedElement = parent.insertBefore(div, insert_before); 
  var paint_sprites_panel = {	  
	  container: "paint_sprites_panel",
	  props: [       
		["paint_btn", "click", "[name='paint_btn']"], 		
		["canvas_click", "emiter-mousedown-canvas", ""],
        ["canvas_move", "emiter-mousemove-canvas", ""],
        ["mouse_up", "emiter-mouseup-canvas", ""], 		
		["operation_with", "emiter-operation-with", ""],
		["draw_sircle_radius", "inputvalue", "[name='draw_sircle_radius']"],
		["draw_sircle_color", "inputvalue", "[name='draw_sircle_color']"], 
		["scroll", "emiter-mousewheel", ""], //изменение диаметра инструмента рисования скролом мыши
	  ],
	  methods: {
		  operation_with: function(){ //отключает слушателей canvas событий ( mousedown) если модуль находится в пассивном состоянии	  
			  if(this.emiter.prop != "paint-sprites" ){			  			 
				  this.parent.props.canvas_click.disableEvent();
				  this.parent.props.canvas_move.disableEvent();
				  this.parent.props.mouse_up.disableEvent();
				  this.parent.props.scroll.disableEvent();
			  }else if(this.emiter.prop == "paint-sprites"){	
				  this.parent.props.canvas_click.enableEvent();
				  this.parent.props.canvas_move.enableEvent();	
				  this.parent.props.mouse_up.enableEvent();	
				  this.parent.props.scroll.enableEvent();	
			  }	           		  
		  },
		  scroll: function(){             		  
				var delta  = parseInt(this.emiter.prop.wheelDelta);	
				var old_radius = parseFloat(this.parent.props.draw_sircle_radius.getProp());
				if(delta > 0){                     						
					old_radius += 0.5;
				}else if(delta < 0){				    
					old_radius -= 0.5;
					if(old_radius <= 0)old_radius = 0.5;
				}
                this.parent.props.draw_sircle_radius.setProp(old_radius);				
		  },
		  paint_btn: function(){			  
				  this.$$("emiter-operation-with").set("paint-sprites");		 		  		  
		  }	,
		  mouse_up: function(){	//console.log(this.parent.props.canvas_move.prop);	                   
								this.parent.props.canvas_move.prop = null;								
								saveImg = ctx.getImageData(0,0, srcWidth, srcHeight);
								ctx.restore();	
		  },
		 canvas_click: function(){		 			  			   
			    saveStep(saveImg, this.$props().commonProps.area_1);
				ctx.save();
	            ctx.putImageData(saveImg, 0, 0);
				var radius = this.parent.props.draw_sircle_radius.getProp();
				var color = this.parent.props.draw_sircle_color.getProp();
				ctx.fillStyle =  color;
				////////////////////////
					this.parent.props.canvas_move.prop  =  {
						color:  color,
						radius: radius ,
                        spray: null						
					};					
					ctx.beginPath();
					ctx.arc(this.emiter.prop[0], this.emiter.prop[1], radius, 0, 2*Math.PI, false);
					//ctx.fillStyle =  color;
					ctx.fill();
					ctx.lineWidth = 0.1;
					ctx.strokeStyle =  color;
					ctx.stroke();
									
		
		},
        canvas_move: function(){
            			
			if(this.prop != null){
				ctx.beginPath();
				ctx.arc(this.emiter.prop[0], this.emiter.prop[1], this.prop.radius, 0, 2*Math.PI, false);
				ctx.fillStyle =  this.prop.color;
				ctx.fill();
				ctx.lineWidth = 0.1;
				ctx.strokeStyle =  this.prop.color;
				ctx.stroke();			
			}			
		}	
	  }	  
  }

  HM.description.paint_sprites_panel  = paint_sprites_panel;
  HM.containerInit(div , HM.description, "paint_sprites_panel");
  HM.eventProps["emiter-operation-with"].emit(); //вызываем пустым (без параметра) чтобы отключить слушателей canvas событий при старте модуля другими модулями
  onloadModules.paintSprites  = true;

})()
