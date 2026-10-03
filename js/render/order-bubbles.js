'use strict';

// Balões individuais. O limite inferior das mercadorias fica sempre livre.
function customerOrderBubbles(){
 const result=[];
 for(const g of G.groups){
  if(g.state!=='seated')continue;ensureDiners(g);
  g.diners.forEach((d,i)=>{if(d.status!=='waiting')return;const p=groupSeatPosition(g,i);
   result.push({x:p.x,y:p.y-109,items:d.orders,seconds:d.patience,total:d.maxPatience,training:g.training,seat:i+1});
  });
 }
 // Só quem já chegou ao atendimento exibe o pedido; não cobre as estações no caminho.
 const c=G.shop.find(c=>c.state==='queue');
 if(c?.dest&&Math.hypot(c.x-c.dest.x,c.y-c.dest.y)<18)result.push({x:c.x,y:c.y-124,items:[c.pid],seconds:c.patience,total:c.maxPatience,training:c.training,weight:c.grams,counter:true});
 return result.map(b=>{
  const width=b.counter?(b.weight?86:62):b.items.length>=3?56:b.items.length===2?48:40,height=b.counter?27:36;
  return {...b,width,height,left:clamp(b.x-width/2,4,W-width-4),top:Math.max(282,b.y-height-5)};
 });
}
function drawCustomerOrders(){
 for(const b of customerOrderBubbles()){
  const x=b.left,y=b.top,w=b.width,h=b.height;
  rect(x,y,w,h,'#fff1d1',5,'#866840');
  ctx.fillStyle='#fff1d1';ctx.beginPath();ctx.moveTo(b.x-3,y+h-1);ctx.lineTo(b.x,y+h+4);ctx.lineTo(b.x+3,y+h-1);ctx.fill();
  if(b.counter){
   food(b.items[0],x+14,y+12,22);
   if(b.weight)txt(formatWeight(b.weight),x+43,y+12,10,'#5a442a','center','Arial',false);
   txt(b.training?'livre':Math.ceil(b.seconds)+'s',x+w-4,y+12,10,b.seconds<25&&!b.training?'#a33420':'#584629','right','Arial',false);
   rect(x+5,y+h-4,w-10,2,'#d6c7a7');rect(x+5,y+h-4,(w-10)*clamp(b.seconds/b.total,0,1),2,'#73934c');continue;
  }
  const size=b.items.length===3?16:b.items.length===2?19:22;
  b.items.slice(0,3).forEach((k,j)=>food(k,x+w/2+(j-(b.items.length-1)/2)*size,y+12,size));
  if(b.weight)txt(formatWeight(b.weight),x+w/2,y+27,10,'#5a442a','center','Arial',false);
  txt(b.training?'livre':Math.ceil(b.seconds)+'s',x+w/2,y+h-9,10,b.seconds<25&&!b.training?'#a33420':'#584629','center','Arial',false);
  rect(x+5,y+h-4,w-10,2,'#d6c7a7');rect(x+5,y+h-4,(w-10)*clamp(b.seconds/b.total,0,1),2,b.seconds<25&&!b.training?'#c65b39':'#73934c');
 }
}
