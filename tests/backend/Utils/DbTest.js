
const Db = require('../../../backend/Utils/Db.js');

class DbTest extends require('../Transpiled/Lib/TestCase.js')
{
	provide_makeSelectQuery() {
		let testCases = [];

		testCases.push({
		    "input": {
		        "table": "cmd_rq_log",
		        "where": [["agentId","=","2911"],["requestId","=","0"]],
		        "orderBy": "id DESC",
		        "limit": 100
		    },
		    "output": {
		        "sql": [
		            "SELECT * FROM cmd_rq_log",
		            "",
		            "WHERE TRUE",
		            "AND `agentId` = ? AND `requestId` = ?",
		            "",
		            "ORDER BY id DESC",
		            "LIMIT 100"
		        ].join("\n"),
		        "placedValues": ["2911","0"]
		    }
		});

		testCases.push({
		    "input": {
		        "table": "migrations",
		        "where": [
		            ["name","=","GRECT/2019.04.17005-create-mentioned-pnrs-table"]
		        ]
		    },
		    "output": {
		        "sql": "SELECT * FROM migrations\n\nWHERE TRUE\nAND `name` = ?\n\n\n",
		        "placedValues": ["GRECT/2019.04.17005-create-mentioned-pnrs-table"]
		    }
		});

		testCases.push({
		    "input": {
		        "table": "terminal_sessions",
		        "as": "ts",
		        "join": [],
		        "where": [],
		        "orderBy": "ts.id DESC",
		        "limit": 2000
		    },
		    "output": {
		        "sql": [
		            "SELECT * FROM terminal_sessions AS ts",
		            "",
		            "WHERE TRUE",
		            "",
		            "",
		            "ORDER BY ts.id DESC",
		            "LIMIT 2000"
		        ].join("\n"),
		        "placedValues": []
		    }
		});

		testCases.push({
			"input": {
				"table": "terminal_sessions",
				"as": "ts",
				"join": [
					{
						"table": "mentioned_pnrs",
						"as": "mp",
						"on": [["mp.sessionId", "=", "ts.id"]]
					}
				],
				"where": [
					["ts.agent_id", "=", "6206"],
					["ts.gds", "=", "sabre"],
					["ts.id", "=", "15102"],
					["ts.lead_id", "=", "18544584"],
					["mp.recordLocator", "=", "TXH2HK"]
				],
				"orderBy": "ts.id DESC",
				"limit": 2000
			},
			"output": {
				"sql": [
					"SELECT * FROM terminal_sessions AS ts",
					"JOIN mentioned_pnrs AS mp ON mp.sessionId = ts.id",
					"WHERE TRUE",
					"AND `ts`.`agent_id` = ? AND `ts`.`gds` = ? AND `ts`.`id` = ? AND `ts`.`lead_id` = ? AND `mp`.`recordLocator` = ?",
					"",
					"ORDER BY ts.id DESC",
					"LIMIT 2000"
				].join("\n"),
				"placedValues": ["6206", "sabre", "15102", "18544584", "TXH2HK"]
			}
		});

		testCases.push({
		    "input": {
		        "table": "terminal_command_log",
		        "where": [["session_id","=",773]],
		        "orderBy": "id DESC"
		    },
		    "output": {
		        "sql": [
		            "SELECT * FROM terminal_command_log",
		            "",
		            "WHERE TRUE",
		            "AND `session_id` = ?",
		            "",
		            "ORDER BY id DESC",
		            ""
		        ].join("\n"),
		        "placedValues": [773]
		    }
		});

		return testCases.map(c => [c]);
	}

	test_makeSelectQuery({input, output}) {
		let actual = Db.makeSelectQuery(input);
		this.assertArrayElementsSubset(output, actual);
	}

	getTestMapping() {
		return [
			[this.provide_makeSelectQuery, this.test_makeSelectQuery],
		];
	}
}

module.exports = DbTest;