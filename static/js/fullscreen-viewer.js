(function(window,document){'use strict';function toElement(target){if(!target){return null;}
if(typeof target==='string'){return document.querySelector(target);}
return target;}
class FullscreenImageViewer{constructor(options={}){this.overlay=toElement(options.overlay);if(!this.overlay){return;}
this.options=Object.assign({zoomSteps:3,wheelStep:null,baseZoomIncrement:0.35,wheelStepMultiplier:0.35,zoomVisibilityDelay:1000,bodyScroll:false,showZoomOnHover:true,onOpen:null,onClose:null},options);this.image=this.overlay.querySelector('.overlay-image');this.container=this.overlay.querySelector('.overlay-image-container');this.slider=this.overlay.querySelector('.overlay-zoom-slider');this.zoomControls=Array.from(this.overlay.querySelectorAll('[data-zoom-direction]'));this.zoomFloater=this.overlay.querySelector('.overlay-zoom-floater');this.closeButtons=Array.from(this.overlay.querySelectorAll('.overlay-close'));this.zoomEpsilon=0.01;this.state={min:this.slider?parseFloat(this.slider.min):1,max:this.slider?parseFloat(this.slider.max):3,scale:this.slider?parseFloat(this.slider.min):1,x:0,y:0,pointerActive:false,pointerId:null,startX:0,startY:0,startOffsetX:0,startOffsetY:0,dragging:false,justDragged:false,pinchActive:false,startPinchDistance:0,startPinchScale:1};this.pointerPositions=new Map();this.defaultMaxScale=this.slider?parseFloat(this.slider.max):2.25;this.baseZoomIncrement=Math.max(this.zoomEpsilon,this.options.baseZoomIncrement||0.25);this.zoomStepCount=Math.max(1,this.options.zoomSteps||3);this.zoomIncrement=this.baseZoomIncrement;this.wheelStep=this.zoomIncrement*Math.max(0.1,this.options.wheelStepMultiplier||0.25);this.updateZoomStepMetrics();this.handleSliderInput=(event)=>{this.setZoom(parseFloat(event.target.value),{showFloater:true});};this.stopPropagation=(event)=>event.stopPropagation();this.handleZoomButtonClick=(event)=>{event.preventDefault();event.stopPropagation();const direction=event.currentTarget.dataset.zoomDirection==='in'?1:-1;this.setZoom(this.state.scale+direction*this.zoomIncrement);};this.handlePointerDown=(event)=>this.onPointerDown(event);this.handlePointerMove=(event)=>this.onPointerMove(event);this.handlePointerUp=(event)=>this.onPointerUp(event);this.handleImageClick=(event)=>this.onImageClick(event);this.handleWheel=(event)=>this.onWheel(event);this.handleMouseMove=()=>{if(this.isVisible()){this.showZoomFloater({allowAtMin:true});}};this.handleCloseClick=(event)=>{event.preventDefault();event.stopPropagation();this.close();};this.handleKeydown=(event)=>{if(event.key==='Escape'&&this.isVisible()){this.close();}};this.handleImageLoad=()=>{this.updateZoomBounds({resetSlider:true});};this.handleResize=()=>{if(!this.isVisible()){return;}
this.updateZoomBounds();if(this.state.scale===this.state.min){return;}
this.limitPan();this.applyImageTransform();};this.previousBodyOverflow='';this.zoomUiTimeout=null;this.visible=false;this.bindEvents();}
bindEvents(){if(this.slider){this.slider.addEventListener('input',this.handleSliderInput);this.slider.addEventListener('pointerdown',this.stopPropagation);}
this.zoomControls.forEach((button)=>{button.addEventListener('click',this.handleZoomButtonClick);});if(this.container){this.container.addEventListener('pointerdown',this.handlePointerDown);this.container.addEventListener('click',this.handleImageClick);this.container.addEventListener('wheel',this.handleWheel,{passive:false});if(this.options.showZoomOnHover){this.container.addEventListener('mousemove',this.handleMouseMove);}}
if(this.zoomFloater){this.zoomFloater.addEventListener('pointerdown',this.stopPropagation);this.zoomFloater.addEventListener('click',this.stopPropagation);}
this.closeButtons.forEach((button)=>{button.addEventListener('click',this.handleCloseClick);});if(this.image){this.image.addEventListener('load',this.handleImageLoad);if(this.image.complete&&this.image.naturalWidth){this.handleImageLoad();}}
document.addEventListener('keydown',this.handleKeydown);window.addEventListener('pointermove',this.handlePointerMove);window.addEventListener('pointerup',this.handlePointerUp);window.addEventListener('pointercancel',this.handlePointerUp);window.addEventListener('resize',this.handleResize);}
isVisible(){return this.visible;}
open(options={}){if(!this.overlay||this.isVisible()){return;}
this.resetZoom();this.overlay.style.display='flex';if(!this.options.bodyScroll){this.previousBodyOverflow=document.body.style.overflow||'';document.body.style.overflow='hidden';}
this.visible=true;this.updateZoomBounds({resetSlider:true});window.requestAnimationFrame(()=>{this.updateZoomBounds();});if(typeof this.options.onOpen==='function'&&!options.silent){this.options.onOpen();}}
close(options={}){if(!this.overlay||!this.isVisible()){return;}
this.overlay.style.display='none';if(!this.options.bodyScroll){document.body.style.overflow=this.previousBodyOverflow||'';}
this.visible=false;this.pointerPositions.clear();this.state.pointerActive=false;this.state.pinchActive=false;this.resetZoom();this.hideZoomFloater();if(typeof this.options.onClose==='function'&&!options.silent){this.options.onClose();}}
resetZoom(){this.state.x=0;this.state.y=0;this.state.scale=this.state.min;this.state.pointerActive=false;this.state.pinchActive=false;this.state.pointerId=null;this.pointerPositions.clear();if(this.slider){this.slider.value=this.state.min;}
this.applyImageTransform();this.hideZoomFloater();}
calculateIntrinsicZoomLimit(){if(!this.image){return this.defaultMaxScale;}
const naturalWidth=this.image.naturalWidth||0;const naturalHeight=this.image.naturalHeight||0;const displayedWidth=this.image.clientWidth||0;const displayedHeight=this.image.clientHeight||0;if(!naturalWidth||!naturalHeight||!displayedWidth||!displayedHeight){return this.defaultMaxScale;}
const widthScale=naturalWidth/displayedWidth;const heightScale=naturalHeight/displayedHeight;const intrinsicLimit=Math.min(widthScale,heightScale);if(!Number.isFinite(intrinsicLimit)){return this.defaultMaxScale;}
return Math.max(1,intrinsicLimit);}
updateZoomBounds(options={}){const{resetSlider=false}=options;const intrinsicLimit=this.calculateIntrinsicZoomLimit();const fallback=Number.isFinite(intrinsicLimit)&&intrinsicLimit>0?intrinsicLimit:this.defaultMaxScale;const nextMax=Math.max(this.state.min,fallback);this.state.max=nextMax;if(this.slider){this.slider.max=String(nextMax);const sliderValue=resetSlider?this.state.scale:Math.min(parseFloat(this.slider.value)||this.state.scale,nextMax);this.slider.value=String(Math.min(sliderValue,nextMax));}
this.updateZoomStepMetrics();if(this.state.scale>nextMax){this.setZoom(nextMax,{showFloater:false});}}
updateZoomStepMetrics(){const range=Math.max(this.state.max-this.state.min,this.zoomEpsilon);const desiredSteps=Math.max(1,Math.ceil(range/this.baseZoomIncrement));this.zoomStepCount=Math.max(desiredSteps,this.options.zoomSteps||1);this.zoomIncrement=range/this.zoomStepCount;if(typeof this.options.wheelStep==='number'){this.wheelStep=Math.max(this.zoomEpsilon,this.options.wheelStep);}else{const multiplier=Math.max(0.05,this.options.wheelStepMultiplier||0.25);this.wheelStep=Math.max(this.zoomEpsilon,this.zoomIncrement*multiplier);}}
setZoom(nextScale,options={}){if(!this.image){return;}
const{resetPosition=false,showFloater=true}=options;const clamped=Math.min(this.state.max,Math.max(this.state.min,nextScale));this.state.scale=clamped;if(resetPosition||clamped===this.state.min){this.state.x=0;this.state.y=0;}else{this.limitPan();}
if(this.slider&&parseFloat(this.slider.value)!==clamped){this.slider.value=clamped;}
this.applyImageTransform();if(!showFloater){return;}
if(clamped<=this.state.min+this.zoomEpsilon){this.hideZoomFloater();}else{this.showZoomFloater();}}
applyImageTransform(){if(!this.image){return;}
this.image.style.transform=`translate3d(${this.state.x}px, ${this.state.y}px, 0) scale(${this.state.scale})`;}
limitPan(){if(!this.container||!this.image){return;}
const containerWidth=this.container.clientWidth;const containerHeight=this.container.clientHeight;const baseWidth=this.image.clientWidth;const baseHeight=this.image.clientHeight;if(!containerWidth||!containerHeight||!baseWidth||!baseHeight){return;}
const scaledWidth=baseWidth*this.state.scale;const scaledHeight=baseHeight*this.state.scale;const extraWidth=Math.max(0,scaledWidth-containerWidth);const extraHeight=Math.max(0,scaledHeight-containerHeight);this.state.x=Math.min(extraWidth/2,Math.max(-extraWidth/2,this.state.x));this.state.y=Math.min(extraHeight/2,Math.max(-extraHeight/2,this.state.y));}
onPointerDown(event){if(!this.isVisible()||!this.container){return;}
if(event.pointerType==='mouse'&&typeof event.button==='number'&&event.button!==0){return;}
if(!this.pointerPositions.has(event.pointerId)&&this.pointerPositions.size>=2){return;}
this.pointerPositions.set(event.pointerId,{x:event.clientX,y:event.clientY});if(this.container.setPointerCapture){try{this.container.setPointerCapture(event.pointerId);}catch(error){}}
if(this.pointerPositions.size>=2){event.preventDefault();this.state.pointerActive=false;this.startPinch();return;}
if(this.state.scale>this.state.min){this.startPan(event);}else{this.state.pointerActive=false;}}
onPointerMove(event){if(!this.pointerPositions.has(event.pointerId)){return;}
this.pointerPositions.set(event.pointerId,{x:event.clientX,y:event.clientY});if(this.state.pinchActive){event.preventDefault();this.handlePinch();return;}
if(this.state.pointerActive&&event.pointerId===this.state.pointerId){this.panImage(event);}}
onPointerUp(event){const hadPointer=this.pointerPositions.has(event.pointerId);if(this.state.pinchActive){if(hadPointer){this.pointerPositions.delete(event.pointerId);}
if(this.pointerPositions.size<2){this.endPinch();if(this.pointerPositions.size===1&&this.state.scale>this.state.min){const remaining=this.pointerPositions.entries().next().value;if(remaining){const[pointerId,position]=remaining;this.startPan({pointerId,clientX:position.x,clientY:position.y,preventDefault(){}});}}}}else if(this.state.pointerActive&&event.pointerId===this.state.pointerId){this.endPan(event);}
if(!this.state.pinchActive&&hadPointer){this.pointerPositions.delete(event.pointerId);}
if(this.container&&this.container.releasePointerCapture){try{this.container.releasePointerCapture(event.pointerId);}catch(error){}}}
startPinch(){if(this.pointerPositions.size<2){return;}
this.state.pinchActive=true;this.state.pointerActive=false;this.state.dragging=false;this.state.startPinchDistance=this.getPointerDistance();this.state.startPinchScale=this.state.scale;this.state.justDragged=true;}
handlePinch(){if(!this.state.pinchActive){return;}
const distance=this.getPointerDistance();if(!distance||!this.state.startPinchDistance){return;}
const scaleFactor=distance/this.state.startPinchDistance;this.setZoom(this.state.startPinchScale*scaleFactor);}
endPinch(){if(!this.state.pinchActive){return;}
this.state.pinchActive=false;this.state.startPinchDistance=0;window.requestAnimationFrame(()=>{this.state.justDragged=false;});}
getPointerDistance(){const points=Array.from(this.pointerPositions.values());if(points.length<2){return 0;}
const[a,b]=points;const deltaX=b.x-a.x;const deltaY=b.y-a.y;return Math.hypot(deltaX,deltaY);}
startPan(event){if(this.state.scale===this.state.min||!this.container){this.state.pointerActive=false;return;}
if(event&&typeof event.preventDefault==='function'){event.preventDefault();}
this.state.pointerActive=true;this.state.pointerId=event.pointerId;this.state.startX=event.clientX;this.state.startY=event.clientY;this.state.startOffsetX=this.state.x;this.state.startOffsetY=this.state.y;this.state.dragging=false;this.state.justDragged=false;}
panImage(event){if(!this.state.pointerActive||event.pointerId!==this.state.pointerId){return;}
event.preventDefault();const deltaX=event.clientX-this.state.startX;const deltaY=event.clientY-this.state.startY;if(Math.abs(deltaX)>2||Math.abs(deltaY)>2){this.state.dragging=true;}
this.state.x=this.state.startOffsetX+deltaX;this.state.y=this.state.startOffsetY+deltaY;this.limitPan();this.applyImageTransform();}
endPan(event){if(!this.state.pointerActive||(event&&event.pointerId!==this.state.pointerId)){return;}
this.state.pointerActive=false;this.state.justDragged=this.state.dragging;this.state.dragging=false;if(this.state.justDragged){window.requestAnimationFrame(()=>{this.state.justDragged=false;});}}
onImageClick(event){if(!this.isVisible()||!this.image){return;}
event.preventDefault();if(this.state.pointerActive||this.state.justDragged){this.state.justDragged=false;return;}
if(this.state.scale>=this.state.max-this.zoomEpsilon){this.showZoomFloater();return;}
this.setZoom(this.state.scale+this.zoomIncrement);}
onWheel(event){if(!this.isVisible()||!this.image){return;}
event.preventDefault();const step=this.wheelStep>0?this.wheelStep:this.zoomIncrement*0.25;const delta=event.deltaY>0?-step:step;this.setZoom(this.state.scale+delta);}
hideZoomFloater(){if(!this.zoomFloater){return;}
this.zoomFloater.classList.remove('is-visible');if(this.zoomUiTimeout){window.clearTimeout(this.zoomUiTimeout);this.zoomUiTimeout=null;}}
showZoomFloater(options={}){if(!this.zoomFloater){return;}
const allowAtMin=Boolean(options.allowAtMin);if(!allowAtMin&&this.state.scale<=this.state.min+this.zoomEpsilon){this.hideZoomFloater();return;}
this.zoomFloater.classList.add('is-visible');if(this.zoomUiTimeout){window.clearTimeout(this.zoomUiTimeout);}
if(options.autoHide===false){return;}
this.zoomUiTimeout=window.setTimeout(()=>{this.zoomFloater.classList.remove('is-visible');this.zoomUiTimeout=null;},this.options.zoomVisibilityDelay);}}
window.FullscreenImageViewer=FullscreenImageViewer;})(window,document);