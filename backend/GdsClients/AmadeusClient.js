
const crypto = require('crypto');
const util = require('util');
const {wrapExc} = require("../Utils/TmpLib.js");
const {parseXml, escapeXml} = require('../GdsHelpers/CommonUtils.js');
const Rej = require("klesun-node-tools/src/Rej.js");
const LoginTimeOut = require("klesun-node-tools/src/Rej").LoginTimeOut;
const AmadeusFareRules = require('./Transformers/AmadeusFareRules');

const chr = (charCode) => String.fromCharCode(charCode);

const sha1 = (str) => {
	const shasum = crypto.createHash('sha1');
	shasum.update(str);
	return shasum;
};

const makePasswordHash = (nonce, timestamp, password) => {
	const passwordSha1 = sha1(password).digest();
	const resultSrc = Buffer.concat([Buffer.from(nonce + timestamp), passwordSha1]);
	return sha1(resultSrc).digest('base64');
};

const makeSoapEnvForActionWithLogin = ({
	profileData, payloadXml, action, passwordRec, status = null,
}) => {
	const sessionEl = !status ? `` : `\n<awsse:Session xmlns:awsse="http://xml.amadeus.com/2010/06/Session_v3" TransactionStatusCode="${status}"/>`;

	return `<?xml version="1.0" encoding="UTF-8"?>
		<SOAP-ENV:Envelope
		    xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
		    xmlns:ns2="http://www.w3.org/2005/08/addressing"
		    xmlns:ns3="http://wsdl.amadeus.com/2010/06/ws/Link_v1">
		  <SOAP-ENV:Header>${sessionEl}
		    <ns2:MessageID>${passwordRec.messageId}</ns2:MessageID>
		    <ns2:Action>http://webservices.amadeus.com/${action}</ns2:Action>
		    <ns2:To>${profileData.endpoint}</ns2:To>
		    <ns3:TransactionFlowLink/>
		    <oas:Security xmlns:oas="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
		      <oas:UsernameToken xmlns:oas1="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" oas1:Id="UsernameToken-1">
		        <oas:Username>${profileData.username}</oas:Username>
		        <oas:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">${passwordRec.nonceB64}</oas:Nonce>
		        <oas:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest">${passwordRec.passwordDigest}</oas:Password>
		        <oas1:Created>${passwordRec.timestamp}</oas1:Created>
		      </oas:UsernameToken>
		    </oas:Security>
		    <AMA_SecurityHostedUser xmlns="http://xml.amadeus.com/2010/06/Security_v1">
		      <UserID AgentDutyCode="SU" RequestorType="U" PseudoCityCode="${profileData.pcc}" POS_Type="1"/>
		    </AMA_SecurityHostedUser>
		  </SOAP-ENV:Header>
		  <SOAP-ENV:Body>${payloadXml}</SOAP-ENV:Body>
		</SOAP-ENV:Envelope>`;
};

/** @param gdsData = parseCmdRs().gdsData */
const makeContinueSoapEnvXml = ({gdsData, payloadXml, status, action, profileData, messageId}) => [
	'<?xml version="1.0" encoding="UTF-8"?>',
	'<SOAP-ENV:Envelope ',
	'    xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" ',
	'    xmlns:addr="http://www.w3.org/2005/08/addressing">',
	'  <SOAP-ENV:Header>',
	'    <awsse:Session xmlns:awsse="http://xml.amadeus.com/2010/06/Session_v3" TransactionStatusCode="' + status + '">',
	'      <awsse:SessionId>' + gdsData.sessionId + '</awsse:SessionId>',
	'      <awsse:SequenceNumber>' + gdsData.seqNumber + '</awsse:SequenceNumber>',
	'      <awsse:SecurityToken>' + gdsData.securityToken + '</awsse:SecurityToken>',
	'    </awsse:Session>',
	'    <addr:MessageID>' + messageId + '</addr:MessageID>',
	'    <addr:Action>http://webservices.amadeus.com/' + action + '</addr:Action>',
	'    <addr:To>' + profileData.endpoint + '</addr:To>',
	'  </SOAP-ENV:Header>',
	'  <SOAP-ENV:Body>' + payloadXml + '</SOAP-ENV:Body>',
	'</SOAP-ENV:Envelope>',
].join('\n');

const makeCmdPayloadXml = (cmd) =>[
	'    <ns1:Command_Cryptic xmlns:ns1="http://xml.amadeus.com/HSFREQ_07_3_1A">',
	'      <ns1:messageAction>',
	'        <ns1:messageFunctionDetails>',
	'          <ns1:messageFunction>M</ns1:messageFunction>',
	'        </ns1:messageFunctionDetails>',
	'      </ns1:messageAction>',
	'      <ns1:longTextString>',
	'        <ns1:textStringDetails>' + escapeXml(cmd) + '</ns1:textStringDetails>',
	'      </ns1:longTextString>',
	'    </ns1:Command_Cryptic>',
].join('\n');

/** @throws TypeError */
const parseCmdRs = (dom, profileName) => ({
	gdsData: {
		sessionId: dom.querySelector('awsse\\:SessionId').textContent,
		seqNumber: dom.querySelector('awsse\\:SequenceNumber').textContent,
		securityToken: dom.querySelector('awsse\\:SecurityToken').textContent,
		profileName: profileName,
	},
	// parsers expect \n everywhere, so it's easier to fix this at once
	output: dom.querySelector('Command_CrypticReply > longTextString > textStringDetails').textContent.replace(/\r/g, '\n'),
});

const AmadeusClient = ({
	PersistentHttpRq = require('klesun-node-tools/src/Utils/PersistentHttpRq.js'),
	GdsProfiles = require("../Repositories/GdsProfiles"),
	randomBytes = (size) => crypto.randomBytes(size),
	now = () => Date.now(),
} = {}) => {
	const {getAmadeus} = GdsProfiles;

	const uuidv4 = () => {
		const $data = randomBytes(16);

		$data[6] = chr($data[6] & 0x0f | 0x40); // set version to 0100
		$data[8] = chr($data[8] & 0x3f | 0x80); // set bits 6-7 to 10

		return util.format('%s%s-%s-%s-%s-%s%s%s', ...$data.toString('hex').match(/.{1,4}/g));
	};
	const makeMessageId = uuidv4;

	const makePasswordRec = (profileData) => {
		const nonceBytes = randomBytes(16);
		const nonce = nonceBytes.toString('base64');
		const timestamp = new Date(now()).toISOString(); // '2019-02-21T19:37:28.361Z'
		const passwordDigest = makePasswordHash(nonce, timestamp, profileData.password); // 'LjWB9HZPLHIuWPa9FyzIl8n1NzU=';
		return {
			timestamp: timestamp,
			nonceB64: Buffer.from(nonce).toString('base64'),
			messageId: makeMessageId(),
			passwordDigest: passwordDigest,
		};
	};

	const startSession = async (params) => {
		const profileName = params.profileName;
		let profileData = await getAmadeus(profileName);
		const pcc = params.pcc || profileData.default_pcc;
		profileData = {...profileData, pcc};

		const payloadXml = makeCmdPayloadXml('MD0');
		const soapEnvXml = makeSoapEnvForActionWithLogin({
			profileData, payloadXml,
			passwordRec: makePasswordRec(profileData),
			action: 'HSFREQ_07_3_1A',
			status: 'Start',
		});

		return PersistentHttpRq({
			// it's probably worth looking in the docs if they have region-specific urls, since this endpoint is
			// located in Germany and we waste a lot of time making requests from our Virginia Amazon server
			// (making requests directly from RIX takes 50-100 ms on dev, but from RIX through prod server - 270 ms)
			url: profileData.endpoint,
			headers: {
				'SOAPAction': 'http://webservices.amadeus.com/HSFREQ_07_3_1A',
				'Content-Type': 'text/xml; charset=utf-8',
			},
			body: soapEnvXml,
		}).then(rs => rs.body).then(rsXml => {
			const dom = parseXml(rsXml);
			return wrapExc(() => parseCmdRs(dom, profileName)).catch(exc => {
				exc.httpStatusCode = Rej.BadGateway.httpStatusCode;
				exc.message = 'Invalid Amadeus cmd response - ' + exc.message;
				return Promise.reject(exc);
			});
		}).then(cmdRs => cmdRs.gdsData);
	};

	/** @param gdsData = parseCmdRs().gdsData */
	const runCmd = async (rqBody, gdsData) => {
		const cmd = rqBody.command;
		const profileName = gdsData.profileName;
		const profileData = await getAmadeus(profileName);

		const soapEnvXml = makeContinueSoapEnvXml({
			messageId: makeMessageId(),
			gdsData, profileData, payloadXml: makeCmdPayloadXml(cmd),
			status: 'InSeries', action: 'HSFREQ_07_3_1A',
		});

		return PersistentHttpRq({
			url: profileData.endpoint,
			headers: {
				'SOAPAction': 'http://webservices.amadeus.com/HSFREQ_07_3_1A',
				'Content-Type': 'text/xml; charset=utf-8',
			},
			body: soapEnvXml,
		}).then(rs => rs.body).then(rsXml => {
			const dom = parseXml(rsXml);
			return wrapExc(() => parseCmdRs(dom, profileName)).catch(exc => {
				exc.httpStatusCode = Rej.BadGateway.httpStatusCode;
				exc.message = 'Invalid Amadeus cmd response - ' + exc.message;
				return Promise.reject(exc);
			});
		}).catch(exc => {
			if ((exc + '').indexOf('95|Session|Inactive conversation') > -1) {
				return LoginTimeOut('Session token expired');
			} else {
				return Promise.reject(exc);
			}
		});
	};

	const closeSession = async (gdsData) => {
		const profileName = gdsData.profileName;
		const profileData = await getAmadeus(profileName);

		const payloadXml = '<ns1:Security_SignOut xmlns:ns1="http://xml.amadeus.com/VLSSOQ_04_1_1A"/>';
		const soapEnvXml = makeContinueSoapEnvXml({
			messageId: makeMessageId(),
			gdsData, profileData, payloadXml,
			status: 'InSeries',
			action: 'VLSSOQ_04_1_1A',
		});

		return PersistentHttpRq({
			url: profileData.endpoint,
			headers: {
				'SOAPAction': 'http://webservices.amadeus.com/VLSSOQ_04_1_1A',
				'Content-Type': 'text/xml; charset=utf-8',
			},
			body: soapEnvXml,
		}).then(rs => rs.body).then(rsXml => {
			const dom = parseXml(rsXml);
			return {
				status: dom.querySelector('Security_SignOutReply > processStatus > statusCode').textContent,
			};
		});
	};

	const makeSession = (gdsData) => ({
		gdsData: gdsData,
		// TODO: refactor and leave just getGdsData()
		getGdsData: () => gdsData,
		runCmd: (cmd) => runCmd({command: cmd}, gdsData)
			.then(result => ({cmd, ...result})),
	});

	const withSession = async (params, action) => {
		const pcc = params.pcc || null;
		const profileName = params.profileName
			|| GdsProfiles.AMADEUS.AMADEUS_PROD_1ASIWTUTICO;
		return startSession({profileName, pcc}).then(gdsData => {
			const session = makeSession(gdsData);
			return Promise.resolve()
				.then(() => action(session))
				.finally(() => {
					closeSession(gdsData);
				});
		});
	};

	const getFareRules = async (gdsData, params) => {
		const profileName = gdsData.profileName;
		let profileData = await GdsProfiles.getAmadeus(profileName);
		const pcc = params.pcc || profileData.default_pcc;
		profileData = {...profileData, pcc};

		const soapEnvXml = makeSoapEnvForActionWithLogin({
			profileData,
			passwordRec: makePasswordRec(profileData),
			action: 'FARRNQ_10_1_1A',
			payloadXml: AmadeusFareRules.buildFareRuleXml(params),
		});

		const result = await PersistentHttpRq({
			url: profileData.endpoint,
			headers: {
				'SOAPAction': 'http://webservices.amadeus.com/FARRNQ_10_1_1A',
				'Content-Type': 'text/xml; charset=utf-8',
			},
			body: soapEnvXml,
		});

		return AmadeusFareRules.parseFareRuleXmlResponse(result.body);
	};

	return {
		startSession,
		runCmd,
		closeSession,
		withSession,
		getFareRules,
	};
};

const defaultInst = AmadeusClient({});

defaultInst.makeCustom = params => AmadeusClient(params);

module.exports = defaultInst;