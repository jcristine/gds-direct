'use strict';

let splitBtn = document.createElement("button");

splitBtn.className = "btn btn-purple zbtn-invert t-f-size-14 btn-rounded";
splitBtn.innerHTML = '<i class="fa fa-fw fa-columns t-bold"></i>';

function bufferBtn()
{
	return {
		make( callback )
		{
			let buffer = document.createElement("button");

			buffer.innerHTML = '<i class="fa fa-fw fa-clipboard"></i>';
			buffer.className = "btn btn-primary btn-rounded t-f-size-14";
			buffer.addEventListener ("click", callback);

			return buffer;
		}
	}
}

let minimize = document.createElement("button");

minimize.innerHTML = "splitBtn";
minimize.className = "btn btn-success";

minimize.addEventListener ("click", function() {
	console.log(root);
});

export { splitBtn };
export { minimize };
export { bufferBtn };