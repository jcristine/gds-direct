class AbstractGdsAction {
	constructor() {
		this.session = null;
	}

	/** @param session = await require('StatefulSession.js')() */
	setSession(session) {
		this.session = session;
		return this;
	}

	async runCmd($cmd) {
		$cmd = $cmd.toUpperCase();
		let $cmdRec = await this.session.runCmd($cmd);
		return $cmdRec;
	}
}

module.exports = AbstractGdsAction;