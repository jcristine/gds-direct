
import './../src/actions/initAuthPage.js';
import GrectApi from './../src/helpers/GrectApi.js';

const whenEmcSessionId = window.GdsDirectPlusPage.whenEmcSessionId;
const grectApi = GrectApi({whenEmcSessionId});

/**
 * based on the code written by Natalija Kuzmenkova
 */

// should be included in the html file
const {$, _} = window;

$(function () {

	var $tbody = $('.js-tbody-main');
	var $modalError = $('.js-modal-error');
	var modal = new MultiPccTariffModal();
	var promises = [];
	var locations;
	var pccs;
	var records;
	var ptcs = [
		{value: '', name: ''},
		{value: 'ITX', name: 'ITX'},
		{value: 'JCB', name: 'JCB'},
		{value: 'JWZ', name: 'JWZ'},
		{value: 'PFA', name: 'PFA'},
		{value: 'SEA', name: 'SEA'},
		{value: 'VFR', name: 'VFR'},
	];
	var fareTypes = [
		{
			value: '',
			name: '',
		},
		{
			value: 'private',
			name: 'Private :P',
		},
		{
			value: 'published',
			name: 'Published :N',
		},
		{
			value: 'airline_private',
			name: 'Airline Private :A',
		},
		{
			value: 'agency_private',
			name: 'Agency Private :G',
		},
	];
	var fareTypesSabre = [
		{
			value: '',
			name: '',
		},
		{
			value: 'private',
			name: 'Private PV',
		},
		{
			value: 'published',
			name: 'Published PL',
		},
	];
	var fareTypesAmadeus = [
		{
			value: '',
			name: '',
		},
		{
			value: 'private',
			name: 'Private R,U',
		},
		{
			value: 'published',
			name: 'Published R,P',
		},
	];
	var fareTypesViewMap = {
		amadeus: {
			private: 'R,U',
			published: 'R,P',
		},
		sabre: {
			private: 'PV',
			published: 'PL',
		},
		common: {
			private: ':P',
			published: ':N',
			airline_private: ':A',
			agency_private: ':G',
		},
	};

	function fetchLocations() {
		return new Promise(function(resolve) {
			$.ajax({
				url: '/api/js/data/locations',
				success: function (records) {
					var i;
					for (i = 0; i < records.length; i++) {
						records[i].id = records[i].value + ',' +
							records[i].type + ',' + records[i].name;
						records[i].title = records[i].name + records[i].value;
						if (records[i].name === 'United States') {
							records[i].title = 'usa' + records[i].title;
						}
					}
					resolve(records);
				},
				error: function (e) {
					$modalError.find('.js-modal-body').html(e.responseText);
					$modalError.modal('show');
					console.error(e);
					resolve([]);
				},
			});
		});
	}
	promises.push(fetchLocations());

	function fetchPccs() {
		return grectApi.getPccList()
			.then((res) => {
				var apolloList = [];
				var sabreList = [];
				var galileoList = [];
				var amadeusList = [];
				var i;
				var record;
				var result = [];

				for (i = 0; i < res.records.length; i++) {
					record = res.records[i];

					switch (record.gds) {
					case 'apollo':
						apolloList.push(record);
						break;
					case 'sabre':
						sabreList.push(record);
						break;
					case 'galileo':
						galileoList.push(record);
						break;
					case 'amadeus':
						amadeusList.push(record);
						break;
					}
				}

				apolloList = _.sortBy(apolloList, ['pcc']);
				sabreList = _.sortBy(sabreList, ['pcc']);
				galileoList = _.sortBy(galileoList, ['pcc']);
				amadeusList = _.sortBy(amadeusList, ['pcc']);

				function setOptgroupFields(list, size) {
					var chunks = _.chunk(
						list,
						_.ceil(list.length/size)
					);
					var i;
					var k;
					for (i = 0; i < chunks.length; i++) {
						for (k = 0; k < chunks[i].length; k++) {
							chunks[i][k].make = chunks[i][k].gds + i;
							chunks[i][k].value = chunks[i][k].pcc + ',' +
								chunks[i][k].gds + ',' + chunks[i][k].consolidator;
							result.push(chunks[i][k]);
						}
					}
				}

				setOptgroupFields(apolloList,2);
				setOptgroupFields(sabreList,2);
				setOptgroupFields(galileoList,1);
				setOptgroupFields(amadeusList,1);

				return result;
			})
			.catch(e => {
				$modalError.find('.js-modal-body').html(e.responseText);
				$modalError.modal('show');
				console.error(e);
				return [];
			});
	}
	promises.push(fetchPccs());

	function fetchList() {
		return grectApi.listMultiPccTariffRules()
			.catch(e => {
				$modalError.find('.js-modal-body').html(e.responseText);
				$modalError.modal('show');
				console.error(e);
				return [];
			});
	}
	promises.push(fetchList());

	Promise.all(promises).then(function (res) {
		locations = res[0];
		pccs = res[1];
		records = res[2];
		var i;
		var k;
		var m;

		for (i = 0; i < locations.length; i++) {
			for (m = 0; m < records.length; m++) {
				for (k = 0; k < records[m].destination_items.length; k++) {

					if (records[m].destination_items[k].type === locations[i].type &&
						records[m].destination_items[k].value === _.toString(locations[i].value)) {

						records[m].destination_items[k].name = locations[i].name;
						records[m].destination_items[k].id = locations[i].id;
					}
				}
				for (k = 0; k < records[m].departure_items.length; k++) {

					if (records[m].departure_items[k].type === locations[i].type &&
						records[m].departure_items[k].value === _.toString(locations[i].value)) {

						records[m].departure_items[k].name = locations[i].name;
						records[m].departure_items[k].id = locations[i].id;
					}
				}
			}
		}

		for (i = 0; i < pccs.length; i++) {
			for (m = 0; m < records.length; m++) {
				for (k = 0; k < records[m].reprice_pcc_records.length; k++) {
					if (!records[m].reprice_pcc_records[k].pcc) {
						continue;
					}
					if (records[m].reprice_pcc_records[k].pcc === pccs[i].pcc &&
						records[m].reprice_pcc_records[k].gds === pccs[i].gds) {
						records[m].reprice_pcc_records[k].consolidator = pccs[i].consolidator;
					}
				}
			}
		}

		var html = '';
		for (i = 0; i < records.length; i++) {
			html += getRowMainHtml(records[i]);
		}
		$tbody.append(html);
	});

	function sortPcc(list) {
		var apolloList = [],
			sabreList = [],
			galileoList = [],
			amadeusList = [];

		_.forEach(list, function (record) {
			switch (record.gds) {
			case 'apollo':
				apolloList.push(record);
				break;
			case 'sabre':
				sabreList.push(record);
				break;
			case 'galileo':
				galileoList.push(record);
				break;
			case 'amadeus':
				amadeusList.push(record);
				break;
			}
		});

		apolloList = _.sortBy(apolloList, ['pcc']);
		sabreList = _.sortBy(sabreList, ['pcc']);
		galileoList = _.sortBy(galileoList, ['pcc']);
		amadeusList = _.sortBy(amadeusList, ['pcc']);

		return _.concat(
			apolloList,
			sabreList,
			galileoList,
			amadeusList
		);
	}

	function MultiPccTariffModal() {
		var _this = this;
		//Array<{pcc: string, items: Array}>
		_this.repricePccElemList = [];
		_this.$modal = $('.js-modal-multi-pcc-tariff');

		_this.removePccRow = function (pcc) {
			var $row = $('[data-pcc-id="' + pcc + '"]');
			var pccIndex = _.findIndex(_this.repricePccElemList, ['pcc', pcc]);
			_.forEach(_this.repricePccElemList[pccIndex].items, function (item, index) {
				if (item) {
					_this.removePccItemsRow(pcc, index);
				}
			});
			$row.remove();
			delete _this.repricePccElemList[pccIndex];
		};

		_this.addPccRow = function (/*string*/pcc) {
			var pccChunks = pcc.split(',');
			var html = '<tr class="js-pcc-row" data-pcc-id="' + pcc + '"><td><span class="pcc-text ' + pccChunks[1] +
				'" title="' + pccChunks[2] + ' (' + pccChunks[1] + ')">' + pccChunks[0] + '</span>' +
				'<div class="pcc-items-wrap"><button class="btn btn-default btn-sm btn-add pull-right js-add-pcc-items" type="button"><i class="fa fa-plus" aria-hidden="true"></i></button><table class="table-pcc-items"><tbody class="js-pcc-items-cell"></tbody></table></div></td></tr>';
			$('.js-reprice-pccs').prepend(html);
		};

		_this.removePccItemsRow = function (pcc, index) {
			var $row;
			var pccElemStore = _.find(_this.repricePccElemList, ['pcc', pcc]);
			_.forEach(pccElemStore.items[index], function ($elem) {
				if ($elem[0].hasOwnProperty('selectize')) {
					$elem[0].selectize.destroy();
				}
				if (!$row) {
					$row = $elem.closest('.js-pcc-items-row');
				}
			});
			$row.remove();
			delete pccElemStore.items[index];
		};

		_this.addPccItemsRow = function (/*string*/pcc, data) {
			var pccElemStore = _.find(_this.repricePccElemList, ['pcc', pcc]);
			var $row = $('[data-pcc-id="' + pcc + '"] .js-pcc-items-cell');
			var gds = pcc.split(',')[1];
			var index;
			var html;

			data = data || {};
			if (!pccElemStore) {
				pccElemStore = {
					pcc: pcc,
					items: [],
				};
				_this.repricePccElemList.push(pccElemStore);
			}

			index = pccElemStore.items.length;
			html = '<tr class="js-pcc-items-row">' +
				'<td colspan="2"><input type="text" placeholder="Account Code" class="form-control all-caps js-account-code-' + index + '"></td>' +
				'<td colspan="1"><select class="js-ptc-' + index + ' select-single"></select></td>' +
				'<td colspan="2"><select class="js-fare-type-' + index + ' select-single"></select></td>' +
				'<td colspan="1"><input type="text" placeholder="/TA.../ PCC" class="form-control all-caps js-ta-pcc-' + index + '"></td>' +
				'<td colspan="3"><input type="text" placeholder="Only For Airlines... (through \',\')" class="form-control all-caps js-allowed-airlines-' + index + '"></td>' +
				'<td class="cell-action"><span class="cross-box"><span class="cross js-remove-pcc-items js-remove-' + index + '" ' +
				'data-pcc-items-index="' + index + '" role="button"></span></span></td>' +
				'</tr>';

			$row.prepend(html);

			pccElemStore.items[index] = {};

			pccElemStore.items[index].$accountCode = $row.find('.js-account-code-' + index);
			pccElemStore.items[index].$accountCode.val(data.account_code || '');

			pccElemStore.items[index].$taPcc = $row.find('.js-ta-pcc-' + index);
			pccElemStore.items[index].$taPcc.val(data.ta_pcc || '');

			pccElemStore.items[index].$allowedAirlines = $row.find('.js-allowed-airlines-' + index);
			pccElemStore.items[index].$allowedAirlines.val((data.allowed_airlines || []).join(','));

			pccElemStore.items[index].$ptc = $row.find('.js-ptc-' + index).selectize({
				allowEmptyOption: true,
				options: ptcs,
				placeholder: 'PTC',
				labelField: 'name',
				valueField: 'value',
				render: {
					item: function (data) {
						var html = '<div class="item ' + (!data.name ? 'is-empty' : '') +
							'">' + (!data.name ? 'PTC' : data.name) + '</div>';

						return html;
					},
					option: function (data) {
						return '<div class="option" ' +
							'data-value="' + data.value + '">' + data.name + '</div>';
					},
				},
				items: [data.ptc],
			});
			pccElemStore.items[index].$fareType = $row.find('.js-fare-type-' + index).selectize({
				allowEmptyOption: true,
				options: (gds === 'sabre') ? fareTypesSabre :
					(gds === 'amadeus') ? fareTypesAmadeus :
						fareTypes,
				placeholder: 'Fare Type',
				labelField: 'name',
				valueField: 'value',
				render: {
					item: function (data) {
						var html = '<div class="item ' + (!data.name ? 'is-empty' : '') +
							'">' + (!data.name ? 'Fare Type' : data.name) + '</div>';

						return html;
					},
					option: function (data) {
						return '<div class="option" ' +
							'data-value="' + data.value + '">' + data.name + '</div>';
					},
				},
				items: [data.fare_type],
			});
		};

		_this.save = function () {
			var data = {};
			var record = {};
			var pccElemList = _.compact(_this.repricePccElemList);
			var isValid = !!pccElemList.length;
			if (!isValid) {
				if (!_this.$pcc.parent().hasClass('is-error')) {
					_this.$pcc.parent().addClass('is-error');
					_this.$pcc.parent().append('<span class="error-text js-error-text">Required</span>');
				}
				return;
			}
			if (_this.data && !_.isNil(_this.data.id)) {
				data.id = _this.data.id;
				record.id = _this.data.id;
			}

			data.reprice_pcc_records = [];
			record.reprice_pcc_records = [];
			_.forEach(pccElemList, function (pccElemStore) {
				var pccChunks = pccElemStore.pcc.split(',');
				var pcc = pccChunks[0];
				var gds = pccChunks[1];
				var consolidator = pccChunks[2];
				var items = _.compact(pccElemStore.items);
				if (items.length) {
					_.forEach(items, function (elemRow) {
						if (elemRow) {
							var accountCode = elemRow.$accountCode.val().toUpperCase();
							var taPcc = elemRow.$taPcc.val().toUpperCase();
							var allowedAirlinesStr = elemRow.$allowedAirlines.val().toUpperCase();
							var allowedAirlines = !allowedAirlinesStr ? [] : allowedAirlinesStr.split(',');
							var ptc = elemRow.$ptc[0].selectize.getValue();
							var fareType = elemRow.$fareType[0].selectize.getValue();
							var stored = _.find(data.reprice_pcc_records, {
								account_code: accountCode,
								ptc: ptc,
								fare_type: fareType,
								pcc: pcc,
								gds: gds,
							});
							if (!stored) {
								data.reprice_pcc_records.push({
									account_code: accountCode,
									ta_pcc: taPcc,
									allowed_airlines: allowedAirlines,
									ptc: ptc,
									fare_type: fareType,
									pcc: pcc,
									gds: gds,
								});
								record.reprice_pcc_records.push({
									account_code: accountCode,
									ta_pcc: taPcc,
									allowed_airlines: allowedAirlines,
									ptc: ptc,
									fare_type: fareType,
									pcc: pcc,
									gds: gds,
									consolidator: consolidator,
								});
							}
						}
					});
				} else {
					data.reprice_pcc_records.push({
						account_code: '',
						ta_pcc: '',
						allowed_airlines: [],
						ptc: '',
						fare_type: '',
						pcc: pcc,
						gds: gds,
					});
					record.reprice_pcc_records.push({
						account_code: '',
						ta_pcc: '',
						allowed_airlines: [],
						ptc: '',
						fare_type: '',
						pcc: pcc,
						gds: gds,
						consolidator: consolidator,
					});
				}
			});

			data.departure_items = [];
			record.departure_items = [];
			_.forEach(_this.$departure[0].selectize.getValue(), function (val) {
				var chunks = val.split(',');
				data.departure_items.push({
					value: chunks[0],
					type: chunks[1],
				});
				record.departure_items.push({
					value: chunks[0],
					type: chunks[1],
					name: chunks[2],
					id: val,
				});
			});

			data.destination_items = [];
			record.destination_items = [];
			_.forEach(_this.$destination[0].selectize.getValue(), function (val) {
				var chunks = val.split(',');
				data.destination_items.push({
					value: chunks[0],
					type: chunks[1],
				});
				record.destination_items.push({
					value: chunks[0],
					type: chunks[1],
					name: chunks[2],
					id: val,
				});
			});

			grectApi.storeMultiPccTariffRule(data)
				.then(res => {
					if (_.isObject(res) && res.success) {
						//todo show alert
						if (_this.data.id) {
							_.assign(_this.data, record);
						} else {
							record.id = res.id;
							records.push(record);
						}
						if (_this.$tr.length) {
							_this.$tr.replaceWith(getRowMainHtml(record));
						} else {
							$tbody.append(getRowMainHtml(record));
						}
						_this.$modal.modal('hide');

						alert('Changes Saved Successfully');
					}
				})
				.catch(e => {
					$modalError.find('.js-modal-body').html(e.responseText);
					$modalError.modal('show');
					console.error(e);
				});
		};

		_this.open = function (data, $tr) {
			var i;
			_this.data = data || {};
			_this.$tr = $tr;
			_this.data.destination_items = _this.data.destination_items || [];
			_this.data.departure_items = _this.data.departure_items || [];
			_this.data.reprice_pcc_records = _this.data.reprice_pcc_records || [{}];

			_.forEach(_this.data.reprice_pcc_records, function (repricePccRecord) {
				if (repricePccRecord.pcc) {
					repricePccRecord.pccId = repricePccRecord.pcc +
						',' + repricePccRecord.gds +
						',' + repricePccRecord.consolidator;
				}
			});

			if (!_this.$departure) {
				_this.$departure = $('.js-departure').selectize({
					maxItems: null,
					maxOptions: 100,
					highlight: false,
					render: {
						item: function (data) {
							var icon;
							var title;
							var html;

							switch (data.type) {
							case 'airport':
								icon = 'fa-plane';
								title = data.value;
								break;

							case 'city':
								icon = 'fa-home';
								title = data.value;
								break;

							case 'country':
								icon = 'fa-globe';
								title = data.name + ' (' + data.value + ')';
								break;

							case 'region':
								icon = 'fa-sun-o';
								title = data.name;
								break;
							}

							html = '<div class="item" title="' + _.upperFirst(data.type) +
								': ' + data.name + ' (' + data.value + ')"><i class="fa ' +
								icon + '"></i> ' + title + '</div>';
							return html;
						},
						option: function (data) {
							return '<div class="option" ' +
								'data-value="' + data.value + '">' + _.upperFirst(data.type) +
								': ' + data.name + ' (' + data.value + ')</div>';
						},
					},
					valueField: 'id',
					searchField: 'title',
					sortField: 'title',
					options: locations,
					create: true,
					plugins: {
						'remove_button': {
							label: '',
							className: 'selectize-close',
						},
					},
				});
			}
			_this.$departure[0].selectize.setValue(_.map(_this.data.departure_items, function (item) {
				return item.id;
			}));

			if (!_this.$destination) {
				_this.$destination = $('.js-destination').selectize({
					maxItems: null,
					maxOptions: 100,
					highlight: false,
					render: {
						item: function (data) {
							var icon;
							var title;
							var html;

							switch (data.type) {
							case 'airport':
								icon = 'fa-plane';
								title = data.value;
								break;

							case 'city':
								icon = 'fa-home';
								title = data.value;
								break;

							case 'country':
								icon = 'fa-globe';
								title = data.name + ' (' + data.value + ')';
								break;

							case 'region':
								icon = 'fa-sun-o';
								title = data.name;
								break;
							}

							html = '<div class="item" title="' + _.upperFirst(data.type) +
								': ' + data.name + ' (' + data.value + ')"><i class="fa ' +
								icon + '"></i> ' + title + '</div>';
							return html;
						},
						option: function (data) {
							return '<div class="option" ' +
								'data-value="' + data.value + '">' + _.upperFirst(data.type) +
								': ' + data.name + ' (' + data.value + ')</div>';
						},
					},
					valueField: 'id',
					searchField: 'title',
					sortField: 'title',
					options: locations,
					create: false,
					plugins: {
						'remove_button': {
							label: '',
							className: 'selectize-close',
						},
					},
				});
			}
			_this.$destination[0].selectize.setValue(_.map(_this.data.destination_items, function (item) {
				return item.id;
			}));

			if (!_this.$pcc) {
				_this.$pcc = $('.js-pcc').selectize({
					options: pccs,
					optgroups: [
						{id: 'apollo0', name: 'Apollo'},
						{id: 'apollo1', name: 'Apollo'},
						{id: 'sabre0', name: 'Sabre'},
						{id: 'sabre1', name: 'Sabre'},
						{id: 'galileo0', name: 'Galileo'},
						{id: 'amadeus0', name: 'Amadeus'},
					],
					render: {
						item: function (data) {
							var html = '<div class="item ' + data.gds + '" title="' +
								data.consolidator + ' (' + data.gds +  ')">' + data.pcc + '</div>';

							return html;
						},
						option: function (data) {
							return '<div class="option" title="' +
								data.consolidator + ' (' + data.gds +  ')" ' +
								'data-value="' + data.value + '">' + data.pcc + '</div>';
						},
					},
					valueField: 'value',
					searchField: ['pcc'],
					optgroupField: 'make',
					optgroupLabelField: 'name',
					optgroupValueField: 'id',
					optgroupOrder: [
						'apollo0',
						'apollo1',
						'sabre0',
						'sabre1',
						'galileo0',
						'amadeus0',
					],
					maxItems: null,
					plugins: {
						'remove_button': {
							label: '',
							className: 'selectize-close',
						},
						'optgroup_columns': {},
					},
				});
				_this.$pcc[0].selectize.on('item_add', function (val) {
					var isItemsRow;
					_this.addPccRow(val);
					_.forEach(_this.data.reprice_pcc_records, function (record) {
						var dataPccId = record.pcc + ',' + record.gds +
							',' + record.consolidator;
						if (val === dataPccId) {
							isItemsRow = true;
							_this.addPccItemsRow(val, record);
						}
					});
					if (!isItemsRow) {
						_this.addPccItemsRow(val);
					}
				});
				_this.$pcc[0].selectize.on('item_remove', function (val) {
					_this.removePccRow(val);
				});
				_this.$pcc[0].selectize.on('change', function () {
					var $parent = _this.$pcc.parent();
					if ($parent.hasClass('is-error')) {
						$parent.removeClass('is-error');
						$parent.find('.js-error-text').remove();
					}
				});
			}
			_this.$pcc[0].selectize.setValue(_.map(_this.data.reprice_pcc_records, function (item) {
				return item.pccId;
			}));

			_this.$modal.modal('show');
			$('.js-modal-state').html((_this.data.id ? 'Edit' : 'Add'));
		};

		_this.$modal.modal({
			backdrop: 'static',
			show: false,
		});

		_this.$modal.on('hidden.bs.modal', function () {
			_.forEach(_this.repricePccElemList, function (pcc) {
				if (pcc) {
					_this.removePccRow(pcc.pcc);
				}
			});
			_this.repricePccElemList = [];
		});

		// watchers
		$(document)
			.on('click', '.js-remove-pcc-items', function () {
				var $this = $(this);
				var $row = $this.closest('[data-pcc-id]');
				var pcc = $row.data('pccId');
				var index = $this.data('pccItemsIndex');
				_this.removePccItemsRow(pcc, index);
			})
			.on('click', '.js-add-pcc-items', function () {
				var $row = $(this).closest('[data-pcc-id]');
				var pcc = $row.data('pccId');
				_this.addPccItemsRow(pcc);
			})
			.on('click', '.js-save-multi-pcc-tariff', function () {
				_this.save();
			})
			.on('click', '.js-delete-multi-pcc-tariff', function () {
				var $this = $(this);
				var $tr = $this.closest('tr');
				var id = _.toString($tr.data('recordId'));
				var index = _.findIndex(records, ['id', id]);
				grectApi.deleteMultiPccTariffRule({id})
					.then(res => {
						if (res && res.success) {
							$tr.remove();
							records.splice(index, 1);
						}
					})
					.catch(e => {
						$modalError.find('.js-modal-body').html(e.responseText);
						$modalError.modal('show');
						console.error(e);
					});
			})
			.on('click', '.js-open-modal-multi-pcc-tariff', function () {
				var $this = $(this);
				var $tr = $this.closest('tr');
				var id;
				var record;
				if ($tr.length) {
					id = _.toString($tr.data('recordId'));
					record = _.find(records, ['id', +id]);
				}
				_this.open(record, $tr);
			})
			.on('keydown', function (event) {
				// Ctrl + Enter
				if (event.which === 13 &&
					event.ctrlKey) {

					_this.save();
				}
			})
			.on('blur', '.all-caps', function () {
				var $this = $(this);
				var value = $this.val();
				$this.val(value.toUpperCase());
			});
	}

	function getRowMainHtml(item) {
		var geoHtml;
		var isDefault = !item.departure_items.length &&
			!item.destination_items.length;

		if (isDefault) {
			geoHtml = '<td colspan="2" class="cell-geo">Default Rules</td>';
		} else {
			geoHtml ='<td>' +
				_.map(item.departure_items, function (geo, index) {
					return getGeoItemHtml(
						geo,
						(index !== item.departure_items.length-1 && item.departure_items.length !== 1)
					);
				}).join('') + '</td><td>' +
				_.map(item.destination_items, function (geo, index) {
					return getGeoItemHtml(
						geo,
						(index !== item.destination_items.length-1 && item.destination_items.length !== 1)
					);
				}).join('') + '</td>';
		}

		return '<tr data-record-id="' + item.id + '" class="' + (isDefault ? 'is-default' : '') + '">' + geoHtml + '<td>' +
			_.map(sortPcc(item.reprice_pcc_records), function (pcc, index) {
				return getRepricePccHtml(
					pcc,
					(index !== item.reprice_pcc_records.length-1 && item.reprice_pcc_records.length !== 1)
				);
			}).join('') + '</td><td><button type="button" ' +
			'class="btn btn-primary btn-xs js-open-modal-multi-pcc-tariff"><i class="fa fa-pencil">' +
			'</i></button><button type="button" class="btn btn-dark btn-xs js-delete-multi-pcc-tariff"><i class="fa fa-trash">' +
			'</i></button></td></tr>';
	}

	function getRepricePccHtml(item, isComma) {
		var html = '';
		var fareTypeTitle;
		var fareTypeText;

		html += '<span class="' + item.gds + '" title="' +
			item.consolidator + ' (' + item.gds + ')">' + item.pcc +  '</span>';

		html += '<span>';
		if (item.ptc) {
			html += ' ' + item.ptc;
		}
		if (item.fare_type) {
			switch (item.gds) {
			case 'apollo':
			case 'galileo':
				fareTypeTitle = _.find(fareTypes, ['value', item.fare_type]).name;
				fareTypeText = ' ' + fareTypesViewMap.common[item.fare_type];
				break;
			case 'amadeus':
				fareTypeTitle = _.find(fareTypesAmadeus, ['value', item.fare_type]).name;
				fareTypeText = ' ' + fareTypesViewMap[item.gds][item.fare_type];
				break;
			case 'sabre':
				fareTypeTitle = _.find(fareTypesSabre, ['value', item.fare_type]).name;
				fareTypeText = ' ' + fareTypesViewMap[item.gds][item.fare_type];
				break;
			}
			html += '<span title="' + fareTypeTitle + '">' + fareTypeText + '</span>';
		}
		if (item.account_code) {
			html += ' ' + item.account_code;
		}
		if (item.ta_pcc) {
			html += ' /TA' + item.ta_pcc;
		}
		if ((item.allowed_airlines || []).length > 0) {
			html += ' -' + item.allowed_airlines.join(',');
		}

		html += '</span>';
		html += ((isComma) ? ', ' : ' ');

		return html;
	}

	function getGeoItemHtml(data, isComma) {
		var icon;
		var title;
		var html;

		switch (data.type) {
		case 'airport':
			icon = 'fa-plane';
			title = data.value;
			break;

		case 'city':
			icon = 'fa-home';
			title = data.value;
			break;

		case 'country':
			icon = 'fa-globe';
			title = data.name + ' (' + data.value + ')';
			break;

		case 'region':
			icon = 'fa-sun-o';
			title = data.name;
			break;
		}

		html = '<span title="' + _.upperFirst(data.type) +
			': ' + data.name + ' (' + data.value + ')">' +
			'<i class="fa ' + icon + '"></i> ' + title +
			((isComma) ? ',' : '') + ' </span>';

		return html;
	}

	$modalError.modal({
		show: false,
	});

});