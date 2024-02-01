import React from "react";
import {
  Stack,
  Box,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Divider,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { DotsThreeVertical, DownloadSimple, Image } from "phosphor-react";
import { Message_options } from "../../data";
import { Link } from "react-router-dom";
import truncateString from "../../utils/truncate";
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import Embed from "react-embed";
import { blue } from "@mui/material/colors";

const MessageOption = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <DotsThreeVertical
        size={20}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Stack spacing={1} px={1}>
          {
            Message_options.map((el) => (
              <MenuItem onClick={handleClose}>{el.title}</MenuItem>
            ))
          }
        </Stack>
      </Menu>
    </>
  );
};

const TextMsg = ({ el, menu }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: el.incoming
            ? alpha(theme.palette.background.default, 1)
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <div style={{ width: el.message?.length > 60 ? menu ? "35vw" : "250px" : "100%", wordWrap: "break-word" }}>
          <Typography variant="body2" color={el.incoming ? theme.palette.text : "#fff"}>
            {el.message}
          </Typography>
        </div>
      </Box>
      {menu && <MessageOption />}
    </Stack >
  );
};

const MediaMsg = ({ el, menu }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: el.incoming
            ? alpha(theme.palette.background.default, 1)
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={1}>
          <img
            src={el.img}
            alt={el.message}
            style={{ maxHeight: 210, borderRadius: "10px" }}
          />
          <Typography
            variant="body2"
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {el.message}
          </Typography>
        </Stack>
      </Box>
      {menu && <MessageOption />}
    </Stack>
  );
};

const DocMsg = ({ el, menu }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: el.incoming
            ? alpha(theme.palette.background.default, 1)
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            direction="row"
            spacing={3}
            alignItems="center"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <Image size={48} />
            <Typography variant="caption">Abstract.png</Typography>
            <IconButton>
              <DownloadSimple />
            </IconButton>
          </Stack>

          <Typography
            variant="body2"
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {el.message}
          </Typography>
        </Stack>
      </Box>
      {menu && <MessageOption />}
    </Stack>
  );
};

const LinkMsg = ({ el, menu }) => {
  const theme = useTheme();

  // function convertToEmbedUrl(url) {
  //   if (el.message.includes('www.youtube.com/watch')) {
  //     const videoId = url.split('v=')[1].substring(0, 11);
  //     return `https://www.youtube.com/embed/${videoId}`;
  //   }
  //   else if (el.message.includes('www.youtube.com/live')) {
  //     const videoId = url.split('live/')[1].substring(0, 11)
  //     return `https://www.youtube.com/embed/${videoId}`;
  //   }
  //   else if (el.message.includes('youtu.be/')) {
  //     const videoId = url.split('youtu.be/')[1].substring(0, 11)
  //     return `https://www.youtube.com/embed/${videoId}`;
  //   }
  //   return null;
  // }
  function convertToEmbedUrl(url) {
    const videoId = url.match(/(?:v=|youtu\.be\/|live\/)([\w-]{11})/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : null;
  }
  const embedUrl = convertToEmbedUrl(el.message);

  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: el.incoming
            ? alpha(theme.palette.background.default, 1)
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction="column"
            spacing={3}
            alignItems="start"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <Stack p={embedUrl ? 0 : 1} direction={"column"}>

              {
                (() => {

                  if (embedUrl)
                    return (
                      <iframe width="200" height="200" src={embedUrl} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen>
                      </iframe>
                    );

                  return (
                    <a href={el.message} target="_blank" rel="noreferrer"
                      style={{ color: theme.palette.mode === "light" ? "black" : "white" }}
                    >
                      {el.message.length > 25 ? el.message.slice(0, 40) + '...' : el.message}
                    </a>
                  );

                })()
              }

              {/* <img src={el.preview} alt={el.message} style={{ maxHeight: 200, borderRadius: "10px" }} /> */}

            </Stack>
          </Stack>


          {/* <Typography
            variant="body2"
            color={el.incoming ? theme.palette.text : "#fff"}
          > */}
          {/* <div dangerouslySetInnerHTML={{ __html: el.message }}></div> */}
          {/* {el.message}
          </Typography> */}


        </Stack>
      </Box>
      {menu && <MessageOption />}
    </Stack>
  );
};

const ReplyMsg = ({ el, menu }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: el.incoming
            ? alpha(theme.palette.background.paper, 1)
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            direction="column"
            spacing={3}
            alignItems="center"
            sx={{
              backgroundColor: alpha(theme.palette.background.paper, 1),
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color={theme.palette.text}>
              {el.message}
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {el.reply}
          </Typography>
        </Stack>
      </Box>
      {menu && <MessageOption />}
    </Stack>
  );
};

const Timeline = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems={"center"} justifyContent="space-between">
      <Divider width="46%" />
      <Typography width="46%" variant="caption" sx={{ color: theme.palette.text }}>
        {el.text}
      </Typography>
      <Divider width="46%" />
    </Stack>
  );
};

export { Timeline, MediaMsg, LinkMsg, DocMsg, TextMsg, ReplyMsg };
