
let PersistentHttpRq = require('../Utils/PersistentHttpRq.js');
let {getSabre} = require('../Repositories/GdsProfiles.js');
let {parseXml, wrapExc} = require("../Utils/Misc.js");
let Rej = require("../Utils/Rej.js");

exports.startSession = async (params) => {
	let profileName = params.profileName;
	let profileData = await getSabre(profileName);

	let conversationId = '2019-02-22T19:07:04@innogateway5c7048587a71aPID4209';
	let messageId = '1876459793';
	let soapEnvXml = [
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
		'      <ns3:ConversationId>' + conversationId + '</ns3:ConversationId>',
		'      <ns3:Service ns3:type="OTA">SessionCreateRQ</ns3:Service>',
		'      <ns3:Action>SessionCreateRQ</ns3:Action>',
		'      <ns3:MessageData>',
		'        <ns3:MessageId>' + messageId + '</ns3:MessageId>',
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

	return PersistentHttpRq({
		url: 'https://webservices.sabre.com/websvc',
		headers: {
			'SOAPAction': 'OTA',
			'Content-Type': 'text/xml; charset=utf-8',
		},
		body: soapEnvXml,
	}).then(rs => rs.body).then(rsXml => {
		let dom = parseXml(rsXml);
		return wrapExc(() => ({
			profileName: profileData.profileName,
			conversationId: conversationId,
			messageId: messageId,
			binarySecurityToken: dom.querySelector('wsse\\:BinarySecurityToken').textContent,
		})).catch(exc => {
			exc.httpStatusCode = Rej.BadGateway.httpStatusCode;
			exc.message = 'Invalid Sabre session response - ' + exc.message;
			return Promise.reject(exc);
		});
	});
};

/** @param gdsData = await await require('SabreClient.js').startSession() */
exports.runCmd = async (rqBody, gdsData) => {
	let cmd = rqBody.command;
	let profileName = gdsData.profileName;
	let profileData = await getSabre(profileName);

	let soapEnvXml = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<SOAP-ENV:Envelope',
		'	xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"',
		'	xmlns:ns1="http://webservices.sabre.com/sabreXML/2003/07"',
		'	xmlns:ns2="http://schemas.xmlsoap.org/ws/2002/12/secext"',
		'	xmlns:ns3="http://www.ebxml.org/namespaces/messageHeader">',
		'  <SOAP-ENV:Header>',
		'    <ns2:Security>',
		'      <ns2:BinarySecurityToken>' + gdsData.binarySecurityToken + '</ns2:BinarySecurityToken>',
		'    </ns2:Security>',
		'    <ns3:MessageHeader>',
		'      <ns3:From>',
		'        <ns3:PartyId ns3:type="urn:x12.org:IO5:01">innogw.dyninno.net</ns3:PartyId>',
		'      </ns3:From>',
		'      <ns3:To>',
		'        <ns3:PartyId ns3:type="urn:x12.org:IO5:01">webservices.sabre.com/websvc</ns3:PartyId>',
		'      </ns3:To>',
		'      <ns3:CPAId>' + profileData.default_pcc + '</ns3:CPAId>',
		'      <ns3:ConversationId>' + gdsData.conversationId + '</ns3:ConversationId>',
		'      <ns3:Service ns3:type="OTA">SabreCommandLLSRQ</ns3:Service>',
		'      <ns3:Action>SabreCommandLLSRQ</ns3:Action>',
		'      <ns3:MessageData>',
		'        <ns3:MessageId>' + gdsData.messageId + '</ns3:MessageId>',
		'        <ns3:Timestamp>2019-02-22T19:07:05</ns3:Timestamp>',
		'        <ns3:Timeout>600</ns3:Timeout>',
		'      </ns3:MessageData>',
		'    </ns3:MessageHeader>',
		'  </SOAP-ENV:Header>',
		'  <SOAP-ENV:Body>',
		'    <ns1:SabreCommandLLSRQ>',
		'      <ns1:Request>',
		'        <ns1:HostCommand>' + cmd + '</ns1:HostCommand>',
		'      </ns1:Request>',
		'    </ns1:SabreCommandLLSRQ>',
		'  </SOAP-ENV:Body>',
		'</SOAP-ENV:Envelope>',
	].join('\n');

	return PersistentHttpRq({
		url: 'https://webservices.sabre.com/websvc',
		headers: {
			'SOAPAction': 'OTA',
			'Content-Type': 'text/xml; charset=utf-8',
		},
		body: soapEnvXml,
	}).then(rs => rs.body).then(rsXml => {
		let dom = parseXml(rsXml);
		return wrapExc(() => ({
			output: dom.querySelector('SabreCommandLLSRS > Response').textContent,
		})).catch(exc => {
			exc.httpStatusCode = Rej.BadGateway.httpStatusCode;
			exc.message = 'Invalid Sabre cmd response - ' + exc.message;
			return Promise.reject(exc);
		});
	});
};
