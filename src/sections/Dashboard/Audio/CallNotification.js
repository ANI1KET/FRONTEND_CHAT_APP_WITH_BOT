import { faker } from "@faker-js/faker";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Slide,
  Stack,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../../socket";
// import {
//   ResetAudioCallQueue,
//   UpdateAudioCallDialog,
// } from "../../../redux/slices/audioCall";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CallNotification = ({ open, handleClose }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.app);
  const [call_details] = useSelector((state) => state.audioCall.call_queue);

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        // onClose={handleDeny}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <Stack direction="row" spacing={24} p={2}>
            <Stack>
              <Avatar
                sx={{ height: 100, width: 100 }}
                src={``}
              />
            </Stack>
            <Stack>
              <Avatar
                sx={{ height: 100, width: 100 }}
                src={``}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained" color="success"
          // onClick={handleAccept} 
          >
            Accept
          </Button>
          <Button
            variant="contained" color="error"
          // onClick={handleDeny} 
          >
            Deny
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CallNotification;
