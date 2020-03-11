class Cache {
  private __cache: Map<string, any>;
  constructor() {
    this.__cache = new Map();
  }
  has(key: string) {
    return this.__cache.has(key);
  }
  get(key: string): any {
    return this.__cache.get(key);
  }

  set(key: string, data: any) {
    this.__cache.set(key, data);
  }
}

export const cache = new Cache();
