"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cache {
    constructor() {
        this.__cache = new Map();
    }
    has(key) {
        return this.__cache.has(key);
    }
    get(key) {
        return this.__cache.get(key);
    }
    set(key, data) {
        this.__cache.set(key, data);
    }
}
exports.cache = new Cache();
//# sourceMappingURL=Cache.js.map