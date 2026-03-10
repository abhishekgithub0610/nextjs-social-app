"use client";
import { useAccount } from "../../lib/hooks/useAccount";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import Person from "@mui/icons-material/Person";
import Logout from "@mui/icons-material/Logout";
import Link from "next/link";
import { Password } from "@mui/icons-material";

export default function UserMenu() {
  const { currentUser, logoutUser } = useAccount();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="user-menu-button"
        onClick={handleClick}
        color="inherit"
        size="large"
        sx={{ fontSize: "1.1rem" }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={currentUser?.imageUrl || "/images/user.png"}
            alt="user"
          />
          {/* <Avatar src={currentUser?.imageUrl} alt="current user image" /> */}
          {currentUser?.displayName}
        </Box>
      </Button>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        aria-labelledby="user-menu-button"
      >
        {/* <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      > */}
        <MenuItem
          component={Link}
          href="/activities/create"
          onClick={handleClose}
        >
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText>Create activity</ListItemText>
        </MenuItem>
        <MenuItem
          component={Link}
          href={`/profiles/${currentUser?.username}`}
          onClick={handleClose}
        >
          {/* <MenuItem
          component={Link}
          href={`/profiles/${currentUser?.id}`}
          onClick={handleClose}
        > */}
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText>My profile</ListItemText>
        </MenuItem>
        <MenuItem
          component={Link}
          href="/account/change-password"
          onClick={handleClose}
        >
          <ListItemIcon>
            <Password />
          </ListItemIcon>
          <ListItemText>Change password</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            logoutUser.mutate(undefined, {
              onSuccess: () => router.push("/"),
            });
            handleClose();
          }}
        >
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
