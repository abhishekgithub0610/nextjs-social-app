"use client";
import { Avatar, Popover } from "@mui/material";
import { useState } from "react";
import Link from "next/link";
import ProfileCard from "../../../features/profiles/ProfileCard";

type Props = {
  profile: Profile;
};

export default function AvatarPopover({ profile }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      {/* <Avatar
        src={profile.imageUrl}
        component={Link}
        href={`/profiles/${profile.id}`}
        sx={{
          border: profile.following ? 3 : 0,
          borderColor: "secondary.main",
        }}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      /> */}
      <Link
        href={`/profiles/${profile.id}`}
        style={{ display: "inline-block" }}
      >
        <Avatar
          src={profile.imageUrl}
          sx={{
            border: profile.following ? 3 : 0,
            borderColor: "secondary.main",
          }}
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        />
      </Link>
      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: "none", borderRadius: 3 }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <ProfileCard profile={profile} />
      </Popover>
    </>
  );
}
