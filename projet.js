(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"projet_atlas_1", frames: [[933,1083,1011,265],[897,1354,563,473],[0,0,1218,833],[1220,585,659,496],[1462,1350,556,471],[1220,0,775,583],[0,835,931,517],[0,1354,895,483]]},
		{name:"projet_atlas_2", frames: [[760,1180,690,106],[760,1072,710,106],[760,964,787,106],[1109,1847,189,185],[1801,1668,192,161],[233,1847,297,196],[539,1496,296,162],[1417,667,387,286],[491,0,693,291],[1109,1288,335,150],[1452,1271,305,223],[1320,1660,156,214],[1478,1740,124,261],[0,1477,283,260],[1274,1496,225,162],[1794,1081,234,320],[1186,0,493,338],[0,492,473,345],[491,293,488,336],[859,1668,248,261],[0,0,489,490],[376,960,382,269],[919,685,371,277],[475,631,442,327],[285,1477,252,247],[233,1739,624,106],[0,1739,231,295],[1417,340,424,325],[532,1931,505,106],[837,1440,211,224],[981,340,434,343],[1801,1831,169,179],[1501,1496,141,242],[570,1288,224,193],[1604,1740,195,163],[1843,335,195,255],[1759,1403,248,263],[1681,0,272,333],[0,839,374,369],[1109,1668,209,177],[1050,1440,222,185],[0,1210,291,265],[293,1288,275,175],[1549,955,243,314],[1806,667,223,412]]},
		{name:"projet_atlas_3", frames: [[976,387,39,58],[316,511,372,38],[365,180,154,106],[912,139,52,140],[137,164,47,99],[690,497,206,53],[679,434,196,61],[551,0,196,132],[453,390,98,90],[0,427,162,96],[586,290,91,219],[679,291,177,72],[679,365,182,67],[137,302,144,123],[551,134,148,154],[164,489,150,96],[187,146,176,154],[877,417,97,74],[863,291,90,124],[283,302,67,66],[701,183,209,106],[749,0,135,181],[966,139,53,104],[955,281,57,104],[957,493,55,99],[0,0,185,162],[391,0,158,178],[0,164,135,196],[164,427,117,51],[0,362,128,48],[187,0,202,144],[283,390,168,97],[365,290,219,98],[886,0,92,137],[898,493,57,104]]}
];


(lib.AnMovieClip = function(){
	this.currentSoundStreamInMovieclip;
	this.actionFrames = [];
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(positionOrLabel);
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		var keys = this.soundStreamDuration.keys();
		for(var i = 0;i<this.soundStreamDuration.size; i++){
			var key = keys.next().value;
			key.instance.stop();
		}
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var keys = this.soundStreamDuration.keys();
			for(var i = 0; i< this.soundStreamDuration.size ; i++){
				var key = keys.next().value; 
				var value = this.soundStreamDuration.get(key);
				if((value.end) == currentFrame){
					key.instance.stop();
					if(this.currentSoundStreamInMovieclip == key) { this.currentSoundStreamInMovieclip = undefined; }
					this.soundStreamDuration.delete(key);
				}
			}
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			if(this.soundStreamDuration.size > 0){
				var keys = this.soundStreamDuration.keys();
				var maxDuration = 0;
				for(var i=0;i<this.soundStreamDuration.size;i++){
					var key = keys.next().value;
					var value = this.soundStreamDuration.get(key);
					if(value.end > maxDuration){
						maxDuration = value.end;
						this.currentSoundStreamInMovieclip = key;
					}
				}
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_15 = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_9 = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_6 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_8 = function() {
	this.initialize(ss["projet_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.aiguillegrande = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.aiguillepetite = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.baguette1 = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.baguette2 = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.banane1 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.banane2 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.banane3 = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.bloccube = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.blocrectanglebleu = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.auto = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.boitefermee = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.boutonplay = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.bureauordi = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.camionbenne = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.camion = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.ciseauferme = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.ciseauouvert = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.coussin = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.crayonbleu = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.crayonrouge = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.decoupecoeur = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.decoupeetoile = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.blocrectanglerouge = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.boiteouverte = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.decoupefeuille = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.bloctriangle = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.dinobras = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.dinocorps = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.ecranchiffres = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.ecraninsectes = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.ecran = function() {
	this.initialize(ss["projet_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.ecran_animaux = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.facejaune = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.horlogecontour = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.fenetre = function() {
	this.initialize(ss["projet_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.gouttesavon = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.dessinbateau = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_12 = function() {
	this.initialize(ss["projet_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.dinobouche = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.dessinnature = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_2 = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.livrecochons = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.horlogeinterieur = function() {
	this.initialize(ss["projet_atlas_1"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.faceverte = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.livreferme = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.livrelion = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.main = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.ourscorps = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.ourspatte2 = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.ourspatte1 = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_11 = function() {
	this.initialize(ss["projet_atlas_1"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.ourspatte3 = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.livreprincesse = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.ourstete = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.pomme1 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.pomme2 = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.pomme3 = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.poupeebras1 = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.poupeebras2 = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.poupeecorps = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.poupeetete = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.sandwich1 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();



(lib.sandwich2 = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.sandwich3 = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.savonpompe = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.savon = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(35);
}).prototype = p = new cjs.Sprite();



(lib.souris = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.table = function() {
	this.initialize(ss["projet_atlas_1"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.tableaufleur = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(36);
}).prototype = p = new cjs.Sprite();



(lib.tableaumaison = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(37);
}).prototype = p = new cjs.Sprite();



(lib.tableausoleil = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(38);
}).prototype = p = new cjs.Sprite();



(lib.tableau = function() {
	this.initialize(ss["projet_atlas_1"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.tambour = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(39);
}).prototype = p = new cjs.Sprite();



(lib.trompette = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(40);
}).prototype = p = new cjs.Sprite();



(lib.virus = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(41);
}).prototype = p = new cjs.Sprite();



(lib.xylophone = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(42);
}).prototype = p = new cjs.Sprite();



(lib.livreouvre = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(43);
}).prototype = p = new cjs.Sprite();



(lib.livrepiles = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(44);
}).prototype = p = new cjs.Sprite();



(lib.ourspatte4 = function() {
	this.initialize(ss["projet_atlas_3"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_10 = function() {
	this.initialize(img.CachedBmp_10);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2276,1644);// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.UI_horloge = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// grande_aiguille
	this.instance = new lib.aiguillegrande();
	this.instance.setTransform(-26,-32,0.3669,0.3669);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// petite_aiguille
	this.instance_1 = new lib.aiguillepetite();
	this.instance_1.setTransform(-26,-24,0.3669,0.3669);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	// contour
	this.instance_2 = new lib.horlogecontour();
	this.instance_2.setTransform(-106,-96,0.3669,0.3669);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1));

	// fond
	this.instance_3 = new lib.horlogeinterieur();
	this.instance_3.setTransform(-119,-93,0.3669,0.3669);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.UI_horloge, new cjs.Rectangle(-119,-96,204,179.8), null);


(lib.station_tableau = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{start:0,soleil:1,fleur:37,maison:73});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
		
		this.Interact = function (choice) {
			switch (choice) {
				case 1:
					this.gotoAndPlay("fleur");
					break;
				case 2:
					this.gotoAndPlay("soleil");
					break;
				case 3:
					this.gotoAndPlay("maison");
					break;
				default:
					console.log("tableau : choice not supported");
		
			}
		}
	}
	this.frame_36 = function() {
		this.gotoAndStop("start");
	}
	this.frame_72 = function() {
		this.gotoAndStop("start");
	}
	this.frame_108 = function() {
		this.gotoAndStop("start");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(36).call(this.frame_36).wait(36).call(this.frame_72).wait(36).call(this.frame_108).wait(1));

	// mask3 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_73 = new cjs.Graphics().p("AnCsQIBsAAIAAYhIhsAAg");
	var mask_graphics_74 = new cjs.Graphics().p("AnCsQIDKAAIAAYhIjKAAg");
	var mask_graphics_75 = new cjs.Graphics().p("AnCsQIEnAAIAAYhIknAAg");
	var mask_graphics_76 = new cjs.Graphics().p("AnCsQIGFAAIAAYhImFAAg");
	var mask_graphics_77 = new cjs.Graphics().p("AnDsQIHiAAIAAYhIniAAg");
	var mask_graphics_78 = new cjs.Graphics().p("AnDsQIJAAAIAAYhIpAAAg");
	var mask_graphics_79 = new cjs.Graphics().p("AnDsQIKdAAIAAYhIqdAAg");
	var mask_graphics_80 = new cjs.Graphics().p("AnDsQIL7AAIAAYhIr7AAg");
	var mask_graphics_81 = new cjs.Graphics().p("AnEsQINZAAIAAYhItZAAg");
	var mask_graphics_82 = new cjs.Graphics().p("AnbsQIO3AAIAAYhIu3AAg");
	var mask_graphics_83 = new cjs.Graphics().p("AoKsQIQVAAIAAYhIwVAAg");
	var mask_graphics_84 = new cjs.Graphics().p("Ao5sQIRzAAIAAYhIxzAAg");
	var mask_graphics_85 = new cjs.Graphics().p("AposQITRAAIAAYhIzRAAg");
	var mask_graphics_86 = new cjs.Graphics().p("AqXsQIUvAAIAAYhI0vAAg");
	var mask_graphics_87 = new cjs.Graphics().p("ArFsQIWLAAIAAYhI2LAAg");
	var mask_graphics_88 = new cjs.Graphics().p("Ar0sQIXpAAIAAYhI3pAAg");
	var mask_graphics_89 = new cjs.Graphics().p("AsjsQIZHAAIAAYhI5HAAg");
	var mask_graphics_90 = new cjs.Graphics().p("AtSsQIalAAIAAYhI6lAAg");
	var mask_graphics_91 = new cjs.Graphics().p("AuBsQIcDAAIAAYhI8DAAg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:null,x:0,y:0}).wait(73).to({graphics:mask_graphics_73,x:-45.0732,y:-5.5316}).wait(1).to({graphics:mask_graphics_74,x:-45.098,y:-5.5316}).wait(1).to({graphics:mask_graphics_75,x:-45.1228,y:-5.5316}).wait(1).to({graphics:mask_graphics_76,x:-45.1476,y:-5.5316}).wait(1).to({graphics:mask_graphics_77,x:-45.1724,y:-5.5316}).wait(1).to({graphics:mask_graphics_78,x:-45.1972,y:-5.5316}).wait(1).to({graphics:mask_graphics_79,x:-45.222,y:-5.5316}).wait(1).to({graphics:mask_graphics_80,x:-45.2468,y:-5.5316}).wait(1).to({graphics:mask_graphics_81,x:-45.2716,y:-5.5316}).wait(1).to({graphics:mask_graphics_82,x:-42.9937,y:-5.5316}).wait(1).to({graphics:mask_graphics_83,x:-38.3539,y:-5.5316}).wait(1).to({graphics:mask_graphics_84,x:-33.7141,y:-5.5316}).wait(1).to({graphics:mask_graphics_85,x:-29.0743,y:-5.5316}).wait(1).to({graphics:mask_graphics_86,x:-24.4346,y:-5.5316}).wait(1).to({graphics:mask_graphics_87,x:-19.7948,y:-5.5316}).wait(1).to({graphics:mask_graphics_88,x:-15.155,y:-5.5316}).wait(1).to({graphics:mask_graphics_89,x:-10.5152,y:-5.5316}).wait(1).to({graphics:mask_graphics_90,x:-5.8754,y:-5.5316}).wait(1).to({graphics:mask_graphics_91,x:-0.2273,y:-5.5316}).wait(18));

	// dessin_3
	this.instance = new lib.tableaumaison();
	this.instance.setTransform(-58,-69,0.3661,0.3661);
	this.instance._off = true;

	var maskedShapeInstanceList = [this.instance];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(73).to({_off:false},0).wait(36));

	// mask3 (mask)
	var mask_1 = new cjs.Shape();
	mask_1._off = true;
	var mask_1_graphics_37 = new cjs.Graphics().p("AnCsQIBsAAIAAYhIhsAAg");
	var mask_1_graphics_38 = new cjs.Graphics().p("AnCsQIDKAAIAAYhIjKAAg");
	var mask_1_graphics_39 = new cjs.Graphics().p("AnCsQIEnAAIAAYhIknAAg");
	var mask_1_graphics_40 = new cjs.Graphics().p("AnCsQIGFAAIAAYhImFAAg");
	var mask_1_graphics_41 = new cjs.Graphics().p("AnDsQIHiAAIAAYhIniAAg");
	var mask_1_graphics_42 = new cjs.Graphics().p("AnDsQIJAAAIAAYhIpAAAg");
	var mask_1_graphics_43 = new cjs.Graphics().p("AnDsQIKdAAIAAYhIqdAAg");
	var mask_1_graphics_44 = new cjs.Graphics().p("AnDsQIL7AAIAAYhIr7AAg");
	var mask_1_graphics_45 = new cjs.Graphics().p("AnEsQINZAAIAAYhItZAAg");
	var mask_1_graphics_46 = new cjs.Graphics().p("AnbsQIO3AAIAAYhIu3AAg");
	var mask_1_graphics_47 = new cjs.Graphics().p("AoKsQIQVAAIAAYhIwVAAg");
	var mask_1_graphics_48 = new cjs.Graphics().p("Ao5sQIRzAAIAAYhIxzAAg");
	var mask_1_graphics_49 = new cjs.Graphics().p("AposQITRAAIAAYhIzRAAg");
	var mask_1_graphics_50 = new cjs.Graphics().p("AqXsQIUvAAIAAYhI0vAAg");
	var mask_1_graphics_51 = new cjs.Graphics().p("ArFsQIWLAAIAAYhI2LAAg");
	var mask_1_graphics_52 = new cjs.Graphics().p("Ar0sQIXpAAIAAYhI3pAAg");
	var mask_1_graphics_53 = new cjs.Graphics().p("AsjsQIZHAAIAAYhI5HAAg");
	var mask_1_graphics_54 = new cjs.Graphics().p("AtSsQIalAAIAAYhI6lAAg");
	var mask_1_graphics_55 = new cjs.Graphics().p("AuBsQIcDAAIAAYhI8DAAg");

	this.timeline.addTween(cjs.Tween.get(mask_1).to({graphics:null,x:0,y:0}).wait(37).to({graphics:mask_1_graphics_37,x:-45.0732,y:-5.5316}).wait(1).to({graphics:mask_1_graphics_38,x:-45.098,y:-5.5316}).wait(1).to({graphics:mask_1_graphics_39,x:-45.1228,y:-5.5316}).wait(1).to({graphics:mask_1_graphics_40,x:-45.1476,y:-5.5316}).wait(1).to({graphics:mask_1_graphics_41,x:-45.1724,y:-5.5316}).wait(1).to({graphics:mask_1_graphics_42,x:-45.1972,y:-5.5316}).wait(1).to({graphics:mask_1_graphics_43,x:-45.222,y:-5.5316}).wait(1).to({graphics:mask_1_graphics_44,x:-45.2468,y:-5.5316}).wait(1).to({graphics:mask_1_graphics_45,x:-45.2716,y:-5.5316}).wait(1).to({graphics:mask_1_graphics_46,x:-42.9937,y:-5.5316}).wait(1).to({graphics:mask_1_graphics_47,x:-38.3539,y:-5.5316}).wait(1).to({graphics:mask_1_graphics_48,x:-33.7141,y:-5.5316}).wait(1).to({graphics:mask_1_graphics_49,x:-29.0743,y:-5.5316}).wait(1).to({graphics:mask_1_graphics_50,x:-24.4346,y:-5.5316}).wait(1).to({graphics:mask_1_graphics_51,x:-19.7948,y:-5.5316}).wait(1).to({graphics:mask_1_graphics_52,x:-15.155,y:-5.5316}).wait(1).to({graphics:mask_1_graphics_53,x:-10.5152,y:-5.5316}).wait(1).to({graphics:mask_1_graphics_54,x:-5.8754,y:-5.5316}).wait(1).to({graphics:mask_1_graphics_55,x:-0.2273,y:-5.5316}).wait(54));

	// dessin_2
	this.instance_1 = new lib.tableaufleur();
	this.instance_1.setTransform(-45,-49,0.3661,0.3661);
	this.instance_1._off = true;

	var maskedShapeInstanceList = [this.instance_1];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask_1;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(37).to({_off:false},0).to({_off:true},36).wait(36));

	// mask3 (mask)
	var mask_2 = new cjs.Shape();
	mask_2._off = true;
	var mask_2_graphics_1 = new cjs.Graphics().p("AnCsQIBsAAIAAYhIhsAAg");
	var mask_2_graphics_2 = new cjs.Graphics().p("AnCsQIDKAAIAAYhIjKAAg");
	var mask_2_graphics_3 = new cjs.Graphics().p("AnCsQIEnAAIAAYhIknAAg");
	var mask_2_graphics_4 = new cjs.Graphics().p("AnCsQIGFAAIAAYhImFAAg");
	var mask_2_graphics_5 = new cjs.Graphics().p("AnDsQIHiAAIAAYhIniAAg");
	var mask_2_graphics_6 = new cjs.Graphics().p("AnDsQIJAAAIAAYhIpAAAg");
	var mask_2_graphics_7 = new cjs.Graphics().p("AnDsQIKdAAIAAYhIqdAAg");
	var mask_2_graphics_8 = new cjs.Graphics().p("AnDsQIL7AAIAAYhIr7AAg");
	var mask_2_graphics_9 = new cjs.Graphics().p("AnEsQINZAAIAAYhItZAAg");
	var mask_2_graphics_10 = new cjs.Graphics().p("AnbsQIO3AAIAAYhIu3AAg");
	var mask_2_graphics_11 = new cjs.Graphics().p("AoKsQIQVAAIAAYhIwVAAg");
	var mask_2_graphics_12 = new cjs.Graphics().p("Ao5sQIRzAAIAAYhIxzAAg");
	var mask_2_graphics_13 = new cjs.Graphics().p("AposQITRAAIAAYhIzRAAg");
	var mask_2_graphics_14 = new cjs.Graphics().p("AqXsQIUvAAIAAYhI0vAAg");
	var mask_2_graphics_15 = new cjs.Graphics().p("ArFsQIWLAAIAAYhI2LAAg");
	var mask_2_graphics_16 = new cjs.Graphics().p("Ar0sQIXpAAIAAYhI3pAAg");
	var mask_2_graphics_17 = new cjs.Graphics().p("AsjsQIZHAAIAAYhI5HAAg");
	var mask_2_graphics_18 = new cjs.Graphics().p("AtSsQIalAAIAAYhI6lAAg");
	var mask_2_graphics_19 = new cjs.Graphics().p("AuBsQIcDAAIAAYhI8DAAg");

	this.timeline.addTween(cjs.Tween.get(mask_2).to({graphics:null,x:0,y:0}).wait(1).to({graphics:mask_2_graphics_1,x:-45.0732,y:-5.5316}).wait(1).to({graphics:mask_2_graphics_2,x:-45.098,y:-5.5316}).wait(1).to({graphics:mask_2_graphics_3,x:-45.1228,y:-5.5316}).wait(1).to({graphics:mask_2_graphics_4,x:-45.1476,y:-5.5316}).wait(1).to({graphics:mask_2_graphics_5,x:-45.1724,y:-5.5316}).wait(1).to({graphics:mask_2_graphics_6,x:-45.1972,y:-5.5316}).wait(1).to({graphics:mask_2_graphics_7,x:-45.222,y:-5.5316}).wait(1).to({graphics:mask_2_graphics_8,x:-45.2468,y:-5.5316}).wait(1).to({graphics:mask_2_graphics_9,x:-45.2716,y:-5.5316}).wait(1).to({graphics:mask_2_graphics_10,x:-42.9937,y:-5.5316}).wait(1).to({graphics:mask_2_graphics_11,x:-38.3539,y:-5.5316}).wait(1).to({graphics:mask_2_graphics_12,x:-33.7141,y:-5.5316}).wait(1).to({graphics:mask_2_graphics_13,x:-29.0743,y:-5.5316}).wait(1).to({graphics:mask_2_graphics_14,x:-24.4346,y:-5.5316}).wait(1).to({graphics:mask_2_graphics_15,x:-19.7948,y:-5.5316}).wait(1).to({graphics:mask_2_graphics_16,x:-15.155,y:-5.5316}).wait(1).to({graphics:mask_2_graphics_17,x:-10.5152,y:-5.5316}).wait(1).to({graphics:mask_2_graphics_18,x:-5.8754,y:-5.5316}).wait(1).to({graphics:mask_2_graphics_19,x:-0.2273,y:-5.5316}).wait(18).to({graphics:null,x:0,y:0}).wait(72));

	// dessin_1
	this.instance_2 = new lib.tableausoleil();
	this.instance_2.setTransform(-68,-69,0.3661,0.3661);
	this.instance_2._off = true;

	var maskedShapeInstanceList = [this.instance_2];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask_2;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1).to({_off:false},0).to({_off:true},36).wait(72));

	// tableau
	this.instance_3 = new lib.tableau();
	this.instance_3.setTransform(-164,-89,0.3661,0.3661);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(109));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-164,-89,327.6,176.8);


(lib.savon_pompe = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.savonpompe();
	this.instance.setTransform(-37.65,-16.85,0.3439,0.3439);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.savon_pompe, new cjs.Rectangle(-37.6,-16.8,75.30000000000001,33.7), null);


(lib.savon_goutte = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.gouttesavon();
	this.instance.setTransform(-15.5,-21.35,0.3439,0.3439);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.savon_goutte, new cjs.Rectangle(-15.5,-21.3,31,42.6), null);


(lib.savon_bouteille = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.savon();
	this.instance.setTransform(-40.45,-52.85,0.4148,0.4148);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.savon_bouteille, new cjs.Rectangle(-40.4,-52.8,80.9,105.69999999999999), null);


(lib.mc_sandwich = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(23));

	// Layer_1
	this.instance = new lib.sandwich1();
	this.instance.setTransform(-32.3,-34.45,0.3822,0.3822);

	this.instance_1 = new lib.sandwich2();
	this.instance_1.setTransform(-30,-29,0.3822,0.3822);

	this.instance_2 = new lib.sandwich3();
	this.instance_2.setTransform(-31,-19,0.4639,0.4639);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},8).to({state:[{t:this.instance_2}]},7).wait(8));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-32.3,-34.4,79.5,62.3);


(lib.mc_pomme = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(23));

	// Layer_1
	this.instance = new lib.pomme1();
	this.instance.setTransform(-32.3,-34.45,0.3822,0.3822);

	this.instance_1 = new lib.pomme2();
	this.instance_1.setTransform(-30,-34,0.3822,0.3822);

	this.instance_2 = new lib.pomme3();
	this.instance_2.setTransform(-22,-33,0.3377,0.3377);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},8).to({state:[{t:this.instance_2}]},7).wait(8));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-32.3,-34.4,64.6,68.5);


(lib.mc_fenetre_info = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.fenetre();
	this.instance.setTransform(-418.35,-270.45,0.6821,0.6821);

	this.instance_1 = new lib.CachedBmp_10();
	this.instance_1.setTransform(-568.95,-411.1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_fenetre_info, new cjs.Rectangle(-568.9,-411.1,1138,822), null);


(lib.mc_bloc_vert = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.bloctriangle();
	this.instance.setTransform(-27.4,-24,0.3113,0.3113);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_bloc_vert, new cjs.Rectangle(-27.4,-24,54.8,48), null);


(lib.mc_bloc_rouge = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.blocrectanglerouge();
	this.instance.setTransform(-19.35,30.25,0.4034,0.4034,-90);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_bloc_rouge, new cjs.Rectangle(-19.3,-30.2,38.7,60.5), null);


(lib.mc_bloc_orange = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.bloccube();
	this.instance.setTransform(-19.8,-18.15,0.4034,0.4034);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_bloc_orange, new cjs.Rectangle(-19.8,-18.1,39.6,36.3), null);


(lib.mc_bloc_bleu = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.blocrectanglebleu();
	this.instance.setTransform(-19.4,32.7,0.4034,0.4034,-90);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_bloc_bleu, new cjs.Rectangle(-19.4,-32.6,38.8,65.30000000000001), null);


(lib.mc_banane = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(23));

	// Layer_1
	this.instance = new lib.banane1();
	this.instance.setTransform(-28,-39,0.3662,0.3662);

	this.instance_1 = new lib.banane2();
	this.instance_1.setTransform(-30,-34,0.3822,0.3822);

	this.instance_2 = new lib.banane3();
	this.instance_2.setTransform(-28,-18,0.3377,0.3377);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},8).to({state:[{t:this.instance_2}]},7).wait(8));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-30,-39,73.4,67.8);


(lib.mc_auto_anim = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.auto();
	this.instance.setTransform(-50.6,-33.4,0.3407,0.3407);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_auto_anim, new cjs.Rectangle(-50.6,-33.4,101.2,66.8), null);


(lib.clickzone = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_11();
	this.instance.setTransform(-164.8,-124.05,0.4252,0.4252);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.clickzone, new cjs.Rectangle(-164.8,-124,329.6,247.9), null);


(lib.camion_benne = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.camionbenne();
	this.instance.setTransform(-58,-41,0.3744,0.4452,7.2215);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.camion_benne, new cjs.Rectangle(-66.4,-41,132.8,82), null);


(lib.camion_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.camion();
	this.instance.setTransform(-60.6,-35.45,0.3974,0.3181);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.camion_1, new cjs.Rectangle(-60.6,-35.4,121.2,70.9), null);


(lib.boutongenerique = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.boutonplay();
	this.instance.setTransform(-196,-148);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.boutongenerique, new cjs.Rectangle(-196,-148,387,286), null);


(lib.stationlecture = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{"start":0,cochons:1,lion:37,princesse:73});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
		
		this.Interact = function (choice) {
			switch (choice) {
				case 1:
					this.gotoAndPlay("cochons");
					break;
				case 2:
					this.gotoAndPlay("princesse");
					break;
				case 3:
					this.gotoAndPlay("lion");
					break;
				default:
					console.log("livre : choice not supported");
		
			}
		}
	}
	this.frame_36 = function() {
		this.gotoAndStop("start");
	}
	this.frame_72 = function() {
		this.gotoAndStop("start");
	}
	this.frame_108 = function() {
		this.gotoAndStop("start");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(36).call(this.frame_36).wait(36).call(this.frame_72).wait(36).call(this.frame_108).wait(1));

	// livre_anim
	this.instance = new lib.livreferme();
	this.instance.setTransform(3,18,0.3523,0.3523);

	this.instance_1 = new lib.livreouvre();
	this.instance_1.setTransform(0,3,0.3523,0.3523);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},6).to({state:[]},6).to({state:[{t:this.instance}]},25).to({state:[{t:this.instance_1}]},5).to({state:[]},6).to({state:[{t:this.instance}]},25).to({state:[{t:this.instance_1}]},5).to({state:[]},6).to({state:[]},1).wait(24));

	// livre_3
	this.instance_2 = new lib.livrecochons();
	this.instance_2.setTransform(-34,13,0.3523,0.3523);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(12).to({_off:false},0).to({_off:true},25).wait(72));

	// livre_2
	this.instance_3 = new lib.livrelion();
	this.instance_3.setTransform(-31,13,0.3523,0.3523);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(48).to({_off:false},0).to({_off:true},25).wait(36));

	// livre_1
	this.instance_4 = new lib.livreprincesse();
	this.instance_4.setTransform(-33,10,0.3523,0.3523);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(84).to({_off:false},0).wait(25));

	// coussin
	this.instance_5 = new lib.coussin();
	this.instance_5.setTransform(-180,91.65,0.5051,0.5051,-90);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(109));

	// pile_livre
	this.instance_6 = new lib.livrepiles();
	this.instance_6.setTransform(-21,-164,0.389,0.389);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(109));

	// Layer_2
	this.instance_7 = new lib.clickzone();
	this.instance_7.setTransform(35.75,-85.55,0.4236,0.6899);

	this.instance_8 = new lib.clickzone();
	this.instance_8.setTransform(-28.45,40.5,1,0.7843);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_8},{t:this.instance_7}]}).wait(109));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-193.2,-171.1,329.5,308.79999999999995);


(lib.station_savon = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(27));

	// bouteille
	this.instance = new lib.savon_bouteille();
	this.instance.setTransform(11.45,12.85);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(27));

	// pompe
	this.instance_1 = new lib.savon_pompe();
	this.instance_1.setTransform(-9.15,-51.15);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({y:-43.3},15).to({y:-51.15},11).wait(1));

	// goutte
	this.instance_2 = new lib.savon_goutte();
	this.instance_2.setTransform(-36.8,-49.1,0.267,0.267);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(15).to({_off:false},0).to({regX:-0.1,scaleX:0.5971,scaleY:0.5971,y:-33.3},5).to({regX:-0.2,x:-36.85,y:4.45},3).to({regX:-0.1,x:-36.8,y:42.3,alpha:0},3).wait(1));

	// Layer_2
	this.instance_3 = new lib.clickzone();
	this.instance_3.setTransform(-0.45,-13.95,0.5176,0.6936,0,0,0,-0.1,-0.1);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(27));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-85.7,-99.9,170.60000000000002,171.9);


(lib.station_ordinateur = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{"start":0,lettres:1,animaux:37,insectes:73});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
		
		this.Interact = function (choice) {
			switch (choice) {
				case 1:
					this.gotoAndPlay("lettres");
					break;
				case 2:
					this.gotoAndPlay("animaux");
					break;
				case 3:
					this.gotoAndPlay("insectes");
					break;
				default:
					console.log("ordi : choice not supported");
		
			}
		}
	}
	this.frame_36 = function() {
		this.gotoAndStop("start");
	}
	this.frame_72 = function() {
		this.gotoAndStop("start");
	}
	this.frame_108 = function() {
		this.gotoAndStop("start");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(36).call(this.frame_36).wait(36).call(this.frame_72).wait(36).call(this.frame_108).wait(1));

	// mask3 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_1 = new cjs.Graphics().p("AnPsQIBsAAIAAYhIhsAAg");
	var mask_graphics_2 = new cjs.Graphics().p("AnPsQIDJAAIAAYhIjJAAg");
	var mask_graphics_3 = new cjs.Graphics().p("AnPsQIEnAAIAAYhIknAAg");
	var mask_graphics_4 = new cjs.Graphics().p("AnQsQIGGAAIAAYhImGAAg");
	var mask_graphics_5 = new cjs.Graphics().p("AnQsQIHiAAIAAYhIniAAg");
	var mask_graphics_6 = new cjs.Graphics().p("AnQsQIJAAAIAAYhIpAAAg");
	var mask_graphics_7 = new cjs.Graphics().p("AnQsQIKdAAIAAYhIqdAAg");
	var mask_graphics_8 = new cjs.Graphics().p("AnRsQIL8AAIAAYhIr8AAg");
	var mask_graphics_9 = new cjs.Graphics().p("AnRsQINZAAIAAYhItZAAg");
	var mask_graphics_10 = new cjs.Graphics().p("AnbsQIO3AAIAAYhIu3AAg");
	var mask_graphics_11 = new cjs.Graphics().p("AoKsQIQVAAIAAYhIwVAAg");
	var mask_graphics_12 = new cjs.Graphics().p("Ao5sQIRzAAIAAYhIxzAAg");
	var mask_graphics_13 = new cjs.Graphics().p("AposQITRAAIAAYhIzRAAg");
	var mask_graphics_14 = new cjs.Graphics().p("AqXsQIUvAAIAAYhI0vAAg");
	var mask_graphics_15 = new cjs.Graphics().p("ArFsQIWLAAIAAYhI2LAAg");
	var mask_graphics_16 = new cjs.Graphics().p("Ar0sQIXpAAIAAYhI3pAAg");
	var mask_graphics_17 = new cjs.Graphics().p("AsjsQIZHAAIAAYhI5HAAg");
	var mask_graphics_18 = new cjs.Graphics().p("AtSsQIalAAIAAYhI6lAAg");
	var mask_graphics_19 = new cjs.Graphics().p("AuBsQIcDAAIAAYhI8DAAg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:null,x:0,y:0}).wait(1).to({graphics:mask_graphics_1,x:-46.3982,y:-53.4816}).wait(1).to({graphics:mask_graphics_2,x:-46.423,y:-53.4816}).wait(1).to({graphics:mask_graphics_3,x:-46.4478,y:-53.4816}).wait(1).to({graphics:mask_graphics_4,x:-46.4726,y:-53.4816}).wait(1).to({graphics:mask_graphics_5,x:-46.4974,y:-53.4816}).wait(1).to({graphics:mask_graphics_6,x:-46.5222,y:-53.4816}).wait(1).to({graphics:mask_graphics_7,x:-46.547,y:-53.4816}).wait(1).to({graphics:mask_graphics_8,x:-46.5718,y:-53.4816}).wait(1).to({graphics:mask_graphics_9,x:-46.5966,y:-53.4816}).wait(1).to({graphics:mask_graphics_10,x:-45.6437,y:-53.4816}).wait(1).to({graphics:mask_graphics_11,x:-41.0039,y:-53.4816}).wait(1).to({graphics:mask_graphics_12,x:-36.3641,y:-53.4816}).wait(1).to({graphics:mask_graphics_13,x:-31.7243,y:-53.4816}).wait(1).to({graphics:mask_graphics_14,x:-27.0845,y:-53.4816}).wait(1).to({graphics:mask_graphics_15,x:-22.4448,y:-53.4816}).wait(1).to({graphics:mask_graphics_16,x:-17.805,y:-53.4816}).wait(1).to({graphics:mask_graphics_17,x:-13.1652,y:-53.4816}).wait(1).to({graphics:mask_graphics_18,x:-8.5254,y:-53.4816}).wait(1).to({graphics:mask_graphics_19,x:-2.8773,y:-53.4816}).wait(18).to({graphics:null,x:0,y:0}).wait(72));

	// image_3
	this.instance = new lib.ecranchiffres();
	this.instance.setTransform(-82,-104,0.3139,0.3139);
	this.instance._off = true;

	var maskedShapeInstanceList = [this.instance];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({_off:false},0).to({_off:true},36).wait(72));

	// mask2 (mask)
	var mask_1 = new cjs.Shape();
	mask_1._off = true;
	var mask_1_graphics_73 = new cjs.Graphics().p("AnPsQIBsAAIAAYhIhsAAg");
	var mask_1_graphics_74 = new cjs.Graphics().p("AnPsQIDJAAIAAYhIjJAAg");
	var mask_1_graphics_75 = new cjs.Graphics().p("AnPsQIEnAAIAAYhIknAAg");
	var mask_1_graphics_76 = new cjs.Graphics().p("AnQsQIGGAAIAAYhImGAAg");
	var mask_1_graphics_77 = new cjs.Graphics().p("AnQsQIHiAAIAAYhIniAAg");
	var mask_1_graphics_78 = new cjs.Graphics().p("AnQsQIJAAAIAAYhIpAAAg");
	var mask_1_graphics_79 = new cjs.Graphics().p("AnQsQIKdAAIAAYhIqdAAg");
	var mask_1_graphics_80 = new cjs.Graphics().p("AnRsQIL8AAIAAYhIr8AAg");
	var mask_1_graphics_81 = new cjs.Graphics().p("AnRsQINZAAIAAYhItZAAg");
	var mask_1_graphics_82 = new cjs.Graphics().p("AnbsQIO3AAIAAYhIu3AAg");
	var mask_1_graphics_83 = new cjs.Graphics().p("AoKsQIQVAAIAAYhIwVAAg");
	var mask_1_graphics_84 = new cjs.Graphics().p("Ao5sQIRzAAIAAYhIxzAAg");
	var mask_1_graphics_85 = new cjs.Graphics().p("AposQITRAAIAAYhIzRAAg");
	var mask_1_graphics_86 = new cjs.Graphics().p("AqXsQIUvAAIAAYhI0vAAg");
	var mask_1_graphics_87 = new cjs.Graphics().p("ArFsQIWLAAIAAYhI2LAAg");
	var mask_1_graphics_88 = new cjs.Graphics().p("Ar0sQIXpAAIAAYhI3pAAg");
	var mask_1_graphics_89 = new cjs.Graphics().p("AsjsQIZHAAIAAYhI5HAAg");
	var mask_1_graphics_90 = new cjs.Graphics().p("AtSsQIalAAIAAYhI6lAAg");
	var mask_1_graphics_91 = new cjs.Graphics().p("AuBsQIcDAAIAAYhI8DAAg");

	this.timeline.addTween(cjs.Tween.get(mask_1).to({graphics:null,x:0,y:0}).wait(73).to({graphics:mask_1_graphics_73,x:-46.3982,y:-53.4816}).wait(1).to({graphics:mask_1_graphics_74,x:-46.423,y:-53.4816}).wait(1).to({graphics:mask_1_graphics_75,x:-46.4478,y:-53.4816}).wait(1).to({graphics:mask_1_graphics_76,x:-46.4726,y:-53.4816}).wait(1).to({graphics:mask_1_graphics_77,x:-46.4974,y:-53.4816}).wait(1).to({graphics:mask_1_graphics_78,x:-46.5222,y:-53.4816}).wait(1).to({graphics:mask_1_graphics_79,x:-46.547,y:-53.4816}).wait(1).to({graphics:mask_1_graphics_80,x:-46.5718,y:-53.4816}).wait(1).to({graphics:mask_1_graphics_81,x:-46.5966,y:-53.4816}).wait(1).to({graphics:mask_1_graphics_82,x:-45.6437,y:-53.4816}).wait(1).to({graphics:mask_1_graphics_83,x:-41.0039,y:-53.4816}).wait(1).to({graphics:mask_1_graphics_84,x:-36.3641,y:-53.4816}).wait(1).to({graphics:mask_1_graphics_85,x:-31.7243,y:-53.4816}).wait(1).to({graphics:mask_1_graphics_86,x:-27.0845,y:-53.4816}).wait(1).to({graphics:mask_1_graphics_87,x:-22.4448,y:-53.4816}).wait(1).to({graphics:mask_1_graphics_88,x:-17.805,y:-53.4816}).wait(1).to({graphics:mask_1_graphics_89,x:-13.1652,y:-53.4816}).wait(1).to({graphics:mask_1_graphics_90,x:-8.5254,y:-53.4816}).wait(1).to({graphics:mask_1_graphics_91,x:-2.8773,y:-53.4816}).wait(18));

	// image_2
	this.instance_1 = new lib.ecraninsectes();
	this.instance_1.setTransform(-79,-105,0.3139,0.3139);
	this.instance_1._off = true;

	var maskedShapeInstanceList = [this.instance_1];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask_1;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(73).to({_off:false},0).wait(36));

	// mask1 (mask)
	var mask_2 = new cjs.Shape();
	mask_2._off = true;
	var mask_2_graphics_37 = new cjs.Graphics().p("AnPsQIBsAAIAAYhIhsAAg");
	var mask_2_graphics_38 = new cjs.Graphics().p("AnPsQIDJAAIAAYhIjJAAg");
	var mask_2_graphics_39 = new cjs.Graphics().p("AnPsQIEnAAIAAYhIknAAg");
	var mask_2_graphics_40 = new cjs.Graphics().p("AnQsQIGGAAIAAYhImGAAg");
	var mask_2_graphics_41 = new cjs.Graphics().p("AnQsQIHiAAIAAYhIniAAg");
	var mask_2_graphics_42 = new cjs.Graphics().p("AnQsQIJAAAIAAYhIpAAAg");
	var mask_2_graphics_43 = new cjs.Graphics().p("AnQsQIKdAAIAAYhIqdAAg");
	var mask_2_graphics_44 = new cjs.Graphics().p("AnRsQIL8AAIAAYhIr8AAg");
	var mask_2_graphics_45 = new cjs.Graphics().p("AnRsQINZAAIAAYhItZAAg");
	var mask_2_graphics_46 = new cjs.Graphics().p("AnbsQIO3AAIAAYhIu3AAg");
	var mask_2_graphics_47 = new cjs.Graphics().p("AoKsQIQVAAIAAYhIwVAAg");
	var mask_2_graphics_48 = new cjs.Graphics().p("Ao5sQIRzAAIAAYhIxzAAg");
	var mask_2_graphics_49 = new cjs.Graphics().p("AposQITRAAIAAYhIzRAAg");
	var mask_2_graphics_50 = new cjs.Graphics().p("AqXsQIUvAAIAAYhI0vAAg");
	var mask_2_graphics_51 = new cjs.Graphics().p("ArFsQIWLAAIAAYhI2LAAg");
	var mask_2_graphics_52 = new cjs.Graphics().p("Ar0sQIXpAAIAAYhI3pAAg");
	var mask_2_graphics_53 = new cjs.Graphics().p("AsjsQIZHAAIAAYhI5HAAg");
	var mask_2_graphics_54 = new cjs.Graphics().p("AtSsQIalAAIAAYhI6lAAg");
	var mask_2_graphics_55 = new cjs.Graphics().p("AuBsQIcDAAIAAYhI8DAAg");

	this.timeline.addTween(cjs.Tween.get(mask_2).to({graphics:null,x:0,y:0}).wait(37).to({graphics:mask_2_graphics_37,x:-46.3982,y:-53.4816}).wait(1).to({graphics:mask_2_graphics_38,x:-46.423,y:-53.4816}).wait(1).to({graphics:mask_2_graphics_39,x:-46.4478,y:-53.4816}).wait(1).to({graphics:mask_2_graphics_40,x:-46.4726,y:-53.4816}).wait(1).to({graphics:mask_2_graphics_41,x:-46.4974,y:-53.4816}).wait(1).to({graphics:mask_2_graphics_42,x:-46.5222,y:-53.4816}).wait(1).to({graphics:mask_2_graphics_43,x:-46.547,y:-53.4816}).wait(1).to({graphics:mask_2_graphics_44,x:-46.5718,y:-53.4816}).wait(1).to({graphics:mask_2_graphics_45,x:-46.5966,y:-53.4816}).wait(1).to({graphics:mask_2_graphics_46,x:-45.6437,y:-53.4816}).wait(1).to({graphics:mask_2_graphics_47,x:-41.0039,y:-53.4816}).wait(1).to({graphics:mask_2_graphics_48,x:-36.3641,y:-53.4816}).wait(1).to({graphics:mask_2_graphics_49,x:-31.7243,y:-53.4816}).wait(1).to({graphics:mask_2_graphics_50,x:-27.0845,y:-53.4816}).wait(1).to({graphics:mask_2_graphics_51,x:-22.4448,y:-53.4816}).wait(1).to({graphics:mask_2_graphics_52,x:-17.805,y:-53.4816}).wait(1).to({graphics:mask_2_graphics_53,x:-13.1652,y:-53.4816}).wait(1).to({graphics:mask_2_graphics_54,x:-8.5254,y:-53.4816}).wait(1).to({graphics:mask_2_graphics_55,x:-2.8773,y:-53.4816}).wait(54));

	// image_1
	this.instance_2 = new lib.ecran_animaux();
	this.instance_2.setTransform(-82,-104,0.3139,0.3139);
	this.instance_2._off = true;

	var maskedShapeInstanceList = [this.instance_2];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask_2;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(37).to({_off:false},0).to({_off:true},36).wait(36));

	// souris
	this.instance_3 = new lib.souris();
	this.instance_3.setTransform(69,37,0.3139,0.3139);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(109));

	// ecran
	this.instance_4 = new lib.ecran();
	this.instance_4.setTransform(-100,-122,0.3461,0.3461);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(109));

	// bureau
	this.instance_5 = new lib.bureauordi();
	this.instance_5.setTransform(-116,25,0.3373,0.3373);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(109));

	// Layer_2
	this.instance_6 = new lib.clickzone();
	this.instance_6.setTransform(0.5,-0.85,0.707,1);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(109));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-116,-124.9,233.8,248.10000000000002);


(lib.station_musique = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
		
		this.Interact = function() {
			console.log("interaction auto");
			this.camion.gotoAndPlay(1);
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(2));

	// baguette_4
	this.instance = new lib.baguette2();
	this.instance.setTransform(-115.3,83.1,0.2866,0.2866,-120.0006);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true},1).wait(1));

	// baguette_3
	this.instance_1 = new lib.baguette1();
	this.instance_1.setTransform(-100.55,74.55,0.2866,0.2866,-120.0006);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({_off:true},1).wait(1));

	// baguette_2
	this.instance_2 = new lib.baguette1();
	this.instance_2.setTransform(98.8,30.35,0.3117,0.3117,-59.9984);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({_off:true},1).wait(1));

	// baguette_1
	this.instance_3 = new lib.baguette2();
	this.instance_3.setTransform(80.8,23.45,0.3117,0.3117,-59.9984);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).to({_off:true},1).wait(1));

	// trompette
	this.instance_4 = new lib.trompette();
	this.instance_4.setTransform(-147.6,-59.9,0.402,0.402,-14.9978);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).to({_off:true},1).wait(1));

	// xylophone
	this.instance_5 = new lib.xylophone();
	this.instance_5.setTransform(-77,7,0.402,0.402);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).to({_off:true},1).wait(1));

	// tambour
	this.instance_6 = new lib.tambour();
	this.instance_6.setTransform(8,-60,0.402,0.402);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).to({_off:true},1).wait(1));

	// Layer_7
	this.instance_7 = new lib.CachedBmp_15();
	this.instance_7.setTransform(39.75,83.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).to({_off:true},1).wait(1));

	// Layer_2
	this.instance_8 = new lib.clickzone();
	this.instance_8.setTransform(0.1,-2,0.9454,0.7662,0,0,0,0,-0.1);
	this.instance_8._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(1).to({_off:false},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-155.7,-96.9,311.6,209.5);


(lib.station_lunch = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{"start":0,pomme:1,banane:33,sandwich:65});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
		
		this.Interact = function (choice) {
			switch (choice) {
				case 1:
					this.gotoAndPlay("pomme");
					break;
				case 2:
					this.gotoAndPlay("banane");
					break;
				case 3:
					this.gotoAndPlay("sandwich");
					break;
				default:
					console.log("lunch : choice not supported");
		
			}
		}
	}
	this.frame_32 = function() {
		this.gotoAndStop("start");
	}
	this.frame_64 = function() {
		this.gotoAndStop("start");
	}
	this.frame_96 = function() {
		this.gotoAndStop("start");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(32).call(this.frame_32).wait(32).call(this.frame_64).wait(32).call(this.frame_96).wait(1));

	// devant_boite_masque (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_1 = new cjs.Graphics().p("Ar8FuIAAqzIX5AAIAAKzg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:null,x:0,y:0}).wait(1).to({graphics:mask_graphics_1,x:-44.475,y:36.65}).wait(96));

	// Layer_7
	this.instance = new lib.boiteouverte();
	this.instance.setTransform(-107,-65,0.3822,0.3822);
	this.instance._off = true;

	var maskedShapeInstanceList = [this.instance];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({_off:false},0).wait(96));

	// pomme
	this.instance_1 = new lib.mc_pomme();
	this.instance_1.setTransform(-50.55,-10.4);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1).to({_off:false},0).wait(4).to({x:4.15,y:-45.8},0).to({x:63.75,y:-4.8},4).wait(1).to({mode:"synched",startPosition:0},0).to({_off:true},23).wait(64));

	// banane
	this.instance_2 = new lib.mc_banane();
	this.instance_2.setTransform(-50.55,-10.4);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(33).to({_off:false},0).wait(4).to({x:4.15,y:-45.8},0).to({x:63.75,y:-4.8},4).wait(1).to({mode:"synched",startPosition:0},0).to({_off:true},23).wait(32));

	// sandwich
	this.instance_3 = new lib.mc_sandwich();
	this.instance_3.setTransform(-50.55,-10.4);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(65).to({_off:false},0).wait(4).to({x:4.15,y:-45.8},0).to({x:63.75,y:-4.8},4).wait(1).to({mode:"synched",startPosition:0},0).wait(23));

	// boite
	this.instance_4 = new lib.boitefermee();
	this.instance_4.setTransform(-109,-29,0.3822,0.3822);

	this.instance_5 = new lib.boiteouverte();
	this.instance_5.setTransform(-107,-65,0.3822,0.3822);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4}]}).to({state:[{t:this.instance_5}]},1).wait(96));

	// table
	this.instance_6 = new lib.table();
	this.instance_6.setTransform(-129,-65,0.2767,0.2624);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(97));

	// Layer_2
	this.instance_7 = new lib.clickzone();
	this.instance_7.setTransform(-1.6,-0.2,0.7898,0.5708,0,0,0,0,-0.1);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(97));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-131.7,-84.8,260.29999999999995,155.5);


(lib.station_jouets = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
		
		this.Interact = function() {
			console.log("interaction auto");
			this.camion.gotoAndPlay(1);
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(2));

	// ourson
	this.instance = new lib.ourstete();
	this.instance.setTransform(-135,-52,0.3683,0.3683);

	this.instance_1 = new lib.ourspatte4();
	this.instance_1.setTransform(-125,44,0.3683,0.3683);

	this.instance_2 = new lib.ourspatte3();
	this.instance_2.setTransform(-100,50,0.3683,0.3683);

	this.instance_3 = new lib.ourspatte2();
	this.instance_3.setTransform(-135,8,0.3683,0.3683);

	this.instance_4 = new lib.ourspatte1();
	this.instance_4.setTransform(-88,-6,0.3683,0.3683);

	this.instance_5 = new lib.ourscorps();
	this.instance_5.setTransform(-125,-6,0.3683,0.3683);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).to({state:[]},1).wait(1));

	// poupee
	this.instance_6 = new lib.poupeetete();
	this.instance_6.setTransform(-28,-94,0.3683,0.3683);

	this.instance_7 = new lib.poupeecorps();
	this.instance_7.setTransform(-18,-32,0.3683,0.3683);

	this.instance_8 = new lib.poupeebras2();
	this.instance_8.setTransform(18,-23,0.3683,0.3683);

	this.instance_9 = new lib.poupeebras1();
	this.instance_9.setTransform(4.1,-4.2,0.3683,0.3683,180);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6}]}).to({state:[]},1).wait(1));

	// dino
	this.instance_10 = new lib.dinobouche();
	this.instance_10.setTransform(70,-5,0.3683,0.3683);

	this.instance_11 = new lib.dinobras();
	this.instance_11.setTransform(57,19,0.3683,0.3683);

	this.instance_12 = new lib.dinocorps();
	this.instance_12.setTransform(65,-31,0.3683,0.3683);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_12},{t:this.instance_11},{t:this.instance_10}]}).to({state:[]},1).wait(1));

	// Layer_7
	this.instance_13 = new lib.CachedBmp_15();
	this.instance_13.setTransform(-15.55,82.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_13).to({_off:true},1).wait(1));

	// Layer_2
	this.instance_14 = new lib.clickzone();
	this.instance_14.setTransform(-5.05,2,0.8918,0.8256,0,0,0,-0.3,-0.1);
	this.instance_14._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_14).wait(1).to({_off:false},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-151.7,-100.3,302.9,211.6);


(lib.station_bricolage = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
		
		this.Interact = function() {
			console.log("interaction auto");
			this.camion.gotoAndPlay(1);
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(2));

	// Layer_7
	this.instance = new lib.CachedBmp_15();
	this.instance.setTransform(39.75,83.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true},1).wait(1));

	// ciseau
	this.instance_1 = new lib.ciseauouvert();
	this.instance_1.setTransform(81,-27,0.3911,0.3911);

	this.instance_2 = new lib.ciseauferme();
	this.instance_2.setTransform(94,-27,0.3911,0.3911);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1}]}).to({state:[{t:this.instance_1},{t:this.instance_2}]},1).wait(1));

	// feuille_decoupage
	this.instance_3 = new lib.decoupefeuille();
	this.instance_3.setTransform(82.9,-64,0.3911,0.3911,14.9981);

	this.instance_4 = new lib.decoupefeuille();
	this.instance_4.setTransform(18,-83,0.3911,0.3911);

	this.instance_5 = new lib.decoupeetoile();
	this.instance_5.setTransform(118,-98,0.3911,0.3911);

	this.instance_6 = new lib.decoupecoeur();
	this.instance_6.setTransform(111,-91,0.3911,0.3911);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3}]}).to({state:[]},1).wait(1));

	// crayon
	this.instance_7 = new lib.crayonrouge();
	this.instance_7.setTransform(-65.55,50.35,0.3911,0.3911,-45);

	this.instance_8 = new lib.crayonbleu();
	this.instance_8.setTransform(-26.05,57.45,0.3911,0.3911,-59.9989);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_8},{t:this.instance_7}]}).to({state:[]},1).wait(1));

	// feuille_dessin
	this.instance_9 = new lib.dessinnature();
	this.instance_9.setTransform(-157,-83,0.3912,0.3912);

	this.instance_10 = new lib.dessinbateau();
	this.instance_10.setTransform(-161,-83,0.3911,0.3911);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_10},{t:this.instance_9}]}).to({state:[]},1).wait(1));

	// table
	this.instance_11 = new lib.table();
	this.instance_11.setTransform(-185,-103,0.3985,0.3985);

	this.timeline.addTween(cjs.Tween.get(this.instance_11).to({_off:true},1).wait(1));

	// Layer_2
	this.instance_12 = new lib.clickzone();
	this.instance_12.setTransform(0.95,-0.45,1.1759,0.8831);
	this.instance_12._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(1).to({_off:false},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-192.8,-110,387.5,222.6);


(lib.mc_camion = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(22));

	// benne
	this.instance = new lib.camion_benne();
	this.instance.setTransform(55.3,22.6,1,1,0,0,0,51.8,34.9);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regY:34.8,rotation:29.9992,y:22.55},10).to({regY:34.9,rotation:0,y:22.6},11).wait(1));

	// Layer_1
	this.instance_1 = new lib.camion_1();
	this.instance_1.setTransform(-9.35,17.8);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(22));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-69.9,-102.2,175.8,155.5);


(lib.mc_blocs = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(27));

	// vert
	this.instance = new lib.mc_bloc_vert();
	this.instance.setTransform(-16.7,-14.4,1,1,0,0,0,-23.1,17.6);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({rotation:10.2201,x:-16.75,y:-14.45},3).wait(1).to({regX:23.9,regY:20.2,x:29,y:-3.5},0).to({rotation:-4.7791,y:-3.55},1).wait(1).to({regX:-22.4,regY:16.1,x:-17.45,y:-3.8},0).to({regY:16,rotation:25.2195,x:-17.5,y:-3.95},4).wait(1).to({regX:23.9,regY:20.9,x:22.25,y:20.25},0).to({regX:24.9,regY:20.1,scaleX:0.9999,scaleY:0.9999,rotation:145.2206,x:23.6,y:20.05},7).wait(9));

	// rouge
	this.instance_1 = new lib.mc_bloc_rouge();
	this.instance_1.setTransform(13.55,49.05,1,1,0,0,0,-12.8,25.8);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(2).to({rotation:-55.7883,x:13.7,y:49.15},8).wait(17));

	// bleu
	this.instance_2 = new lib.mc_bloc_bleu();
	this.instance_2.setTransform(-30.7,49.55,1,1,0,0,0,-13.1,26.9);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(5).to({regX:-13.2,rotation:-71.4639,x:-30.65,y:49.6},6).wait(16));

	// orange
	this.instance_3 = new lib.mc_bloc_orange();
	this.instance_3.setTransform(-78.4,54.55,1,1,0,0,0,-15.2,12.4);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(8).to({regY:12.5,rotation:-37.4609,x:-114.35,y:47.6},4).to({regX:-15.3,regY:12.4,scaleX:0.9999,scaleY:0.9999,rotation:-91.9396,x:-145.85,y:51.85},4).wait(11));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-177.5,-56.2,269.2,116.5);


(lib.mc_auto = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(25));

	// Layer_1
	this.instance = new lib.mc_auto_anim();

	this.timeline.addTween(cjs.Tween.get(this.instance).to({x:59.9,y:20.4},4).to({x:135.4,y:-2.4},4).to({skewY:180,x:112.6,y:-38.35},4).to({x:23.9,y:-23.95},4).to({skewY:0,x:-33.6,y:4.8},4).to({x:0,y:0},4).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-84.2,-104.3,270.2,178.8);


(lib.station_auto = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	this.isSingleFrame = false;
	// timeline functions:
	this.frame_0 = function() {
		if(this.isSingleFrame) {
			return;
		}
		if(this.totalFrames == 1) {
			this.isSingleFrame = true;
		}
		this.stop();
		
		this.Interact = function() {
			console.log("interaction auto");
			this.camion.gotoAndPlay(1);
		}
		
		this.Interact = function (choice) {
			switch (choice) {
				case 1:
					this.camion.gotoAndPlay(1);
					break;
				case 2:
					this.blocs.gotoAndPlay(1);
					break;
				case 3:
					this.auto.gotoAndPlay(1);
					break;
				default:
					console.log("livre : choice not supported");
		
			}
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// camion
	this.camion = new lib.mc_camion();
	this.camion.name = "camion";
	this.camion.setTransform(-78.05,8.65);

	this.timeline.addTween(cjs.Tween.get(this.camion).wait(1));

	// auto
	this.auto = new lib.mc_auto();
	this.auto.name = "auto";
	this.auto.setTransform(43.6,-72.6);

	this.timeline.addTween(cjs.Tween.get(this.auto).wait(1));

	// blocs
	this.blocs = new lib.mc_blocs();
	this.blocs.name = "blocs";
	this.blocs.setTransform(89.25,49.65);

	this.timeline.addTween(cjs.Tween.get(this.blocs).wait(1));

	// Layer_2
	this.instance = new lib.clickzone();
	this.instance.setTransform(3.05,-1.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.station_auto, new cjs.Rectangle(-161.7,-125.7,329.5,247.9), null);


// stage content:
(lib.projet = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{main_menu:0,info:4,instructions:9,jeu:14,zones:19,succes:24,echec:29});

	this.actionFrames = [0,4,9,14,19,24,29];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		this.stop();
		
		this.btn.addEventListener("click", StartGame.bind(this));
		
		
		
		function StartGame()
		
		{
			this.gotoAndStop("instructions");
		}
	}
	this.frame_4 = function() {
		this.stop();
	}
	this.frame_9 = function() {
		this.stop();
		
		this.btn2.addEventListener("click", CloseInstructions.bind(this));
		this.fenetre.addEventListener("click", DoNothing.bind(this));
		
		
		
		function CloseInstructions()
		
		{
			this.gotoAndStop("jeu");
		}
		
		function DoNothing()
		
		{
			
		}
	}
	this.frame_14 = function() {
		this.stop();
		var contaminationLvl = 0
		var contaminationThreshold = 10;
		var self = this;
		
		this.livres.addEventListener("click", ()=>{Interact(this.livres,3);});
		this.tableau.addEventListener("click", ()=>{Interact(this.tableau, 3);});
		this.ordinateur.addEventListener("click", ()=>{Interact(this.ordinateur, 3);});
		this.auto.addEventListener("click", ()=>{Interact(this.auto, 3);});
		this.bricolage.addEventListener("click", ()=>{Interact(this.bricolage, 1);});
		this.jouets.addEventListener("click", ()=>{Interact(this.jouets, 1);});
		this.musique.addEventListener("click", ()=>{Interact(this.musique, 1);});
		this.lunch.addEventListener("click", ()=>{Interact(this.lunch, 3);});
		
		this.savon.addEventListener("click", ()=>{WashHands(this.savon);});
		this.horloge.addEventListener("click", Results.bind(this));
		
		
		
		function Interact(station, choixMax)
		{
			var choix; 
			var choixMin = 1;
			choix =  Math.floor(Math.random() * (choixMax - choixMin +1) ) + choixMin;
		
			
			station.Interact(choix);
			UpdateContamination(1);
		}
		
		function WashHands(mc)
		{
			mc.gotoAndPlay(1);
			UpdateContamination(0);
			
		}
		
		function Results()
		{
			if (contaminationLvl < contaminationThreshold)
				this.gotoAndStop("succes");
			else
				this.gotoAndStop("echec");
				
		}
		
		function UpdateContamination(lvl)
		{
			if (lvl != 0)
				contaminationLvl++;
			else
				contaminationLvl = 0;
			console.log("contaminationLvl " +contaminationLvl);
			console.log(self);
			self.contaminationTXT.text = "contaminationLvl " +contaminationLvl;
		}
	}
	this.frame_19 = function() {
		this.stop();
	}
	this.frame_24 = function() {
		this.stop();
		
		this.btnRetry.addEventListener("click", Restart.bind(this));
		
		
		
		function Restart()
		
		{
			this.gotoAndStop("main_menu");
		}
	}
	this.frame_29 = function() {
		this.stop();
		
		this.btnRetry2.addEventListener("click", Restart.bind(this));
		
		
		
		function Restart()
		
		{
			this.gotoAndStop("main_menu");
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(4).call(this.frame_4).wait(5).call(this.frame_9).wait(5).call(this.frame_14).wait(5).call(this.frame_19).wait(5).call(this.frame_24).wait(5).call(this.frame_29).wait(5));

	// action
	this.btn = new lib.boutongenerique();
	this.btn.name = "btn";
	this.btn.setTransform(485,388,1,1,0,0,0,0.7,0);

	this.timeline.addTween(cjs.Tween.get(this.btn).to({_off:true},4).wait(30));

	// titre
	this.instance = new lib.CachedBmp_1();
	this.instance.setTransform(59.2,46.95,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_2();
	this.instance_1.setTransform(59.2,46.95,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_3();
	this.instance_2.setTransform(59.2,46.95,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_4();
	this.instance_3.setTransform(59.2,46.95,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_5();
	this.instance_4.setTransform(59.2,46.95,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_6();
	this.instance_5.setTransform(59.2,46.95,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_7();
	this.instance_6.setTransform(59.2,46.95,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},4).to({state:[{t:this.instance_2}]},5).to({state:[{t:this.instance_3}]},5).to({state:[{t:this.instance_4}]},5).to({state:[{t:this.instance_5}]},5).to({state:[{t:this.instance_6}]},5).wait(5));

	// contaminationLayer
	this.contaminationTXT = new cjs.Text("", "13px 'Arial'");
	this.contaminationTXT.name = "contaminationTXT";
	this.contaminationTXT.lineHeight = 17;
	this.contaminationTXT.lineWidth = 150;
	this.contaminationTXT.alpha = 0.50588235;
	this.contaminationTXT.parent = this;
	this.contaminationTXT.setTransform(180.25,37.05);
	this.contaminationTXT._off = true;

	this.timeline.addTween(cjs.Tween.get(this.contaminationTXT).wait(14).to({_off:false},0).to({_off:true},5).wait(15));

	// instructions
	this.instance_7 = new lib.station_savon("single",0);
	this.instance_7.setTransform(747.2,313.2,1.5178,1.5178);

	this.instance_8 = new lib.CachedBmp_8();
	this.instance_8.setTransform(161.35,440.6,0.5,0.5);

	this.instance_9 = new lib.virus();
	this.instance_9.setTransform(163,210,0.7646,0.7646);

	this.instance_10 = new lib.main();
	this.instance_10.setTransform(420,202);

	this.btn2 = new lib.boutongenerique();
	this.btn2.name = "btn2";
	this.btn2.setTransform(759.6,520.85,0.5612,0.5612,0,0,0,-2.5,-5);

	this.fenetre = new lib.mc_fenetre_info();
	this.fenetre.name = "fenetre";
	this.fenetre.setTransform(515.35,369.45);

	this.instance_11 = new lib.CachedBmp_9();
	this.instance_11.setTransform(142.55,14.2,0.5,0.5);

	this.btnRetry = new lib.boutongenerique();
	this.btnRetry.name = "btnRetry";
	this.btnRetry.setTransform(502,622.5,0.3455,0.3455,0,0,0,-2.5,-5);

	this.instance_12 = new lib.facejaune();
	this.instance_12.setTransform(388,254);

	this.btnRetry2 = new lib.boutongenerique();
	this.btnRetry2.name = "btnRetry2";
	this.btnRetry2.setTransform(502,622.5,0.3455,0.3455,0,0,0,-2.5,-5);

	this.instance_13 = new lib.faceverte();
	this.instance_13.setTransform(388,254);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.fenetre},{t:this.btn2},{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7}]},9).to({state:[{t:this.instance_11}]},5).to({state:[]},5).to({state:[{t:this.instance_12},{t:this.btnRetry}]},5).to({state:[{t:this.instance_13},{t:this.btnRetry2}]},5).wait(5));

	// savon
	this.savon = new lib.station_savon();
	this.savon.name = "savon";
	this.savon.setTransform(937.75,694.05);
	this.savon._off = true;

	this.timeline.addTween(cjs.Tween.get(this.savon).wait(9).to({_off:false},0).to({_off:true},15).wait(10));

	// horloge
	this.horloge = new lib.UI_horloge();
	this.horloge.name = "horloge";
	this.horloge.setTransform(123,90.4);
	this.horloge._off = true;

	this.timeline.addTween(cjs.Tween.get(this.horloge).wait(9).to({_off:false},0).to({_off:true},15).wait(10));

	// ordinateur
	this.ordinateur = new lib.station_ordinateur();
	this.ordinateur.name = "ordinateur";
	this.ordinateur.setTransform(857.8,172.1,0.9111,0.9111);
	this.ordinateur._off = true;

	this.timeline.addTween(cjs.Tween.get(this.ordinateur).wait(9).to({_off:false},0).to({_off:true},15).wait(10));

	// tableau
	this.tableau = new lib.station_tableau();
	this.tableau.name = "tableau";
	this.tableau.setTransform(512.55,121.95);
	this.tableau._off = true;

	this.timeline.addTween(cjs.Tween.get(this.tableau).wait(9).to({_off:false},0).to({_off:true},15).wait(10));

	// musique
	this.musique = new lib.station_musique();
	this.musique.name = "musique";
	this.musique.setTransform(203.35,641.8);
	this.musique._off = true;

	this.timeline.addTween(cjs.Tween.get(this.musique).wait(9).to({_off:false},0).to({_off:true},15).wait(10));

	// lunch
	this.lunch = new lib.station_lunch();
	this.lunch.name = "lunch";
	this.lunch.setTransform(158.5,468.8);
	this.lunch._off = true;

	this.timeline.addTween(cjs.Tween.get(this.lunch).wait(9).to({_off:false},0).to({_off:true},15).wait(10));

	// lecture
	this.livres = new lib.stationlecture();
	this.livres.name = "livres";
	this.livres.setTransform(209.65,243.85,0.8789,0.8789);
	this.livres._off = true;

	this.timeline.addTween(cjs.Tween.get(this.livres).wait(9).to({_off:false},0).to({_off:true},15).wait(10));

	// bricolage
	this.bricolage = new lib.station_bricolage();
	this.bricolage.name = "bricolage";
	this.bricolage.setTransform(570.1,621.9);
	this.bricolage._off = true;

	this.timeline.addTween(cjs.Tween.get(this.bricolage).wait(9).to({_off:false},0).to({_off:true},15).wait(10));

	// auto
	this.auto = new lib.station_auto();
	this.auto.name = "auto";
	this.auto.setTransform(530.4,352.7,0.8345,0.8345);
	this.auto._off = true;

	this.timeline.addTween(cjs.Tween.get(this.auto).wait(9).to({_off:false},0).to({_off:true},15).wait(10));

	// jouets
	this.jouets = new lib.station_jouets();
	this.jouets.name = "jouets";
	this.jouets.setTransform(857.45,407.9,0.9251,0.9251);
	this.jouets._off = true;

	this.timeline.addTween(cjs.Tween.get(this.jouets).wait(9).to({_off:false},0).to({_off:true},15).wait(10));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(458.4,342.4,626.0000000000001,438);
// library properties:
lib.properties = {
	id: '52B00B9F474BFF43A43C715B0EA7D4D4',
	width: 1024,
	height: 768,
	fps: 30,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_10.png?1592709131036", id:"CachedBmp_10"},
		{src:"images/projet_atlas_1.png?1592709130927", id:"projet_atlas_1"},
		{src:"images/projet_atlas_2.png?1592709130930", id:"projet_atlas_2"},
		{src:"images/projet_atlas_3.png?1592709130932", id:"projet_atlas_3"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['52B00B9F474BFF43A43C715B0EA7D4D4'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}			
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;			
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});			
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;			
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused){
			stageChild.syncStreamSounds();
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;