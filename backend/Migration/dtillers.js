module.exports.migrations = [
	{
		name: 'GDSD-87-create_terminal_command_log_hist',
		perform: async db => db.query([
			"CREATE TABLE `terminal_command_log_hist` (",
			"  `id` bigint(20) NOT NULL,",
			"  `session_id` int(11) DEFAULT NULL,",
			"  `type` varchar(50) DEFAULT NULL,",
			"  `is_mr` tinyint(1) DEFAULT NULL,",
			"  `dt` datetime NOT NULL,",
			"  `cmd` text,",
			"  `cmd_rq_id` bigint(20) DEFAULT NULL,",
			"  `output_compressed` blob NOT NULL,",
			// this doesn't point to exact row in dictionary table,
			// to retrieve dictionary first session needs to be located
			// and then using gds from session and type from this entry
			// it is possible to locate required dictionary
			"  `dictionary_id` tinyint(3) UNSIGNED,",
			"  PRIMARY KEY (`id`),",
			"  KEY `session_id` (`session_id`),",
			"  KEY `type` (`type`)",
			") ENGINE=InnoDB DEFAULT CHARSET=utf8",
		].join('\n')),
	},
	{
		name: 'GDSD-87-create_terminal_command_log_hist_dictionary',
		perform: async db => db.query([
			"CREATE TABLE `terminal_command_log_hist_dictionary` (",
			"  `id` tinyint(3) UNSIGNED NOT NULL,",
			"  `gds` varchar(10) DEFAULT NULL,",
			"  `type` varchar(50) DEFAULT NULL,",
			"  `created` datetime NOT NULL,",
			"  `status` tinyint(1) NOT NULL DEFAULT '1',",
			"  `compression_type` tinyint(3) NOT NULL,",
			"  `dictionary` blob NOT NULL,",
			"  PRIMARY KEY (`id`, `gds`, `type`)",
			") ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8",
		].join('\n')),
	},
];