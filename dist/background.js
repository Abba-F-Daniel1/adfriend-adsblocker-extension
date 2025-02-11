const c=["*://*.doubleclick.net/*","*://*.googlesyndication.com/*","*://*.google-analytics.com/*","*://*.adnxs.com/*","*://*.amazon-adsystem.com/*","*://*.facebook.com/tr/*","*://*.moatads.com/*","*://*.outbrain.com/*","*://*.taboola.com/*","*://*.criteo.com/*","*://*.adform.net/*","*://*.rubiconproject.com/*","*://ads.*/*","*://ad.*/*","*://adserv.*/*","*://adserver.*/*","*://banner.*/*","*://banners.*/*","*://creatives.*/*","*://delivery.*/*","*://analytics.*/*","*://pixel.*/*","*://track.*/*","*://tracker.*/*","*://beacon.*/*","*://stats.*/*","*://*/*/tracking/*","*://*/*/analytics/*","*://*/*/pixel/*","*://*/*/beacon/*","*://*/*-ad-*","*://*/*_ad_*","*://*/*-ads-*","*://*/*_ads_*","*://*/*/ads/*","*://*/*/ad/*","*://*/*/advert/*","*://*/*/sponsor/*","*://*/*/banner/*","*://*/*/promo/*","*://*.2mdn.net/*","*://*.admob.com/*","*://*.adsafeprotected.com/*","*://*.adsrvr.org/*","*://*.pubmatic.com/*","*://*.serving-sys.com/*","*://*.sharethrough.com/*","*://*.teads.tv/*","*://*.yieldmo.com/*"],a=["quote","fact","reminder"];async function d(){try{const t=(await chrome.declarativeNetRequest.getDynamicRules()).map(r=>r.id),o=c.map((r,n)=>({id:1e3+n,priority:1,action:{type:"block"},condition:{urlFilter:r,resourceTypes:["script","image","xmlhttprequest","sub_frame","main_frame"]}}));await chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds:t,addRules:o}),console.debug(`[AdFriend] Successfully initialized ${o.length} blocking rules`)}catch(e){console.error("[AdFriend] Error initializing rules:",e)}}d();chrome.runtime.onMessage.addListener((e,t,o)=>{try{if(e.type==="CONTENT_SCRIPT_READY"){const r=a[Math.floor(Math.random()*a.length)];o({type:"BACKGROUND_READY",payload:{contentType:r}}),chrome.storage.local.get("blockedAds",n=>{n.blockedAds||chrome.storage.local.set({blockedAds:[]})})}return!0}catch(r){return console.error("[AdFriend] Error processing message:",r),o({type:"ERROR",payload:{error:"Internal error occurred"}}),!1}});chrome.runtime.onInstalled.addListener(()=>{chrome.storage.sync.get(["blockedCount","transformedCount"],e=>{typeof e.blockedCount>"u"&&chrome.storage.sync.set({blockedCount:0}),typeof e.transformedCount>"u"&&chrome.storage.sync.set({transformedCount:0})})});var s;(s=chrome.declarativeNetRequest.onRuleMatchedDebug)==null||s.addListener(({request:e,rule:t})=>{try{console.debug(`[AdFriend] Blocked ad request to: ${e.url}`),console.debug(`[AdFriend] Matched rule: ${t.ruleId}`),chrome.storage.sync.get(["blockedCount"],o=>{const r=(o.blockedCount||0)+1;chrome.storage.sync.set({blockedCount:r},()=>{chrome.runtime.sendMessage({type:"updateCounts",blockedCount:r})})}),chrome.storage.local.set({[`blocked_${Date.now()}`]:{url:e.url,ruleId:t.ruleId,timestamp:new Date().toISOString()}}).catch(console.error)}catch(o){console.error("[AdFriend] Error processing blocked request:",o)}});chrome.runtime.onMessage.addListener(e=>(e.type==="AD_TRANSFORMED"&&chrome.storage.sync.get(["transformedCount"],t=>{const o=(t.transformedCount||0)+1;chrome.storage.sync.set({transformedCount:o},()=>{chrome.runtime.sendMessage({type:"updateCounts",transformedCount:o})})}),!0));
//# sourceMappingURL=background.js.map
