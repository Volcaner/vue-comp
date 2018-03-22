/* 
** 支持图片上传压缩
** 不支持本地图片路径压缩
** 不支持GIF图片压缩
** author: kaican
*/

function ImageCompress(obj, callback) {
	let files = [];
	let maxsize = obj.maxsize;
	let quality = obj.quality;
	let arrResult = [];

	if(obj.files && obj.files.length > 0) {
		for(let i = 0; i < obj.files.length; i++) {
			files.push(obj.files[i]);
		}

		files.forEach(function(file, index) {
			let fileType = file.type.substring(6, file.type.length);
			if(file.size > maxsize && ~'jpg,jpeg,png,bmp'.indexOf(fileType)) {
				let imgreader = new FileReader();
				imgreader.readAsDataURL(file);
				imgreader.onload = function() {
					let img = new Image();
					img.crossOrigin = '*'; 
					img.src = imgreader.result;
					img.onload = function() {
						let canvas1 = document.createElement("canvas");
						let cxt1 = canvas1.getContext('2d');

						if(img.width > img.height) {
							canvas1.width = 750;
							canvas1.height = 750*(img.height/img.width);
						}
						else {
							canvas1.width = 750*(img.width/img.height);
							canvas1.height = 750;
						}

						canvas1.width = img.width;
						canvas1.height = img.height;
						cxt1.drawImage(img, 0, 0, canvas1.width, canvas1.height);
						let result = canvas1.toDataURL('image/jpeg', quality);

						arrResult.push({
							src: result,
							size: getSize(result),
						});

						if(index == files.length-1) {
							callback(arrResult);
						}
					};

					img.onerror = function() {
						arrResult.push({
							src: imgreader.result,
							size: getSize(imgreader.result),
						});
						if(index == files.length-1) {
							callback(arrResult);
						}
					};
				};

				imgreader.onerror = function() {
					arrResult.push({
						src: imgreader.result,
						size: getSize(imgreader.result),
					});
					if(index == files.length-1) {
						callback(arrResult);
					}
				};
			}
			else {
				let imgreader = new FileReader();
				imgreader.readAsDataURL(file);
				imgreader.onload = function() {
					arrResult.push({
						src: imgreader.result,
						size: getSize(imgreader.result),
					});

					if(index == files.length-1) {
						callback(arrResult);
					}
				};
			}
		});
	}
	else {
		callback(arrResult);
	}
};

function getSize(strBase64) {
	let str = strBase64.substring(23, strBase64.length-1);
	let equalIndex= str.indexOf('=');
	if(equalIndex > 0) {
		str = str.substring(0, equalIndex);
	}
	let strLength = str.length;
	let filesize = parseInt(strLength-(strLength/8)*2);

	return filesize;
};

export {ImageCompress};