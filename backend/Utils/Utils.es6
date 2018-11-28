
exports.MultiLevelMap = () => {
    let root = {};
    return {
        get: (keys) => {
            let current = root;
            for (let i = 0; i < keys.length; ++i) {
                let key = keys[i];
                if (key in current) {
                    current = current[key];
                } else {
                    return null;
                }
            }
            return current;
        },
        set: (keys, value) => {
            let current = root;
            for (let i = 0; i < keys.length; ++i) {
                let key = keys[i];
                let isLast = i === keys.length - 1;
                if (isLast) {
                    current[key] = value;
                } else if (!(key in current)) {
                    current[key] = exports.MultiLevelMap();
                }
                current = current[key];
            }
        },
    };
};