"use strict";var precacheConfig=[["./index.html","680ff72c8bd6ddbd8a5ba8f9daf4d15b"],["./static/css/main.223e9f81.css","c4ac9985e744039e6464159727f16611"],["./static/js/main.9d8ac895.js","d799c3381547d9321d2fc3a631190f51"],["./static/media/fa-regular-400.381af09a.woff","381af09a1366b6c2ae65eac5dd6f0588"],["./static/media/fa-regular-400.73fe7f1e.ttf","73fe7f1effbf382f499831a0a9f18626"],["./static/media/fa-regular-400.7422060c.eot","7422060ca379ee9939d3b687d072acad"],["./static/media/fa-regular-400.949a2b06.woff2","949a2b066ec37f5a384712fc7beaf2f1"],["./static/media/fa-regular-400.b5a61b22.svg","b5a61b229c9c92a6ac21f5b0e3c6e9f1"],["./static/media/fa-solid-900.0079a0ab.ttf","0079a0ab6bec4da7d6e16f2a2e87cd71"],["./static/media/fa-solid-900.14a08198.woff2","14a08198ec7d1eb96d515362293fed36"],["./static/media/fa-solid-900.38508b2e.svg","38508b2e7fac045869a86a15936433f7"],["./static/media/fa-solid-900.70e65a7d.eot","70e65a7d34902f2c350816ecfe2f6492"],["./static/media/fa-solid-900.815694de.woff","815694de1120d6c1e9d1f0895ee81056"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var a=new URL(e);return"/"===a.pathname.slice(-1)&&(a.pathname+=t),a.toString()},cleanResponse=function(t){return t.redirected?("body"in t?Promise.resolve(t.body):t.blob()).then(function(e){return new Response(e,{headers:t.headers,status:t.status,statusText:t.statusText})}):Promise.resolve(t)},createCacheKey=function(e,t,a,n){var r=new URL(e);return n&&r.pathname.match(n)||(r.search+=(r.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(a)),r.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var a=new URL(t).pathname;return e.some(function(e){return a.match(e)})},stripIgnoredUrlParameters=function(e,a){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(t){return a.every(function(e){return!e.test(t[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],a=e[1],n=new URL(t,self.location),r=createCacheKey(n,hashParamName,a,/\.\w{8}\./);return[n.toString(),r]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(n){return setOfCachedUrls(n).then(function(a){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!a.has(t)){var e=new Request(t,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+t+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return n.put(t,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var a=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(t){return t.keys().then(function(e){return Promise.all(e.map(function(e){if(!a.has(e.url))return t.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(t){if("GET"===t.request.method){var e,a=stripIgnoredUrlParameters(t.request.url,ignoreUrlParametersMatching),n="index.html";(e=urlsToCacheKeys.has(a))||(a=addDirectoryIndex(a,n),e=urlsToCacheKeys.has(a));var r="./index.html";!e&&"navigate"===t.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],t.request.url)&&(a=new URL(r,self.location).toString(),e=urlsToCacheKeys.has(a)),e&&t.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(a)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',t.request.url,e),fetch(t.request)}))}});