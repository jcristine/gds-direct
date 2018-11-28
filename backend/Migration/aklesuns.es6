
module.exports.migrations = [
    {
        number: '00.00.01',
        sql: [
            'CREATE TABLE `terminalBuffering` (',
            '  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,',
            '  `agentId` int(10) unsigned NOT NULL,',
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
            '  KEY `rbsSessionId` (`rbsSessionId`),',
            '  KEY `gdsSessionDataMd5` (`gdsSessionDataMd5`)',
            ') ENGINE=InnoDB CHARSET=utf8',
        ].join('\n'),
    },
];