import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import SideNav from "./SideNav";
import useResponsive from "../../hooks/useResponsive";
import { FetchUserProfile, SelectConversation, showSnackbar } from "../../redux/slices/app";
import { socket, connectSocket } from "../../socket";
import {
  UpdateDirectConversation,
  AddDirectConversation,
  AddDirectMessage,
} from "../../redux/slices/conversation";
import AudioCallNotification from "../../sections/Dashboard/Audio/CallNotification";
import VideoCallNotification from "../../sections/Dashboard/video/CallNotification";
import {
  PushToAudioCallQueue,
  UpdateAudioCallDialog,
} from "../../redux/slices/audioCall";
import AudioCallDialog from "../../sections/Dashboard/Audio/CallDialog";
import VideoCallDialog from "../../sections/Dashboard/video/CallDialog";
import { PushToVideoCallQueue, UpdateVideoCallDialog } from "../../redux/slices/videoCall";

import BottomNav from "./BottomNav";
import { FetchDirectConversations, } from "../../redux/slices/conversation";

const DashboardLayout = () => {
  const isDesktop = useResponsive("up", "md");
  const dispatch = useDispatch();
  const { user_id } = useSelector((state) => state.auth);
  const { open_audio_notification_dialog, open_audio_dialog } = useSelector(
    (state) => state.audioCall
  );
  const { open_video_notification_dialog, open_video_dialog } = useSelector(
    (state) => state.videoCall
  );
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { conversations, current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );

  useEffect(() => {
    dispatch(FetchUserProfile());
  }, []);

  const handleCloseAudioDialog = () => {
    dispatch(UpdateAudioCallDialog({ state: false }));
  };
  const handleCloseVideoDialog = () => {
    dispatch(UpdateVideoCallDialog({ state: false }));
  };

  useEffect(() => {
    if (isLoggedIn) {
      window.onload = function () {
        if (!window.location.hash) {
          window.location = window.location + "#loaded";
          // window.location.reload();
        }
      };

      window.onload();

      if (!socket) {
        connectSocket(user_id);
      }

      socket.on("audio_call_notification", (data) => {
        // TODO => dispatch an action to add this in call_queue
        dispatch(PushToAudioCallQueue(data));
      });

      socket.on("video_call_notification", (data) => {
        // TODO => dispatch an action to add this in call_queue
        dispatch(PushToVideoCallQueue(data));
      });

      socket.on("new_message", (data) => {
        const message = data.message;
        // check if msg we got is from currently selected conversation
        if (current_conversation?.id === data.conversation_id) {
          dispatch(
            AddDirectMessage({
              type: "msg",
              subtype: message.type,
              message: message.text,
              incoming: message.to === user_id,
              outgoing: message.from === user_id,
            })
          );
        }
      });

      socket.on("start_chat", (data, exist) => {
        // const existing_conversation = conversations.find(
        //   (el) => el?.id === data._id
        // );
        if (exist) {
          dispatch(UpdateDirectConversation({ conversation: data }));
        } else {
          dispatch(AddDirectConversation({ conversation: data }));
        }
        dispatch(SelectConversation({ room_id: data._id }));
      });

      socket.on("new_friend_request", (data) => {
        dispatch(
          showSnackbar({
            severity: "success",
            message: "New friend request received",
          })
        );
      });

      socket.on("request_accepted", (data) => {
        dispatch(
          showSnackbar({
            severity: "success",
            message: "Friend Request Accepted",
          })
        );
      });

      socket.on("request_sent", (data) => {
        dispatch(showSnackbar({ severity: "success", message: data.message }));
      });

      socket.on("get_direct_conversations", (data) => {
        dispatch(FetchDirectConversations({ user_id: user_id, conversations: data }));
      });
    }

    return () => {
      socket?.off("audio_call_notification");
      socket?.off("video_call_notification");
      socket?.off("new_message");
      socket?.off("start_chat");
      socket?.off("new_friend_request");
      socket?.off("request_accepted");
      socket?.off("request_sent");
    };
  }, [current_conversation, isLoggedIn, user_id]);

  if (!isLoggedIn) {
    return <Navigate to={"/auth/login"} />;
  }

  return (
    <>
      <Stack direction={isDesktop ? "row" : "column"}>
        {
          isDesktop && (
            <SideNav />
          )
        }

        <Outlet />

        {
          !isDesktop && (
            <BottomNav />
          )
        }
      </Stack>

      {
        open_audio_notification_dialog && (
          <AudioCallNotification open={open_audio_notification_dialog} />
        )
      }
      {
        open_audio_dialog && (
          <AudioCallDialog
            open={open_audio_dialog}
            handleClose={handleCloseAudioDialog}
          />
        )
      }
      {
        open_video_notification_dialog && (
          <VideoCallNotification open={open_video_notification_dialog} />
        )
      }
      {
        open_video_dialog && (
          <VideoCallDialog
            open={open_video_dialog}
            handleClose={handleCloseVideoDialog}
          />
        )
      }

    </>
  );
};

export default DashboardLayout;
