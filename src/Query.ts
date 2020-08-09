import { beforeUpdate, onDestroy } from "svelte";
import { Readable } from "svelte/store";
import { cache } from "./Cache";
import { update, subscribe } from "./Store";
import isPromise from "is-promise";

import { getContext } from "./Context";
import { defaultConfig, IConfig, IFetcherFn, IState } from "./Types";

let lastKey: string | undefined;

function query<Data = any>(
  key: string
): { data: Readable<IState<Data>>; refetch: () => void };
function query<Data = any>(
  key: string,
  config?: IConfig
): { data: Readable<IState<Data>>; refetch: () => void };
function query<Data = any>(
  key: string,
  fn?: IFetcherFn<Data>,
  config?: IConfig
): { data: Readable<IState<Data>>; refetch: () => void };

function query<Data = any>(
  ...args: any
): { data: Readable<IState<Data>>; refetch: () => void } {
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
    throw new Error("You need to define a key");
  }
  if (!fn && !config.fetcher) {
    throw new Error("You need to define a fetching functions");
  }

  const fetcherFunc: IFetcherFn<Data> = fn ? fn : config.fetcher;

  let interval: NodeJS.Timeout;

  const getAndSetData = async () => {
    if (isPromise(fetcherFunc())) {
      // Get Data from server and update cache
      const data = await (fetcherFunc as (...args: any) => Promise<Data>)(
        key
      ).catch((error) => {
        update((state) => ({ ...state, loading: false, error }));
      });
      update((state) => ({ ...state, loading: false, data }));
      cache.set(key, data);
    }
  };
  beforeUpdate(async () => {
    // Check if the provided key is a Promise
    if (isPromise(key)) {
      try {
        // Don't display any data while the promise is resolving
        update((state) => ({ ...state, loading: false, data: undefined }));
        // If it is a Promise wait for the Promise to resolve
        const keyVal = await ((key as unknown) as () => Promise<any>)();
        if (typeof keyVal === "string") {
          key = keyVal;
        }
      } catch (e) {
        update((state) => ({ ...state, loading: false, data: undefined }));
        return;
      }
    }
    // Only run if key is different to the last key
    if (key !== lastKey) {
      update((state) => ({ ...state, loading: true }));
      // Check if key is a function
      if (typeof key === "function") {
        key = (key as any)();
      }

      if (typeof fn === "undefined") {
        // use a global fetcher
        fn = config.fetcher;
      }
      lastKey = key;
      // Check cache and return data if cache has data for that key
      if (cache.has(key)) {
        update((state) => ({ ...state, loading: false, data: cache.get(key) }));
      }

      getAndSetData();

      // Set refreshInterval if is set through config
      if (config?.refreshInterval) {
        interval = setInterval(async () => {
          try {
            const data = await fn?.(key);
            update((state) => ({ ...state, loading: false, data }));
            cache.set(key, data);
          } catch (error) {
            update((state) => ({ ...state, loading: false, error }));
          }
        }, config?.refreshInterval);
      }
    }
  });
  // Delete interval on unmount so refreshing stops
  onDestroy(() => clearInterval(interval));

  return { data: { subscribe }, refetch: getAndSetData };
}

export { query };
