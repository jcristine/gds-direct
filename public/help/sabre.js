
window.onload = () => {
	let headers = document.querySelectorAll('.categoryHeader');
	let collapse = (header, force) => {
		header.parentElement.classList.toggle('collapsed', force);
	};
	headers.forEach(header => {
		header.onclick = () => collapse(header);
	});

	document.querySelectorAll('button#collapse-all').forEach(btn => {
		let allCollapsed = false;
		btn.onclick = () => {
			allCollapsed = !allCollapsed;
			headers.forEach(header => {
				collapse(header, allCollapsed);
			});
		};
	});
};