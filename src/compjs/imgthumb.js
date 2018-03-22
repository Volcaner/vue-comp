var urlAPI = window.createObjectURL && window || window.URL && URL.revokeObjectURL && URL || window.webkitURL;
function ImgThumb(img) {
	let can1 = document.createElement("canvas");
	let cxt1 = can1.getContext('2d');

	if(img.width > img.height) {
		can1.width = 200;
		can1.height = 200*(img.height/img.width);
	}
	else {
		can1.width = 200*(img.width/img.height);
		can1.height = 200;
	}
	cxt1.drawImage(img, 0, 0, can1.width, can1.height);

	return can1.toDataURL('image/jpeg', 0.9);
};

export {ImgThumb};