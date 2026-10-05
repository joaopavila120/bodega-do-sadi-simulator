// Sistema e síntese de áudio, reprodução de trilhas sonoras e efeitos
'use strict';

const AudioEngine={ctx:null,master:null,on:true,music:true,tracks:null,stepClock:0,hissClock:0,noiseBuffer:null,whiteBuffer:null,loops:{},popClock:0,glugClock:0,fireClock:0,mooClock:6,
 initMusic(){if(this.tracks)return;this.tracks=MUSIC_DATA.map(src=>{const audio=new Audio(src);audio.loop=true;audio.preload='metadata';audio.volume=.12;const track={audio,pending:false,blocked:false};audio.addEventListener('error',()=>{track.blocked=true;if(!this.musicError){this.musicError=true;say('Não foi possível carregar a música. Os efeitos sonoros continuam disponíveis.');}});return track;});},
 syncMusic(){if(!this.tracks)return;const active=this.on&&this.music&&started&&!paused&&!G.bocce?.paused&&!modal&&!document.hidden,index=['open','closing'].includes(G.phase)?1:0;this.tracks.forEach((track,i)=>{const a=track.audio;if(!active||i!==index){if(!a.paused)a.pause();return;}if(a.paused&&!track.pending&&!track.blocked){track.pending=true;a.play().catch(error=>{if(error.name!=='AbortError')track.blocked=true;}).finally(()=>{track.pending=false;});}});},
 unlock(){this.initMusic();this.tracks.forEach(track=>{if(!track.audio.error)track.blocked=false;});this.syncMusic();if(!this.ctx){try{this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=.48;this.master.connect(this.ctx.destination);this.noiseBuffer=this.ctx.createBuffer(1,this.ctx.sampleRate,this.ctx.sampleRate);const data=this.noiseBuffer.getChannelData(0);let previous=0;for(let i=0;i<data.length;i++){previous=(previous+Math.random()*.16-.08)*.98;data[i]=previous;}this.whiteBuffer=this.ctx.createBuffer(1,this.ctx.sampleRate*2,this.ctx.sampleRate);const white=this.whiteBuffer.getChannelData(0);for(let i=0;i<white.length;i++)white[i]=Math.random()*2-1;}catch(e){return;}}if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});},
 note(freq,duration=.12,type='triangle',volume=.035,delay=0){if(!this.on||!this.ctx||this.ctx.state!=='running')return;const now=this.ctx.currentTime+delay,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),now+.01);g.gain.exponentialRampToValueAtTime(.0001,now+duration);o.connect(g);g.connect(this.master);o.start(now);o.stop(now+duration+.02);},
 noise(duration=.1,volume=.08,frequency=1300){if(!this.on||!this.ctx)return;const source=this.ctx.createBufferSource(),filter=this.ctx.createBiquadFilter(),gain=this.ctx.createGain(),now=this.ctx.currentTime;source.buffer=this.noiseBuffer;filter.type='bandpass';filter.frequency.value=frequency;filter.Q.value=.7;gain.gain.setValueAtTime(volume,now);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);source.connect(filter);filter.connect(gain);gain.connect(this.master);source.start(now);source.stop(now+duration);},
 tick(){this.note(650,.055,'triangle',.06);this.note(920,.04,'sine',.025,.035);},
 ready(){this.note(784,.16,'sine',.08);this.note(1046,.24,'triangle',.07,.12);},
 bad(){this.note(174,.13,'triangle',.1);this.note(130,.24,'triangle',.09,.1);},
 warning(){this.note(880,.1,'square',.025);this.note(880,.12,'square',.025,.16);},
 coins(){[1046,1318,1568,2093].forEach((f,i)=>this.note(f,.16,'sine',.07,i*.055));},
 glass(){this.note(1760,.3,'sine',.085);this.note(2600,.2,'sine',.025,.025);},
 chop(){[0,.08,.16].forEach(t=>this.note(160,.045,'triangle',.1,t));this.noise(.13,.16,1800);},
 press(){this.note(90,.2,'sawtooth',.035);this.note(240,.05,'triangle',.08,.12);},
 sizzle(){this.noise(.35,.13,2600);},
 grain(){this.noise(.055,.22,2700);},
 scaleDone(){[659,880,1318].forEach((f,i)=>this.note(f,.13,'sine',.07,i*.08));},
 gulp(){this.note(280,.11,'sine',.08);this.note(180,.13,'sine',.06,.08);},
 boost(){[392,494,587,784,988].forEach((f,i)=>this.note(f,.14,'triangle',.065,i*.055));this.noise(.25,.1,1200);},
 drop(){this.note(115,.09,'triangle',.11);},
 trash(){this.noise(.15,.22,700);this.note(85,.12,'triangle',.07);},
 clean(){this.noise(.2,.22,2100);this.note(1174,.22,'sine',.055,.1);},
 heart(){[523,659,784,1046].forEach((f,i)=>this.note(f,.22,'triangle',.065,i*.12));},
 phone(){[880,1174,880,1174].forEach((f,i)=>this.note(f,.075,'sine',.055,i*.09));},
 crowd(){[196,246,294].forEach((f,i)=>this.note(f,.4,'triangle',.03,i*.08));},
 // ---------- Sons de ambiente ----------
 // Laço contínuo de ruído filtrado; o volume sobe e desce suave conforme a situação.
 loop(name,level,setup){const c=this.ctx;if(!c||c.state!=='running')return null;let l=this.loops[name];if(!l){if(level<=0)return null;const source=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain();source.buffer=setup.buffer==='brown'?this.noiseBuffer:this.whiteBuffer;source.loop=true;filter.type=setup.type;filter.frequency.value=setup.freq;filter.Q.value=setup.q??.8;gain.gain.value=0;source.connect(filter);filter.connect(gain);gain.connect(this.master);source.start(c.currentTime,Math.random());l=this.loops[name]={source,filter,gain};}l.gain.gain.setTargetAtTime(Math.max(0,level),c.currentTime,.06);return l;},
 silence(){for(const l of Object.values(this.loops))l.gain.gain.setTargetAtTime(0,this.ctx.currentTime,.05);},
 // Estalo curto: gordura na chapa, lenha no fogo.
 pop(freq=3500,volume=.06,duration=.025){if(!this.on||!this.ctx||this.ctx.state!=='running')return;const c=this.ctx,now=c.currentTime,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=this.whiteBuffer;f.type='bandpass';f.frequency.value=freq;f.Q.value=1.6;g.gain.setValueAtTime(volume,now);g.gain.exponentialRampToValueAtTime(.0001,now+duration);s.connect(f);f.connect(g);g.connect(this.master);s.start(now,Math.random()*1.8);s.stop(now+duration+.01);},
 // Bolha de líquido saindo da garrafa ("glub").
 bloop(freq=300,volume=.05){if(!this.on||!this.ctx||this.ctx.state!=='running')return;const c=this.ctx,now=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(freq*.55,now);o.frequency.exponentialRampToValueAtTime(freq,now+.05);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(volume,now+.012);g.gain.exponentialRampToValueAtTime(.0001,now+.08);o.connect(g);g.connect(this.master);o.start(now);o.stop(now+.1);},
 // Mugido: duas serras desafinadas, boca abrindo e fechando no filtro.
 moo(volume=.07,pitch=1){if(!this.on||!this.ctx||this.ctx.state!=='running')return;const c=this.ctx,now=c.currentTime,d=1.1+Math.random()*.45,base=112*pitch,lfo=c.createOscillator(),depth=c.createGain(),f1=c.createBiquadFilter(),f2=c.createBiquadFilter(),g=c.createGain(),oscs=[c.createOscillator(),c.createOscillator()];lfo.frequency.value=5.2;depth.gain.value=2.2;lfo.connect(depth);oscs.forEach((o,i)=>{o.type='sawtooth';o.detune.value=i*9;o.frequency.setValueAtTime(base*1.04,now);o.frequency.linearRampToValueAtTime(base*1.2,now+.28);o.frequency.linearRampToValueAtTime(base*.84,now+d);depth.connect(o.frequency);o.connect(f1);});f1.type='bandpass';f1.Q.value=1.3;f1.frequency.setValueAtTime(320,now);f1.frequency.linearRampToValueAtTime(820,now+.32);f1.frequency.linearRampToValueAtTime(400,now+d);f2.type='lowpass';f2.frequency.value=1500;f1.connect(f2);f2.connect(g);g.connect(this.master);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(volume,now+.2);g.gain.setValueAtTime(volume,now+d*.68);g.gain.exponentialRampToValueAtTime(.0001,now+d);[...oscs,lfo].forEach(o=>{o.start(now);o.stop(now+d+.05);});},
 brawl(){[0,.09,.2,.3].forEach((t,i)=>{this.note(95+i*14,.07,'triangle',.09,t);this.noise(.08,.14,900+i*300);});},
 crash(){this.noise(.4,.3,3200);[2350,3100,2650,3900,2900].forEach((f,i)=>this.note(f,.18,'sine',.05,.02+i*.045));this.note(70,.25,'triangle',.12);},
 near(x,y,range=800){return clamp(1.15-Math.hypot(G.player.x-x,G.player.y-y)/range,.3,1);},
 ambience(dt){
  const campo=isCampo()||!!G.lasso;
  // Chapa fritando: chiado contínuo + estalos de gordura (ovo chia mais agudo).
  const frying=campo?[]:G.kitchen.grill.filter(i=>i&&!i.waitingToast),near=this.near(86,560,700);
  this.loop('fry',frying.length?(.035+.02*Math.min(frying.length,3))*near*(frying.some(i=>i.burned)?.6:1):0,{type:'highpass',freq:2600});
  this.popClock-=dt;if(frying.length&&this.popClock<=0){const egg=frying.some(i=>i.key==='ovo');this.popClock=Math.random()*(egg?.09:.16)+.03;this.pop(egg?4200+Math.random()*1800:2600+Math.random()*2200,(.03+Math.random()*.05)*near);}
  // Enchendo o copo: cerveja faz espuma; cachaça e bitter fazem glub-glub na garrafa.
  const pour=G.task?.type==='pour'?G.task:null,fill=pour?Math.min(1.1,pour.time/1.65):0,beer=pour?.item?.key==='cerveja';
  const l=this.loop('pour',pour?(beer?.07:.04):0,{type:'bandpass',freq:900,q:1.1});
  if(l&&pour)l.filter.frequency.setTargetAtTime((beer?1100:700)+fill*(beer?1500:1300),this.ctx.currentTime,.05);
  this.glugClock-=dt;if(pour&&!beer&&this.glugClock<=0){this.glugClock=.11+Math.random()*.05;this.bloop(240+fill*380,.05);}
  // Fogo de chão: ronco grave da brasa e lenha estalando, conforme a lenha que resta.
  const fuel=campo&&!G.lasso?(campoState().fuel??0)/100:0,fire=fuel>0?this.near(525,510,900):0;
  this.loop('fire',fuel>0?(.05+.09*fuel)*fire:0,{buffer:'brown',type:'lowpass',freq:420});
  this.fireClock-=dt;if(fuel>0&&this.fireClock<=0){this.fireClock=(Math.random()*.22+.03)/(.4+fuel);const big=Math.random()<.12;this.pop(big?1100+Math.random()*600:1800+Math.random()*3200,(big?.12:.04+Math.random()*.06)*fire,big?.06:.018);}
  // Bois mugindo no campo e na laçada.
  this.mooClock-=dt;if(campo&&this.mooClock<=0){this.mooClock=G.lasso?2.5+Math.random()*3.5:7+Math.random()*9;this.moo(G.lasso?.06+Math.random()*.04:.025+Math.random()*.03,.82+Math.random()*.36);}
 },
 update(dt){this.syncMusic();const quiet=G.bocce||!this.on||!started||paused||modal||document.hidden;if(this.ctx){if(quiet)this.silence();else this.ambience(dt);}if(G.bocce)return;if(!this.on||!started||paused||modal||document.hidden)return;this.stepClock+=dt;this.hissClock+=dt;if(G.player.walk&&this.stepClock>(G.boost>0?.14:.19)){this.stepClock=0;this.note(G.boost>0?125:95,.04,'triangle',.025);if(G.boost>0)G.visual.push({x:G.player.x,y:G.player.y,dx:0,dy:5,life:.4,total:.4,type:'leaf'});}if(this.hissClock>.6){this.hissClock=0;if(G.event.id==='chuva'&&G.phase==='open')this.noise(.5,.025,1900);}}
};

function saveAudio(){try{localStorage.setItem('bodega-music',String(AudioEngine.music));localStorage.setItem('bodega-sound',String(AudioEngine.on));}catch(e){}}
