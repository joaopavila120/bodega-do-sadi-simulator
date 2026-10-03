'use strict';

const NON_RETURNABLE=new Set(['cafe','cachaca','bitter','cerveja']);
function sourceProduct(id){if(id==='bag')return 'erva';const [type,key]=id.split(':');return ['bin','shop','bottle'].includes(type)&&GOODS[key]?key:null;}
function matchingReturn(id){const key=sourceProduct(id),item=held();return !!(key&&item&&(item.pid||item.key)===key&&!NON_RETURNABLE.has(key));}
function returnToSource(id){
 if(!matchingReturn(id))return false;
 const key=sourceProduct(id),item=held(),quantity=bulk(key)?item.weight||bulk(key).unit:1;
 if(item.burned||item.spoiled){say('Produto queimado ou estragado vai para a lixeira.');return true;}
 if(G.stock[key]+quantity>stationCapacity(key)){say('Não há espaço para devolver este produto. Use a bancada de apoio.');return true;}
 const previous=G.stock[key];G.stock[key]+=quantity;
 G.avg[key]=(previous*G.avg[key]+item.cost)/G.stock[key];
 takeHeld();
 // Porções mantêm estado e custo; produtos a granel voltam pelo peso real.
 if(!bulk(key)){G.returnedItems??={};(G.returnedItems[key]??=[]).push(item);}
 AudioEngine.tick();say('Devolvido: '+nameOf(key)+(bulk(key)?' · '+formatWeight(quantity):''));save();refreshHUD();return true;
}
