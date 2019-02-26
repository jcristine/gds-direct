class AbstractGdsAction {
	constructor() {
		this.$log = ($cmd, $data) => {};
		this.$session = null;
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