<template>
	<div id="updateHeadpic">
		<div class="confirm clearfix">
			<input class="cancelBtn_cls btn" id="cancelBtn" @click="returnToMine()" type="button" name="btn" value="取消">
			<input class="postBtn_cls btn" id="postBtn" @click="postPic()" type="button" name="btn" value="确定">
		</div>
		<div class="canBox clearfix">
			<canvas id="canvas1" class="canvas1"></canvas>
			<canvas id="canvas2" class="canvas2"></canvas>
		</div>
		<div class="files">
			<p>选择图片</p>
			<input @change="init()" accept="image/*" type="file" name="files" value="">
			<!-- <input class="showBtn_cls" id="showBtn" @click="showPic()" type="button" name="btn" value="预览"> -->
		</div>
		<!-- <button id="btn" @click="showPic()" type="">click</button> -->
		<div class="show"></div>
	</div>
</template>
<script>
	export default{
		name:'updateHeadpic',
		data(){
			return{
				imgData: null,
				can: undefined,
				can2: undefined,
				cxt: undefined,
				cxt2: undefined,
				canvasW: 0,
				canvasH: 0,
				uid: '',
			}
		},
		mounted() {
			this.$store.state.uid = JSON.parse(localStorage.uid);
			this.uid = this.$store.state.uid;

			this.$store.state.comp_name = JSON.parse(localStorage.comp_name);
			this.comp_name = this.$store.state.comp_name;
			// document.title = this.comp_name;

			this.can = document.getElementById('canvas1');
			this.can2 = document.getElementById('canvas2');
			this.cxt = this.can.getContext("2d"); 
			this.cxt2 = this.can.getContext("2d"); 

			this.canvasW = this.can.width;
			this.can.height = this.canvasW;
			this.can2.width = 200; 
			this.can2.height = 200;

			this.can.addEventListener("touchmove", function(touche) {
				touche.preventDefault();
			});

			// clear
			this.cxt.clearRect(0, 0, this.canvasW, this.canvasW);
			this.cxt2.clearRect(0, 0, 200, 200);
			document.querySelector('div.show').innerHTML = "";

			// console.log(document.querySelector('input[type=file]'));
		},
		methods:{
			init: function() {
				var imgData = this.imgData;
				var can = this.can;
				var can2 = this.can2;
				var cxt = this.cxt;
				var cxt2 = this.cxt2;
				var canvasW = this.canvasW;
				var canvasH = this.canvasH;

				var file = document.querySelector('input[type=file]');

				canvasW = can.width;
				canvasH = can.height;

				// img: width height & absolute: x y
				var imgDrawW;
				var imgDrawH;
				var imgDrawX;
				var imgDrawY;

				// abs
				var dis_abs = {};

				// get drawImage obj
				var imgByDr;

				// img: bis width > height =>  radio > 1 ?
				var bIsRadio = false;

				// bis double figer touch
				var bIsDouTouch = false;

				// scale record
				var lastDis;
				var nowDis;

				// clearCanvas
				function clearCanvas() {
					cxt.clearRect(0, 0, canvasW, canvasH);
				}

				if(file.files[0]){
					// if size > 2M ?
					var size = file.files[0].size/(1024*1024);//单位MB
					if(size > 10) {
						alert('图片大小不能超过10MB');
						return;
					}

					// main
					var imgreader = new FileReader();
					imgreader.readAsDataURL(file.files[0]);
					imgreader.onload = function(e) {
						// draw img to canvas
						var img = new Image();
						img.src = imgreader.result;
						img.onload = function(){

							// init img
							var imgW = img.width;
							var imgH = img.height;
							var ratio = parseFloat(imgW/imgH).toFixed(2);
							if(ratio <= 1) {
								bIsRadio = true;
								var imgX = canvasW*0.5 - canvasW*0.5;
								var imgY = canvasH*0.5 - canvasH/ratio*0.5;
								imgDrawW = canvasW;
								imgDrawH = canvasH/ratio;
								imgDrawX = imgX;
								imgDrawY = imgY;

								clearCanvas();
								cxt.drawImage(img, imgX, imgY, imgDrawW, imgDrawH);
							}else if(ratio > 1) {
								bIsRadio = false;
								var imgX = canvasW*0.5 - canvasW*ratio*0.5;
								var imgY = canvasH*0.5 - canvasH*0.5;
								imgDrawW = canvasW*ratio;
								imgDrawH = canvasH;
								imgDrawX = imgX;
								imgDrawY = imgY;

								clearCanvas();
								cxt.drawImage(img, imgX, imgY, imgDrawW, imgDrawH);
							}

							// touch 1: move
							var moveEvent = function(touche, img) {
								var touch1X = touche.targetTouches[0].clientX - can.offsetLeft;
								var touch1Y = touche.targetTouches[0].clientY - can.offsetTop;

								if(touch1X < imgDrawX){
									var x = touch1X + dis_abs.dis_x;
								}else{
									var x = touch1X - dis_abs.dis_x;
								}

								if(touch1Y < imgDrawY){
									var y = touch1Y + dis_abs.dis_Y;
								}else{
									var y = touch1Y - dis_abs.dis_Y;
								}
								
								// record the absolute x y of img
								imgDrawX = x;
								imgDrawY = y;

								clearCanvas();
								cxt.drawImage(img, x, y, imgDrawW, imgDrawH);
							};

							// touch 2: sacle
							var scaleEvent = function(touche, img) {
								// alert(touche.targetTouches[1].scale);
								var touch1X = touche.targetTouches[0].clientX;
								var touch1Y = touche.targetTouches[0].clientY;
								var touch2X = touche.targetTouches[1].clientX;
								var touch2Y = touche.targetTouches[1].clientY;
								var disX1_2 = touch1X - touch2X;
								var disY1_2 = touch1Y - touch2Y;
								if(isNaN(lastDis) || null == lastDis || undefined == lastDis){
									lastDis = Math.pow((disX1_2*disX1_2 + disY1_2*disY1_2), 0.5);
								}

								nowDis = Math.pow((disX1_2*disX1_2 + disY1_2*disY1_2), 0.5);
								var disRadio = nowDis/lastDis;
								lastDis = nowDis;

								if(disRadio > 1) {
									imgDrawW = imgDrawW * (1 + (disRadio - 1) * 0.5);
									imgDrawH = imgDrawH * (1 + (disRadio - 1) * 0.5);
								}else {
									imgDrawW = imgDrawW * (1 - (1 - disRadio) * 0.5);
									imgDrawH = imgDrawH * (1 - (1 - disRadio) * 0.5);
								}

								
								

								clearCanvas();
								cxt.drawImage(img, imgDrawX, imgDrawY, imgDrawW, imgDrawH);
							};

							can.addEventListener("touchmove", function(touche) {
								// alert(touche.targetTouches.length);
								if(1 == touche.targetTouches.length){
									if(!bIsDouTouch){
										moveEvent(touche, img);
									}
									
								}else if(2 == touche.targetTouches.length){
									bIsDouTouch = true;
									scaleEvent(touche, img);
								}
							}, false);

							can.addEventListener("touchstart", function(touche) {
								// abs the distance between touche and img
								var dis_x = Math.abs(touche.targetTouches[0].clientX - can.offsetLeft - imgDrawX);
								var dis_Y = Math.abs(touche.targetTouches[0].clientY - can.offsetTop - imgDrawY);
								dis_abs = {"dis_x": dis_x, "dis_Y": dis_Y};

								// clear lastDis when touch start
								lastDis = null;
							}, false);

							can.addEventListener("touchend", function(touche) {
								setTimeout(function(){
									bIsDouTouch = false;
								}, 500)
							}, false);
						};
					}
				}
			},
			showPic: function() {
				var imgData = this.imgData;
				var can = this.can;
				var can2 = this.can2;
				var cxt = this.cxt;
				var cxt2 = this.cxt2;
				var canvasW = this.canvasW;
				var canvasH = this.canvasH;
				var imgResult;

				// get img data
				imgData = can.toDataURL("image/jpeg", 1);
				var test4img = new Image();
				test4img.src = imgData;
				test4img.onload = function() {
					can2 = document.getElementById('canvas2');
					cxt2 = can2.getContext("2d"); 
					cxt2.drawImage(test4img, 0, 0, 200, 200);

					// img result
					imgResult = can2.toDataURL("image/jpeg", 0.6);
					var result4img = new Image();
					result4img.src = imgResult;
					result4img.onload = function() {
						// console.log(result4img);

						// show img
						let imgaaa = document.createElement('img');
						imgaaa.src = result4img.src;
						imgaaa.onload = function(){
							var showBox = document.querySelector('.show');
							showBox.innerHTML = "";
							showBox.appendChild(imgaaa); 
							// document.querySelector('img').style.cssText += "width: 200px; border-radius: 200px 200px";
						}
					}
				}
			},
			postPic: function() {
				var that = this;
				var imgData = this.imgData;
				var can = this.can;
				var can2 = this.can2;
				var cxt = this.cxt;
				var cxt2 = this.cxt2;
				var canvasW = this.canvasW;
				var canvasH = this.canvasH;

				// get img data
				var dataCache = can.toDataURL("image/jpeg", 1);
				var cache4img = new Image();
				cache4img.src = dataCache;
				cache4img.onload = function() {
					can2 = document.getElementById('canvas2');
					cxt2 = can2.getContext("2d"); 
					cxt2.drawImage(cache4img, 0, 0, 200, 200);

					// img result
					imgData = can2.toDataURL("image/jpeg", 0.6);
					var result4img = new Image();
					result4img.src = imgData;
					result4img.onload = function() {
						// console.log(result4img);
						// this.imgData = can2.toDataURL("image/jpeg", 0.6);
					};

					// post
	 				that.$http.post(window.publicPath2 + '/uc_server/avatar_wechat.php', {uid: that.uid, img: imgData}, {emulateJSON: true})
	 				.then((response)=>{
	 					var res = response.body.res;
	 					if(res >= 1) {
	 						// that.$store.state.mestate.avatarimg = imgData;
	 						that.returnToMine();
	 						return;
	 					}else if(-1 == res) {
	 						alert('图片为空');
	 						return;
	 					}else if(-2 == res) {
	 						alert('图片过大（jpg，jpeg，gif，png，bmp）');
	 						return;
	 					}else if(-3 == res) {
	 						alert('图片格式错误（限制2M）');
	 						return;
	 					}
	 					// console.log(response);
	 				},(error)=>{
	 					// console.log(error);
	 				})
				}
			},
			returnToMine: function() {
				window.history.go(-1);
				// window.location.reload();
			},
		}
	}
</script>
<style lang='less' scoped>
	
</style>