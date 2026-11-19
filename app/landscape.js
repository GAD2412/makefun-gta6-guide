// A hand-composed coastal print. Its three depth planes scale together at any viewport.
(() => {
  const ctx = document.getElementById('scenery').getContext('2d');
  if (!ctx) return;
  const width = 850, height = 280;
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#7c969c');
  sky.addColorStop(.48, '#eab59a');
  sky.addColorStop(.76, '#f8bf7e');
  sky.addColorStop(1, '#638e89');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);
  let seed = 73;
  const random = () => ((seed = (seed * 48271) % 2147483647) / 2147483647);
  function polygon(fill, points) {
    ctx.fillStyle = fill; ctx.beginPath();
    points.forEach(([x,y], i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
    ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = '#ffe1a7';
  ctx.beginPath(); ctx.arc(523,107,62,0,Math.PI*2); ctx.fill();
  for (let i=0;i<45;i++) {
    let x=random()*width, y=random()*150;
    ctx.fillStyle='rgba(255,224,190,.17)'; ctx.fillRect(x,y,15+random()*125,1+random()*3);
  }
  let x=0;
  while(x<width) {
    const w=8+random()*23, h=3+random()*19+(x>290&&x<458?random()*40:0);
    ctx.fillStyle='#778c89'; ctx.fillRect(x,167-h,w,h);
    if(h>40)ctx.fillRect(x+w*.44,156-h,2,13);
    x+=w+random()*5;
  }
  ctx.fillStyle='#6d9790';ctx.fillRect(0,167,width,113);
  for(let i=0;i<280;i++){
    const x=random()*width,y=170+random()*110;
    ctx.fillStyle=x>445&&x<605?'#e3bd8f':'#99b1a1';ctx.fillRect(x,y,2+random()*20,1);
  }
  // Causeway deck, parapet and piers recede into the city.
  for(let i=0;i<15;i++){
    const f=i/15, bx=270+f*f*610, by=166+f*f*67;
    polygon('#425e60',[[bx,by],[bx+2+f*7,by],[bx+4+f*6,by+5+f*54],[bx+1,by+6+f*55]]);
  }
  polygon('#374f52',[[249,165],[850,219],[850,245],[249,167]]);
  polygon('#e4b391',[[250,164],[850,214],[850,221],[250,166]]);
  for(let i=1;i<14;i++) {
    const f=i/13, bx=260+f*f*620, by=164+f*f*52;
    ctx.fillStyle='#546368';ctx.fillRect(bx,by-f*25,1+f,25*f);ctx.fillRect(bx-7*f,by-25*f,7*f,1+f);
  }
  function palm(x,y,size,lean) {
    ctx.save();ctx.translate(x,y);ctx.scale(size,size);
    polygon('#243f41',[[-5,0],[lean-1,-77],[lean+2,-77],[3,0]]);
    ctx.translate(lean,-77);ctx.fillStyle='#294547';
    for(let n=0;n<11;n++){
      const angle= -Math.PI*.99+n*Math.PI*.197, length=25+random()*24;
      const ex=Math.cos(angle)*length, ey=Math.sin(angle)*13+6;
      ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(ex*.55,-22,ex,ey+5);ctx.quadraticCurveTo(ex*.55,-12,0,0);ctx.fill();
      for(let j=2;j<9;j++){
        const t=j/10, px=ex*t,py=-30*t*(1-t)+ey*t*t;
        polygon('#294547',[[px,py],[px+ex*.14,py+7*(1-t)+2],[px+1,py+2]]);
      }
    }
    ctx.restore();
  }
  polygon('#365858',[[0,211],[120,193],[195,204],[252,199],[330,226],[391,243],[420,280],[0,280]]);
  for(let i=0;i<130;i++){const x=random()*290;let y=204+Math.max(0,x-175)*.22-random()*6;ctx.fillStyle='#365858';ctx.beginPath();ctx.arc(x,y,3+random()*7,0,7);ctx.fill()}
  palm(100,205,1.68,8);palm(142,202,1.08,-7);palm(221,211,.7,3);
  polygon('#223c3e',[[0,217],[79,217],[179,242],[230,255],[328,268],[352,280],[0,280]]);
  for(let i=0;i<12000;i++){ctx.fillStyle=random()>.5?'rgba(255,248,209,.065)':'rgba(28,39,40,.055)';ctx.fillRect(random()*width,random()*height,1.4,1.4)}
})();
