import { update } from "./Store";
import { cache } from "./Cache";
import { getContext } from "./Context";

export async function mutate(key: string, fetcher?: () => Promise<any>) {
  const fetcherFn = fetcher || getContext().fetcher;
  const data = await fetcherFn?.(key);
  update(state => ({ ...state, data }));
  cache.set(key, data);
}
