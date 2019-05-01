
import './../src/actions/initAuthPage.js';
import GrectApi from './../src/helpers/GrectApi.js';

/**
 * based on the code written by Natalija Kuzmenkova
 */

// should be included in the html file
let {moment, $, jQuery, _, template, Spinner} = window;

(function () {

    window.ModalSpinner = function (timer) {
        var self = this,
            spinnerEl = new Spinner().spin().el,
            $modalSpinner = $('.js-modal-spinner');

        $modalSpinner.find('.modal-content').append(spinnerEl);

        timer = timer || 600;

        function hideModal(dfd) {
            var onHidden = function () {
                $modalSpinner.off('hidden.bs.modal', onHidden);
                self.isShow = false;
                dfd.resolve();
            };

            self.isHide = false;
            $modalSpinner.on('hidden.bs.modal', onHidden);
            $modalSpinner.modal('hide');
        }

        self.show = function () {
            var dfd = jQuery.Deferred();

            if (!self.isShow) {
                self.isShow = true;
                $modalSpinner.modal('show');

                self.spinnerTimer = setTimeout(function () {
                    if (self.isHide) {
                        hideModal(dfd);
                    } else {
                        dfd.resolve();
                    }
                    self.spinnerTimer = null;
                }, timer);
            } else {
                dfd.resolve();
            }

            return dfd.promise();
        };

        self.hide = function () {
            var dfd = jQuery.Deferred();

            if (self.isShow) {
                self.isHide = true;
                if (_.isNil(self.spinnerTimer)) {
                    hideModal(dfd);
                } else {
                    dfd.resolve();
                }
            } else {
                dfd.resolve();
            }

            return dfd.promise();
        };
    };

    window.customSpinner = new window.ModalSpinner();
})();

let whenEmcSessionId = window.GdsDirectPlusPage.whenEmcSessionId;
let grectApi = GrectApi({whenEmcSessionId});

whenEmcSessionId.then(function(emcSessionId){
	let sessionId = new URLSearchParams(window.location.search).get('sessionId');
    let whenCmdRqById = grectApi.getCmdRqList({sessionId})
        .then(({records}) => {
            let cmdRqById = {};
            for (let record of records) {
                cmdRqById[record.id] = record;
            }
            return cmdRqById;
        });

    var iconsMap = {
            apollo: 'fa-rocket',
            galileo: 'fa-balance-scale',
            amadeus: 'fa-globe',
            sabre: 'fa-paper-plane',
            hasPnr: 'fa-sticky-note',
            isStoredPnr: 'fa-sticky-note info',
            canCreatePq: 'fa-check'
        },
        tableSession = new TableSession(),
        tableCommands = new TableCommands(),
        modalSpinner = new window.ModalSpinner(600);

    tableCommands.getRecords();

    function TableSession() {
        var self = this;

        let isDev = !(window.location.hostname + '').endsWith('.asaptickets.com');
        self.render = function (item) {

            var diffDuration = moment.duration( moment(item.user_activity_dt).diff(moment(item.created_dt)) );

            var isMinute = diffDuration.minutes() !== 0;

            var html = template('tbody_session_template', {

                iconGds: iconsMap[item.gds],

                item: item,

                trClass: (parseInt(item.is_active)) ? 'is-active': '',

                logUrl: isDev
                    ? 'http://stg-logger.dyninno.net/get.php?i=' + item.log_id
                    : 'https://log.dyninno.net/get.php?i=' + item.log_id,

                duration: (isMinute) ? diffDuration.humanize() :
                    (diffDuration.seconds() > 1) ? diffDuration.seconds() + ' seconds' :
                        'a second'
            });

            $('.js-tbody-session').append(html);
        };
    }

    function TableCommands() {
        var self = this,
            $window = $(window),
            $content = $('.js-commands-content'),
            $table = $content.find('.js-table'),
            $tBody = $content.find('.js-tbody'),
            $countBox = $('.js-record-count'),
            animateAlertQueue = [],
            $alert = $('.js-alert'),
            $modalCommon = $('.modal-common'),
            messagesHtml = {
                success: 'Copied to clipboard'
            },
            isAnimateAlert;

        self.copyAll = [];
        self.exportAll = [];

        self.wrapOutput = function(text) {
            return _.flatten(_.map(text.split('\n'), function (line) {
                //Split string in n-size chunks
                return line.match(/.{1,64}/g);
            })).join('\n');
        };

        self.getRecords = function () {

            modalSpinner.show();

            grectApi.getCmdList({sessionId})
                .then((res) => {
                    $('.js-content').removeClass('hidden');

                    self.records = res.records || [];

                    _.forEach(self.records, function (record) {
                       record.outputWrapped = self.wrapOutput(record.output);
                    });
                    tableSession.render(res.sessionData);

                    $countBox.append(self.records.length);

                    self.render({
                        isOnInit: true
                    });

                    self.width = $table.innerWidth();

                    $table
                        .find('.js-output')
                        .width(self.width);
                });
        };

        self.setDialectStyles = function () {
            var dialectWidth = 0;

            //todo
            $tBody
                .find('.js-dialect')
                .each(function (i, item) {
                    dialectWidth = Math.max(
                        dialectWidth,
                        $(item).width()
                    );
                })
                .filter(function (i, item) {
                    return $(item).width() !== dialectWidth;
                })
                .width(dialectWidth);
        };

        self.onRenderEnd = function () {
            modalSpinner.hide();

            $tBody.find('[data-toggle="tooltip"]').tooltip({
                html: true
            });

            self.setDialectStyles();
        };

        self.render = function (options) {
            self.countChunks = 0;

            modalSpinner.show();

            $tBody.empty();

            let lastCmdRqId = null;
            var rowList = _.reduce(self.records, function (acc, item) {

                var iconPnr = (!parseInt(item.has_pnr)) ? '' :
                    (!parseInt(item.is_pnr_stored)) ? iconsMap.hasPnr :
                        iconsMap.isStoredPnr;

                var html = template('tbody_template', {

                    item: item,

                    iconDialect: iconsMap[item.dialect],

                    iconPnr: iconPnr,

                    areaClass: 'command-area-' + _.toLower(item.area),

                    iconCanCreatePq: (parseInt(item.can_create_pq)) ? iconsMap.canCreatePq : '',

                    isCollapsed: self.isCollapsed,

                    btnCollapseIcon: (self.isCollapsed) ? 'fa-caret-up' : 'fa-caret-down',

                    outputStyles: (self.width) ? 'width:' + self.width + 'px;' : '',

                    isVisibleWrapBtn: item.gds === 'apollo' || item.gds === 'galileo',

                    iconWrapBtn: item.isWrap ? 'fa-exchange' : 'fa-arrows-h',

                    output: item.isWrap ?
                        '<pre>' + item.outputWrapped + '</pre>' :
                        '<pre>' + item.output + '</pre>'
                });

                let $tr = $(html);
                let cmdRqId = item.cmd_requested;
                let isContinuation = lastCmdRqId == cmdRqId;
                whenCmdRqById.then(cmdRqById => {
                    let cmdRqCell = $tr[0].querySelector('.value-holder[data-name="cmd_requested"]');
                    let cmdRq = cmdRqById[cmdRqId];
                    if (cmdRqCell) {
                        if (isContinuation) {
                            cmdRqCell.style['color'] = 'lightgrey';
                            cmdRqCell.textContent = '(continue)';
                        } else if (cmdRq) {
                            cmdRqCell.textContent = cmdRq.command;
                        } else if (!cmdRqId) {
                            cmdRqCell.style['color'] = 'orange';
                            cmdRqCell.textContent = '(no input data)';
                        }
                        cmdRqCell.title = cmdRqId;
                    }
                });
                lastCmdRqId = cmdRqId;

                if (options && options.isOnInit) {

                    self.copyAll.push(
                        self.wrapOutput('>' + item['cmd_performed']) +
                        '\n' + item.outputWrapped
                    );

                    self.exportAll.push(
                        {
                            cmd: item['cmd_performed'],
                            output: item.output
                        }
                    );
                }

                acc.push($tr);

                if (acc.length > 1000) {

                    var appendTbody = function (rowList, count){

                        setTimeout(function () {

                            $tBody.append(rowList);

                            if (count === (self.countChunks-1)) {
                                self.onRenderEnd();
                            }
                        }, 400*count);
                    };
                    appendTbody(acc, self.countChunks);

                    self.countChunks++;
                    acc = [];
                }

                return acc;
            }, []);

            if (options && options.isOnInit) {
                self.copyAll = self.copyAll.join('\n');
                self.exportAll = formatExportedData(self.exportAll);
            }

            $tBody.append(rowList);

            if (self.countChunks === 0) {
                self.onRenderEnd();
            }
        };

        $content
            .on('click', '.js-btn-copy', function () {

                var $modalContent = $('<textarea></textarea>').css({

                    height: $(window).height()-120 + 'px'

                }).val(self.copyAll);

                $modalCommon
                    .find('.modal-body')
                    .empty();

                $modalCommon.modal('show');

                setTimeout(function () {
                    $modalCommon.find('.modal-body').append($modalContent);
                });

                setTimeout(function () {
                    copyToClipboard(self.copyAll);
                    showAlert('success');
                }, 100);
            })
            .on('click', '.js-export-all', function () {

                var $modalContent = $('<textarea></textarea>').css({

                    height: $(window).height()-120 + 'px'

                }).val(self.exportAll);

                $modalCommon
                    .find('.modal-body')
                    .empty();

                $modalCommon.modal('show');

                setTimeout(function () {
                    $modalCommon.find('.modal-body').append($modalContent);
                });

                setTimeout(function () {
                    copyToClipboard(self.exportAll);
                    showAlert('success');
                }, 100);
            })
            .find('.js-collapse-all').click(function () {
                self.isCollapsed = !self.isCollapsed;

                $(this).html(
                    (self.isCollapsed) ? 'Hide all' : 'Show all'
                );

                self.render();
            });

        $table
            .on('click', '.js-toggle-wrap', function (e, params) {
                var $btn = $(this),
                    $trToggle = $btn.closest('tr'),
                    $trCollapse = $trToggle.next(),
                    $output = $trCollapse.find('.js-output-content'),
                    id = '' + $trCollapse.data('record-id'),
                    record = _.find(self.records, ['id', id]);

                $btn.toggleClass('fa-arrows-h fa-exchange');

                record.isWrap = !record.isWrap;
                if (record.isWrap) {
                    $output.html('<pre>' + record.outputWrapped + '</pre>');
                } else {
                    $output.html('<pre>' + record.output + '</pre>');
                }

                if (!$trToggle.hasClass('is-collapsed')) {
                    $trToggle.addClass('is-collapsed');
                    $trCollapse.collapse('show');
                }
            })
            .on('show.bs.collapse', 'tr.collapse', function () {
                $(this).prev().find('.js-btn-collapse-toggle').toggleClass('fa-caret-down fa-caret-up');
            })
            .on('hidden.bs.collapse', 'tr.collapse', function () {
                $(this).prev().find('.js-btn-collapse-toggle').toggleClass('fa-caret-down fa-caret-up');
            })
            .on('click', 'tr.js-collapse-toggle', function (e) {
                var $trToggle = $(this),
                    $target = $(e.target),
                    $trCollapse = $trToggle.next(),
                    id,
                    record;

                if ($target.closest('.js-item-log').length) {
                    id = '' + $trCollapse.data('record-id');
                    record = _.find(self.records, ['id', id]);
                    if (record) {
                        if (!record.isLogVisited) {
                            $trToggle.addClass('is-log-visited');
                        }
                        record.isLogVisited = true;
                    }
                }

                if ($target.closest('.js-folding-skip').length &&
                    !$target.closest('.js-btn-collapse-toggle').length) {
                    return;
                }

                $trToggle.toggleClass('is-collapsed');

                if ($trToggle.hasClass('is-collapsed')) {
                    $trCollapse.collapse('show');
                } else {
                    $trCollapse.collapse('hide');
                }
            })
            .on('click', '.js-copy-output', function () {
                var $tr = $(this).closest('tr').next(),
                    id = '' + $tr.data('record-id'),
                    outputHtml = _.find(self.records, ['id', id]).output;

                copyToClipboard(outputHtml);
            });

        function addSlashes(str) {
            return str
                .replace(/[\\']/g, '\\$&')
                .replace(/\u0000/g, '\\0');
        }

        function showAlert(path) {
            if (isAnimateAlert) {
                animateAlertQueue.push(path);
                return;
            }
            isAnimateAlert = true;

            var className = 'alert-' + _.head(path.split('.'));
            $alert.addClass(className);
            $alert.append(_.get(messagesHtml, path));

            $alert.show(0);

            $alert.delay(400).fadeTo(200, 1, function () {
                $alert.delay(2000).fadeTo(200, 0, function () {

                    $alert.removeClass(className);
                    $alert.empty();
                    $alert.hide(0);

                    isAnimateAlert = false;
                    if (animateAlertQueue.length) {
                        showAlert(animateAlertQueue[0]);
                        animateAlertQueue = _.slice(animateAlertQueue, 1);
                    }
                });
            });
        }

        function formatExportedData(data, margin, ind) {
            var result;

            ind = ind || '    ';
            margin = margin || '';

            if (_.isNil(data)) {
                return;
            }

            if (_.isArray(data)) {
                result = '[' + (ind ? '\n' : '') +
                    _.map(data, function(el) {
                        return margin + ind + formatExportedData(el, margin + ind);
                    }).join(ind ? ',\n' : ',') +
                    (ind ? ',\n' : '') + margin + ']';

            } else if (_.isObject(data)) {
                result = '[' + (ind ? '\n' : '') +
                    _.map(_.keys(data), function(k) {
                        return margin + ind + '\'' + addSlashes(k) +
                            '\'' + ' => ' + formatExportedData(data[k], margin + ind);
                    }).join(ind ? ',\n' : ',') +
                    (ind ? ',\n' : '') + margin + ']';

            } else if (_.isString(data)) {
                if (data.indexOf('\n') > -1) {
                    result = 'implode(PHP_EOL, ' + formatExportedData(data.split('\n'), margin) + ')';
                } else {
                    result = '\'' + addSlashes(data) + '\'';
                }
            } else {
                result = JSON.stringify(data);
            }

            return result;
        }

        function copyToClipboard(text) {

            // create hidden text element, if it doesn't already exist
            var targetId = '_hiddenCopyText_',
                $currentFocus = $(document.activeElement),
                currentScroll = $window.scrollTop(),
                // must use a temporary form element for the selection and copy
                $target = $('#' + targetId),
                succeed;

            if (!$target.length) {
                $target = $('<textarea id="' + targetId + '"></textarea>')
                    .css({
                        position: 'absolute',
                        left: '-9999px',
                        top: '0'
                    });
                $('body').append($target);
            }

            $target.val(text);

            // select the content
            $target.focus();
            $target.get(0).setSelectionRange(0, text.length);

            // copy the selection
            try {
                succeed = document.execCommand("copy");
            } catch(e) {
                succeed = false;
            }

            // restore original focus
            if ($currentFocus.length) {
                $currentFocus.focus();
                $window.scrollTop(currentScroll);
            }

            // clear temporary content
            $target.text('');

            return succeed;
        }
    }
});
