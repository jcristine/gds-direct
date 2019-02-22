
let {getAmadeus} = require("../Repositories/GdsProfiles.js");
let PersistentHttpRq = require('../Utils/PersistentHttpRq.js');
let crypto = require('crypto');
let util = require('util');
let {parseXml, wrapExc} = require("../Utils/Misc.js");
let Rej = require("../Utils/Rej.js");

let chr = (charCode) => String.fromCharCode(charCode);

let uuidv4 = () => {
	let $data = crypto.randomBytes(16);

	$data[6] = chr($data[6] & 0x0f | 0x40); // set version to 0100
	$data[8] = chr($data[8] & 0x3f | 0x80); // set bits 6-7 to 10

	return util.format('%s%s-%s-%s-%s-%s%s%s', ...$data.toString('hex').match(/.{1,4}/g));
};

let sha1 = (str) => {
	let crypto = require('crypto');
	let shasum = crypto.createHash('sha1');
	shasum.update(str);
	return shasum;
};

let makePasswordHash = (nonce, timestamp, password) => {
	let passwordSha1 = sha1(password).digest();
	let resultSrc = Buffer.concat([Buffer.from(nonce + timestamp), passwordSha1]);
	return sha1(resultSrc).digest('base64');
};

let makeStartSoapEnvXml = (profileData, payloadXml) => {
	let nonceBytes = crypto.randomBytes(16);
	let nonce = nonceBytes.toString('base64');
	let timestamp = new Date().toISOString(); // '2019-02-21T19:37:28.361Z'
	let password = makePasswordHash(nonce, timestamp, profileData.password); // 'LjWB9HZPLHIuWPa9FyzIl8n1NzU=';
	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<SOAP-ENV:Envelope ',
		'    xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" ',
		'    xmlns:ns1="http://xml.amadeus.com/HSFREQ_07_3_1A" ',
		'    xmlns:ns2="http://xml.amadeus.com/2010/06/Session_v3" ',
		'    xmlns:ns3="http://www.w3.org/2005/08/addressing" ',
		'    xmlns:ns4="http://wsdl.amadeus.com/2010/06/ws/Link_v1" ',
		'    xmlns:ns5="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wsswssecurity-secext-1.0.xsd" ',
		'    xmlns:ns6="http://xml.amadeus.com/2010/06/Security_v1">',
		'  <SOAP-ENV:Header>',
		'    <awsse:Session xmlns:awsse="http://xml.amadeus.com/2010/06/Session_v3" TransactionStatusCode="Start"/>',
		'    <ns3:MessageID>' + uuidv4() + '</ns3:MessageID>',
		'    <ns3:Action>http://webservices.amadeus.com/HSFREQ_07_3_1A</ns3:Action>',
		'    <ns3:To>https://nodeD1.production.webservices.amadeus.com/1ASIWTUTICO</ns3:To>',
		'    <ns4:TransactionFlowLink/>',
		'    <oas:Security xmlns:oas="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">',
		'      <oas:UsernameToken xmlns:oas1="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" oas1:Id="UsernameToken-1">',
		'        <oas:Username>' + profileData.username + '</oas:Username>',
		'        <oas:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">' + Buffer.from(nonce).toString('base64') + '</oas:Nonce>',
		'        <oas:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest">' + password + '</oas:Password>',
		'        <oas1:Created>' + timestamp + '</oas1:Created>',
		'      </oas:UsernameToken>',
		'    </oas:Security>',
		'    <AMA_SecurityHostedUser xmlns="http://xml.amadeus.com/2010/06/Security_v1">',
		'      <UserID AgentDutyCode="SU" RequestorType="U" PseudoCityCode="' + profileData.default_pcc + '" POS_Type="1"/>',
		'    </AMA_SecurityHostedUser>',
		'  </SOAP-ENV:Header>',
		'  <SOAP-ENV:Body>' + payloadXml + '</SOAP-ENV:Body>',
		'</SOAP-ENV:Envelope>',
	].join('\n');
};

/** @param gdsData = parseCmdRs().gdsData */
let makeContinueSoapEnvXml = (gdsData, payloadXml) => [
	'<?xml version="1.0" encoding="UTF-8"?>',
	'<SOAP-ENV:Envelope ',
	'    xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" ',
	'    xmlns:ns1="http://xml.amadeus.com/HSFREQ_07_3_1A" ',
	'    xmlns:ns2="http://xml.amadeus.com/2010/06/Session_v3" ',
	'    xmlns:ns3="http://www.w3.org/2005/08/addressing">',
	'  <SOAP-ENV:Header>',
	'    <awsse:Session xmlns:awsse="http://xml.amadeus.com/2010/06/Session_v3" TransactionStatusCode="InSeries">',
	'      <awsse:SessionId>' + gdsData.sessionId + '</awsse:SessionId>',
	'      <awsse:SequenceNumber>' + gdsData.seqNumber + '</awsse:SequenceNumber>',
	'      <awsse:SecurityToken>' + gdsData.securityToken + '</awsse:SecurityToken>',
	'    </awsse:Session>',
	'    <ns3:MessageID>' + uuidv4() + '</ns3:MessageID>',
	'    <ns3:Action>http://webservices.amadeus.com/HSFREQ_07_3_1A</ns3:Action>',
	'    <ns3:To>https://nodeD1.production.webservices.amadeus.com/1ASIWTUTICO</ns3:To>',
	'  </SOAP-ENV:Header>',
	'  <SOAP-ENV:Body>' + payloadXml + '</SOAP-ENV:Body>',
	'</SOAP-ENV:Envelope>',
].join('\n');

let makeCmdPayloadXml = (cmd) =>[
	'    <ns1:Command_Cryptic>',
	'      <ns1:messageAction>',
	'        <ns1:messageFunctionDetails>',
	'          <ns1:messageFunction>M</ns1:messageFunction>',
	'        </ns1:messageFunctionDetails>',
	'      </ns1:messageAction>',
	'      <ns1:longTextString>',
	'        <ns1:textStringDetails>' + cmd + '</ns1:textStringDetails>',
	'      </ns1:longTextString>',
	'    </ns1:Command_Cryptic>',
].join('\n');

/** @throws TypeError */
let parseCmdRs = (dom, profileData) => ({
	gdsData: {
		sessionId: dom.querySelector('awsse\\:SessionId').textContent,
		seqNumber: dom.querySelector('awsse\\:SequenceNumber').textContent,
		securityToken: dom.querySelector('awsse\\:SecurityToken').textContent,
		pcc: profileData.default_pcc,
		profileName: profileData.profileName,
	},
	output: dom.querySelector('Command_CrypticReply > longTextString > textStringDetails').textContent,
});

exports.startSession = async (params) => {
	let profileName = params.profileName;
	let profileData = await getAmadeus(profileName);

	let payloadXml = makeCmdPayloadXml('MD0');
	let soapEnvXml = makeStartSoapEnvXml(profileData, payloadXml);

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
		let dom = parseXml(rsXml);
		return wrapExc(() => parseCmdRs(dom, profileData)).catch(exc => {
			exc.httpStatusCode = Rej.BadGateway.httpStatusCode;
			exc.message = 'Invalid Amadeus cmd response - ' + exc.message;
			return Promise.reject(exc);
		});
	}).then(cmdRs => cmdRs.gdsData);
};

/** @param gdsData = parseCmdRs().gdsData */
exports.runCmd = async (rqBody, gdsData) => {
	let cmd = rqBody.command;
	let profileName = gdsData.profileName;
	let profileData = await getAmadeus(profileName);

	let payloadXml = makeCmdPayloadXml(cmd);
	let soapEnvXml = makeContinueSoapEnvXml(gdsData, payloadXml);

	return PersistentHttpRq({
		url: profileData.endpoint,
		headers: {
			'SOAPAction': 'http://webservices.amadeus.com/HSFREQ_07_3_1A',
			'Content-Type': 'text/xml; charset=utf-8',
		},
		body: soapEnvXml,
	}).then(rs => rs.body).then(rsXml => {
		let dom = parseXml(rsXml);
		return wrapExc(() => parseCmdRs(dom, profileData)).catch(exc => {
			exc.httpStatusCode = Rej.BadGateway.httpStatusCode;
			exc.message = 'Invalid Amadeus cmd response - ' + exc.message;
			return Promise.reject(exc);
		});
	});
};