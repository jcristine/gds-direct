import {get, Dom, components} 		        from 'application';
import {apiRequest, loadScript} 	        from 'abstract/helper';
import {agent} 			                    from 'abstract/user';
import {AddPq, ClonePq, TerminalCreate} 	from 'es6!page/requestInfo/tabs/priceQuote/modals/create/app';

const Component = components.create;
let response;

const checkAccess = res => {

	if (!res.enabled)
	{
		document.getElementById('terminalContext').appendChild(
			Component('div.hbox stretch text-center pos-rlt')
				.attach(
					Component('div.pos-abt t-width-100',{style: 'top: 30%;'})
						.attach(
							Component('div.l-h-2x',{style: 'font-size: 31px;'})
								.attach(
									Component('div.panel-body text-white')
										.attach([
											Component('span[<i class="fa fa-warning"></i>]',{style: 'margin: 20px;font-size: 55px;'}),
											Component('span.t-underlined['+ res['disableReason'] +']')
										])
								)
						)
				).getContext()
		);

		response = null;
		return Promise.reject();
	}

	return res;
};

const terminal = ({buffer, settings}) => {
	return new window.GdsDirectPlusApp({
		buffer,
		settings,

		commandUrl 		: 'terminal/command?',
		htmlRootId		: 'terminalContext',

		requestId		: get('rId'),
		isStandAlone	: get('terminalData')['isStandAlone'],
		permissions		: get('auth')['isTester'],
		terminalThemes	: get('terminalThemes'),
		agentId			: agent.getId(),
		PqPriceModal	: (response, onClose) => new Promise(resolve => pQuotesTerminal(response, onClose, resolve))
	});
};

export const init = () => {

	const url = '/gdsDirect/view';

	return response = response || apiRequest.promise({url}).get()
		.then( checkAccess )
		.then( response => {
			return new Promise( resolve => {
				loadScript('frontend/public/vendor.terminal-bundle.js', () => {
					loadScript('frontend/public/terminal-bundle.js', () => {
						resolve(terminal(response));
					}, true);
				});
			})
		})
};

const initNext = callback => {
	document.getElementById('terminalNavBtn').click();
	init().then(callback);
};

export const execPnrCode = props => initNext(terminal => terminal.runPnr(props));
export const execRebuild = props => initNext( terminal => terminal.rebuild(props));

export const pQuotesCreate = () => {
	return AddPq();
};

export const pQuotesClone = (props) => {
	return ClonePq(props);
};

const pQuotesTerminal = (response, onClose, resolve) => {
	TerminalCreate(response, onClose);
	resolve();
};