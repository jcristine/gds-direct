
process.env.HTTP_PORT = '3012';
process.env.SOCKET_PORT = '3022';
process.env.DB_NAME = "gds_direct_plus";
process.env.RANDOM_KEY = "12345678901234567890123456789012";
process.env.NODE_ENV = 'development';
process.env.HOST = '0.0.0.0';
process.env.RBS_PASSWORD = "qwerty";

process.env.REDIS_CLUSTER_NAME = "stage-travel-shared1";
process.env.CONFIG_LAN = "https://config-lan.sandbox.dyninno.net";
// config lan on dev is often dead...
//process.env.REDIS_CLUSTER_NAME = "some-grect-redis";
//process.env.CONFIG_LAN = "http://intranet.dyninno.net/~aklesuns/fake_config_lan/grect/";