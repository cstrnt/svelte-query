import { writable } from "svelte/store";
import { IState } from "./Types";

const INITIAL_STATE = {
  data: undefined,
  loading: true,
  error: undefined
};
export const { subscribe, update } = writable<IState<any>>(INITIAL_STATE);
