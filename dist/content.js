let c=[];const d=["The only way to do great work is to love what you do. - Steve Jobs","Innovation distinguishes between a leader and a follower. - Steve Jobs","Stay hungry, stay foolish. - Steve Jobs","The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt","Success is not final, failure is not fatal. - Winston Churchill","Be the change you wish to see in the world. - Mahatma Gandhi","Everything you've ever wanted is on the other side of fear. - George Addair","The best way to predict the future is to create it. - Peter Drucker","Believe you can and you're halfway there. - Theodore Roosevelt","Your time is limited, don't waste it living someone else's life. - Steve Jobs","Life is 10% what happens to you and 90% how you react to it. - Charles R. Swindoll","The journey of a thousand miles begins with one step. - Lao Tzu","What you do today can improve all your tomorrows. - Ralph Marston","The secret of getting ahead is getting started. - Mark Twain","Don't watch the clock; do what it does. Keep going. - Sam Levenson","Quality is not an act, it is a habit. - Aristotle","The harder you work for something, the greater you'll feel when you achieve it.","Dream big and dare to fail. - Norman Vaughan","Wake up determined, go to bed satisfied.","The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt"],m=["A teaspoonful of neutron star would weigh 6 billion tons.","Honeybees can recognize human faces.","Light travels at 299,792,458 meters per second.","A day on Venus is longer than its year.","DNA is about 98% identical in humans and chimpanzees.","The human brain processes images in just 13 milliseconds.","Quantum entanglement allows particles to instantly share their quantum states.","There are more possible iterations of a game of chess than atoms in the universe.","The Milky Way galaxy is moving through space at 2.1 million kilometers per hour.","The average human body contains enough carbon to make 900 pencils.","A single lightning bolt contains enough energy to toast 100,000 slices of bread.","The human body generates enough heat in 30 minutes to boil a gallon of water.","Bananas are berries, but strawberries aren't.","The Great Wall of China is not visible from space with the naked eye.","A hummingbird's heart beats up to 1,260 times per minute.","Octopuses have three hearts and blue blood.","The universe is expanding faster than the speed of light.","Time passes faster at your head than at your feet.","A single cloud can weigh more than a million pounds.","There are more trees on Earth than stars in the Milky Way."],f=["Time for a posture check! Sit up straight 🪑","Remember to stay hydrated! Drink some water 💧","Take a break! Look away from the screen for 20 seconds 👀","Stand up and stretch for a minute 🧘‍♂️","Deep breathing exercise: Take 3 deep breaths 🫁","Relax your shoulders and unclench your jaw 😌","Time for a quick walk around! Get moving 🚶‍♂️","Blink your eyes several times to prevent eye strain 👁️","Roll your shoulders and neck gently 🔄","Check your screen brightness and distance 🖥️","Time to refill your water bottle! Stay hydrated 🚰","Do some ankle and wrist rotations 🔄","Practice the 20-20-20 rule: Look 20ft away for 20s every 20min 👀","Time for a mindful minute of meditation 🧘","Stretch your arms and fingers 🤸‍♂️","Check your sitting position and adjust if needed 💺","Remember to take your vitamins! 💊","Time for a healthy snack! Grab some fruits 🍎","Stand up and do some light exercises 🏃‍♂️","Take a moment to practice gratitude 🙏"],b=`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`,g=document.createElement("style");g.textContent=b;document.head.appendChild(g);function y(e){switch(e){case"quote":return d[Math.floor(Math.random()*d.length)];case"fact":return m[Math.floor(Math.random()*m.length)];case"reminder":return f[Math.floor(Math.random()*f.length)];default:return d[0]}}function w(){const e=document.createElement("div");e.className="adfriend-inspiration";const t=["quote","fact","reminder"],a=t[Math.floor(Math.random()*t.length)],s={quote:"linear-gradient(135deg, #4f46e5, #818cf8)",fact:"linear-gradient(135deg, #059669, #34d399)",reminder:"linear-gradient(135deg, #db2777, #f472b6)"},n={quote:"linear-gradient(90deg, #4f46e5 0%, #818cf8 25%, #4f46e5 50%, #818cf8 75%, #4f46e5 100%)",fact:"linear-gradient(90deg, #059669 0%, #34d399 25%, #059669 50%, #34d399 75%, #059669 100%)",reminder:"linear-gradient(90deg, #db2777 0%, #f472b6 25%, #db2777 50%, #f472b6 75%, #db2777 100%)"};e.style.cssText=`
    padding: 20px;
    background: ${s[a]};
    background-size: 200% auto;
    color: white;
    border-radius: 12px;
    text-align: center;
    font-family: system-ui, -apple-system, sans-serif;
    box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1);
    margin: 15px 0;
    transition: all 0.3s ease;
    cursor: pointer;
    animation: fadeIn 0.5s ease-out, float 3s ease-in-out infinite;
    position: relative;
    overflow: hidden;
  `;const r=document.createElement("p");r.textContent=y(a),r.style.cssText=`
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    font-weight: 500;
    position: relative;
    z-index: 1;
  `;const o=document.createElement("div");return o.style.cssText=`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${n[a]};
    background-size: 200% auto;
    opacity: 0;
    transition: opacity 0.3s ease;
  `,e.addEventListener("mouseenter",()=>{e.style.transform="scale(1.02) translateY(-5px)",e.style.boxShadow="0 12px 24px -8px rgba(0, 0, 0, 0.2)",o.style.opacity="0.1",o.style.animation="shimmer 2s linear infinite"}),e.addEventListener("mouseleave",()=>{e.style.transform="scale(1) translateY(0)",e.style.boxShadow="0 8px 16px -4px rgba(0, 0, 0, 0.1)",o.style.opacity="0",o.style.animation="none"}),e.addEventListener("click",()=>{const i=["pulse","rotate"],p=i[Math.floor(Math.random()*i.length)];r.textContent=y(a),e.style.animation=`${p} 0.5s ease-in-out`,setTimeout(()=>{e.style.animation="float 3s ease-in-out infinite"},500)}),e.appendChild(o),e.appendChild(r),e}function l(e){const t=w();c.push({original:e.cloneNode(!0),replacement:t}),e.replaceWith(t)}function v(){c.forEach(({original:e,replacement:t})=>{try{t.parentNode&&t.replaceWith(e)}catch(a){console.log("[AdFriend] Error restoring element:",a)}}),c=[]}const u=['[id^="ad-"],[id^="ads-"],[class^="ad-"],[class^="ads-"]','[id*="advertisement"],[class*="advertisement"]','[id*="banner-ad"],[class*="banner-ad"]','[id*="sponsored-"],[class*="sponsored-"]','[class*="popup"],[id*="popup"],[class*="modal"],[id*="modal"]','[class*="overlay"],[id*="overlay"],[class*="lightbox"],[id*="lightbox"]','[class*="dialog"],[id*="dialog"],[role="dialog"],[aria-modal="true"]','[class*="promo"],[id*="promo"]','[class*="banner"],[id*="banner"]','[class*="newsletter"],[id*="newsletter"]'],k=e=>{chrome.storage.sync.get(["enabled"],t=>{t.enabled&&e.forEach(a=>{a.addedNodes.forEach(s=>{if(s.nodeType===1){const n=s;u.forEach(r=>{var o;(o=n.matches)!=null&&o.call(n,r)&&l(n),n.querySelectorAll(r).forEach(i=>{l(i)})})}})})})},h=new MutationObserver(k);chrome.storage.sync.get(["enabled"],e=>{e.enabled&&(h.observe(document.body,{childList:!0,subtree:!0}),u.forEach(t=>{document.querySelectorAll(t).forEach(a=>{l(a)})}))});chrome.runtime.onMessage.addListener(e=>{e.type==="DISABLE_ADFRIEND"?(h.disconnect(),v()):e.type==="ENABLE_ADFRIEND"&&(h.observe(document.body,{childList:!0,subtree:!0}),u.forEach(t=>{document.querySelectorAll(t).forEach(a=>{l(a)})}))});
//# sourceMappingURL=content.js.map
