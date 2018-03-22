<template>
	<div class="main">
		<div id="topic" class="topic">
			<div class="issuearea">
				<div class="title_input">
					<textarea v-model='titleVal' name="title" placeholder="标题" rows="3" maxlength="80" @click='getEditer($event)'></textarea>
					<p><span>{{titleVal.length}}/80</span></p>
				</div>

				<div class="content_input">
					<!-- <textarea v-model.trim='contentVal' name="content" placeholder="内容" rows="7" :value='contentVal.trim()'></textarea> -->
					<div id="conBox" class="conBox" contentEditable="true" @input='getRanger(); inputListener();' @paste='getRanger(); getPaste($event)' @click='getRanger(); getEditer($event);' @focus='getRanger' @change='getRangerooo'>
						<p>
							<br>
						</p>
					</div>
				</div>

				<div class="pics_input">
					<div class="select_mode">
						<span class="photography hide icon iconfont">&#xe67f;</span>
						<span class="emoticon icon iconfont" @click="showInsertPic">&#xe60c;</span>
						<span class="picture hide icon iconfont">&#xe680;</span>
						<a href="javascript:;" class="picture icon iconfont">
							&#xe680;
							<input type="file" accept="image/*" size="9" name="insertpics" value="" @change="previewPics" @click="initFileBox">
						</a>
					</div>

					<InsertPic v-if='bIsInsertPic' @insertPic='insertPic'></InsertPic>

					<!-- <div class="select_look hide">
						<span class="look_name">二狗你干啥</span>
						<table class="clearfix">
							<tr>
								<td><img src="./../images/ergou/ergou0.jpg" alt="ergou0"></td>
							</tr>
						</table>
					</div> -->

					<div class="preview hide" v-if='picsCache.length > 0'>
						<ul class="clearfix">
							<template v-for='(imgItem, index) in picsCache'>
								<li>
									<div>
										<img :src='imgItem' alt="pics">
									</div>
									<b class="icon iconfont" @click='cancelPic(imgItem, index)'>&#xe601;</b>
								</li>
							</template>
						</ul>
					</div>
				</div>

				<div class="control" v-show='bIsmanager'>
					<p class="stick clearfix">
						<label><input type="checkbox" name="stick" value="" @click='clickToStick()'>置顶</label>
						<!-- <label><input type="checkbox" name="stick" value="" />置顶</label> -->
					</p>
					<p class="synchro clearfix">
						<label><input type="checkbox" name="synchro" value="" @click='clickToSynchro()'>同步到文章推送（每日16:00推送，今日还剩<b>{{synchroCount}}</b>篇）</label>
					</p>
					<p class="note">
						<b>注：</b>
						<span>1. 勾选第二项时，标题需控制在64个字以内。</span>
						<span>2. 勾选第二项时，建议在内容中添加图片，否则将使用默认图。</span>
					</p>
				</div>
			</div>

			<div class="footer">
				<div class="submit_btn" @click='clickToSubmit()'>
					<span>提交</span>
				</div>
			</div>

			<div v-show='bIsTips' class="tips">
				<div class="tip_box">
					<!-- <span>{{tipWords}}</span> -->
					<img src="../images/submiting.gif" height="32" width="32" alt="">
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import {ImageCompress} from './../compjs/imagecompress.js';
	import InsertPic from './../compchild/insertpic.vue';
	export default({
		data() {
			return{
				bIsmanager: false,
				titleVal: '',
				contentVal: '',
				picsCache:[
					// require('./../images/robbin.jpg')?1',
					// require('./../images/robbin.jpg')?2',
					// require('./../images/robbin.jpg')?3',
				],
				bIsPush: false,
				ispush: 0,
				bIsTop: false,
				istop: 0,
				synchroCount: 0,
				attachment: 0,
				bIsTips: false,
				tipWords: '上传中...',
				altsb: '',
				comp_name: '',
				imgFiles: [],

				files: [],

				// version-2
				bIsInsertPic: false,
				editer: '',
				ranger: '',
				nt_code: '',  // 防止多次提交
			}
		},
		mounted() {
			// 解决刷新界面，store又初始化----感觉这个地方很狗血，用了store，又用localstorage，  TODO：需要优化？
			this.$store.state.fid = JSON.parse(localStorage.fid);
			this.$store.state.uid = JSON.parse(localStorage.uid);
			this.$store.state.ismanager = JSON.parse(localStorage.ismanager);
			let that = this;
			
			this.$store.state.comp_name = JSON.parse(localStorage.comp_name);
			this.comp_name = this.$store.state.comp_name;
			// document.title = this.comp_name;

			// if alt@ ???
			let alt_uid = this.getReg("alt_uid");
			let alt_username = unescape(this.getReg("alt_username"));
			if(alt_uid!=null && alt_uid.toString().length > 0 && alt_username!=null && alt_username.toString().length > 0) {
				// this.contentVal += "@" + alt_username + " ";
				document.querySelector("div#conBox").innerHTML = "<p>@" + alt_username + " </p>";
			}

			let ismanager = this.$store.state.ismanager;
			if(1 == ismanager || 2 == ismanager) {
				this.bIsmanager = true;

				this.$http.post(window.publicPath + '/home.php', {op: 'push_auth'}, {emulateJSON: true}).then(function(res) {
					// console.log(res);
					let result = res.body;

					that.nt_code = result.result.nt_code;
					
					if(0 <= parseInt(result.result.result)) {
						// 为当天推送的文章数（最大为7，最小为0，>=7时即当天推送文章已满，不可勾选选框）
						if(7 > parseInt(result.result.result)) {
							that.synchroCount = 7 - parseInt(result.result.result);
						}else {
							that.synchroCount = 0;
							let synchroCheckBox = document.querySelector('input[name=synchro');
							synchroCheckBox.disabled = true;
						}
						
					}
					else if(-4 == parseInt(result.result.result)) {
						// 没有显示权限
						let synchroCheckBox = document.querySelector('input[name=synchro');
						synchroCheckBox.disabled = true;
					}
				}, function(error) {
					window.location.href = window.publicPath + "/dist/error404/error404.html"; 
				});
			}
			else {
				this.$http.post(window.publicPath + '/home.php', {op: 'push_auth'}, {emulateJSON: true}).then(function(res) {
					// console.log(res);
					let result = res.body;

					that.nt_code = result.result.nt_code;
				}, function(error) {
					window.location.href = window.publicPath + "/dist/error404/error404.html"; 
				});
			}

			// jianting
			// document.getElementById("conBox").addEventListener("DOMNodeInserted", function() {console.log(999);}, false);
			// document.getElementById("conBox").addEventListener("input", function() {}, false);
			
			// 初始 内容输入框 获得焦点
			document.body.onload = function() {
				let conBoxEl = document.getElementById("conBox");
				conBoxEl.focus();
				that.editer = conBoxEl;
			};
		},
		methods: {
			getPaste: function(e) {
				// console.log(e);

			},
			getRangerooo: function() {
				// console.log(88888)
			},
			getRanger: function() {
				let that = this;
				if (window.getSelection) {
					let se = window.getSelection();
					if (se.getRangeAt && se.rangeCount) {
						this.ranger = se.getRangeAt(0);
					}
				}
				else if(document.selection && document.selection.createRange) {
					this.ranger = document.selection.createRange();
				}
			},
			getEditer: function(e) {
				this.editer = e.currentTarget;

				// emoji 隐藏
				this.bIsInsertPic = false;
			},
			escapeHandle: function() {
				let strContentVal = document.querySelector("div#conBox").innerHTML;
				// alert(strContentVal);
			},
			inputListener: function() {
				let strContentVal = document.querySelector("div#conBox").innerHTML;
				if(strContentVal == "") {
					document.querySelector("div#conBox").innerHTML += '<p><br></p>'
					document.getElementById("conBox").firstChild.focus();
				}
			},
			pasteHandler: function() {
				// 监控粘贴(ctrl+v),如果是粘贴过来的东东，则替换多余的html代码，只保留<br>
				setTimeout(function() {
				var content = document.querySelector("div#conBox").innerHTML;
					// var valiHTML=["br"];
					content = content.replace(/(<[^>]*>)/g, function($0,$1){
						if(/<img[^>]*>/gi.test($1)){
							return $1;
						}else {
							return "";
						}
					});
					if(!/firefox/.test(navigator.userAgent.toLowerCase())){
						content=content.replace(/\r?\n/gi, "<p><br></p>");
					}
					document.querySelector("div#conBox").innerHTML=content;
					saveRange();
					},1)

				function saveRange(){
		            var selection= window.getSelection ? window.getSelection() : document.selection;
		            var range= selection.createRange ? selection.createRange() : selection.getRangeAt(0);
		            // _range = range;
		            if (!window.getSelection){
		                var o = document.querySelector("div#conBox");
		                if(o.lastChild && o.lastChild.tagName == "IMG"){
		                    o.appendChild(document.createTextNode("\n"));
		                }
		            }
		        }
			},
			clickToSubmit: function() {
				let that = this;
				let bIsNull = /^\s*$/g;
				let fileSize = 0;
				let fid = that.$store.state.fid;
				let uid = that.$store.state.uid;

				// loading show
				that.bIsTips = true;

				let post4Submit = function() {
					// post
					that.$http.post(window.publicPath2 + '/forum.php', 
						{mod: "post", action: "new_thread", fid: fid, uid: uid, subject: that.titleVal, message: strContentVal, groupimage: that.picsCache, attachment: that.attachment, ispush: that.ispush, istop: that.istop, nt_code: that.nt_code}, 
						{emulateJSON: true}).then(function(res) {
						// console.log(res);
						let result = Number(res.body);
						// loading hide
						that.bIsTips = false;

						switch(Number(result)) {
							case 1: {
								// 为发帖成功
								that.$store.state.bIsIssueOk = true;
								localStorage.bIsIssueOk = JSON.stringify(that.$store.state.bIsIssueOk);
								// window.location.href = window.publicPath + "/dist/communityhome/communityhome.html"; 
								let reurl = "c_" + "communityhome";
								window.location.href = window.publicPath5 + '/wechat.php?page=redirect&url=' + reurl;
								break;
							}
							case 0: {
								// 为上传图片失败
								alert("为上传图片失败");
								break;
							}
							case -1: {
								// 标题或内容为空
								alert("标题或内容为空");
								break;
							}
							case -2: {
								// 标题太长
								alert("标题太长");
								break;
							}
							case -3: {
								// 内容太长
								alert("内容太长");
								break;
							}
							case -55: {
								// 用户未登录
								alert("用户未登录");
								break;
							}
							case -66: {
								// 没有足够的操作权限
								alert("没有足够的操作权限");
								break;
							}
							case -77: {
								// 文章推送数已满
								alert("文章推送数已满");
								break;
							}
							case -8: {
								// 图片格式错误（'jpg', 'jpeg', 'gif', 'png', 'bmp'）
								alert("图片格式错误（'jpg', 'jpeg', 'gif', 'png', 'bmp'）");
								break;
							}
							case -9: {
								// 图片未保存
								alert("图片未保存");
								break;
							}
							case -10: {
								// 图片保存出错
								alert("图片保存出错");
								break;
							}
						}
					}, function(error) {
						// console.log(error);

						// loading hide
						that.bIsTips = false;

						window.location.href = window.publicPath + "/dist/error404/error404.html"; 
					});
				};

				let strContentVal = document.querySelector("div#conBox").innerHTML;

				// 遍历img[name=images]
				let imglist = document.querySelectorAll("#conBox img[name=images]");
				let imgFilesList = [];
				if(imglist && imglist.length > 0) {
					for(var k = 0; k < imglist.length; k++) {
						let el = imglist[k]

						for(let m = 0; m < that.files.length; m++) {
							if(el.id == that.files[m].id) {
								imgFilesList.push(that.files[m]);
								break;
							}
						}
					}
				}

				if(imgFilesList.length > 0) {
					imgFilesList.forEach(function(imgItem, imgIndex) {
						let obj = {
							files: [
								imgItem.file,
							],
							maxsize: 1024*1024,  // b
							quality: 0.05,
						};

						that.imageCompress(obj, function(arrResult) {
							that.imgFiles.push({
								size: arrResult[0].size,
								src: imgItem.id + arrResult[0].src.toString(),
								id: imgItem.id,
							});

							that.picsCache.push(imgItem.id + arrResult[0].src.toString());

							if(imgIndex == imgFilesList.length-1) {
								if(!bIsNull.test(that.titleVal) && !bIsNull.test(strContentVal)) {
									if(that.imgFiles && that.imgFiles.length > 0) {
										that.imgFiles.forEach(function(item, index) {
											fileSize += item.size;
										});
									}

									if(that.imgFiles.length > 9) {
										alert("图片数量过多！");
									}
									else if(fileSize/(1024*1024) > 10) {
										alert("图片文件过大！");
									}
									else {
										that.attachment = that.picsCache.length;

										// post
										post4Submit();
									}
								}
								else {
									// loading hide
									that.bIsTips = false;
									alert("标题或内容不能为空！");
								}
							}
						});
					});
				}
				else {
					if(!bIsNull.test(that.titleVal) && !bIsNull.test(strContentVal)) {
						// post
						post4Submit();
					}
					else {
						// loading hide
						that.bIsTips = false;
						alert("标题或内容不能为空！");
					}
				}












				
				
				// // 遍历img[name=images]
				// let imgFilesList = [];
				// let picsCacheList = [];
				// let imglist = document.querySelectorAll("#conBox img[name=images]");
				// if(imglist && imglist.length > 0) {
				// 	for(var k = 0; k < imglist.length; k++) {
				// 		let el = imglist[k]

				// 		for(let m = 0; m < that.imgFiles.length; m++) {
				// 			if(el.id == that.imgFiles[m].id) {
				// 				imgFilesList.push(that.imgFiles[m]);
				// 				break;
				// 			}
				// 		}

				// 		for(let n = 0; n < that.picsCache.length; n++) {
				// 			if(el.id == that.picsCache[n].substring(0, 4)) {
				// 				picsCacheList.push(that.picsCache[n]);
				// 				break;
				// 			}
				// 		}
				// 	}
				// }

				// if(!bIsNull.test(this.titleVal) && !bIsNull.test(strContentVal)) {
				// 	if(imgFilesList && imgFilesList.length > 0) {
				// 		imgFilesList.forEach(function(item, index) {
				// 			fileSize += item.size;
				// 		});
				// 	}

				// 	if(imgFilesList.length > 9) {
				// 		alert("图片数量过多！");
				// 	}
				// 	else if(fileSize/(1024*1024) > 10) {
				// 		alert("图片文件过大！");
				// 	}
				// 	else {
				// 		let fid = that.$store.state.fid;
				// 		let uid = that.$store.state.uid;
				// 		this.attachment = picsCacheList.length;

				// 		// loading show
				// 		this.bIsTips = true;

				// 		// post
				// 		this.$http.post(window.publicPath2 + '/forum.php', 
				// 			{mod: "post", action: "new_thread", fid: fid, uid: uid, subject: this.titleVal, message: strContentVal, groupimage: picsCacheList, attachment: this.attachment, ispush: this.ispush, istop: this.istop, nt_code: this.nt_code}, 
				// 			{emulateJSON: true}).then(function(res) {
				// 			// console.log(res);
				// 			let result = Number(res.body);
				// 			// loading hide
				// 			that.bIsTips = false;

				// 			switch(Number(result)) {
				// 				case 1: {
				// 					// 为发帖成功
				// 					that.$store.state.bIsIssueOk = true;
				// 					localStorage.bIsIssueOk = JSON.stringify(that.$store.state.bIsIssueOk);
				// 					window.location.href = window.publicPath + "/dist/communityhome/communityhome.html"; 
				// 					break;
				// 				}
				// 				case 0: {
				// 					// 为上传图片失败
				// 					alert("为上传图片失败");
				// 					break;
				// 				}
				// 				case -1: {
				// 					// 标题或内容为空
				// 					alert("标题或内容为空");
				// 					break;
				// 				}
				// 				case -2: {
				// 					// 标题太长
				// 					alert("标题太长");
				// 					break;
				// 				}
				// 				case -3: {
				// 					// 内容太长
				// 					alert("内容太长");
				// 					break;
				// 				}
				// 				case -55: {
				// 					// 用户未登录
				// 					alert("用户未登录");
				// 					break;
				// 				}
				// 				case -66: {
				// 					// 没有足够的操作权限
				// 					alert("没有足够的操作权限");
				// 					break;
				// 				}
				// 				case -77: {
				// 					// 文章推送数已满
				// 					alert("文章推送数已满");
				// 					break;
				// 				}
				// 				case -8: {
				// 					// 图片格式错误（'jpg', 'jpeg', 'gif', 'png', 'bmp'）
				// 					alert("图片格式错误（'jpg', 'jpeg', 'gif', 'png', 'bmp'）");
				// 					break;
				// 				}
				// 				case -9: {
				// 					// 图片未保存
				// 					alert("图片未保存");
				// 					break;
				// 				}
				// 				case -10: {
				// 					// 图片保存出错
				// 					alert("图片保存出错");
				// 					break;
				// 				}
				// 			}
				// 		}, function(error) {
				// 			// console.log(error);

				// 			// loading hide
				// 			that.bIsTips = false;

				// 			window.location.href = window.publicPath + "/dist/error404/error404.html"; 
				// 		});
				// 	}
				// }
				// else {
				// 	alert("标题或内容不能为空！");
				// }
			},
			previewPics: function() {
				let that = this;
				let fileBox = document.querySelector('input[type=file]');
				if(0 < fileBox.files.length) {
					for(let i = 0; i < fileBox.files.length; i++) {
						let file = fileBox.files[i];
						let fileType = file.type.split("/")[1].toLowerCase();

						if(~'jpg,jpeg,png,bmp,gif'.indexOf(fileType)) {
							let arrAtoZ = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
							let intPicAltRandom = arrAtoZ[Math.round(Math.random()*25)] + (Math.round(Math.random()*899)+100).toString();
							that.files.push({
								file: file,
								id: intPicAltRandom.toString(),
							});

							let reader = new FileReader();
							reader.readAsDataURL(file);
							reader.onload = function() {
								let blobUrl = window.URL.createObjectURL(that.dataURItoBlob(reader.result));
								let strHtml = '<br><img name="images" src=' + blobUrl + ' id=' + intPicAltRandom + ' />';
								that.insertPic(strHtml, function() {  // ("img#" + intPicAltRandom.toString()
									// document.querySelector("img#" + intPicAltRandom.toString()).addEventListener("DOMNodeRemoved", function(e) {  // DOMContentLoaded  // DOMNodeRemoved
									// 	document.querySelector("img#" + intPicAltRandom.toString()).parentNode.removeChild();
									// 	console.log(arrResult);
									// 	that.imgFiles.forEach(function(item, index) {
									// 		if(item == arrResult[0]) {
									// 			that.imgFiles.splice(index, 1);
									// 		}
									// 	});

									// 	that.picsCache.forEach(function(val, num) {
									// 		if(val == intPicAltRandom.toString() + arrResult[0].src.toString()) {
									// 			that.picsCache.splice(num, 1);
									// 		}
									// 	});
									// }, true);
								});
								// window.URL.revokeObjectURL(blobUrl);
							};
						}
						else {
							alert("请选择正确的图片格式！（jpg、jpeg、png、bmp、gif）");
						}
					};






					// for(let i = 0; i < fileBox.files.length; i++) {
					// 	let obj = {
					// 		files: [
					// 			fileBox.files[i],
					// 		],
					// 		maxsize: 1024*1024,  // b
					// 		quality: 0.05,
					// 	};
					// 	that.imageCompress(obj, function(arrResult) {
					// 		let arrAtoZ = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
					// 		let intPicAltRandom = arrAtoZ[Math.round(Math.random()*25)] + (Math.round(Math.random()*899)+100).toString();

					// 		that.imgFiles.push({
					// 			size: arrResult[0].size,
					// 			src: intPicAltRandom.toString() + arrResult[0].src.toString(),
					// 			id: intPicAltRandom.toString(),
					// 		});

					// 		that.picsCache.push(intPicAltRandom.toString() + arrResult[0].src.toString());

					// 		let can = document.createElement("canvas");
					// 		let cxt = can.getContext('2d');
					// 		let img = new Image();
					// 		img.src = arrResult[0].src;
					// 		img.onload = function() {
					// 			can.width = 200;
					// 			can.height = 200*img.height/img.width;
					// 			cxt.drawImage(img , 0, 0, can.width, can.height);
					// 			let result = can.toDataURL('image/jpeg', 0.5);
					// 			let blobUrl = window.URL.createObjectURL(that.dataURItoBlob(result));
					// 			// window.URL.revokeObjectURL()  主动释放
								
					// 			let strHtml = '<br><img name="images" src=' + blobUrl + ' id=' + intPicAltRandom + ' />';
								
					// 			that.insertPic(strHtml, function() {  // ("img#" + intPicAltRandom.toString()
					// 				// document.querySelector("img#" + intPicAltRandom.toString()).addEventListener("DOMNodeRemoved", function(e) {  // DOMContentLoaded  // DOMNodeRemoved
					// 				// 	document.querySelector("img#" + intPicAltRandom.toString()).parentNode.removeChild();
					// 				// 	console.log(arrResult);
					// 				// 	that.imgFiles.forEach(function(item, index) {
					// 				// 		if(item == arrResult[0]) {
					// 				// 			that.imgFiles.splice(index, 1);
					// 				// 		}
					// 				// 	});

					// 				// 	that.picsCache.forEach(function(val, num) {
					// 				// 		if(val == intPicAltRandom.toString() + arrResult[0].src.toString()) {
					// 				// 			that.picsCache.splice(num, 1);
					// 				// 		}
					// 				// 	});
					// 				// }, true);
					// 			});

								

					// 			// window.URL.revokeObjectURL(blobUrl);
					// 		};
					// 	});
					// };
					
				}
			},
			dataURItoBlob: function(dataURI) {
				// convert base64/URLEncoded data component to raw binary data held in a string
			    var byteString;
			    if (dataURI.split(',')[0].indexOf('base64') >= 0)
			        byteString = atob(dataURI.split(',')[1]);
			    else
			        byteString = unescape(dataURI.split(',')[1]);

			    // separate out the mime component
			    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

			    // write the bytes of the string to a typed array
			    var ia = new Uint8Array(byteString.length);
			    for (var i = 0; i < byteString.length; i++) {
			        ia[i] = byteString.charCodeAt(i);
			    }

			    return new Blob([ia], {type:mimeString});
			},
			initFileBox: function() {
				// clear input:file 
				let that = this;

				// hide emoji
				this.bIsInsertPic = false;

				let fileBox = document.querySelector('input[type=file]');
				if(fileBox.value) {
					try {
						fileBox.value = "";
					}catch(err) {

					}
					if(fileBox.value) {
						let form = document.createElement('form');
						let ref = fileBox.nextSibling;
						let parentNode = fileBox.parentNode;
						form.appendChild(fileBox);
						form.reset();
						parentNode.insertBefore(fileBox, ref);
					}
				}
			},
			cancelPic: function(imgItem, key) {
				let that = this;
				let arrayPics = document.querySelectorAll('li');

				this.picsCache.forEach(function(item, index) {
					if(imgItem == item && index == key) {
						that.picsCache.splice(index, 1);
						that.imgFiles.splice(index, 1);
					}
				});
			},
			clickToStick: function() {
				this.bIsPush = !this.bIsPush;
				if(this.bIsPush) {
					this.istop = 1;
				}
				else {
					this.istop = 0;
				}
			},
			clickToSynchro: function() {
				this.bIsTop = !this.bIsTop;
				if(this.bIsTop) {
					this.ispush = 1;
				}
				else{
					this.ispush = 0;
				}
			},
			getReg: function(name) {
				let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
				let r = window.location.search.substr(1).match(reg);
				if(r!=null) return  unescape(r[2]); return null;
			},
			imageCompress: function(obj, callback) {
				ImageCompress(obj, callback);
			},
			showInsertPic: function() {
				this.bIsInsertPic = !this.bIsInsertPic;
			},
			insertPic: function(text, callback) {
				let that = this;
				let targetEl = document.getElementById("conBox");
				let titleEl = document.querySelector("textArea[name=title]");
				try {
					if (window.getSelection) {
						let se = window.getSelection();
						let range;

						if(that.editer == titleEl) {
							return;
						}
						else if(that.editer == "" || that.editer == null || that.editer == undefined) {
							return;
						}
						else if(that.editer == targetEl) {
							if (se.getRangeAt) {
								if(se.rangeCount) {
									range = se.getRangeAt(0);
									if(targetEl != range.commonAncestorContainer || targetEl != range.commonAncestorContainer.parentNode || targetEl != range.commonAncestorContainer.parentNode.parentNode) {
										se.removeAllRanges();
										se.addRange(that.ranger);
										range = se.getRangeAt(0);
									}
								}
								else{
									se.removeAllRanges();
									se.addRange(that.ranger);
									range = se.getRangeAt(0);
								}
								
								range.deleteContents();
			                    let el = document.createElement("div");
			                    el.innerHTML = text;
			                    let frag = document.createDocumentFragment(), node, lastNode;
			                    frag.appendChild(document.createTextNode(' '));
			                    while ((node = el.firstChild)) {
			                        lastNode = frag.appendChild(node);
			                    }
			                    range.insertNode(frag);
			                    if(callback) {
			                    	callback();
			                    }
			                    
			                    if (lastNode) {
			                        // range = range.cloneRange();
			                        range.setStart(lastNode, 0);

			                        window.setTimeout(function() {
							            range = document.createRange();
							            range.setStartAfter(lastNode);
							            range.collapse(true);
							            se.removeAllRanges();
							            se.addRange(range);
							            that.ranger = document.createRange();
							            that.ranger.setStartAfter(lastNode);
							            that.ranger.collapse(true);
							        }, 0);
			                    }
			                    document.getElementById("conBox").blur();
							}
						}
					}
					else if(document.selection && document.selection.createRange) {
						let se = document.selection;
						let range = document.selection.createRange();
						if(targetEl == range.commonAncestorContainer || targetEl == range.commonAncestorContainer.parentNode || targetEl == range.commonAncestorContainer.parentNode.parentNode) {
							if (typeof text === 'string') {
						        range.text = text;
						    } else {
						        range.pasteHTML(text.outerHTML);
						        document.getElementById("conBox").blur();
						    }
						}
					}
				} catch(err) {
					alert("err");
			    }
			},
			delHtmlTag: function(str) {
				return str.replace(/<[^>]+>/g,"");  // 去掉所有的html标记
			},
			getFocus: function(el) {
				el.focus();
			},
		},
		watch: {
			'contentVal': function(newVal, oldVal) {
				this.contentVal = newVal.trim();
			},
		},
		components: {
			InsertPic,
		},
	});
</script>
<style type="text/css" media="screen">
	
</style>