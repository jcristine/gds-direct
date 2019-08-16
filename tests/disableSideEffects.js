

// TODO: get rid of config lan in tests altogether
process.env.DB_NAME = "gds_direct_plus";
process.env.REDIS_CLUSTER_NAME = "stage-travel-shared1";
process.env.CONFIG_LAN = "https://config-lan.sandbox.dyninno.net";
process.env.NODE_ENV = 'unitTest';

const Redis = require('../backend/LibWrappers/Redis.js');
const Db = require('../backend/Utils/Db.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const Config = require('../backend/Config.js');
const FluentLogger = require('../backend/LibWrappers/FluentLogger.js');

Redis.withLock = () => Rej.ServiceUnavailable('Redis disabled in tests');
Redis.withCache = () => Rej.ServiceUnavailable('Redis disabled in tests');
Redis.withNewConnection = () => Rej.ServiceUnavailable('Redis disabled in tests');
Redis.getClient = () => Rej.ServiceUnavailable('Redis disabled in tests');

Db.with = () => Rej.ServiceUnavailable('DB disabled in tests');
Db.fetchOne = () => Rej.ServiceUnavailable('DB disabled in tests');
Db.fetchAll = () => Rej.ServiceUnavailable('DB disabled in tests');

Config.getConfig = () => Rej.ServiceUnavailable('Config should not be fetched in tests');

FluentLogger.logit = () => Promise.resolve();
FluentLogger.logExc = () => Promise.resolve();
FluentLogger.logNewId = () => Promise.resolve('fake123456777');