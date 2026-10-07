import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// The visitor's month, read on the client. The server renders the default (-1), so nothing seasonal
// is baked into the static page.
export function useMonth() {
  return useSyncExternalStore(subscribe, () => new Date().getMonth(), () => -1);
}
