
const {wrapExc} = require("../Utils/TmpLib.js");
const {parseXml, escapeXml} = require('../GdsHelpers/CommonUtils.js');
const Rej = require("klesun-node-tools/src/Rej.js");
const LoginTimeOut = require("klesun-node-tools/src/Rej").LoginTimeOut;
const SabreItinerary = require('./Transformers/SabreItinerary');

/** @see https://sds.sabre.com/XTRANET_Access/sabre.htm */
const decodeBinaryChars = (output) => {
	output = output.replace(new RegExp('', 'g'), '¥');
	output = output.replace(new RegExp('Â', 'g'), '');
	output = output.replace(new RegExp(String.fromCharCode(0xC2, 0x80), 'g'), ' '); // yellow background start
	output = output.replace(new RegExp(String.fromCharCode(0xC2, 0x81), 'g'), ' '); // yellow background end
	return output;
};

const makeStartSoapEnvXml = ({profileData, baseGdsData}) => {
	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<SOAP-ENV:Envelope',
		'	xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"',
		'	xmlns:ns1="http://www.opentravel.org/OTA/2002/11"',
		'	xmlns:ns2="http://schemas.xmlsoap.org/ws/2002/12/secext"',
		'	xmlns:ns3="http://www.ebxml.org/namespaces/messageHeader">',
		'  <SOAP-ENV:Header>',
		'    <ns2:Security>',
		'      <ns2:UsernameToken>',
		'        <ns2:Username>' + profileData.username + '</ns2:Username>',
		'        <ns2:Password>' + profileData.password + '</ns2:Password>',
		'        <Organization>' + profileData.default_pcc + '</Organization>',
		'        <Domain>DEFAULT</Domain>',
		'      </ns2:UsernameToken>',
		'    </ns2:Security>',
		'    <ns3:MessageHeader>',
		'      <ns3:From>',
		'        <ns3:PartyId ns3:type="urn:x12.org:IO5:01">innogw.dyninno.net</ns3:PartyId>',
		'      </ns3:From>',
		'      <ns3:To>',
		'        <ns3:PartyId ns3:type="urn:x12.org:IO5:01">webservices.sabre.com/websvc</ns3:PartyId>',
		'      </ns3:To>',
		'      <ns3:CPAId>' + profileData.default_pcc + '</ns3:CPAId>',
		'      <ns3:ConversationId>' + baseGdsData.conversationId + '</ns3:ConversationId>',
		'      <ns3:Service ns3:type="OTA">SessionCreateRQ</ns3:Service>',
		'      <ns3:Action>SessionCreateRQ</ns3:Action>',
		'      <ns3:MessageData>',
		'        <ns3:MessageId>' + baseGdsData.messageId + '</ns3:MessageId>',
		'        <ns3:Timestamp>2019-02-22T19:07:04</ns3:Timestamp>',
		'        <ns3:Timeout>600</ns3:Timeout>',
		'      </ns3:MessageData>',
		'    </ns3:MessageHeader>',
		'  </SOAP-ENV:Header>',
		'  <SOAP-ENV:Body>',
		'    <ns1:SessionCreateRQ>',
		'      <ns1:POS>',
		'        <ns1:Source PseudoCityCode="' + profileData.default_pcc + '"/>',
		'      </ns1:POS>',
		'    </ns1:SessionCreateRQ>',
		'  </SOAP-ENV:Body>',
		'</SOAP-ENV:Envelope>',
	].join('\n');
};

const makeContinueSoapEnvXml = ({gdsData, payloadXml, profileData, action}) => {
	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<SOAP-ENV:Envelope',
		'	xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"',
		'	xmlns:secext="http://schemas.xmlsoap.org/ws/2002/12/secext"',
		'	xmlns:ebmsg="http://www.ebxml.org/namespaces/messageHeader">',
		'  <SOAP-ENV:Header>',
		'    <secext:Security>',
		'      <secext:BinarySecurityToken>' + gdsData.binarySecurityToken + '</secext:BinarySecurityToken>',
		'    </secext:Security>',
		'    <ebmsg:MessageHeader>',
		'      <ebmsg:From>',
		'        <ebmsg:PartyId ebmsg:type="urn:x12.org:IO5:01">innogw.dyninno.net</ebmsg:PartyId>',
		'      </ebmsg:From>',
		'      <ebmsg:To>',
		'        <ebmsg:PartyId ebmsg:type="urn:x12.org:IO5:01">webservices.sabre.com/websvc</ebmsg:PartyId>',
		'      </ebmsg:To>',
		'      <ebmsg:CPAId>' + profileData.default_pcc + '</ebmsg:CPAId>',
		'      <ebmsg:ConversationId>' + gdsData.conversationId + '</ebmsg:ConversationId>',
		// actually may differ from action...
		'      <ebmsg:Service ebmsg:type="OTA">' + action + '</ebmsg:Service>',
		'      <ebmsg:Action>' + action + '</ebmsg:Action>',
		'      <ebmsg:MessageData>',
		'        <ebmsg:MessageId>' + gdsData.messageId + '</ebmsg:MessageId>',
		'        <ebmsg:Timestamp>2019-02-22T19:07:05</ebmsg:Timestamp>',
		'        <ebmsg:Timeout>600</ebmsg:Timeout>',
		'      </ebmsg:MessageData>',
		'    </ebmsg:MessageHeader>',
		'  </SOAP-ENV:Header>',
		'  <SOAP-ENV:Body>' + payloadXml + '  </SOAP-ENV:Body>',
		'</SOAP-ENV:Envelope>',
	].join('\n');
};

const SabreClient = ({
	PersistentHttpRq = require('klesun-node-tools/src/Utils/PersistentHttpRq.js'),
	GdsProfiles = require("../Repositories/GdsProfiles"),
} = {}) => {
	const {getSabre} = GdsProfiles;

	const sendRequest = async (soapEnvXml, format) => {
		return PersistentHttpRq({
			url: 'https://webservices.sabre.com/websvc',
			headers: {
				'SOAPAction': 'OTA',
				'Content-Type': 'text/xml; charset=utf-8',
			},
			body: soapEnvXml,
		}).then(rs => rs.body).then(rsXml => {
			const dom = parseXml(rsXml);
			return wrapExc(() => format(dom)).catch(exc => {
				if (!exc.httpStatusCode) {
					exc.httpStatusCode = Rej.BadGateway.httpStatusCode;
					exc.message = 'Invalid Sabre session response format - ' + exc.message;
					exc.rsXml = rsXml;
				}
				return Promise.reject(exc);
			});
		});
	};

	const startSession = async (params) => {
		const profileName = params.profileName;
		const profileData = await getSabre(profileName);

		const baseGdsData = {
			conversationId: '2019-02-22T19:07:04@innogateway5c7048587a71aPID4209',
			messageId: '1876459793',
		};
		const soapEnvXml = makeStartSoapEnvXml({profileData, baseGdsData});

		return sendRequest(soapEnvXml, dom => ({
			...baseGdsData,
			profileName: profileData.profileName,
			binarySecurityToken: dom.querySelector('wsse\\:BinarySecurityToken').textContent,
		}));
	};

	const parseInSessionExc = (exc) => {
		if ((exc + '').indexOf('Invalid or Expired binary security token') > -1) {
			return LoginTimeOut('Session token expired');
		} else {
			return Promise.reject(exc);
		}
	};

	/** @param gdsData = await require('SabreClient.js').startSession() */
	const runCmd = async (rqBody, gdsData) => {
		const cmd = rqBody.command;
		if (!cmd) {
			return Rej.BadRequest('Tried to invoke empty Sabre command');
		}
		const profileData = await getSabre(gdsData.profileName);
		const payloadXml = [
			'    <ns1:SabreCommandLLSRQ xmlns:ns1="http://webservices.sabre.com/sabreXML/2003/07">',
			'      <ns1:Request>',
			'        <ns1:HostCommand>' + escapeXml(cmd) + '</ns1:HostCommand>',
			'      </ns1:Request>',
			'    </ns1:SabreCommandLLSRQ>',
		].join('\n');
		const soapEnvXml = await makeContinueSoapEnvXml({
			gdsData, payloadXml, profileData, action: 'SabreCommandLLSRQ',
		});

		return sendRequest(soapEnvXml, dom => {
			const output = (dom.querySelector('SabreCommandLLSRS > Response') || {}).textContent || '';
			const error = (dom.querySelector('SabreCommandLLSRS > ErrorRS Message') || {}).textContent || '';
			if (output) {
				return {output: decodeBinaryChars(output)};
			} else if (error === 'Invalid Value') {
				return Rej.BadRequest('Invalid characters in your Sabre command - ' + cmd);
			} else if (error) {
				return Rej.ServiceUnavailable('Sabre returned error - ' + error);
			} else {
				return Rej.BadGateway('Unexpected Sabre cmd rs format - ' + soapEnvXml);
			}
		}).catch(parseInSessionExc);
	};

	/** @param gdsData = await require('SabreClient.js').startSession() */
	const closeSession = async (gdsData) => {
		const profileName = gdsData.profileName;
		const profileData = await getSabre(profileName);
		const payloadXml = [
			'    <ns1:SessionCloseRQ xmlns:ns1="http://www.opentravel.org/OTA/2002/11">',
			'      <ns1:POS>',
			'        <ns1:Source PseudoCityCode="' + profileData.default_pcc + '"/>',
			'      </ns1:POS>',
			'    </ns1:SessionCloseRQ>',
		].join('\n');
		const soapEnvXml = await makeContinueSoapEnvXml({
			gdsData, payloadXml, profileData, action: 'SessionCloseRQ',
		});

		return sendRequest(soapEnvXml, dom => {
			const rsEl = dom.querySelector('SessionCloseRS');
			return {
				status: rsEl.getAttribute('status'),
				version: rsEl.getAttribute('version'),
			};
		}).catch(parseInSessionExc);
	};

	const makeSession = (gdsData) => ({
		gdsData: gdsData,
		// TODO: refactor and leave just getGdsData()
		getGdsData: () => gdsData,
		runCmd: (cmd) => runCmd({command: cmd}, gdsData)
			.then(result => ({cmd, ...result})),
	});

	/**
	 * starts a session, executes the action, closes the session
	 */
	const withSession = (params, action) => {
		const profileName = params.profileName
			|| GdsProfiles.SABRE.SABRE_PROD_L3II;
		return startSession({profileName}).then(gdsData => {
			const session = makeSession(gdsData);
			return Promise.resolve()
				.then(() => action(session))
				.finally(() => {
					closeSession(gdsData);
				});
		});
	};

	const processPnr = async (gdsData, params) => {
		const xml = SabreItinerary.buildItineraryXml(params);
		const profileData = await getSabre(gdsData.profileName);
		const soapEnvXml = makeContinueSoapEnvXml({
			gdsData, payloadXml: xml, profileData, action: 'EnhancedAirBookRQ',
		});

		return sendRequest(soapEnvXml,
			dom => SabreItinerary.parseItineraryXmlResponse(dom, params));
	};

	return {
		startSession,
		runCmd,
		closeSession,
		withSession,
		processPnr,
	};
};

const defaultInst = SabreClient({});

defaultInst.makeCustom = params => SabreClient(params);

module.exports = defaultInst;