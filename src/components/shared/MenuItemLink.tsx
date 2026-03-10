"use client";
import { MenuItem } from "@mui/material";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
type Props = {
  children: ReactNode;
  href: string;
};
export default function MenuItemLink({ children, href }: Props) {
  // export default function MenuItemLink({
  //   children,
  //   href,
  // }: {
  //   children: ReactNode;
  //   href: string;
  // }) {
  // CHANGE: Get current path in Next.js
  const pathname = usePathname();

  // CHANGE: Determine if the link is active
  const isActive = pathname === href || pathname.startsWith(href + "/");
  return (
    // <MenuItem
    //   component={NavLink}
    //   href={to}
    //   classes={({ isActive }: { isActive: boolean }) =>
    //     isActive ? "active" : ""
    //   }
    //   sx={{
    //     fontSize: "1.2rem",
    //     textTransform: "uppercase",
    //     fontWeight: "bold",
    //     color: "inherit",
    //     "&.active": {
    //       color: "yellow",
    //     },
    //   }}
    // >
    //   {children}
    // </MenuItem>
    <MenuItem
      component={Link}
      href={href}
      className={isActive ? "active" : ""}
      sx={{
        fontSize: "1.2rem",
        textTransform: "uppercase",
        fontWeight: "bold",
        color: "inherit",
        "&.active": {
          color: "yellow",
        },
      }}
    >
      {children}
    </MenuItem>
  );
}
