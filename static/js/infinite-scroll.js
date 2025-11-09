class InfiniteScroll{constructor(options={}){this.container=options.container||document.querySelector('.photographs-list');this.sentinel=options.sentinel||document.getElementById('scroll-sentinel');this.loadingIndicator=options.loadingIndicator||document.getElementById('loading-indicator');this.paginationElement=options.paginationElement||document.querySelector('.pagination');this.paginationOriginalDisplay=this.paginationElement?this.paginationElement.style.display||'':'';const pageInfo=document.querySelector('.page-info');if(pageInfo){const pageMatch=pageInfo.textContent.match(/Page (\d+) of (\d+)/);this.currentPage=pageMatch?parseInt(pageMatch[1]):1;this.totalPages=pageMatch?parseInt(pageMatch[2]):1;}else{this.currentPage=1;this.totalPages=1;}
this.collectionName=this.getCollectionName();this.isLoading=false;this.hasMore=this.currentPage<this.totalPages;this.retryCount=0;this.maxRetries=3;this.monthNames=['January','February','March','April','May','June','July','August','September','October','November','December'];this.jsonBasePath='/photographs/data';this.siteUrl=this.getSiteUrl();this.cache=this.initializeCache();if(this.shouldInitialize()){this.init();}}
shouldInitialize(){if(!this.hasMore){return false;}
if(!this.container||!this.sentinel){console.warn('InfiniteScroll: Required elements not found');return false;}
return true;}
getCollectionName(){const pathParts=window.location.pathname.split('/').filter(p=>p);if(pathParts.length>=2&&pathParts[0]==='photographs'){if(!isNaN(pathParts[1])){return'all';}
return pathParts[1];}
return'all';}
getSiteUrl(){const link=document.querySelector('a[href*="/photographs/"]');if(link){const url=new URL(link.href);return url.origin;}
return window.location.origin;}
initializeCache(){try{const cacheKey=`photos_cache_${this.collectionName}`;const cached=sessionStorage.getItem(cacheKey);return cached?JSON.parse(cached):{};}catch(e){console.warn('InfiniteScroll: Cache initialization failed',e);return{};}}
saveToCache(page,data){try{this.cache[page]=data;const cacheKey=`photos_cache_${this.collectionName}`;sessionStorage.setItem(cacheKey,JSON.stringify(this.cache));}catch(e){console.warn('InfiniteScroll: Cache save failed',e);}}
init(){this.hidePaginationForInfiniteScroll();this.setupIntersectionObserver();this.preloadNextPage();}
setupIntersectionObserver(){const observerOptions={root:null,rootMargin:'400px',threshold:0.01};this.observer=new IntersectionObserver((entries)=>this.handleIntersection(entries),observerOptions);if(this.sentinel){this.observer.observe(this.sentinel);}}
handleIntersection(entries){entries.forEach(entry=>{if(entry.isIntersecting&&!this.isLoading&&this.hasMore){this.loadNextPage();}});}
async loadNextPage(){if(this.isLoading||!this.hasMore){return;}
this.isLoading=true;this.showLoader();const nextPage=this.currentPage+1;try{let data;if(this.cache[nextPage]){data=this.cache[nextPage];}else{data=await this.fetchPage(nextPage);this.saveToCache(nextPage,data);}
this.renderPhotos(data);this.currentPage=nextPage;this.hasMore=data.has_next;this.retryCount=0;if(this.hasMore){this.preloadNextPage();}
if(!this.hasMore){this.finalizeInfiniteScroll();}}catch(error){console.error('InfiniteScroll: Error loading page',error);this.handleError(error);}finally{this.isLoading=false;this.hideLoader();}}
async fetchPage(pageNum){const url=`${this.siteUrl}${this.jsonBasePath}/${this.collectionName}/page-${pageNum}.json`;const response=await fetch(url);if(!response.ok){throw new Error(`HTTP ${response.status}: ${response.statusText}`);}
const data=await response.json();return data;}
async preloadNextPage(){const nextPage=this.currentPage+1;if(nextPage>this.totalPages||this.cache[nextPage]){return;}
try{const data=await this.fetchPage(nextPage);this.saveToCache(nextPage,data);}catch(error){console.warn('InfiniteScroll: Preload failed (non-critical)',error);}}
renderPhotos(data){if(!data.photos||data.photos.length===0){console.warn('InfiniteScroll: No photos to render');return;}
const fragment=document.createDocumentFragment();data.photos.forEach(photo=>{const photoElement=this.createPhotoElement(photo);fragment.appendChild(photoElement);});this.container.appendChild(fragment);requestAnimationFrame(()=>{const newPhotos=this.container.querySelectorAll('.photo-item.loading');newPhotos.forEach(photo=>{photo.classList.remove('loading');photo.classList.add('loaded');});});}
createPhotoElement(photo){const photoDiv=document.createElement('div');photoDiv.setAttribute('data-collection',photo.collection);photoDiv.id=photo.slug;photoDiv.className='photo-item loading';const gridDiv=document.createElement('div');gridDiv.className='photographs-grid';const imageColumn=document.createElement('div');const imageLink=document.createElement('a');imageLink.href=photo.url;const picture=document.createElement('picture');const webpSource=document.createElement('source');webpSource.srcset=photo.images.display;webpSource.type='image/webp';picture.appendChild(webpSource);const img=document.createElement('img');img.src=photo.images.display_fallback;img.alt=photo.title;img.className='clickable-image';img.loading='lazy';if(photo.images&&photo.images.display_width&&photo.images.display_height){img.setAttribute('width',photo.images.display_width);img.setAttribute('height',photo.images.display_height);}
picture.appendChild(img);imageLink.appendChild(picture);imageColumn.appendChild(imageLink);const detailColumn=document.createElement('div');detailColumn.className='detail-info';const title=document.createElement('h3');const titleLink=document.createElement('a');titleLink.href=photo.url;const titleSpan=document.createElement('span');titleSpan.className='image-title';titleSpan.textContent=photo.title;titleLink.appendChild(titleSpan);title.appendChild(titleLink);detailColumn.appendChild(title);const metadataSection=this.buildMetadataSection(photo);if(metadataSection){detailColumn.appendChild(metadataSection);}
const buttonsDiv=document.createElement('div');buttonsDiv.className='button-row';const moreInfoBtn=document.createElement('a');moreInfoBtn.href=photo.url;moreInfoBtn.className='btn';moreInfoBtn.textContent='More Info';buttonsDiv.appendChild(moreInfoBtn);if(photo.shop_enabled&&photo.shop_url){const shopBtn=document.createElement('a');shopBtn.href=photo.shop_url;shopBtn.className='btn';shopBtn.textContent='Shop Print';buttonsDiv.appendChild(shopBtn);}
detailColumn.appendChild(buttonsDiv);gridDiv.appendChild(imageColumn);gridDiv.appendChild(detailColumn);photoDiv.appendChild(gridDiv);return photoDiv;}
buildMetadataSection(photo){const metadataItems=[];const photographedText=this.getPhotographedText(photo);if(photographedText){metadataItems.push(photographedText);}
if(photo.location){metadataItems.push(photo.location);}
if(!metadataItems.length){return null;}
const metadataDiv=document.createElement('div');metadataDiv.className='image-metadata';metadataItems.forEach(text=>{const list=document.createElement('ul');const listItem=document.createElement('li');listItem.textContent=text;list.appendChild(listItem);metadataDiv.appendChild(list);});return metadataDiv;}
getPhotographedText(photo){const metadata=photo.metadata||{};const rawDate=metadata.date_photographed||photo.date;const formattedDate=this.formatPhotographDate(rawDate);if(!formattedDate){return'';}
return`Photographed ${formattedDate}`;}
formatPhotographDate(dateString){const parsed=this.parseDateString(dateString);if(!parsed){return'';}
const{year,month}=parsed;if(typeof month==='number'){const monthName=this.monthNames[month];if(!monthName){return'';}
return`${monthName} ${year}`;}
return`${year}`;}
parseDateString(dateString){if(!dateString||typeof dateString!=='string'){return null;}
const trimmed=dateString.trim();if(!trimmed){return null;}
const match=trimmed.match(/^(\d{4})(?:-(\d{2}))?/);if(!match){return null;}
const year=parseInt(match[1],10);if(Number.isNaN(year)){return null;}
if(!match[2]){return{year,month:null};}
const month=parseInt(match[2],10);if(Number.isNaN(month)||month<1||month>12){return null;}
return{year,month:month-1};}
showLoader(){if(this.loadingIndicator){this.loadingIndicator.style.display='block';}}
hideLoader(){if(this.loadingIndicator){this.loadingIndicator.style.display='none';}}
handleError(error){this.hideLoader();if(this.retryCount<this.maxRetries){this.retryCount++;setTimeout(()=>{this.isLoading=false;this.loadNextPage();},1000*this.retryCount);}else{this.showErrorMessage(error);if(this.paginationElement){this.restorePaginationFallback();}}}
showErrorMessage(error){const errorDiv=document.createElement('div');errorDiv.className='infinite-scroll-error';errorDiv.innerHTML=`
            <p>Unable to load more photographs. Please try refreshing the page.</p>
            <p class="error-details">${error.message}</p>
        `;if(this.sentinel){this.sentinel.parentNode.insertBefore(errorDiv,this.sentinel);}}
hidePaginationForInfiniteScroll(){if(this.paginationElement){this.paginationElement.style.display='none';}}
restorePaginationFallback(){if(this.paginationElement){this.paginationElement.style.display=this.paginationOriginalDisplay||'';}}
finalizeInfiniteScroll(){if(this.observer&&this.sentinel){this.observer.unobserve(this.sentinel);}
if(this.sentinel&&this.sentinel.parentNode){this.sentinel.parentNode.removeChild(this.sentinel);this.sentinel=null;}}}
document.addEventListener('DOMContentLoaded',function(){if(window.location.pathname.includes('/photographs/')){const container=document.querySelector('.photographs-list');const sentinel=document.getElementById('scroll-sentinel');if(container&&sentinel){window.photographsInfiniteScroll=new InfiniteScroll();}}});