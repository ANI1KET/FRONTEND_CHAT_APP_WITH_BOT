import React from "react";
import { Avatar, Box, Fade, Menu, MenuItem, Stack } from "@mui/material";

import { Profile_Menu } from "../../data";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "../../redux/slices/auth";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";
import { AWS_S3_REGION, S3_BUCKET_NAME } from "../../config";
import { SelectConversation } from "../../redux/slices/app"

const ProfileMenu = () => {
  const { user } = useSelector((state) => state.app);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const user_id = window.localStorage.getItem("user_id");

  const user_name = user?.firstName;
  const user_img = `https://${S3_BUCKET_NAME}.s3.${AWS_S3_REGION}.amazonaws.com/${user?.avatar}`;

  return (
    <>
      <Avatar
        id="profile-positioned-button"
        aria-controls={openMenu ? "profile-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? "true" : undefined}
        alt={user_name}
        src={user_img}
        onClick={handleClick}
      />
      <Menu
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        TransitionComponent={Fade}
        id="profile-positioned-menu"
        aria-labelledby="profile-positioned-button"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Box>
          <Stack spacing={1}>
            {
              Profile_Menu.map((el, idx) => (
                <MenuItem onClick={handleClose} key={idx}>
                  <Stack
                    onClick={() => {
                      if (idx === 0) {
                        navigate("/profile");
                      }
                      else if (idx === 1) {
                        navigate("/settings");
                      }
                      else {
                        dispatch(LogoutUser());
                        dispatch(SelectConversation({ room_id: null }));
                        socket.emit("end", { user_id });
                      }
                    }}
                    sx={{ width: 100 }}
                    direction="row"
                    alignItems={"center"}
                    justifyContent="space-between"
                  >
                    <span>{el.title}</span>
                    {el.icon}
                  </Stack>{" "}
                </MenuItem>
              ))
            }
          </Stack>
        </Box>
      </Menu>
    </>
  );
};

export default ProfileMenu;
