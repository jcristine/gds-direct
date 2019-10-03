import Dom from "../../helpers/dom";

/** @param {TerminalPlugin} plugin */
const promptForTicketedPnrCancelConfirm = (plugin, data) => new Promise((resolve) => {
	const {agentDisplayName} = data;
	const msg = [
		'This PNR has issued tickets with active coupon statuses.',
		'Please, confirm, that you have reviewed everything carefully',
		'and would like to proceed with the changes in the Ticketed PNR',
	].join(' ');
	const rejectAction = () => {
		remove();
		resolve({status: 'rejected'});
	};
	let rejectBtn, confirmBtn;
	rejectBtn = Dom('button', {
		className: 'reject',
		textContent: 'Undo last step',
		onkeydown: (evt) => {
			if (evt.key === 'Escape') {
				rejectAction();
			} else if (evt.key === 'ArrowRight') {
				confirmBtn.focus();
			}
		},
		onclick: rejectAction,
	});
	confirmBtn = Dom('button', {
		className: 'confirm',
		textContent: 'Proceed with changes',
		onkeydown: (evt) => {
			if (evt.key === 'Escape') {
				rejectAction();
			} else if (evt.key === 'ArrowLeft') {
				rejectBtn.focus();
			}
		},
		onclick: () => {
			remove();
			resolve({status: 'confirmed'});
		},
	});
	const {remove} = plugin.injectDom({
		cls: 'ticketed-pnr-cancellation-holder',
		dom: Dom('div', {}, [
			Dom('button', {
				className: 'cancel-popup',
				textContent: 'X',
				onclick: rejectAction,
			}),
			Dom('br', {clear: 'all'}),
			Dom('h2', {textContent: 'TICKETED PNR CANCELLATION REQUEST'}),
			Dom('p', {textContent: `Dear ${agentDisplayName},`}),
			Dom('p', {textContent: msg}),
			Dom('p', {textContent: 'Please note, that these changes cannot be reversed once saved'}),
			Dom('div', {className: 'btn-holder'}, [rejectBtn, confirmBtn]),
		]),
	});
	setTimeout(() => rejectBtn.focus(), 50);
});

export default promptForTicketedPnrCancelConfirm;
