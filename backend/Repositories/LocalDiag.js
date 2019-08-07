const Misc = require('klesun-node-tools/src/Utils/Misc.js');
const Db = require('../Utils/Db.js');
const {StrConsts, never} = require('../Utils/StrConsts.js');

/**
 * @module - an alternative to diag.dyninno.net for errors that may
 * happen 20 times in a row - to not trash the limited web UI
 */

const TABLE = 'local_diag';

const LocalDiag  = ({type, data}) => {
	return Db.with(db => db.writeRows(TABLE, [{
		type: type,
		dt: Misc.sqlNow(),
		data: JSON.stringify(data),
	}]));
};

LocalDiag.types = StrConsts({
	get REPORT_CMD_CALLED_RQ_TIMEOUT() { never(); },
	get REPORT_CMD_CALLED_RQ_NOT_ALLOWED() { never(); },
	get REPORT_CMD_CALLED_RQ_INTERNAL_SERVICE_ERROR() { never(); },
	get AMA_TMP_NETWORK_ERROR_UNABLE_TO_REACH() { never(); },
});

module.exports = LocalDiag;