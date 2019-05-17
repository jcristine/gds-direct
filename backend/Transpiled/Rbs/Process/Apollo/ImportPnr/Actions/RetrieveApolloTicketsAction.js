// namespace Rbs\Process\Apollo\ImportPnr\Actions;

const HteParser = require('../../../../../Gds/Parsers/Apollo/HteParser/HteParser.js');
const TicketParser = require('../../../../../Gds/Parsers/Apollo/HteParser/TicketParser.js');
const AbstractGdsAction = require('../../../../GdsAction/AbstractGdsAction.js');
const {fetchAll} = require('../../../../../../GdsHelpers/TravelportUtils.js');

/**
 * calls >*HTE and >*TE001, >*TE002, ...
 */
const php = require('../../../../../php.js');
const Pccs = require("../../../../../../Repositories/Pccs");
const TravelportClient = require("../../../../../../GdsClients/TravelportClient");
const Forbidden = require("gds-direct-lib/src/Utils/Rej").Forbidden;

class RetrieveApolloTicketsAction extends AbstractGdsAction {
	static async getTicket($ticketRef, gdsSession) {
		let $cmd, $teDump, $ticket;

		$cmd = '*TE' + $ticketRef['teCommandNumber'];
		$teDump = (await fetchAll($cmd, gdsSession)).output;
		$ticket = TicketParser.parse($teDump);

		if (!php.empty($ticket['error'])) {
			$ticket['ticketNumber'] = $ticketRef['ticketNumber'];
		}
		return $ticket;
	}

	withPccSession($pcc, $recordLocator, pccAction) {
		return TravelportClient.withSession({}, async (tmSession) => {
			await tmSession.runCmd('*' + $recordLocator, false);
			await tmSession.runCmd('*HTE', false);
			return pccAction();
		});
	}

	async withAgreedPccSession($ticket, ticketAction) {
		let $log, $ticketingPcc, $pccDataProvider, $pccData;

		$log = this.$log;
		$ticketingPcc = $ticket['pcc'];
		$pccDataProvider = this.$dataAccess.$pccDataProvider;
		$pccData = await Pccs.findByCode('apollo', $ticketingPcc);
		if ($pccData['ticket_mask_pcc']) {
			// $log('No agreement exists for [' + $ticket['pcc'] + '], using [' + $pccData['ticket_mask_pcc'] + '] instead');
			return this.withPccSession(
				$pccData['ticket_mask_pcc'],
				$ticket['recordLocator'],
				() => ticketAction()
			);
		} else {
			return Forbidden('Ticket Mask PCC not configured for ' + $ticket['pcc']);
		}
	}

	async execute() {
		let $log, $hteDump, $listOrTicket, $tickets, $ticket, $ticketRef, $tmSession, $pnrSession, $errors, $errorTypes,
			$ticketInfo;

		$log = this.$log;
		$hteDump = (await fetchAll('*HTE', this)).output;
		$listOrTicket = HteParser.parse($hteDump);
		if (php.empty($listOrTicket['error'])) {
			$tickets = [];
			if ($listOrTicket['type'] === HteParser.SINGLE_TICKET) {
				$ticket = $listOrTicket['result'];
				$tickets.push($ticket);
			} else {
				for ($ticketRef of Object.values($listOrTicket['result']['tickets'])) {
					$ticket = await this.constructor.getTicket($ticketRef, this.session);
					if ($ticket['errorType'] === 'no_agreement_exists') {
						$ticket = await this.withAgreedPccSession($ticket, $tmSession => {
							return this.constructor.getTicket($ticketRef, $tmSession);
						}).catch(exc => $ticket);
					}
					$tickets.push($ticket);
				}
			}
			$errors = php.array_filter(php.array_column($tickets, 'error'));
			$errorTypes = php.array_column($tickets, 'errorType');
			if (php.count($errors) === php.count($tickets)) {
				$ticketInfo = {
					'error': 'All ' + php.count($tickets) + ' ticket masks are not available - ' + php.array_shift($errors),
					'errorType': php.count(php.array_unique($errorTypes)) === 1 ? $errorTypes[0] : null,
					'tickets': $tickets,
				};
			} else {
				$ticketInfo = {'tickets': $tickets};
			}
		} else {
			$ticketInfo = $listOrTicket;
		}

		return $ticketInfo;
	}
}

module.exports = RetrieveApolloTicketsAction;
