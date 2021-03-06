const MpRemarkLogs = require('../Repositories/MpRemarkLogs.js');

const Emc = require('../LibWrappers/Emc.js');
const Redis = require("../LibWrappers/Redis");

module.exports.migrations = [
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
		name: 'GRECT/2019.04.10002-fix-optional-lang-col-2',
		perform: (db) => db.query([
			'ALTER TABLE terminalSettings MODIFY COLUMN language tinyint(4) NOT NULL DEFAULT 0;',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.04.16010-make-setting-lang-col-string',
		perform: (db) => db.query([
			'ALTER TABLE terminalSettings MODIFY COLUMN language VARCHAR(10) DEFAULT "";',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.04.16010-reset-setting-lang-col',
		perform: (db) => db.query([
			'UPDATE terminalSettings SET language = "";',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.07.25002-add-custom-data-to-terminal-settings-2',
		perform: db => db.query([
			'CREATE TABLE agent_custom_settings (',
			'    id INT PRIMARY KEY AUTO_INCREMENT,',
			'    agentId INT NOT NULL,',
			'    name VARCHAR(50) NOT NULL,',
			'    data TEXT NOT NULL,',
			'    UNIQUE KEY agentId_name (agentId, name)',
			') ENGINE=InnoDB DEFAULT CHARSET=utf8;',
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
		name: 'GRECT/2019.08.23002-create-highlight-rule-sample-dumps-table',
		perform: db => db.query([
			'CREATE TABLE highlight_sample_dumps (',
			'    id INT PRIMARY KEY AUTO_INCREMENT,',
			'    outputPatternId INT NOT NULL,',
			'    comment TEXT DEFAULT "",',
			'    dump TEXT NOT NULL,',
			'    KEY outputPatternId (outputPatternId)',
			') ENGINE=InnoDB DEFAULT CHARSET=utf8',
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
	{
		name: 'GRECT/2019.02.26005-create-roles-amr',
		perform: async (db) => {
			const emc = await Emc.getClient();
			return emc.addRole([
				{"name": "NEW_GDS_DIRECT_ACCESS", "project": "GDSD", "description": "Same as in RBS"},
				{"name": "NEW_GDS_DIRECT_TICKETING", "project": "GDSD", "description": "Same as in RBS"},
				{"name": "NEW_GDS_DIRECT_QUEUE_PROCESSING", "project": "GDSD", "description": "Same as in RBS"},
				{"name": "NEW_GDS_DIRECT_PNR_SEARCH", "project": "GDSD", "description": "Same as in RBS"},
				{"name": "NEW_GDS_DIRECT_EDIT_TICKETED_PNR", "project": "GDSD", "description": "Same as in RBS"},
				{"name": "NEW_GDS_DIRECT_EDIT_VOID_TICKETED_PNR", "project": "GDSD", "description": "Same as in RBS"},
				{"name": "NEW_GDS_DIRECT_CC_ACCESS", "project": "GDSD", "description": "Same as in RBS"},
				{"name": "NEW_GDS_DIRECT_CONTACT_INFO_ACCESS", "project": "GDSD", "description": "Same as in RBS"},
				{"name": "NEW_GDS_DIRECT_EMULATE_ANY_PCC", "project": "GDSD", "description": "Same as in RBS"},
				{"name": "NEW_GDS_DIRECT_ANY_PCC_AVAILABILITY", "project": "GDSD", "description": "Same as in RBS"},
				{
					"name": "NEW_GDS_DIRECT_CAN_EMULATE_TO_RESTRICTED_SABRE_PCCS",
					"project": "GDSD",
					"description": "Same as in RBS"
				},
				{"name": "NEW_GDS_DIRECT_NO_LEAD_PNR", "project": "GDSD", "description": "Same as in RBS"},
				{"name": "NEW_GDS_DIRECT_PRIVATE_PNR_ACCESS", "project": "GDSD", "description": "Same as in RBS"},
				{"name": "NEW_GDS_DIRECT_MULTI_PCC_TARIFF_DISPLAY", "project": "GDSD", "description": "Same as in RBS"},
				{"name": "NEW_GDS_DIRECT_PASTE_ITINERARY", "project": "GDSD", "description": "Same as in RBS"},
				{"name": "NEW_GDS_DIRECT_HHMCO", "project": "GDSD", "description": "Same as in RBS"},
			]);
		},
	},
	{
		name: 'GRECT/2019.02.27002-create-airports-table',
		perform: (db) => db.query([
			"CREATE TABLE `airports` (",
			"  `iata_code` char(3) COLLATE utf8_unicode_ci NOT NULL,",
			"  `name` varchar(250) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',",
			"  `country_code` char(2) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',",
			"  `country_code_3` char(3) COLLATE utf8_unicode_ci DEFAULT NULL,",
			"  `country_name` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,",
			"  `state_code` char(2) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',",
			"  `city_code` char(3) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',",
			"  `city_name` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,",
			"  `lat` decimal(7,4) DEFAULT NULL,",
			"  `lon` decimal(7,4) DEFAULT NULL,",
			"  `tz` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',",
			"  `updated_dt` datetime DEFAULT NULL,",
			"  `region_id` int(11) DEFAULT NULL,",
			"  `region_name` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,",
			"  `alternatives` tinytext COLLATE utf8_unicode_ci,",
			"  PRIMARY KEY (`iata_code`)",
			") ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci",
		].join('\n')),
	},
	{
		name: 'GRECT/2019.02.27004-add-key-by-city',
		perform: (db) => db.query([
			'ALTER TABLE airports ADD INDEX city_code (city_code);',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.02.28002-create-pccs-table',
		perform: (db) => db.query([
			"CREATE TABLE `pccs` (",
			"  `gds` varchar(10) COLLATE utf8_unicode_ci NOT NULL,",
			"  `pcc` varchar(9) COLLATE utf8_unicode_ci NOT NULL,",
			"  `consolidator` varchar(50) COLLATE utf8_unicode_ci NOT NULL,",
			"  `pcc_type` varchar(50) COLLATE utf8_unicode_ci NOT NULL,",
			"  `arc_type` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,",
			"  `content_type` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,",
			"  `description` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,",
			"  `arc_nr` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,",
			"  `dk_number` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,",
			"  `point_of_sale_country` char(2) COLLATE utf8_unicode_ci DEFAULT NULL,",
			"  `point_of_sale_city` char(3) COLLATE utf8_unicode_ci DEFAULT NULL,",
			"  `default_currency` char(3) COLLATE utf8_unicode_ci DEFAULT NULL,",
			"  `ticket_mask_pcc` varchar(9) COLLATE utf8_unicode_ci DEFAULT NULL,",
			"  `updated_dt` datetime DEFAULT NULL,",
			"  UNIQUE KEY `gds` (`gds`,`pcc`)",
			") ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci",
		].join('\n')),
	},
	{
		name: 'GRECT/2019.10.04019-add-custom-data-column-to-pccs',
		perform: (db) => db.query([
			'ALTER TABLE `pccs` ADD COLUMN data_json TEXT DEFAULT NULL;',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.03.01001-create-airlines-table',
		perform: (db) => db.query([
			"CREATE TABLE `airlines` (",
			"  `iata_code` char(2) NOT NULL,",
			"  `name` varchar(250) NOT NULL DEFAULT '',",
			"  `hub` char(3) DEFAULT NULL,",
			"  `updated_dt` datetime DEFAULT NULL,",
			"  PRIMARY KEY (`iata_code`)",
			") ENGINE=InnoDB CHARSET=utf8",
		].join('\n')),
	},
	{
		name: 'GRECT/2019.03.07005-create-airlines-table',
		perform: (db) => db.query([
			'CREATE TABLE `airline_booking_classes` (',
			'  `airline` varchar(2) NOT NULL,',
			'  `cabin_class` varchar(20) NOT NULL,',
			'  `booking_class` char(1) NOT NULL,',
			'  UNIQUE KEY `airline_booking_class` (`airline`,`booking_class`)',
			') ENGINE=InnoDB CHARSET=utf8',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.03.08008-create-terminal-sessions-table',
		perform: (db) => db.query([
			"CREATE TABLE `terminal_sessions` (",
			"  `id` int(11) NOT NULL AUTO_INCREMENT,",
			"  `gds` varchar(10) NOT NULL,",
			"  `created_dt` datetime NOT NULL,",
			"  `agent_id` int(11) NOT NULL,",
			"  `lead_id` int(11) DEFAULT NULL,",
			"  `log_id` varchar(100) DEFAULT NULL,",
			"  PRIMARY KEY (`id`),",
			"  KEY `gds` (`gds`),",
			"  KEY `agent_id` (`agent_id`)",
			") ENGINE=InnoDB CHARSET=utf8",
		].join('\n')),
	},
	{
		name: 'GRECT/2019.03.08008-add-dt-to-session-table-agent-index',
		perform: (db) => db.query([
			"ALTER TABLE terminal_sessions DROP INDEX agent_id,",
			"ADD COLUMN closed_dt DATETIME DEFAULT NULL,",
			"ADD INDEX closed_dt_agent_id (closed_dt, agent_id)",
		].join('\n')),
	},
	{
		name: 'GRECT/2019.03.08008-create-new-tcl-table-3',
		perform: (db) => db.query([
			"CREATE TABLE `terminal_command_log` (",
			"  `id` BIGINT NOT NULL AUTO_INCREMENT,",
			"  `session_id` int(11) DEFAULT NULL,",
			"  `gds` varchar(10) DEFAULT NULL,",
			"  `type` varchar(50) DEFAULT NULL,",
			// TODO: NOT NULL DEFAULT FALSE when historical records are moved
			"  `is_mr` BOOLEAN DEFAULT NULL,",
			"  `dt` datetime NOT NULL,",
			"  `cmd` varchar(255) NOT NULL,",
			"  `duration` decimal(10,4) NOT NULL,",
			"  `cmd_rq_id` BIGINT DEFAULT NULL,",
			"  `area` char(1) DEFAULT NULL,",
			"  `record_locator` char(6) DEFAULT '',",
			"  `has_pnr` tinyint(1) DEFAULT '0',",
			"  `is_pnr_stored` tinyint(1) DEFAULT '0',",
			"  `output` text NOT NULL,",
			"  PRIMARY KEY (`id`),",
			"  KEY `dt` (`dt`),",
			"  KEY `session_id` (`session_id`),",
			"  KEY `gds_type_dt` (`gds`,`type`, `dt`)",
			") ENGINE=InnoDB CHARSET=utf8",
		].join('\n')),
	},
	{
		name: 'GRECT/2019.04.09002-increase-cmd-col-size',
		perform: (db) => db.query([
			'ALTER TABLE terminal_command_log MODIFY COLUMN cmd TEXT;',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.03.08008-re-create-terminal-buffering-table-again-2',
		perform: (db) => db.query([
			'CREATE TABLE `cmd_rq_log` (',
			'  `id` bigint(20) unsigned PRIMARY KEY AUTO_INCREMENT,',
			'  `agentId` int(10) unsigned NOT NULL,',
			'  `requestId` int(10) unsigned NOT NULL DEFAULT 0,',
			'  `gds` VARCHAR(15),',
			'  `dialect` VARCHAR(15),',
			'  `sessionId` INTEGER NOT NULL,',
			'  `area` char(1) DEFAULT NULL,',
			'  `terminalNumber` tinyint(3) unsigned NOT NULL,',
			'  `processedTime` decimal(10,5) NOT NULL DEFAULT "0.00000",',
			'  `command` varchar(127) DEFAULT NULL,',
			'  `output` text,',
			'  `requestTimestamp` int(10) unsigned DEFAULT NULL,',
			'  `responseTimestamp` int(10) unsigned DEFAULT NULL,',
			'  KEY `agentId_requestId` (`agentId`, `requestId`),',
			'  KEY `sessionId` (`sessionId`)',
			') ENGINE=InnoDB CHARSET=utf8',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.04.15003-make-rq-cmd-text-instead-of-varchar',
		perform: (db) => db.query([
			'ALTER TABLE cmd_rq_log MODIFY command TEXT DEFAULT NULL;',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.06.17002-drop-cmd-rq-log-legacy-fields',
		perform: (db) => db.query([
			'ALTER TABLE cmd_rq_log',
			'DROP INDEX agentId_requestId,',
			'DROP COLUMN output,',
			'DROP COLUMN agentId,',
			'DROP COLUMN requestId,',
			'DROP COLUMN gds,',
			'DROP COLUMN terminalNumber,',
			'DROP COLUMN area,',
			'DROP COLUMN processedTime,',
			'DROP COLUMN responseTimestamp;',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.06.17001-create-cmd-rs-log-2',
		perform: (db) => db.query([
			'CREATE TABLE `cmd_rs_log` (',
			'  `id` bigint(20) unsigned PRIMARY KEY AUTO_INCREMENT,',
			'  `cmdRqId` INTEGER NOT NULL,',
			'  `agentId` int(10) unsigned NOT NULL,',
			'  `requestId` int(10) unsigned NOT NULL DEFAULT 0,',
			'  `gds` VARCHAR(15),',
			'  `dialect` VARCHAR(15),',
			'  `sessionId` INTEGER NOT NULL,',
			'  `terminalNumber` tinyint(3) unsigned NOT NULL,',
			'  `command` TEXT DEFAULT NULL,',
			'  `output` text,',
			'  `responseTimestamp` int(10) unsigned DEFAULT NULL,',
			'  KEY `agentId_requestId` (`agentId`, `requestId`),',
			'  KEY `sessionId` (`sessionId`)',
			') ENGINE=InnoDB CHARSET=utf8',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.06.18004-add-ts-index-in-cmd-rs-log',
		perform: (db) => db.query([
			'ALTER TABLE `cmd_rs_log` ADD INDEX responseTimestamp (responseTimestamp)',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.06.27003-optimize-truncated-rs-log-table',
		perform: (db) => db.query('OPTIMIZE TABLE cmd_rs_log'),
	},
	{
		name: 'GRECT/2019.03.08008-create-counted-fs-usages',
		perform: (db) => db.query([
			"CREATE TABLE `counted_fs_usages` (",
			"  `agent_id` int(11) NOT NULL,",
			"  `dt` datetime NOT NULL,",
			"  KEY `agent_date` (`agent_id`,`dt`)",
			") ENGINE=InnoDB CHARSET=utf8",
		].join('\n')),
	},
	{
		name: 'GRECT/2019.03.12001-create-td-table',
		perform: (db) => db.query([
			"CREATE TABLE `ticket_designators` (",
			"  `id` int(11) NOT NULL AUTO_INCREMENT,",
			"  `code` varchar(15) NOT NULL,",
			"  `is_published` tinyint(1) NOT NULL DEFAULT '0',",
			"  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',",
			"  `updated_dt` datetime DEFAULT NULL,",
			"  `ticketing_correct_pricing_command` varchar(250) DEFAULT NULL,",
			"  `ticketing_gds` varchar(15) DEFAULT NULL,",
			"  `ticketing_pcc` varchar(15) DEFAULT NULL,",
			"  `sale_correct_pricing_command` varchar(250) DEFAULT NULL,",
			"  `tour_code` varchar(50) DEFAULT NULL,",
			"  `updated_in_act_dt` datetime DEFAULT NULL,",
			"  `agency_incentive_value` decimal(10,2) DEFAULT NULL,",
			"  `agency_incentive_units` varchar(30) DEFAULT NULL,",
			"  `currency` char(3) DEFAULT NULL,",
			"  `drop_net_value` decimal(10,2) DEFAULT NULL,",
			"  `drop_net_units` varchar(30) DEFAULT NULL,",
			"  PRIMARY KEY (`id`),",
			"  UNIQUE KEY `code` (`code`),",
			"  KEY `updated_in_act_dt` (`updated_in_act_dt`)",
			") ENGINE=InnoDB DEFAULT CHARSET=utf8",
		].join('\n')),
	},
	{
		name: 'GRECT/2019.03.28001-create-agents-table',
		perform: (db) => db.query([
		    "CREATE TABLE `agents` (",
		    "  `id` int(11) NOT NULL,",
		    "  `login` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,",
		    "  `name` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,",
		    "  `fp_initials` char(3) COLLATE utf8_unicode_ci DEFAULT NULL,",
		    "  `sabre_initials` varchar(3) COLLATE utf8_unicode_ci DEFAULT NULL,",
		    "  `sabre_lniata` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,",
		    "  `sabre_id` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,",
		    "  `team_id` int(11) DEFAULT NULL,",
		    "  `is_active` tinyint(1) DEFAULT NULL,",
		    "  `deactivated_dt` datetime DEFAULT NULL,",
		    "  `updated_dt` datetime DEFAULT NULL,",
		    "  `email_list` text COLLATE utf8_unicode_ci,",
		    "  `gds_direct_fs_limit` int(11) DEFAULT NULL,",
		    "  `gds_direct_usage_limit` int(11) DEFAULT NULL,",
		    "  `roles` text default '',",
		    "  PRIMARY KEY (`id`)",
		    ") ENGINE=InnoDB DEFAULT CHARSET=utf8",
		].join('\n')),
	},
	{
		name: 'GRECT/2019.10.02005-add-json-to-agents',
		perform: (db) => db.query([
			'ALTER TABLE `agents` ADD COLUMN dataJson TEXT DEFAULT NULL;',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.10.02005-remove-roles-column-from-agents',
		perform: (db) => db.query([
			'ALTER TABLE `agents` DROP COLUMN roles;',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.10.02005-remove-sabre-lniata-column-from-agents',
		perform: (db) => db.query([
			'ALTER TABLE `agents` DROP COLUMN sabre_lniata;',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.04.02006-create-role-NEW_GDS_DIRECT_DEV_ACCESS',
		perform: async (db) => {
			const emc = await Emc.getClient();
			return emc.addRole([
				{"name": "NEW_GDS_DIRECT_DEV_ACCESS", "project": "GDSD", "description": "Allows seeing session log and other utility actions like running maintenance scripts, getting request debug info, etc..."},
			]);
		},
	},
	{
		name: 'GRECT/2019.04.12003-create-shortcut-actions-table-2',
		perform: (db) => db.query([
			"CREATE TABLE shortcut_actions (",
			"    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,",
			"    gds VARCHAR(10) NOT NULL,",
			"    name VARCHAR(100) NOT NULL,",
			"    data TEXT NOT NULL",
			") ENGINE=InnoDB DEFAULT CHARSET=utf8",
		].join('\n')),
	},
	{
		name: 'GRECT/2019.04.17005-create-mentioned-pnrs-table',
		perform: (db) => db.query([
			'CREATE TABLE mentioned_pnrs (',
			'    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,',
			'    recordLocator CHAR(6) NOT NULL,',
			'    gds VARCHAR(10) NOT NULL,',
			'    sessionId INT NOT NULL,',
			'    UNIQUE KEY (recordLocator, gds, sessionId)',
			') ENGINE=InnoDB DEFAULT CHARSET=utf8',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.04.18005-fix-l3ii-settings-2',
		perform: (db) => db.query([
			'UPDATE terminalAreaSettings',
			'SET defaultPcc = "6IIF"',
			'WHERE gds = "sabre" AND defaultPcc = "L3II"',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.05.21003-remove-unused-redis-keys',
		perform: async (db) => {
			const redis = await Redis.getClient();
			return Promise.all([
				redis.del('GRECT_CMD_RQ_LAST_INSERT_ID'),
				redis.del('GRECT_SESSION_LAST_INSERT_ID'),
				redis.del('GRECT_SESSION_TO_USER_ACCESS_MS'),
			]);
		},
	},
	{
		name: 'GRECT/2019.05.23001-create-generic-db-log',
		perform: (db) => db.query([
			'CREATE TABLE generic_log (',
			'    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,',
			'    dt DATETIME NOT NULL,',
			'    msg TEXT,',
			'    KEY dt (dt)',
			') ENGINE=InnoDB DEFAULT CHARSET=utf8',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.05.31003-create-admin-settings',
		perform: (db) => db.query([
			'CREATE TABLE admin_settings (',
			'    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,',
			'    name VARCHAR(50),',
			'    value TEXT,',
			'    UNIQUE KEY name (name)',
			') ENGINE=InnoDB DEFAULT CHARSET=utf8',
		].join('\n')),
	},
	{
		comment: 'to quickly store complex tree structures, like PCC mapping from ACT',
		name: 'GRECT/2019.07.17009-create-table-custom-data',
		perform: (db) => db.query([
			'CREATE TABLE custom_data (',
			'    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,',
			'    name VARCHAR(50),',
			'    value MEDIUMTEXT,',
			'    UNIQUE KEY name (name)',
			') ENGINE=InnoDB DEFAULT CHARSET=utf8',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.04.02006-create-role-VIEW_GDS_SESSION_LOG',
		perform: async (db) => {
			const emc = await Emc.getClient();
			return emc.addRole([
				{"name": "VIEW_GDS_SESSION_LOG", "project": "GDSD", "description": "Allows seeing list of active and historical sessions as well as opening the page listing commands and their outputs"},
			]);
		},
	},
	{
		name: 'GRECT/2019.08.06015-create-role-can_add_pqs',
		perform: async (db) => {
			const emc = await Emc.getClient();
			return emc.addRole([
				{"name": "can_add_pqs", "project": "GDSD", "description": "Grants users an option to see/use \"Add PQ\" button"},
			]);
		},
	},
	{
		name: 'GRECT/2019.08.06015-create-role-NEW_GDS_DIRECT_CAN_EDIT_D_MIX_MODIFIERS',
		perform: async (db) => {
			const emc = await Emc.getClient();
			return emc.addRole([
				{"name": "NEW_GDS_DIRECT_CAN_EDIT_D_MIX_MODIFIERS", "project": "GDSD", "description": "Grants users access to $D/MIX config page and ability to modify it"},
			]);
		},
	},
	{
		name: 'GRECT/2019.09.16001-add-role-soldTicketsDailyReport',
		perform: async (db) => {
			const emc = await Emc.getClient();
			return emc.addRole([
				{"name": "CMD_soldTicketsDailyReport", "project": "GDSD", "description": "Allows using HMPR and other HMP* formats"},
			]);
		},
	},
	{
		name: 'GRECT/2019.09.16001-add-role-can_add_pq_with_forced_fare',
		perform: async (db) => {
			const emc = await Emc.getClient();
			return emc.addRole([
				{"name": "can_add_pq_with_forced_fare", "project": "GDSD", "description": "Allows creating PQ from a pricing with explicit fare basis, like $B??KWX45H6"},
			]);
		},
	},
	{
		name: 'GRECT/2019.07.30001-create-local-diag-table-2',
		perform: async (db) => db.query([
			'CREATE TABLE local_diag (',
			'    id INT PRIMARY KEY AUTO_INCREMENT,',
			'    type VARCHAR(50) NOT NULL,',
			'    dt DATETIME NOT NULL,',
			'    data TEXT DEFAULT NULL,',
			'    KEY dt_type (dt, type)',
			') ENGINE=InnoDB DEFAULT CHARSET=utf8',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.08.28007-create-multi_pcc_tariff_rules',
		perform: async (db) => db.query([
			'CREATE TABLE `multi_pcc_tariff_rules` (',
			'  `id` int(11) PRIMARY KEY AUTO_INCREMENT,',
			'  `updated_dt` datetime NOT NULL,',
			'  `data` text NOT NULL',
			') ENGINE=MyISAM DEFAULT CHARSET=utf8',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.08.28007-populate-multi_pcc_tariff_rules-3',
		perform: async (db) => db.query([
			'INSERT INTO multi_pcc_tariff_rules (updated_dt, data) VALUES',
			'(\'2019-08-29 12:28:00\', \'{"departure_items":[{"type":"country","value":"US","name":null}],"destination_items":[{"type":"region","value":"35","name":"Middle East"}],"reprice_pcc_records":[{"gds":"apollo","pcc":"1O3K","ptc":"","account_code":"","fare_type":""},{"gds":"apollo","pcc":"13NM","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G52","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G8P","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2I3L","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"sabre","pcc":"U2E5","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"5E9H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2F3K","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2E95","ptc":"","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G2H","ptc":"","account_code":"","fare_type":""}]}\'),',
			'(\'2019-08-29 12:28:00\', \'{"departure_items":[{"type":"country","value":"US","name":null}],"destination_items":[{"type":"region","value":"39","name":"Latin America"}],"reprice_pcc_records":[{"gds":"apollo","pcc":"1O3K","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G2H","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G8P","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"13NM","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G52","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"15D9","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"sabre","pcc":"U2E5","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"5E9H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"amadeus","pcc":"LAXGO3106","ptc":"","account_code":"","fare_type":"private"},{"gds":"apollo","pcc":"2F3K","ptc":"JWZ","account_code":"","fare_type":""}]}\'),',
			'(\'2019-08-29 12:28:00\', \'{"departure_items":[{"type":"country","value":"US","name":null}],"destination_items":[{"type":"region","value":"34","name":"Africa"}],"reprice_pcc_records":[{"gds":"apollo","pcc":"1O3K","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"13NM","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G2H","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G52","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"sabre","pcc":"U2E5","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"5E9H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2F3K","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G8P","ptc":"","account_code":"","fare_type":""}]}\'),',
			'(\'2019-08-29 12:28:00\', \'{"departure_items":[{"type":"country","value":"US","name":null}],"destination_items":[{"type":"region","value":"33","name":"Europe"}],"reprice_pcc_records":[{"gds":"apollo","pcc":"1O3K","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G2H","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G52","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"13NM","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"sabre","pcc":"U2E5","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"5E9H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"amadeus","pcc":"LAXGO3106","ptc":"","account_code":"","fare_type":"private"},{"gds":"apollo","pcc":"2F3K","ptc":"","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G8P","ptc":"JWZ","account_code":"","fare_type":""}]}\'),',
			'(\'2019-08-29 12:28:00\', \'{"departure_items":[{"type":"country","value":"US","name":null}],"destination_items":[{"type":"region","value":"37","name":"Oceania"}],"reprice_pcc_records":[{"gds":"apollo","pcc":"2G2H","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G52","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"13NM","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"amadeus","pcc":"LAXGO3106","ptc":"","account_code":"","fare_type":"private"},{"gds":"apollo","pcc":"2F3K","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2E8R","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"FP3C","ptc":"JCB","account_code":"","fare_type":""}]}\'),',
			'(\'2019-08-29 12:28:00\', \'{"departure_items":[{"type":"country","value":"US","name":null}],"destination_items":[{"type":"region","value":"42","name":"India & ISC"}],"reprice_pcc_records":[{"gds":"apollo","pcc":"1O3K","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"13NM","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G52","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G2H","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2I3L","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"sabre","pcc":"U2E5","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"DK8H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"5E9H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2F3K","ptc":"JWZ","account_code":"","fare_type":""}]}\'),',
			'(\'2019-08-29 12:28:00\', \'{"departure_items":[{"type":"country","value":"US","name":null}],"destination_items":[{"type":"region","value":"36","name":"Asia"}],"reprice_pcc_records":[{"gds":"apollo","pcc":"2G2H","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G52","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2E8R","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"sabre","pcc":"U2E5","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"5E9H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2F3K","ptc":"JWZ","account_code":"","fare_type":""}]}\'),',
			'(\'2019-08-29 12:28:00\', \'{"departure_items":[{"type":"country","value":"CA","name":"Canada"}],"destination_items":[],"reprice_pcc_records":[{"gds":"apollo","pcc":"2BQ6","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2E4T","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2I70","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2E1I","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2ER7","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"10OW","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"sabre","pcc":"RR8F","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"5EGB","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"T42I","ptc":"JCB","account_code":"","fare_type":""},{"gds":"amadeus","pcc":"YTOGO310E","ptc":"","account_code":"","fare_type":"private"},{"gds":"apollo","pcc":"2F3K","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"amadeus","pcc":"YTOC421D7","ptc":"","account_code":"","fare_type":"private"},{"gds":"apollo","pcc":"12NJ","ptc":"","account_code":"","fare_type":""}]}\'),',
			'(\'2019-08-29 12:28:00\', \'{"departure_items":[{"type":"country","value":"GB","name":"United Kingdom"}],"destination_items":[],"reprice_pcc_records":[{"gds":"apollo","pcc":"13NM","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"sabre","pcc":"0EKH","ptc":"ITX","account_code":"BSAG","fare_type":""},{"gds":"sabre","pcc":"0EKH","ptc":"","account_code":"BSAG","fare_type":""},{"gds":"sabre","pcc":"5E9H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"DK8H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"galileo","pcc":"K9P","ptc":"ITX","account_code":"TPACK","fare_type":"private"},{"gds":"galileo","pcc":"K9P","ptc":"","account_code":"TPACK","fare_type":"private"},{"gds":"galileo","pcc":"G8T","ptc":"ITX","account_code":"TPACK","fare_type":"private"},{"gds":"galileo","pcc":"G8T","ptc":"","account_code":"TPACK","fare_type":"private"},{"gds":"galileo","pcc":"3ZV4","ptc":"ITX","account_code":"BSAG","fare_type":"private"},{"gds":"galileo","pcc":"3ZV4","ptc":"","account_code":"BSAG","fare_type":"private"},{"gds":"galileo","pcc":"80DJ","ptc":"","account_code":"","fare_type":"private"},{"gds":"apollo","pcc":"2F3K","ptc":"","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G2H","ptc":"","account_code":"","fare_type":""}]}\'),',
			'(\'2019-08-29 12:28:00\', \'{"departure_items":[{"type":"country","value":"US","name":null}],"destination_items":[],"reprice_pcc_records":[{"gds":"apollo","pcc":"2G2H","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G52","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"sabre","pcc":"U2E5","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"6IIF","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"DK8H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"5E9H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2F3K","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"1O3K","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G8P","ptc":"JWZ","account_code":"","fare_type":""}]}\'),',
			'(\'2019-08-29 12:28:00\', \'{"departure_items":[],"destination_items":[],"reprice_pcc_records":[{"gds":"apollo","pcc":"2G52","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"13NM","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G2H","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"sabre","pcc":"U2E5","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"5E9H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"0EKH","ptc":"ITX","account_code":"BSAG","fare_type":"private"},{"gds":"sabre","pcc":"0EKH","ptc":"","account_code":"BSAG","fare_type":"private"},{"gds":"galileo","pcc":"K9P","ptc":"ITX","account_code":"TPACK","fare_type":"private"},{"gds":"galileo","pcc":"K9P","ptc":"","account_code":"TPACK","fare_type":"private"},{"gds":"galileo","pcc":"G8T","ptc":"ITX","account_code":"TPACK","fare_type":"private"},{"gds":"galileo","pcc":"G8T","ptc":"","account_code":"TPACK","fare_type":"private"},{"gds":"apollo","pcc":"2F3K","ptc":"","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G8P","ptc":"","account_code":"","fare_type":""},{"gds":"amadeus","pcc":"SFO1S2195","ptc":"","account_code":"","fare_type":""},{"gds":"amadeus","pcc":"LAXGO3106","ptc":"","account_code":"","fare_type":"private"},{"gds":"sabre","pcc":"6IIF","ptc":"","account_code":"","fare_type":""}]}\'),',
			'(\'2019-08-29 12:28:00\', \'{"departure_items":[{"type":"country","value":"PH","name":"Philippines"}],"destination_items":[],"reprice_pcc_records":[{"gds":"amadeus","pcc":"MNLPH28FP","ptc":"","account_code":"","fare_type":""},{"gds":"sabre","pcc":"C5VD","ptc":"","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2F3K","ptc":"","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G2H","ptc":"","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G8P","ptc":"","account_code":"","fare_type":""}]}\')',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.10.02005-create-mp-log-table-2',
		perform: db => db.query([
			'CREATE TABLE mp_remark_log (',
			'    id INT PRIMARY KEY AUTO_INCREMENT,',
			'    dt DATETIME NOT NULL,',
			'    recordLocator CHAR(6) NOT NULL,',
			'    agentId INT NOT NULL,',
			'    airline CHAR(2) NOT NULL,',
			'    pcc VARCHAR(9) NOT NULL,',
			'    destinationAirport CHAR(3) DEFAULT NULL,',
			'    INDEX dt (dt),',
			'    INDEX recordLocator (recordLocator),',
			'    INDEX airline (airline),',
			'    INDEX pcc (pcc),',
			'    INDEX destinationAirport (destinationAirport),',
			'    INDEX agentId (agentId)',
			') ENGINE=InnoDB DEFAULT CHARSET=utf8',
		].join('\n')),
	},
	{
		name: 'GRECT/2019.10.02005-fill-mp-log-table-4',
		perform: async db => {
			const rows = await MpRemarkLogs.getFromCmdLogs();
			rows.reverse(); // the function returns them in descending order
			await db.delete({table: 'mp_remark_log'});
			return db.writeRows('mp_remark_log', rows);
		},
	},
];
