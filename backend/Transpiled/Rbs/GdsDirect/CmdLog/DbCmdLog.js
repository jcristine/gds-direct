//
// // namespace Rbs\GdsDirect\CmdLog;
//
// const Fp = require('../../../Lib/Utils/Fp.js');
// const GdsDirect = require('../../../Rbs/GdsDirect/GdsDirect.js');
// const SessionStateHelper = require('../../../Rbs/GdsDirect/SessionStateProcessor/SessionStateHelper.js');
// const SessionStateProcessor = require('../../../Rbs/GdsDirect/SessionStateProcessor/SessionStateProcessor.js');
// const InstanceCmdLog = require('./InstanceCmdLog.js');
//
// /**
//  * this is an ORM to terminal_command_log table
//  * it allows to fetch rows from db just once and ability to
//  * take all commands including commands called in this process
//  */
// class DbCmdLog
// {
//      $sessionId;
//      $gds;
//      $cmdRequested = '';
//      $dialect = '';
//      $leadData = [];
//
//      $sessionData;
//
//      $earliestCurrentPnrCmdId = null;
//      $earliestStateSafeCmdId = null;
//      $earliestFetchedId = null;
//
//      $fetchedCommands = [];
//
//     static selectEarliestStateSafeCmdId($sessionId, $area)  {
//         let $stateSafeTypes;
//         $stateSafeTypes = SessionStateProcessor.$nonAffectingTypes;
//         return this.selectEarliestCmdOfTypeId($sessionId, $area, $stateSafeTypes);
//     }
//
//     static selectEarliestCmdOfTypeId($sessionId, $area, $types)  {
//         let $limitCommands, $params;
//         $limitCommands = php.implode(',', Fp.map('json_encode', $types));
//         $params = {'session_id': $sessionId, 'area': $area};
//         return Db.inst().fetchOne(php.implode(php.PHP_EOL, [
//             'SELECT id FROM terminal_command_log',
//             'WHERE TRUE',
//             '    AND session_id = :session_id',
//             '    AND cmd_type NOT IN ('+$limitCommands+')',
//             '    AND area = :area',
//             'ORDER BY id DESC LIMIT 1;',
//         ]), $params)['id'] || 0;
//     }
//
//     /** this function should filter by completely same criteria as selectEarliestStateSafeCmdId() */
//     static takeStateSafeCommands($commands, $area)  {
//         return this.takeLastCommandsOfTypes($commands, $area, SessionStateProcessor.$nonAffectingTypes);
//     }
//
//     /** this function should filter by completely same criteria as selectEarliestCmdOfTypeId() */
//     static takeLastCommandsOfTypes($commands, $area, $types)  {
//         let $matched, $canBeMoreInDb, $i, $cmdRec;
//         $matched = [];
//         $canBeMoreInDb = true;
//         for ($i = php.count($commands) -1; $i >= 0; --$i) {
//             $cmdRec = $commands[$i];
//             if ($cmdRec['area'] === $area) {
//                 php.array_unshift($matched, $cmdRec);
//                 if (!php.in_array($cmdRec['cmd_type'], $types)) {
//                     $canBeMoreInDb = false;
//                     break;
//                 }
//             }
//         }
//         return {
//             'canBeMoreInDb': $canBeMoreInDb,
//             'commands': $matched,
//         };
//     }
//
//     static selectEarliestPnrCmdId($state)  {
//         let $params;
//         $params = {
//             'session_id': $state['id'],
//             'area': $state['area'],
//             'record_locator': $state['record_locator'],
//         };
//         return Db.inst().fetchOne(php.implode(php.PHP_EOL, [
//             'SELECT id FROM terminal_command_log',
//             'WHERE TRUE',
//             '    AND session_id = :session_id',
//             '    AND area = :area',
//             '    AND (',
//             '        NOT has_pnr OR',
//             '        record_locator NOT IN (:record_locator, \\\'\\\')',
//             '    )',
//             'ORDER BY id DESC LIMIT 1;',
//         ]), $params)['id'] || 0;
//     }
//
//     /** this function should filter by completely same criteria as selectEarliestPnrCmdId() */
//     static takePnrCommands($commands, $state)  {
//         let $matched, $canBeMoreInDb, $tmpState, $i, $cmdRec;
//         $matched = [];
//         $canBeMoreInDb = true;
//         $tmpState = null;
//         for ($i = php.count($commands) -1; $i >= 0; --$i) {
//             $cmdRec = $commands[$i];
//             if ($cmdRec['area'] === $state['area']) {
//                 php.array_unshift($matched, $cmdRec);
//                 if (!$cmdRec['has_pnr'] ||
//                     !php.in_array($cmdRec['record_locator'], [$state['record_locator'], ''])
//                 ) {
//                     $canBeMoreInDb = false;
//                     break;
//                 }
//             }
//         }
//         return {
//             'canBeMoreInDb': $canBeMoreInDb,
//             'commands': $matched,
//         };
//     }
//
//     /** @param $sessionData = Db::fetchOne('SELECT * FROM terminal_sessions') */
//     constructor($sessionData)  {
//         this.$sessionId = $sessionData['id'];
//         this.$gds = $sessionData['gds'];
//         this.$sessionData = $sessionData;
//     }
//
//     setCmdRequested($cmdRequested, $dialect)  {
//         this.$cmdRequested = $cmdRequested;
//         this.$dialect = $dialect;
//         return this;
//     }
//
//     setLeadData($leadData)  {
//         this.$leadData = $leadData;
//         return this;
//     }
//
//     parseCommand($cmd)  {
//         return GdsDirect.makeGdsInterface(this.$gds).parseCommand($cmd);
//     }
//
//     getCommandsStartingFrom($id)  {
//         let $toId, $rows;
//         $toId = this.$earliestFetchedId;
//         $rows = Db.inst().fetchAll(php.implode(php.PHP_EOL, [
//             'SELECT * FROM terminal_command_log',
//             'WHERE TRUE',
//             '    AND session_id = :session_id',
//             '    AND id >= :from_id',
//             $toId !== null ?
//                 'AND id < :to_id' : '',
//             'ORDER BY id ASC;',
//         ]), php.array_merge({'session_id': this.$sessionId},
//             {'from_id': $id},
//             $toId !== null ?
//                 {'to_id': $toId} : []));
//         this.$fetchedCommands = php.array_merge($rows, this.$fetchedCommands);
//         this.$earliestFetchedId = $id;
//         return this.$fetchedCommands;
//     }
//
//     getEarliestStateSafeCmdId()  {
//         return this.$earliestStateSafeCmdId
//             || (this.$earliestStateSafeCmdId = this.constructor.selectEarliestStateSafeCmdId(this.$sessionId, this.$sessionData['area']));
//     }
//
//     getEarliestDbPnrCmdId()  {
//         return this.$earliestCurrentPnrCmdId
//             || (this.$earliestCurrentPnrCmdId = this.constructor.selectEarliestPnrCmdId(this.$sessionData));
//     }
//
//     getLastStateSafeCommands()  {
//         let $area, $taken, $commands, $earliestStateSafeCmdId;
//         $area = this.$sessionData['area'];
//         $taken = this.constructor.takeStateSafeCommands(this.$fetchedCommands, $area);
//         $commands = $taken['commands'];
//         if (!$taken['canBeMoreInDb']) {
//             // the earliest possible command is already fetched
//             return $commands;
//         }
//         $earliestStateSafeCmdId = this.getEarliestStateSafeCmdId();
//         if (this.$earliestFetchedId !== null &&
//             this.$earliestFetchedId <= $earliestStateSafeCmdId
//         ) {
//             // the earliest possible command is already fetched
//             return $commands;
//         }
//         $commands = this.getCommandsStartingFrom($earliestStateSafeCmdId);
//         return this.constructor.takeStateSafeCommands($commands, $area)['commands'];
//     }
//
//     getLastCommandsOfTypes($types)  {
//         let $sessionId, $area, $taken, $commands, $earliestId;
//         $sessionId = this.$sessionId;
//         $area = this.$sessionData['area'];
//         $taken = this.constructor.takeLastCommandsOfTypes(this.$fetchedCommands, $area, $types);
//         $commands = $taken['commands'];
//         if (!$taken['canBeMoreInDb']) {
//             // the earliest possible command is already fetched
//             return $commands;
//         }
//         $earliestId = this.constructor.selectEarliestCmdOfTypeId($sessionId, $area, $types);
//         if (this.$earliestFetchedId !== null &&
//             this.$earliestFetchedId <= $earliestId
//         ) {
//             // the earliest possible command is already fetched
//             return $commands;
//         }
//         $commands = this.getCommandsStartingFrom($earliestId);
//         return this.constructor.takeLastCommandsOfTypes($commands, $area, $types)['commands'];
//     }
//
//     getCurrentPnrCommands()  {
//         let $taken, $commands, $earliestPnrCmdId;
//         $taken = this.constructor.takePnrCommands(this.$fetchedCommands, this.$sessionData);
//         $commands = $taken['commands'];
//         if (!$taken['canBeMoreInDb']) {
//             // the earliest possible command is already fetched
//             return $commands;
//         }
//         $earliestPnrCmdId = this.getEarliestDbPnrCmdId();
//         if (this.$earliestFetchedId !== null &&
//             this.$earliestFetchedId <= $earliestPnrCmdId
//         ) {
//             // the earliest possible command is already fetched
//             return $commands;
//         }
//         $commands = this.getCommandsStartingFrom($earliestPnrCmdId);
//         return this.constructor.takePnrCommands($commands, this.$sessionData)['commands'];
//     }
//
//     getAllCommands()  {
//         return this.getCommandsStartingFrom(0);
//     }
//
//     getLastCalledCommand()  {
//         let $row;
//         if (this.$earliestFetchedId !== null) {
//             return this.$fetchedCommands.slice(-1)[0];
//         }
//         $row = Db.inst().fetchOne(php.implode(php.PHP_EOL, [
//             'SELECT * FROM terminal_command_log',
//             'WHERE session_id = :session_id',
//             'ORDER BY id DESC LIMIT 1;'
//         ]), {'session_id': this.$sessionId});
//         if ($row) {
//             this.$fetchedCommands.push($row);
//         }
//         this.$earliestFetchedId = $row['id'] || 0;
//         return $row;
//     }
//
//     getSessionData()  {
//         return this.$sessionData;
//     }
//
//     /**
//      * takes command-specific data, combines with
//      * context-specific data and writes to db
//      */
//     logCmdData($cmdData)  {
//         let $row, $id;
//         $row = (new InstanceCmdLog([], this.$sessionData)).setCmdRequested(this.$cmdRequested, this.$dialect).setLeadData(this.$leadData).makeRow($cmdData);
//         $id = Db.inst().insert('terminal_command_log', $row).getConnection().lastInsertId();
//         $row['id'] = $id;
//         this.$fetchedCommands.push($row);
//         this.$earliestFetchedId = this.$earliestFetchedId || $id;
//     }
//
//     logCommand($calledCommand)  {
//         let $cmd, $output, $cmdParsed, $prevState, $loggedType, $flatCmdTypes, $rloc;
//         $cmd = $calledCommand['cmd'];
//         $output = $calledCommand['output'];
//         $cmdParsed = this.parseCommand($cmd);
//         $prevState = this.$sessionData;
//         $loggedType = $cmdParsed['followingCommands'] ? 'complexCmd' : $cmdParsed['type'];
//         this.logCmdData({
//             'cmd_performed': $cmd,
//             'cmd_type': $loggedType,
//             'duration': $calledCommand['duration'],
//             'output': $output,
//         });
//         this.$sessionData = DbSessionState.updateSessionState($calledCommand['cmd'], $calledCommand['output'], this.$sessionData);
//         $flatCmdTypes = php.array_merge([$cmdParsed['type']], php.array_column($cmdParsed['followingCommands'] || [], 'type'));
//     }
//
//     updateAreaState($areaData, $rqData)  {
//         let $prevState;
//         this.logCmdData({
//             'cmd_type': $rqData['type'],
//             'duration': $rqData['duration'],
//             'cmd_performed': '',
//             'output': '',
//         });
//         $prevState = this.$sessionData;
//         this.$sessionData = SessionStateHelper.updateFromArea(this.getSessionData(), $areaData);
//         if ($prevState != this.$sessionData) {
//             Db.inst().insertOrUpdate('terminal_sessions', this.$sessionData);
//             Db.inst().insertOrUpdate('terminal_session_areas', SessionStateHelper.makeAreaData(this.$sessionData));
//         }
//     }
// }
// module.exports = DbCmdLog;
