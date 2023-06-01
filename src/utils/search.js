import log from "./console";

function search(obj, key) {
    if (typeof obj !== "object" || obj === null) {
        return obj === key ? obj : undefined;
    }
    for (const [k, v] of Object.entries(obj)) {
        const result = search(v, key);
        if (key === k) {
            return v;
        }
    }
    return undefined;
}

export default search;