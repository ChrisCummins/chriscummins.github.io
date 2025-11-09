(function(window,document){'use strict';function toElement(target){if(!target){return null;}
if(typeof target==='string'){return document.querySelector(target);}
return target;}
class FullscreenImageViewer{constructor(options={}){this.overlay=toElement(options.overlay);if(!this.overlay){return;}
this.options=Object.assign({zoomSteps:3,wheelStep:null,zoomVisibilityDelay:1000,bodyScroll:false,showZoomOnHover:true,onOpen:null,onClose:null},options);this.image=this.overlay.querySelector('.overlay-image');this.container=this.overlay.querySelector('.overlay-image-container');this.slider=this.overlay.querySelector('.overlay-zoom-slider');this.zoomControls=Array.from(this.overlay.querySelectorAll('[data-zoom-direction]'));this.zoomFloater=this.overlay.querySelector('.overlay-zoom-floater');this.closeButtons=Array.from(this.overlay.querySelectorAll('.overlay-close'));this.zoomEpsilon=0.01;this.state={min:this.slider?parseFloat(this.slider.min):1,max:this.slider?parseFloat(this.slider.max):3,scale:this.slider?parseFloat(this.slider.min):1,x:0,y:0,pointerActive:false,pointerId:null,startX:0,startY:0,startOffsetX:0,startOffsetY:0,dragging:false,justDragged:false};this.zoomIncrement=this.slider?(this.state.max-this.state.min)/(this.options.zoomSteps||3):0.5;this.wheelStep=typeof this.options.wheelStep==='number'?this.options.wheelStep:this.zoomIncrement/10;this.handleSliderInput=(event)=>{this.setZoom(parseFloat(event.target.value),{showFloater:true});};this.stopPropagation=(event)=>event.stopPropagation();this.handleZoomButtonClick=(event)=>{event.preventDefault();event.stopPropagation();const direction=event.currentTarget.dataset.zoomDirection==='in'?1:-1;this.setZoom(this.state.scale+direction*this.zoomIncrement);};this.handlePointerDown=(event)=>this.startPan(event);this.handlePointerMove=(event)=>this.panImage(event);this.handlePointerUp=(event)=>this.endPan(event);this.handleImageClick=(event)=>this.onImageClick(event);this.handleWheel=(event)=>this.onWheel(event);this.handleMouseMove=()=>{if(this.isVisible()){this.showZoomFloater({allowAtMin:true});}};this.handleCloseClick=(event)=>{event.preventDefault();event.stopPropagation();this.close();};this.handleKeydown=(event)=>{if(event.key==='Escape'&&this.isVisible()){this.close();}};this.previousBodyOverflow='';this.zoomUiTimeout=null;this.visible=false;this.bindEvents();}
bindEvents(){if(this.slider){this.slider.addEventListener('input',this.handleSliderInput);this.slider.addEventListener('pointerdown',this.stopPropagation);}
this.zoomControls.forEach((button)=>{button.addEventListener('click',this.handleZoomButtonClick);});if(this.container){this.container.addEventListener('pointerdown',this.handlePointerDown);this.container.addEventListener('click',this.handleImageClick);this.container.addEventListener('wheel',this.handleWheel,{passive:false});if(this.options.showZoomOnHover){this.container.addEventListener('mousemove',this.handleMouseMove);}}
if(this.zoomFloater){this.zoomFloater.addEventListener('pointerdown',this.stopPropagation);this.zoomFloater.addEventListener('click',this.stopPropagation);}
this.closeButtons.forEach((button)=>{button.addEventListener('click',this.handleCloseClick);});document.addEventListener('keydown',this.handleKeydown);window.addEventListener('pointermove',this.handlePointerMove);window.addEventListener('pointerup',this.handlePointerUp);window.addEventListener('pointercancel',this.handlePointerUp);window.addEventListener('resize',()=>{if(!this.isVisible()||this.state.scale===this.state.min){return;}
this.limitPan();this.applyImageTransform();});}
isVisible(){return this.visible;}
open(options={}){if(!this.overlay||this.isVisible()){return;}
this.resetZoom();this.overlay.style.display='flex';if(!this.options.bodyScroll){this.previousBodyOverflow=document.body.style.overflow||'';document.body.style.overflow='hidden';}
this.visible=true;if(typeof this.options.onOpen==='function'&&!options.silent){this.options.onOpen();}}
close(options={}){if(!this.overlay||!this.isVisible()){return;}
this.overlay.style.display='none';if(!this.options.bodyScroll){document.body.style.overflow=this.previousBodyOverflow;}
this.visible=false;this.resetZoom();this.hideZoomFloater();if(typeof this.options.onClose==='function'&&!options.silent){this.options.onClose();}}
resetZoom(){this.state.x=0;this.state.y=0;this.state.scale=this.state.min;if(this.slider){this.slider.value=this.state.min;}
this.applyImageTransform();this.hideZoomFloater();}
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
startPan(event){if(this.state.scale===this.state.min||!this.container){return;}
event.preventDefault();this.state.pointerActive=true;this.state.pointerId=event.pointerId;this.state.startX=event.clientX;this.state.startY=event.clientY;this.state.startOffsetX=this.state.x;this.state.startOffsetY=this.state.y;this.state.dragging=false;this.state.justDragged=false;if(this.container.setPointerCapture){this.container.setPointerCapture(event.pointerId);}}
panImage(event){if(!this.state.pointerActive||event.pointerId!==this.state.pointerId){return;}
event.preventDefault();const deltaX=event.clientX-this.state.startX;const deltaY=event.clientY-this.state.startY;if(Math.abs(deltaX)>2||Math.abs(deltaY)>2){this.state.dragging=true;}
this.state.x=this.state.startOffsetX+deltaX;this.state.y=this.state.startOffsetY+deltaY;this.limitPan();this.applyImageTransform();}
endPan(event){if(!this.state.pointerActive||(event&&event.pointerId!==this.state.pointerId)){return;}
this.state.pointerActive=false;this.state.justDragged=this.state.dragging;this.state.dragging=false;if(this.container&&this.container.releasePointerCapture&&event){this.container.releasePointerCapture(event.pointerId);}
if(this.state.justDragged){window.requestAnimationFrame(()=>{this.state.justDragged=false;});}}
onImageClick(event){if(!this.isVisible()||!this.image){return;}
event.preventDefault();if(this.state.pointerActive||this.state.justDragged){this.state.justDragged=false;return;}
if(this.state.scale>=this.state.max-this.zoomEpsilon){this.showZoomFloater();return;}
this.setZoom(this.state.scale+this.zoomIncrement);}
onWheel(event){if(!this.isVisible()||!this.image){return;}
event.preventDefault();const step=this.wheelStep>0?this.wheelStep:0.07;const delta=event.deltaY>0?-step:step;this.setZoom(this.state.scale+delta);}
hideZoomFloater(){if(!this.zoomFloater){return;}
this.zoomFloater.classList.remove('is-visible');if(this.zoomUiTimeout){window.clearTimeout(this.zoomUiTimeout);this.zoomUiTimeout=null;}}
showZoomFloater(options={}){if(!this.zoomFloater){return;}
const allowAtMin=Boolean(options.allowAtMin);if(!allowAtMin&&this.state.scale<=this.state.min+this.zoomEpsilon){this.hideZoomFloater();return;}
this.zoomFloater.classList.add('is-visible');if(this.zoomUiTimeout){window.clearTimeout(this.zoomUiTimeout);}
if(options.autoHide===false){return;}
this.zoomUiTimeout=window.setTimeout(()=>{this.zoomFloater.classList.remove('is-visible');this.zoomUiTimeout=null;},this.options.zoomVisibilityDelay);}}
window.FullscreenImageViewer=FullscreenImageViewer;})(window,document);