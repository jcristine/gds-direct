interface IRedisInfo {
    // Server
	"redis_version": "3.0.6",
	"redis_git_sha1": "00000000",
	"redis_git_dirty": "0",
	"redis_build_id": "28b6715d3583bf8e",
	"redis_mode": "standalone",
	"os": "Linux 4.4.0-124-generic x86_64",
	"arch_bits": "64",
	"multiplexing_api": "epoll",
	"gcc_version": "5.4.0",
	"process_id": "31643",
	"run_id": "5d6f271fefe3edcaa770d4a6b7bbe2d204ffcd1d",
	"tcp_port": "6379",
	"uptime_in_seconds": "3567459",
	"uptime_in_days": "41",
	"hz": "10",
	"lru_clock": "4566270",
	"config_file": "/etc/redis/redis.conf",

    // Clients
	"connected_clients": "19",
	"client_longest_output_list": "0",
	"client_biggest_input_buf": "0",
	"blocked_clients": "2",

    // Memory
	"used_memory": "1397544",
	"used_memory_human": "1.33M",
	"used_memory_rss": "4177920",
	"used_memory_peak": "2015928",
	"used_memory_peak_human": "1.92M",
	"used_memory_lua": "50176",
	"mem_fragmentation_ratio": "2.99",
	"mem_allocator": "jemalloc-3.6.0",

    // Persistence
	"loading": "0",
	"rdb_changes_since_last_save": "504968",
	"rdb_bgsave_in_progress": "0",
	"rdb_last_save_time": "1544502683",
	"rdb_last_bgsave_status": "ok",
	"rdb_last_bgsave_time_sec": "-1",
	"rdb_current_bgsave_time_sec": "-1",
	"aof_enabled": "0",
	"aof_rewrite_in_progress": "0",
	"aof_rewrite_scheduled": "0",
	"aof_last_rewrite_time_sec": "-1",
	"aof_current_rewrite_time_sec": "-1",
	"aof_last_bgrewrite_status": "ok",
	"aof_last_write_status": "ok",

    // Stats
	"total_connections_received": "242351",
	"total_commands_processed": "1547367",
	"instantaneous_ops_per_sec": "0",
	"total_net_input_bytes": "135497159",
	"total_net_output_bytes": "137918239",
	"instantaneous_input_kbps": "0.00",
	"instantaneous_output_kbps": "0.00",
	"rejected_connections": "0",
	"sync_full": "0",
	"sync_partial_ok": "0",
	"sync_partial_err": "0",
	"expired_keys": "115953",
	"evicted_keys": "0",
	"keyspace_hits": "141134",
	"keyspace_misses": "126717",
	"pubsub_channels": "2",
	"pubsub_patterns": "0",
	"latest_fork_usec": "0",
	"migrate_cached_sockets": "0",

    // Replication
	"role": "master",
	"connected_slaves": "0",
	"master_repl_offset": "0",
	"repl_backlog_active": "0",
	"repl_backlog_size": "1048576",
	"repl_backlog_first_byte_offset": "0",
	"repl_backlog_histlen": "0",

    // CPU
	"used_cpu_sys": "3075.78",
	"used_cpu_user": "2008.40",
	"used_cpu_sys_children": "0.00",
	"used_cpu_user_children": "0.00",

    // Cluster
	"cluster_enabled": "0",

    // Keyspace
	"db0": "keys=11,expires=0,avg_ttl=0",
	"db1": "keys=5811,expires=118,avg_ttl=75653011",
	"db2": "keys=135,expires=135,avg_ttl=57894404"
}