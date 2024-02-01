import React from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  Tabs,
  Tab,
  Grid,
} from "@mui/material";
import { ArrowLeft } from "phosphor-react";
import useResponsive from "../../hooks/useResponsive";
import { useDispatch } from "react-redux";
import { UpdateSidebarType } from "../../redux/slices/app";
import { faker } from "@faker-js/faker";
import { DocMsg, LinkMsg } from "./Conversation";
import { Shared_docs, Shared_links } from "../../data";

const Media = () => {
  const dispatch = useDispatch();

  const theme = useTheme();

  const isDesktop = useResponsive("up", "md");

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{
      width: !isDesktop ? "100vw" : 350,
      height: isDesktop ? "100%" : "calc(100vh - 70px)",
      paddingBottom: !isDesktop ? "58px" : "0px",
      marginRight: isDesktop ? "10px" : "0px",

      position: "fixed", right: "0",
      backgroundColor: theme.palette.mode === "light"
        ? "#F8FAFF"
        : "#2a353d",
      overflow: "hidden",
      zIndex: 10,
      borderLeft: theme.palette.mode === "light" ? "2px solid #dedcdc" : "2px solid #302c2c"
    }}>
      <Stack sx={{ height: "100%" }}>
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            width: "100%",

            // backgroundColor:
            //   theme.palette.mode === "light"
            //     ? "#F8FAFF"
            //     : theme.palette.background,

          }}
        >
          <Stack
            sx={{ height: "100%", p: 2 }}
            direction="row"
            alignItems={"center"}
            spacing={3}
          >
            <IconButton
              onClick={() => {
                dispatch(UpdateSidebarType("CONTACT"));
              }}
            >
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle2">Shared</Typography>
          </Stack>
        </Box>

        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Media" />
          <Tab label="Links" />
          <Tab label="Docs" />
        </Tabs>
        <Stack
          sx={{
            height: "90vh",
            position: "relative",
            flexGrow: 1,

            overflow: "scroll",
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            // overflow: "scroll",
            // '&::-webkit-scrollbar': {
            //   display: 'none',
            // },

          }}
          spacing={3}
          padding={value === 1 ? 1 : 3}
        >
          {/* <Conversation starred={true} /> */}
          {
            (() => {
              switch (value) {
                case 0:
                  return (
                    <Grid container spacing={2}>
                      {
                        [0, 1, 2, 3, 4, 5].map((el, key) => (
                          <Grid item xs={4} key={key}>
                            <img
                              src={faker.image.city()}
                              alt={faker.internet.userName()}
                            />
                          </Grid>
                        ))
                      }
                    </Grid>
                  );
                case 1:
                  return Shared_links.map((el, key) => <LinkMsg el={el} key={key} />);

                case 2:
                  return Shared_docs.map((el, key) => <DocMsg el={el} key={key} />);

                default:
                  break;
              }
            })()
          }
        </Stack>
      </Stack>
    </Box>
  );
};

export default Media;
