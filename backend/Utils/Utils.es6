
/**
 * if you are sick of checking each level in a multidimensional map, this class is for you:
 * before:
 *   let agentToGdsToLeadToSessionId = {};
 *   if (!agentToGdsToLeadToSessionId[agentId]) agentToGdsToLeadToSessionId[agentId] = {};
 *   if (!agentToGdsToLeadToSessionId[agentId][gds]) agentToGdsToLeadToSessionId[agentId][gds] = {};
 *   agentToGdsToLeadToSessionId[agentId][gds][leadId] = sessionId;
 * after:
 *   let agentToGdsToLeadToSessionId = DefaultDict();
 *   agentToGdsToLeadToSessionId[agentId][gds][leadId] = sessionId;
 */
exports.DefaultDict = (parent = null, keyInParent = null) => new Proxy({}, {
    get: (self, name) => {
        if (name in self) {
            return self[name];
        } else {
            return DefaultDict(self, name);
        }
    },
    set: (self, name, value) => {
        self[name] = value;
        if (parent) {
            parent[keyInParent] = self;
        }
    },
});

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