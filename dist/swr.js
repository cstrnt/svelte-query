"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const svelte_1 = require("svelte");
const store_1 = require("svelte/store");
const Cache_1 = require("./Cache");
const INITIAL_STATE = {
    data: undefined,
    loading: true,
    error: undefined
};
const { subscribe, update } = store_1.writable(INITIAL_STATE);
function query(key, fetcher) {
    svelte_1.onMount(() => __awaiter(this, void 0, void 0, function* () {
        if (Cache_1.cache.has(key)) {
            update(state => (Object.assign(Object.assign({}, state), { loading: false, data: Cache_1.cache.get(key) })));
        }
        try {
            const data = yield fetcher();
            update(state => (Object.assign(Object.assign({}, state), { loading: false, data })));
            Cache_1.cache.set(key, data);
        }
        catch (error) {
            update(state => (Object.assign(Object.assign({}, state), { loading: false, error })));
        }
    }));
    return { subscribe };
}
exports.query = query;
function mutate(key, fetcher) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fetcher();
        update(state => (Object.assign(Object.assign({}, state), { data })));
        Cache_1.cache.set(key, data);
    });
}
exports.mutate = mutate;
//# sourceMappingURL=swr.js.map