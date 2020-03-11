import { onMount } from "svelte";
import { writable } from "svelte/store";
import { cache } from "./Cache";

const INITIAL_STATE = {
  data: undefined,
  loading: true,
  error: undefined
};
const { subscribe, update } = writable(INITIAL_STATE);

export function query(key: string, fetcher: () => Promise<any>) {
  onMount(async () => {
    if (cache.has(key)) {
      update(state => ({ ...state, loading: false, data: cache.get(key) }));
    }
    try {
      const data = await fetcher();
      update(state => ({ ...state, loading: false, data }));
      cache.set(key, data);
    } catch (error) {
      update(state => ({ ...state, loading: false, error }));
    }
  });

  return { subscribe };
}

export async function mutate(key: string, fetcher: () => Promise<any>) {
  const data = await fetcher();
  update(state => ({ ...state, data }));
  cache.set(key, data);
}
