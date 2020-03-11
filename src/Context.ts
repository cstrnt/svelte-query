import { getContext as svGetContext, setContext } from "svelte";
import { IConfig } from "./Types";

const CONTEXT_NAME = "__svelte-query";

const DEFAULT_CONFIG = {
  fetcher: undefined,
  refreshInterval: 0
};

export function setConfig(config: IConfig = DEFAULT_CONFIG) {
  setContext(CONTEXT_NAME, config);
}

export function getContext(): IConfig {
  return svGetContext(CONTEXT_NAME);
}
