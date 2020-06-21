(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"projet_atlas_1", frames: [[1220,475,693,291],[897,1575,493,338],[1392,1594,488,336],[933,835,1011,265],[1220,0,563,473],[0,0,1218,833],[1491,1102,489,490],[933,1102,556,471],[0,835,931,517],[0,1354,895,483]]},
		{name:"projet_atlas_2", frames: [[885,1694,154,106],[1512,1800,372,38],[0,849,690,106],[0,741,710,106],[1956,265,52,140],[0,633,787,106],[510,1792,196,61],[1995,513,47,99],[307,1080,297,196],[1725,1624,196,132],[1915,749,98,90],[1450,1274,296,162],[358,1726,150,96],[1047,1559,176,154],[1041,1715,162,96],[1630,749,283,260],[475,345,387,286],[1113,1243,335,150],[0,957,305,223],[373,347,91,219],[1441,1438,156,214],[1599,1438,124,261],[137,1785,177,72],[410,1278,182,67],[739,1694,144,123],[1362,1654,148,154],[528,1684,209,106],[307,972,624,106],[1071,1395,225,162],[1337,371,382,269],[0,347,371,277],[606,1243,505,106],[1034,656,234,320],[712,842,67,66],[1915,841,97,74],[1503,1011,248,261],[1753,1011,252,247],[0,0,473,345],[1956,139,90,124],[911,0,442,327],[1270,909,231,295],[911,329,424,325],[789,656,243,314],[1731,0,223,412],[475,0,434,343],[197,1278,211,224],[712,741,55,99],[1630,642,57,104],[1995,407,53,104],[1225,1639,135,181],[1270,656,57,104],[860,1530,185,162],[197,1504,169,179],[1915,917,128,48],[0,1604,135,196],[885,1813,206,53],[368,1546,158,178],[1298,1395,141,242],[410,1351,224,193],[0,1439,195,163],[636,1538,202,144],[1512,1701,168,97],[137,1685,219,98],[933,978,248,263],[1956,0,92,137],[0,1182,195,255],[1721,414,272,333],[1355,0,374,369],[1503,909,117,51],[860,1351,209,177],[636,1351,222,185],[1337,642,291,265],[1753,1260,275,175],[1748,1437,189,185],[606,1080,192,161]]}
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



(lib.CachedBmp_4 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_14 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_6 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.aiguillegrande = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.baguette2 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.aiguillepetite = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.auto = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.banane3 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.bloccube = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.boitefermee = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.blocrectanglerouge = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.bloctriangle = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.blocrectanglebleu = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.boiteouverte = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.boutonplay = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.bureauordi = function() {
	this.initialize(ss["projet_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.camionbenne = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.camion = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.ciseauferme = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.ciseauouvert = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.coussin = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.crayonbleu = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.crayonrouge = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.decoupecoeur = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.decoupeetoile = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_2 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.decoupefeuille = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.dessinbateau = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.dessinnature = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.dinocorps = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.ecranchiffres = function() {
	this.initialize(ss["projet_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.dinobouche = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.dinobras = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();



(lib.ecran_animaux = function() {
	this.initialize(ss["projet_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.facejaune = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(35);
}).prototype = p = new cjs.Sprite();



(lib.faceverte = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(36);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_13 = function() {
	this.initialize(ss["projet_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.ecran = function() {
	this.initialize(ss["projet_atlas_1"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.ecraninsectes = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(37);
}).prototype = p = new cjs.Sprite();



(lib.fenetre = function() {
	this.initialize(ss["projet_atlas_1"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.gouttesavon = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(38);
}).prototype = p = new cjs.Sprite();



(lib.horlogecontour = function() {
	this.initialize(ss["projet_atlas_1"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.horlogeinterieur = function() {
	this.initialize(ss["projet_atlas_1"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.livrecochons = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(39);
}).prototype = p = new cjs.Sprite();



(lib.livreferme = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(40);
}).prototype = p = new cjs.Sprite();



(lib.livrelion = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(41);
}).prototype = p = new cjs.Sprite();



(lib.livreouvre = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(42);
}).prototype = p = new cjs.Sprite();



(lib.livrepiles = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(43);
}).prototype = p = new cjs.Sprite();



(lib.livreprincesse = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(44);
}).prototype = p = new cjs.Sprite();



(lib.main = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(45);
}).prototype = p = new cjs.Sprite();



(lib.ourspatte3 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(46);
}).prototype = p = new cjs.Sprite();



(lib.ourspatte1 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(47);
}).prototype = p = new cjs.Sprite();



(lib.ourspatte2 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(48);
}).prototype = p = new cjs.Sprite();



(lib.ourscorps = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(49);
}).prototype = p = new cjs.Sprite();



(lib.ourspatte4 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(50);
}).prototype = p = new cjs.Sprite();



(lib.ourstete = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(51);
}).prototype = p = new cjs.Sprite();



(lib.pomme1 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(52);
}).prototype = p = new cjs.Sprite();



(lib.poupeebras2 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(53);
}).prototype = p = new cjs.Sprite();



(lib.pomme3 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(54);
}).prototype = p = new cjs.Sprite();



(lib.baguette1 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(55);
}).prototype = p = new cjs.Sprite();



(lib.pomme2 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(56);
}).prototype = p = new cjs.Sprite();



(lib.poupeecorps = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(57);
}).prototype = p = new cjs.Sprite();



(lib.poupeetete = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(58);
}).prototype = p = new cjs.Sprite();



(lib.sandwich1 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(59);
}).prototype = p = new cjs.Sprite();



(lib.sandwich2 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(60);
}).prototype = p = new cjs.Sprite();



(lib.sandwich3 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(61);
}).prototype = p = new cjs.Sprite();



(lib.savonpompe = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(62);
}).prototype = p = new cjs.Sprite();



(lib.tableaufleur = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(63);
}).prototype = p = new cjs.Sprite();



(lib.souris = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(64);
}).prototype = p = new cjs.Sprite();



(lib.table = function() {
	this.initialize(ss["projet_atlas_1"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.savon = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(65);
}).prototype = p = new cjs.Sprite();



(lib.tableaumaison = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(66);
}).prototype = p = new cjs.Sprite();



(lib.tableausoleil = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(67);
}).prototype = p = new cjs.Sprite();



(lib.poupeebras1 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(68);
}).prototype = p = new cjs.Sprite();



(lib.tambour = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(69);
}).prototype = p = new cjs.Sprite();



(lib.trompette = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(70);
}).prototype = p = new cjs.Sprite();



(lib.virus = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(71);
}).prototype = p = new cjs.Sprite();



(lib.xylophone = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(72);
}).prototype = p = new cjs.Sprite();



(lib.tableau = function() {
	this.initialize(ss["projet_atlas_1"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.banane1 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(73);
}).prototype = p = new cjs.Sprite();



(lib.banane2 = function() {
	this.initialize(ss["projet_atlas_2"]);
	this.gotoAndStop(74);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_15 = function() {
	this.initialize(img.CachedBmp_15);
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


(lib.stationlecture = function(mode,startPosition,loop) {
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
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// livre_anim
	this.instance = new lib.livreouvre();
	this.instance.setTransform(1,15,0.3523,0.3523);

	this.instance_1 = new lib.livreferme();
	this.instance_1.setTransform(3,18,0.3523,0.3523);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	// livre_3
	this.instance_2 = new lib.livrecochons();
	this.instance_2.setTransform(-34,13,0.3523,0.3523);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1));

	// livre_2
	this.instance_3 = new lib.livrelion();
	this.instance_3.setTransform(-31,13,0.3523,0.3523);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(1));

	// livre_1
	this.instance_4 = new lib.livreprincesse();
	this.instance_4.setTransform(-33,10,0.3523,0.3523);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(1));

	// coussin
	this.instance_5 = new lib.coussin();
	this.instance_5.setTransform(-180,91.65,0.5051,0.5051,-90);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(1));

	// pile_livre
	this.instance_6 = new lib.livrepiles();
	this.instance_6.setTransform(-21,-164,0.389,0.389);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.stationlecture, new cjs.Rectangle(-180,-164,301.7,294.9), null);


(lib.station_tableau = function(mode,startPosition,loop) {
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
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// dessin_3
	this.instance = new lib.tableaumaison();
	this.instance.setTransform(-58,-69,0.3661,0.3661);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// dessin_2
	this.instance_1 = new lib.tableaufleur();
	this.instance_1.setTransform(-45,-49,0.3661,0.3661);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	// dessin_1
	this.instance_2 = new lib.tableausoleil();
	this.instance_2.setTransform(-68,-69,0.3661,0.3661);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1));

	// tableau
	this.instance_3 = new lib.tableau();
	this.instance_3.setTransform(-164,-89,0.3661,0.3661);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.station_tableau, new cjs.Rectangle(-164,-89,327.6,176.8), null);


(lib.station_ordinateur = function(mode,startPosition,loop) {
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
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// image_3
	this.instance = new lib.ecranchiffres();
	this.instance.setTransform(-82,-104,0.3139,0.3139);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// image_2
	this.instance_1 = new lib.ecraninsectes();
	this.instance_1.setTransform(-79,-105,0.3139,0.3139);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	// image_1
	this.instance_2 = new lib.ecran_animaux();
	this.instance_2.setTransform(-82,-104,0.3139,0.3139);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1));

	// souris
	this.instance_3 = new lib.souris();
	this.instance_3.setTransform(69,37,0.3139,0.3139);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(1));

	// ecran
	this.instance_4 = new lib.ecran();
	this.instance_4.setTransform(-100,-122,0.3461,0.3461);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(1));

	// bureau
	this.instance_5 = new lib.bureauordi();
	this.instance_5.setTransform(-116,25,0.3373,0.3373);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.station_ordinateur, new cjs.Rectangle(-116,-122,233.8,245.2), null);


(lib.station_musique = function(mode,startPosition,loop) {
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
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// baguette_4
	this.instance = new lib.baguette2();
	this.instance.setTransform(-115.3,83.1,0.2866,0.2866,-120.0006);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// baguette_3
	this.instance_1 = new lib.baguette1();
	this.instance_1.setTransform(-100.55,74.55,0.2866,0.2866,-120.0006);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	// baguette_2
	this.instance_2 = new lib.baguette1();
	this.instance_2.setTransform(98.8,30.35,0.3117,0.3117,-59.9984);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1));

	// baguette_1
	this.instance_3 = new lib.baguette2();
	this.instance_3.setTransform(80.8,23.45,0.3117,0.3117,-59.9984);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(1));

	// trompette
	this.instance_4 = new lib.trompette();
	this.instance_4.setTransform(-147.6,-59.9,0.402,0.402,-14.9978);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(1));

	// xylophone
	this.instance_5 = new lib.xylophone();
	this.instance_5.setTransform(-77,7,0.402,0.402);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(1));

	// tambour
	this.instance_6 = new lib.tambour();
	this.instance_6.setTransform(8,-60,0.402,0.402);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.station_musique, new cjs.Rectangle(-147.6,-83,292.79999999999995,166.1), null);


(lib.station_jouets = function(mode,startPosition,loop) {
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
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

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

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	// poupee
	this.instance_6 = new lib.poupeetete();
	this.instance_6.setTransform(-28,-94,0.3683,0.3683);

	this.instance_7 = new lib.poupeecorps();
	this.instance_7.setTransform(-18,-32,0.3683,0.3683);

	this.instance_8 = new lib.poupeebras2();
	this.instance_8.setTransform(18,-23,0.3683,0.3683);

	this.instance_9 = new lib.poupeebras1();
	this.instance_9.setTransform(4.1,-4.2,0.3683,0.3683,180);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6}]}).wait(1));

	// dino
	this.instance_10 = new lib.dinocorps();
	this.instance_10.setTransform(46,-24,0.3683,0.3683);

	this.instance_11 = new lib.dinobras();
	this.instance_11.setTransform(46,30,0.3683,0.3683);

	this.instance_12 = new lib.dinobouche();
	this.instance_12.setTransform(46,8,0.3683,0.3683);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_12},{t:this.instance_11},{t:this.instance_10}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.station_jouets, new cjs.Rectangle(-135,-94,267.2,187.9), null);


(lib.station_bricolage = function(mode,startPosition,loop) {
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
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// ciseau
	this.instance = new lib.ciseauferme();
	this.instance.setTransform(94,-27,0.3911,0.3911);

	this.instance_1 = new lib.ciseauouvert();
	this.instance_1.setTransform(81,-27,0.3911,0.3911);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	// feuille_decoupage
	this.instance_2 = new lib.decoupefeuille();
	this.instance_2.setTransform(82.9,-64,0.3911,0.3911,14.9981);

	this.instance_3 = new lib.decoupefeuille();
	this.instance_3.setTransform(18,-83,0.3911,0.3911);

	this.instance_4 = new lib.decoupeetoile();
	this.instance_4.setTransform(118,-98,0.3911,0.3911);

	this.instance_5 = new lib.decoupecoeur();
	this.instance_5.setTransform(111,-91,0.3911,0.3911);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2}]}).wait(1));

	// crayon
	this.instance_6 = new lib.crayonrouge();
	this.instance_6.setTransform(-65.55,50.35,0.3911,0.3911,-45);

	this.instance_7 = new lib.crayonbleu();
	this.instance_7.setTransform(-26.05,57.45,0.3911,0.3911,-59.9989);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_7},{t:this.instance_6}]}).wait(1));

	// feuille_dessin
	this.instance_8 = new lib.dessinnature();
	this.instance_8.setTransform(-157,-83,0.3912,0.3912);

	this.instance_9 = new lib.dessinbateau();
	this.instance_9.setTransform(-161,-83,0.3911,0.3911);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_9},{t:this.instance_8}]}).wait(1));

	// table
	this.instance_10 = new lib.table();
	this.instance_10.setTransform(-185,-103,0.3985,0.3985);

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.station_bricolage, new cjs.Rectangle(-185,-103,371,206), null);


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

	this.instance_1 = new lib.CachedBmp_15();
	this.instance_1.setTransform(-568.95,-411.1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_fenetre_info, new cjs.Rectangle(-568.9,-411.1,1138,822), null);


(lib.mc_blocs = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.bloctriangle();
	this.instance.setTransform(-50.25,-55.65,0.3113,0.3113);

	this.instance_1 = new lib.blocrectanglerouge();
	this.instance_1.setTransform(-22.25,53.85,0.4034,0.4034,-90);

	this.instance_2 = new lib.blocrectanglebleu();
	this.instance_2.setTransform(-66.25,55.7,0.4034,0.4034,-90);

	this.instance_3 = new lib.bloccube();
	this.instance_3.setTransform(26.75,5.35,0.4034,0.4034);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_blocs, new cjs.Rectangle(-66.2,-55.6,132.5,111.30000000000001), null);


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


(lib.mc_auto = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.auto();
	this.instance.setTransform(-50.6,-33.4,0.3407,0.3407);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_auto, new cjs.Rectangle(-50.6,-33.4,101.2,66.8), null);


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

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-46.8,-68,98.69999999999999,133.8);


(lib.station_lunch = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{start:0,pomme:1,banane:33,sandwich:65});

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

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-129,-84.8,257.6,155.5);


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

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.station_auto, new cjs.Rectangle(-148,-106,303.6,211.4), null);


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
		var contaminationThreshold = 3;
		var self = this;
		
		this.livres.addEventListener("click", ()=>{Interact(this.livres,1);});
		this.tableau.addEventListener("click", ()=>{Interact(this.tableau, 1);});
		this.ordinateur.addEventListener("click", ()=>{Interact(this.ordinateur, 1);});
		this.auto.addEventListener("click", ()=>{Interact(this.auto, 1);});
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

	this.instance_1 = new lib.CachedBmp_3();
	this.instance_1.setTransform(59.2,46.95,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_2();
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
	this.contaminationTXT.alpha = 0.50980392;
	this.contaminationTXT.parent = this;
	this.contaminationTXT.setTransform(180.25,37.05);
	this.contaminationTXT._off = true;

	this.timeline.addTween(cjs.Tween.get(this.contaminationTXT).wait(14).to({_off:false},0).to({_off:true},5).wait(15));

	// instructions
	this.instance_7 = new lib.station_savon("single",0);
	this.instance_7.setTransform(747.2,313.2,1.5178,1.5178);

	this.instance_8 = new lib.CachedBmp_13();
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

	this.instance_11 = new lib.CachedBmp_14();
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
		{src:"images/CachedBmp_15.png?1592703241794", id:"CachedBmp_15"},
		{src:"images/projet_atlas_1.png?1592703241723", id:"projet_atlas_1"},
		{src:"images/projet_atlas_2.png?1592703241725", id:"projet_atlas_2"}
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