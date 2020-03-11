import { beforeUpdate, onDestroy } from "svelte";
import { Readable } from "svelte/store";
import { cache } from "./Cache";
import { update, subscribe } from "./Store";

import { getContext } from "./Context";
import { defaultConfig, IConfig, IFetcherFn, IState } from "./Types";

let lastKey: string | undefined;

function query<Data = any>(key: string): Readable<IState<Data>>;
function query<Data = any>(
  key: string,
  config?: IConfig
): Readable<IState<Data>>;
function query<Data = any>(
  key: string,
  fn?: IFetcherFn<Data>,
  config?: IConfig
): Readable<IState<Data>>;

function query<Data = any>(...args: any): Readable<IState<Data>> {
  let key: string;
  let fn: IFetcherFn<Data> | undefined;
  let config: any;
  if (args.length >= 1) {
    key = args[0];
  }
  if (args.length > 2) {
    fn = args[1];
    config = args[2];
  } else {
    if (typeof args[1] === "function") {
      fn = args[1];
    } else if (typeof args[1] === "object") {
      config = args[1];
    }
  }
  // Merge configs
  config = Object.assign({}, defaultConfig, getContext(), config);

  // @ts-ignore
  if (!key) {
    update(state => ({ ...state, loading: false, data: undefined }));
    return { subscribe };
  }

  if (typeof key === "function") {
    try {
      key = (key as any)();
    } catch (e) {
      update(state => ({ ...state, loading: false, data: undefined }));
      return { subscribe };
    }
  }

  if (typeof fn === "undefined") {
    // use a global fetcher
    fn = config.fetcher;
  }

  let interval: number;
  beforeUpdate(async () => {
    // Only run if key is different to the last key
    if (key !== lastKey) {
      lastKey = key;
      // Check cache and return data if cache has data for that key
      if (cache.has(key)) {
        update(state => ({ ...state, loading: false, data: cache.get(key) }));
      }

      try {
        // Get Data from server and update cache
        const data = await fn?.(key);
        update(state => ({ ...state, loading: false, data }));
        cache.set(key, data);
      } catch (error) {
        // Return the error if something went wrong with the request
        update(state => ({ ...state, loading: false, error }));
      }

      // Set refreshInterval if is set through config
      if (config?.refreshInterval) {
        interval = setInterval(async () => {
          try {
            const data = await fn?.(key);
            update(state => ({ ...state, loading: false, data }));
            cache.set(key, data);
          } catch (error) {
            update(state => ({ ...state, loading: false, error }));
          }
        }, config?.refreshInterval);
      }
    }
  });
  // Delete Interval on Unmount so refreshing stops
  onDestroy(() => clearInterval(interval));

  return { subscribe };
}

export { query };
