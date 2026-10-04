// Caminhos relativos ao HTML: funcionam tanto por file:// quanto por HTTP.
'use strict';
const ROOM_DATA = 'assets/images/room.png';
const PEOPLE_DATA = 'assets/images/people.png';
const HORSE_DATA = 'assets/images/horse.png';
const FURNITURE_DATA = 'assets/images/furniture.png';
const MUSIC_DATA = ['assets/audio/1.mp3', 'assets/audio/2.mp3'];

// A arte, a colisão e as rotas usam o mesmo mundo lógico de 1280 x 800.
const W = 1280, H = 800;
const DAY = 180, ORDER_WAIT = 110, COUNTER_WAIT = 95;
// Mantidos para recuperar partidas anteriores à separação dos arquivos.
const KEY = 'bodega-interior-v3', TEST_KEY = 'bodega-interior-tests';
const BASE_SPEED=280;

const COOK={torrada:6,burger:11,ovo:7,bacon:8,coracao:10};

const SPRITES=[{x:190,y:26,w:244,h:483},{x:670,y:25,w:226,h:481},{x:1127,y:18,w:252,h:491},{x:188,y:526,w:247,h:474},{x:671,y:528,w:229,h:478},{x:1123,y:524,w:250,h:477}];

const HORSE_CROPS=[[17,93,577,687],[603,93,578,687],[1193,93,581,687]];

const furnitureCrops=[[46,48,442,422],[552,74,435,374],[1101,9,379,480],[133,502,263,514],[527,561,488,397],[1051,560,476,394]];

const TABLE_DEF=[{id:0,x:784,y:319,w:138,h:87,seats:4},{id:1,x:1082,y:322,w:138,h:87,seats:4},{id:2,x:796,y:491,w:136,h:87,seats:4,unlock:'table3'},{id:3,x:1060,y:487,w:150,h:88,seats:4,unlock:'table4'}];

const FIXED=[
 {id:'bin:pao_xis',x:40,y:218,w: 72,h:57,label:'Pão de xis'}, {id:'bin:burger',x:125,y:218,w:72,h:57,label:'Hambúrguer'}, {id:'bin:ovo',x:210,y:218,w:72,h:57,label:'Ovo'}, {id:'bin:queijo',x:295,y:218,w:72,h:57,label:'Queijo'}, {id:'bin:salada',x:380,y:218,w:72,h:57,label:'Salada'}, {id:'bin:bacon',x:465,y:218,w:72,h:57,label:'Bacon',unlock:'bacon'}, {id:'bin:coracao',x:550,y:218,w:72,h:57,label:'Coração',unlock:'coracao'},
 {id:'grill:0',x:30,y:326,w: 92,h: 66,label:'Chapa · espaço 1'}, {id:'grill:1',x:30,y:404,w:92,h:66,label:'Chapa · espaço 2'}, {id:'grill:2',x:30,y:482,w:92,h:66,label:'Chapa · espaço 3',unlock:'grill3'},
 {id:'bench:0',x:284,y:354,w: 83,h:108,label:'Montagem · bancada 1'}, {id:'bench:1',x:373,y:354,w:83,h:108,label:'Montagem · bancada 2'}, {id:'press',x: 30,y:592,w:110,h:82,label:'Prensa'},
 {id:'bottle:refri',x:548,y:318,w:55,h:92,label:'Refrigerante'}, {id:'tap:cerveja',x:609,y:318,w:55,h:92,label:'Cerveja'}, {id:'pour',x:565,y:465,w:90,h:87,label:'Servir uma dose',unlock:'trago'},
 {id:'parking:0',x:284,y:568,w:83,h:78,label:'Apoio · lugar 1'}, {id:'parking:1',x:373,y:568,w:83,h:78,label:'Apoio · lugar 2'}, {id:'trash',x: 40,y:699,w:48,h:52,label:'Lixeira'},
 {id:'shop:cigarro',x:774,y:218,w:52,h:57,label:'Maços de cigarros'}, {id:'shop:codorna',x:834,y:218,w:52,h:57,label:'Ovos de codorna'}, {id:'bag',x:894,y:218,w:52,h:57,label:'Balança de erva-mate'},
 {id:'shop:pepino',x:954,y:218,w:52,h:57,label:'Pepino em conserva',unlock:'pepino'}, {id:'shop:salame',x:1014,y:218,w:52,h:57,label:'Salame de colônia',unlock:'salame'}, {id:'shop:amendoim',x:1074,y:218,w:52,h:57,label:'Amendoim torrado',unlock:'amendoim'}, {id:'shop:pinhao',x:1134,y:218,w:52,h:57,label:'Pinhão a granel',unlock:'pinhao'}, {id:'shop:bergamota',x:1194,y:218,w:52,h:57,label:'Bergamota',unlock:'bergamota'},
 {id:'service',x:990,y:640,w:200,h:55,label:'Balcão de atendimento'}, {id:'mate',x:691,y:501,w: 66,h: 54,label:'Chimarrão · segure E'}, {id:'bitter',x:562,y:601,w:67,h: 64,label:'Servir bitter',unlock:'bitter'},
 {id:'coffee',x:562,y:697,w:67,h:55,label:'Cafeteira · segure E',unlock:'coffee'}
];
