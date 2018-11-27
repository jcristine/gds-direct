exports.getView = (req) => {
	return {
	    enabled       : true,
	    disableReason : '',
	    settings      : {
			"common": {"currentGds":"apollo"},
			"gds": {
				"apollo": {
				  "terminalsMatrix": [2,2],
				  "language": "",
				  "area": "A",
				  "pcc": "2G52",
				  "terminalNumber": 1,
				  "fontSize": 1,
				  "canCreatePq": 0,
				  "keyBindings": null,
				  "theme": 0,
				  "matrix": {"hasWide":"false","matrix":{"rows":0,"cells":0,"list":[0]}},
				  "defaultPcc": "",
				  "areaSettings": [
					  {
						  "id": 33,
						  "gds": "apollo",
						  "area": "A",
						  "agentId": 6206,
						  "defaultPcc": null
					  },
					  {
						  "id": 34,
						  "gds": "apollo",
						  "area": "B",
						  "agentId": 6206,
						  "defaultPcc": null
					  },
					  {
						  "id": 35,
						  "gds": "apollo",
						  "area": "C",
						  "agentId": 6206,
						  "defaultPcc": "2CV4"
					  },
					  {
						  "id": 36,
						  "gds": "apollo",
						  "area": "D",
						  "agentId": 6206,
						  "defaultPcc": null
					  },
					  {
						  "id": 37,
						  "gds": "apollo",
						  "area": "E",
						  "agentId": 6206,
						  "defaultPcc": null
					  }
				  ]
			  },
			},
		},
	    buffer        : {},
	    lastCommands  : [],
	};
};