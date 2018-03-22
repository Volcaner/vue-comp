<template>
	<!-- <div class="main"> -->
		<div class="commentarea">
			<div class="replysb" @click='click2Return'>
				<!-- <div class="reply_input">
					<div class="insertwords">
						<textarea v-model='commentVal' name="insertwords" rows="5" value="" :placeholder='"@" + this.author'></textarea>
					</div>
					
					<div class="insertpics clearfix hide">
						<p class="emoticon icon iconfont">&#xe60c;</p>
						<p class="picture icon iconfont">&#xe680;</p>
					</div>
				</div>
				<div class="reply_footer">
					<input @click='submit()' type="button" name="submit" value="提交">
					<input @click='cancel()' type="button" name="cancel" value="取消">
				</div> -->
 
				<div class="reply_area">
					<div>
						<span class="emoticon icon iconfont" @click="showInsertPic">&#xe60c;</span>
						<div id="conBox" class="conBox" contentEditable="true" @input='getRanger(); inputListener();' @paste='getRanger' @click='getRanger(); getEditer($event);' @focus='getRanger' @change='getRangerooo'>
							<p>
								<br>
							</p>
						</div>
						<span class="icon iconfont" @click='submitToComment(thread_info)'>{{btnName}}</span>
					</div>
					<InsertPic v-if='bIsInsertPic' @insertPic='insertPic'></InsertPic>
				</div>
				
			</div>
		</div>
	<!-- </div> -->
</template>
<script>
	import commentcss from './../less/comment.less';
	import InsertPic from './../compchild/insertpic.vue';
	export default({
		data() {
			return {
				// rpid: null,
				commentVal: '',
				// author: '',
				uid: '',
				comp_name: '',

				// emoji
				bIsInsertPic: false,
				editer: '',
				ranger: '',
			}
		},
		props: ['author', 'rpid', 'btnName'],
		mounted() {
			let that = this;
			
			this.$store.state.comp_name = localStorage.comp_name && localStorage.comp_name!="undefined"?JSON.parse(localStorage.comp_name):"";
			this.comp_name = this.$store.state.comp_name;
			// document.title = this.comp_name;
			

			// this.rpid = this.getReg('rpid');
			// this.author = unescape(this.getReg('author'));
			this.$store.state.uid = localStorage.uid && localStorage.uid!="undefined"?JSON.parse(localStorage.uid):"";
			this.uid = this.$store.state.uid;
		},
		methods: {
			submitToComment: function() {
				let that = this;
				let strComment = document.querySelector(".commentarea div#conBox").innerHTML;
				if(strComment != null) {
					this.$http.post(window.publicPath2 + '/forum.php', {mod: 'post',action: 'new_reply', rpid: this.rpid, uid: this.uid, message: strComment}, {emulateJSON: true}).then(function(res) {
						// console.log(res);
						let result = res.body;

						switch(Number(result)) {
							case 1: {
								// 为评论成功
								// window.history.go(-1);
								// location.reload();
								that.$emit('comment', true);
								document.querySelector(".commentarea div#conBox").innerHTML = "<p><br></p>";
								break;
							}
							case -1: {
								// 内容为空或太短
								alert("内容为空或太短");
								that.$emit('comment', false);
								break;
							}
							case -2: {
								// 内容太长
								alert("内容太长");
								that.$emit('comment', false);
								break;
							}
							case -3: {
								// 未选择回复内容
								alert("未选择回复内容");
								that.$emit('comment', false);
								break;
							}
							case -4: {
								// 用户未登录
								alert("用户未登录");
								that.$emit('comment', false);
								break;
							}
						};
					}, function(error) {
						// console.log(error);
						alert("评论失败");
						that.$emit('comment', false);
					});
				}
			},
			cancel: function() {
				// window.history.go(-1);
				// location.reload();
				this.$emit('cancel', false);
			},
			getReg: function(name) {
				let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
				let r = window.location.search.substr(1).match(reg);
				if(r!=null) return  unescape(r[2]); return null;
			},
			click2Return: function(e) {
				if(e.currentTarget == e.target) {
					this.cancel();
				}
				else {
					// do nothing
				}
			},
			showInsertPic: function() {
				this.bIsInsertPic = !this.bIsInsertPic;
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
			getRangerooo: function() {
				// alert(88888)
			},
			insertPic: function(text) {
				let that = this;
				let targetEl = document.querySelector(".commentarea div#conBox");
				try {
					if (window.getSelection) {
						let se = window.getSelection();
						let range;

						if(that.editer == "" || that.editer == null || that.editer == undefined) {
							return;
						}
						else if(that.editer == targetEl) {
							if (se.getRangeAt && se.rangeCount) {
								range = se.getRangeAt(0);
								if(targetEl != range.commonAncestorContainer || targetEl != range.commonAncestorContainer.parentNode || targetEl != range.commonAncestorContainer.parentNode.parentNode) {
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

			    }
			},
			inputListener: function() {
				let strContentVal = document.querySelector("div#conBox").innerHTML;
				if(strContentVal == "") {
					document.querySelector("div#conBox").innerHTML += '<p><br></p>'
					document.getElementById("conBox").firstChild.focus();
				}
			},
		},
		watch: {
			// 'author': function(newVal, oldVal) {
			// 	document.querySelector('textarea[name=insertwords').placeholder = "回复 @" + this.author;
			// },
		},
		components: {
			'InsertPic': InsertPic,
		},
	});
</script>
<style lang='less' scoped>
</style>