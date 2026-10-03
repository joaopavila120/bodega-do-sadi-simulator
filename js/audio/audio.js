// Sistema e síntese de áudio, reprodução de trilhas sonoras e efeitos
'use strict';

const AudioEngine={ctx:null,master:null,on:true,music:true,tracks:null,stepClock:0,hissClock:0,noiseBuffer:null,
 initMusic(){if(this.tracks)return;this.tracks=MUSIC_DATA.map(src=>{const audio=new Audio(src);audio.loop=true;audio.preload='metadata';audio.volume=.12;const track={audio,pending:false,blocked:false};audio.addEventListener('error',()=>{track.blocked=true;if(!this.musicError){this.musicError=true;say('Não foi possível carregar a música. Os efeitos sonoros continuam disponíveis.');}});return track;});},
 syncMusic(){if(!this.tracks)return;const active=this.on&&this.music&&started&&!paused&&!G.bocce?.paused&&!modal&&!document.hidden,index=['open','closing'].includes(G.phase)?1:0;this.tracks.forEach((track,i)=>{const a=track.audio;if(!active||i!==index){if(!a.paused)a.pause();return;}if(a.paused&&!track.pending&&!track.blocked){track.pending=true;a.play().catch(error=>{if(error.name!=='AbortError')track.blocked=true;}).finally(()=>{track.pending=false;});}});},
 unlock(){this.initMusic();this.tracks.forEach(track=>{if(!track.audio.error)track.blocked=false;});this.syncMusic();if(!this.ctx){try{this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=.48;this.master.connect(this.ctx.destination);this.noiseBuffer=this.ctx.createBuffer(1,this.ctx.sampleRate,this.ctx.sampleRate);const data=this.noiseBuffer.getChannelData(0);let previous=0;for(let i=0;i<data.length;i++){previous=(previous+Math.random()*.16-.08)*.98;data[i]=previous;}}catch(e){return;}}if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});},
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
 update(dt){this.syncMusic();if(G.bocce)return;if(!this.on||!started||paused||modal||document.hidden)return;this.stepClock+=dt;this.hissClock+=dt;if(G.player.walk&&this.stepClock>(G.boost>0?.14:.19)){this.stepClock=0;this.note(G.gear==='horse'?130:G.boost>0?125:95,.04,'triangle',G.gear==='horse'?.06:.025);if(G.gear==='horse')this.note(100,.04,'triangle',.035,.065);if(G.boost>0)G.visual.push({x:G.player.x,y:G.player.y,dx:0,dy:5,life:.4,total:.4,type:'leaf'});}if(this.hissClock>.6){this.hissClock=0;const hot=G.kitchen.grill.some(i=>i&&!i.burned);if(hot)this.noise(.25,G.player.x<450?.025:.008,2400);if(G.event.id==='chuva'&&G.phase==='open')this.noise(.5,.025,1900);}}
};

function saveAudio(){try{localStorage.setItem('bodega-music',String(AudioEngine.music));localStorage.setItem('bodega-sound',String(AudioEngine.on));}catch(e){}}
