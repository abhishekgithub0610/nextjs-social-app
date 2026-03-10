"use client";

import { ReactNode } from "react";
import { StoreContext, store } from "@/lib/stores/store";

export default function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

// "use client";

// import { ReactNode } from "react";
// import { StoreContext, store } from "@/lib/stores/store";

// type Props = {
//   children: ReactNode;
// };

// export default function StoreProvider({ children }: Props) {
//   return (
//     <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
//   );
// }

// "use client";

// import { ReactNode, createContext, useContext } from "react";
// import { store } from "../lib/stores/store";

// type Props = {
//   children: ReactNode;
// };

// const StoreContext = createContext(store);

// export function useRootStore() {
//   return useContext(StoreContext);
// }

// export default function StoreProvider({ children }: Props) {
//   return (
//     <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
//   );
// }

// "use client";

// import type { ReactNode } from "react";

// type Props = {
//   children: ReactNode;
// };

// export default function StoreProvider({ children }: Props) {
//   return <>{children}</>;
// }
