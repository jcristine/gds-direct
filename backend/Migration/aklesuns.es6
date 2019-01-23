
module.exports.migrations = [
	{
		name: '00.00.01',
		perform: (db) => db.query([
			'CREATE TABLE `terminalBuffering` (',
			'  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,',
			'  `agentId` int(10) unsigned NOT NULL,',
			'  `requestId` int(10) unsigned NOT NULL DEFAULT 0,',
			'  `gds` VARCHAR(15),',
			'  `dialect` VARCHAR(15),',
			'  `rbsSessionId` int(10) unsigned DEFAULT NULL,',
			'  `gdsSessionDataMd5` CHAR(32) DEFAULT NULL,',
			'  `area` char(1) DEFAULT NULL,',
			'  `terminalNumber` tinyint(3) unsigned NOT NULL,',
			'  `processedTime` decimal(10,5) NOT NULL DEFAULT "0.00000",',
			'  `command` varchar(127) DEFAULT NULL,',
			'  `output` text,',
			'  `requestTimestamp` int(10) unsigned DEFAULT NULL,',
			'  `responseTimestamp` int(10) unsigned DEFAULT NULL,',
			'  PRIMARY KEY (`id`),',
			'  KEY `agentId_requestId` (`agentId`, `requestId`),',
			'  KEY `rbsSessionId` (`rbsSessionId`),',
			'  KEY `gdsSessionDataMd5` (`gdsSessionDataMd5`)',
			') ENGINE=InnoDB CHARSET=utf8',
		].join('\n')),
	},
	{
		name: '00.00.02',
		perform: (db) => db.query([
			'CREATE TABLE `terminalSettings` (',
			'  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,',
			'  `agentId` int(10) unsigned NOT NULL,',
			'  `gds` VARCHAR(15) NOT NULL,',
			'  `language` tinyint(4) NOT NULL,',
			'  `matrixConfiguration` varchar(255) DEFAULT NULL,',
			'  `terminalNumber` tinyint(3) unsigned NOT NULL DEFAULT \'1\',',
			'  `fontSize` tinyint(3) unsigned NOT NULL DEFAULT \'1\',',
			'  `keyBindings` text,',
			'  `terminalTheme` tinyint(3) DEFAULT NULL,',
			'  PRIMARY KEY (`id`),',
			'  UNIQUE KEY `agentId_gds` (`agentId`,`gds`)',
			') ENGINE=InnoDB DEFAULT CHARSET=utf8',
		].join('\n')),
	},
	{
		name: '00.00.03',
		perform: (db) => db.query([
			'CREATE TABLE `terminalAreaSettings` (',
			'  `id` int(11) NOT NULL AUTO_INCREMENT,',
			'  `gds` varchar(15) NOT NULL,',
			'  `area` char(1) NOT NULL,',
			'  `agentId` int(11) NOT NULL,',
			'  `defaultPcc` varchar(9) DEFAULT NULL,',
			'  PRIMARY KEY (`id`),',
			'  UNIQUE KEY `agentId_gds_area` (`agentId`,`gds`,`area`)',
			') ENGINE=InnoDB DEFAULT CHARSET=utf8',
		].join('\n')),
	},
	{
		name: '00.00.04',
		perform: (db) => db.query([
			// called terminalHighlightLanguages in CMS
			"CREATE TABLE `highlightCmdPatterns` (",
			"  `id` int(11) NOT NULL AUTO_INCREMENT,",
			"  `ruleId` int(10) unsigned NOT NULL,",
			"  `dialect` VARCHAR(15) NOT NULL,",
			"  `cmdPattern` varchar(255) DEFAULT NULL,",
			"  `onClickCommand` varchar(50) DEFAULT NULL,",
			"  `regexError` tinyint(3) unsigned DEFAULT '0',",
			"  PRIMARY KEY (`id`),",
			"  UNIQUE KEY `ruleId_dialect` (`ruleId`,`dialect`)",
			") ENGINE=InnoDB DEFAULT CHARSET=utf8",
		].join('\n')),
	},
	{
		name: '00.00.05',
		perform: (db) => db.query([
			"CREATE TABLE `highlightRules` (",
		   "  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,",
		   "  `highlightGroup` VARCHAR(50) NOT NULL DEFAULT '0',",
		   "  `color` VARCHAR(50) NOT NULL,",
		   "  `backgroundColor` VARCHAR(50) DEFAULT NULL,",
		   "  `highlightType` VARCHAR(50) NOT NULL,",
		   "  `priority` INTEGER unsigned NOT NULL DEFAULT '0',",
		   "  `name` varchar(255) NOT NULL,",
		   "  `label` varchar(255) DEFAULT NULL,",
		   "  `message` varchar(255) DEFAULT NULL,",
		   "  `isMessageOnClick` BOOLEAN NOT NULL DEFAULT FALSE,",
		   "  `isOnlyFirstFound` BOOLEAN NOT NULL DEFAULT FALSE,",
		   "  `isEnabled` BOOLEAN DEFAULT TRUE,",
		   "  `isForTestersOnly` BOOLEAN DEFAULT FALSE,",
		   "  `isInSameWindow` BOOLEAN NOT NULL DEFAULT FALSE,",
		   "  `decoration` VARCHAR(255),",
		   "  PRIMARY KEY (`id`),",
		   "  UNIQUE KEY `terminalHighlight_name_uindex` (`name`)",
		   ") ENGINE=InnoDB DEFAULT CHARSET=utf8",
		].join('\n')),
	},
	{
		name: '00.00.06',
		perform: (db) => db.query([
			"CREATE TABLE `highlightOutputPatterns` (",
			"  `id` int(11) NOT NULL AUTO_INCREMENT,",
			"  `ruleId` int(10) unsigned NOT NULL,",
			"  `gds` VARCHAR(15) NOT NULL,",
			"  `pattern` varchar(255) DEFAULT NULL,",
			"  `regexError` BOOLEAN DEFAULT '0',",
			"  PRIMARY KEY (`id`),",
			"  UNIQUE KEY `gds_ruleId` (`gds`, `ruleId`)",
			") ENGINE=InnoDB DEFAULT CHARSET=utf8",
		].join('\n')),
	},
	{
		name: '00.00.07-create-http-rq-log-table',
		perform: (db) => db.query([
			"CREATE TABLE `http_rq_log` (",
			"  `id` INT NOT NULL AUTO_INCREMENT,",
			"  `path` VARCHAR(255) NOT NULL,",
			"  `dt` DATETIME NOT NULL,",
			"  `agentId` INT DEFAULT NULL,",
			"  `logId` VARCHAR(255),",
			"  PRIMARY KEY (`id`),",
			"  KEY `dt` (`dt`)",
			") ENGINE=InnoDB DEFAULT CHARSET=utf8",
		].join('\n')),
	},
	{
		name: '00.00.08-create-themes-table',
		perform: (db) => db.query([
			"CREATE TABLE `terminalThemes` (",
			"  `id` int(11) NOT NULL AUTO_INCREMENT,",
			"  `label` varchar(100) NOT NULL,",
			"  `colors` text NOT NULL,",
			"  PRIMARY KEY (`id`)",
			") ENGINE=InnoDB DEFAULT CHARSET=utf8",
		].join('\n')),
	},
	{
		name: '00.00.09-fill-themes-table',
		perform: (db) => db.query([
			'REPLACE INTO `terminalThemes` (`id`, `label`, `colors`) VALUES ',
			'(4,\'Apollo Default\',\'{"defaultBg":{"background-color":"#191a1b"},"activeWindow":{"background-color":"#2a2835"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#ff0000","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#00ff00"},"specialHighlight":{"color":"#00ff00"},"highlightDark":{"background-color":"#ddeeff","font-weight":"bold"},"highlightLight":{"background-color":"#f40000"},"highlightBlue":{"background-color":"#00029f"},"fixedColumnBackground":{"background-color":"#3deb28"}}\'),',
			'(6,\'Sabre Default\',\'{"defaultBg":{"background-color":"#000080"},"activeWindow":{"background-color":"#000080"},"entryFont":{"color":"#ffff00"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#fa0000","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#00ff00","font-weight":"bold"},"specialHighlight":{"color":"#35c26e","font-weight":"bold"},"highlightDark":{"background-color":""},"highlightLight":{"background-color":"#751515"},"highlightBlue":{"background-color":"#000000"},"fixedColumnBackground":{"background-color":""}}\'),',
			'(8,\'Natural Apollo\',\'{"defaultBg":{"background-color":"#3f7b7d"},"activeWindow":{"background-color":"#428284"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#f30912","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#00ff00"},"specialHighlight":{"color":"#eab00b"},"highlightDark":{"background-color":""},"highlightLight":{"background-color":"#eab00b"},"highlightBlue":{"background-color":""},"fixedColumnBackground":{"background-color":""}}\'),',
			'(10,\'Black on White\',\'{"defaultBg":{"background-color":"#f2f2f2"},"activeWindow":{"background-color":"#ffffff"},"entryFont":{"color":"#0000ff"},"outputFont":{"color":"#000000"},"usedCommand":{"color":"#0000ff","font-weight":"bold"},"errorMessage":{"color":"#ff0000","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#008000","font-weight":"bold"},"specialHighlight":{"color":"#008000","font-weight":"bold"}}\'),',
			'(12,\'CMS Color Scheme\',\'{"defaultBg":{"background-color":"#545e70"},"activeWindow":{"background-color":"#3d4452"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#f60a0c","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#0ff940"},"specialHighlight":{"color":"#44f0f9"}}\'),',
			'(16,\'Exotic Green\',\'{"defaultBg":{"background-color":"#191a1b"},"activeWindow":{"background-color":"#2a2835"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#17f308"},"usedCommand":{"color":"#f1fb33"},"errorMessage":{"color":"#fb1010","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#18fafa"},"specialHighlight":{"color":"#fa70f9"}}\'),',
			'(18,\'Chocolate\',\'{"defaultBg":{"background-color":"#403835"},"activeWindow":{"background-color":"#483f3b"},"entryFont":{"color":"#f2f2f2"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00","font-weight":"bold"},"errorMessage":{"color":"#ff5252","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#35c26e","font-weight":"bold"},"specialHighlight":{"color":"#00ff00","font-weight":"bold"}}\'),',
			'(20,\'Deep Ocean\',\'{"defaultBg":{"background-color":"#141e29"},"activeWindow":{"background-color":"#192633"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#ff0000"},"warningMessage":{"color":"#65d994"},"startSession":{"color":"#81f7b1"},"specialHighlight":{"color":"#18fafa"}}\'),(22,\'SmartPoint Theme\',\'{"defaultBg":{"background-color":"#4b4b4b"},"activeWindow":{"background-color":"#525151"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#ff0000","font-weight":"bold"},"warningMessage":{"color":"#77fc77"},"startSession":{"color":"#00ff00"},"specialHighlight":{"color":"#7eb9f9"}}\'),',
			'(24,\'Deep Ocean (no highlights)\',\'{"defaultBg":{"background-color":"#141e29"},"activeWindow":{"background-color":"#192633"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffffff"},"errorMessage":{"color":"#ffffff"},"warningMessage":{"color":"#ffffff"},"startSession":{"color":"#ffffff"},"specialHighlight":{"color":"#ffffff"}}\')',
			';',
		].join('\n')),
	},
];