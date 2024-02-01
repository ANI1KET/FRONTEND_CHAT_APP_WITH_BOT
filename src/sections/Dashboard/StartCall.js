import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
} from "@mui/material";
import { MagnifyingGlass } from "phosphor-react";
import { useDispatch, useSelector } from "react-redux";
import { faker } from "@faker-js/faker";
import { useTheme } from "@mui/material/styles";

import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import { CallElement } from "../../components/CallElement";
import { CallList } from "../../data";
import { FetchAllUsers } from "../../redux/slices/app";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StartCall = ({ open, handleClose }) => {
  const { all_users } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(FetchAllUsers());
  }, []);

  const list = all_users.map((el) => ({
    id: el?._id,
    name: `${el?.firstName} ${el?.lastName}`,
    image: faker.image.avatar(),
  }));
  const theme = useTheme();

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{ p: 4 }}
    >
      <DialogTitle>{"Start New Conversation"}</DialogTitle>
      <Stack p={1} sx={{ width: "100%" }}>
        <Search>
          <SearchIconWrapper>
            <MagnifyingGlass style={{ color: theme.palette.primary.main }} />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
      </Stack>

      <DialogContent
        sx={{
          overflowY: "scroll",
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <Stack sx={{ height: "100%" }}>
          <Stack spacing={2.4}>
            {
              list.map((el, idx) => {
                return <CallElement key={idx} {...el} handleClose={handleClose} />;
              })
            }
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default StartCall;
