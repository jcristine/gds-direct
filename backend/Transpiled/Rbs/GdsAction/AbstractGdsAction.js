class AbstractGdsAction {
	constructor() {
		this.$log = ($cmd, $data) => {};
		this.$session = null;
	}

	setLog($log) {
		this.$log = $log;
		return this;
	}

	log($msg, $data) {
		let $log;
		$log = this.$log;
		$log($msg, $data);
		return this;
	}

	setSession($apollo) {
		this.$session = $apollo;
		return this;
	}

	runCmd($cmd) {
		let $log, $dump;
		$log = this.$log;
		$cmd = php.strtoupper($cmd);
		$dump = this.$session.fetchAllOutput($cmd, $forceScrolling);
		$log('GDS result: (' + $cmd + ')', $dump);
		return $dump;
	}
}

module.exports = AbstractGdsAction;