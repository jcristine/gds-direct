
/**
 * kind of similar to writing this in php:
 *   $terminals[$leadId][$agentId][$sessionId] = [...];
 *   $terminal = $terminals[$leadId][$agentId][$sessionId] ?? null;
 * keys are added recursively if not present
 */
module.exports = () => {
    let root = {};
    let get = (keys) => {
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
    };
    let set = (keys, value) => {
        let current = root;
        for (let i = 0; i < keys.length; ++i) {
            let key = keys[i];
            let isLast = i === keys.length - 1;
            if (isLast) {
                current[key] = value;
            } else if (!(key in current)) {
                current[key] = {};
            }
            current = current[key];
        }
        return current;
    };
    return {
        get: get,
        set: set,
        push: (keys, element) => {
            let arr = get(keys);
            if (!Array.isArray(arr)) {
                arr = set(keys, []);
            }
            arr.push(element);
        },
        root: root,
    };
};