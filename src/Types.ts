export type IFetcherFn<Data> = (...args: any) => Data | Promise<Data>;

export interface IConfig {
  fetcher?: undefined | IFetcherFn<any>;
  refreshInterval?: number;
}

export const defaultConfig: IConfig = {
  fetcher: undefined,
  refreshInterval: 0
};

export interface IState<Data> {
  data: Data | undefined;
  loading: boolean;
  error: Error | undefined;
}
