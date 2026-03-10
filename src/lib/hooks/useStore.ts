import { useContext } from "react";
import { StoreContext } from "../stores/store";

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("StoreProvider missing");
  return context;
  //return useContext(StoreContext);
}
