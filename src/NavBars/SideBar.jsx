import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import 'react-pro-sidebar/dist/css/styles.css';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from "react-router-dom";
import { tokens } from "../theme";
import SailingIcon from '@mui/icons-material/Sailing';
import GridOnIcon from '@mui/icons-material/GridOn';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

const Item = ({ title, icon, selected, setSelected, onClick }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
      <MenuItem
        active={selected === title}
        style={{
          color: colors.grey[100],
        }}
        onClick={() => {
          setSelected(title);
          onClick();
        }}
        icon={icon}
      >
        <Typography>{title}</Typography>
      </MenuItem>
    );
  };

  const Sidebar = ({toggleTerrainMode, toggleGridMode, handleDijkstraClick, handleBFSClick, handleDFSClick, handleAstarClick}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");
  
    return (
      <Box
        sx={{
          "& .pro-sidebar-inner": {
            background: `${colors.primary[400]} !important`,
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            padding: "5px 35px 5px 20px !important",
          },
          "& .pro-inner-item:hover": {
            color: "#868dfb !important",
          },
          "& .pro-menu-item.active": {
            color: "#6870fa !important",
          },
        }}
      >
        <ProSidebar collapsed={isCollapsed}>
          <Menu iconShape="square">
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: "10px 0 20px 0",
                color: colors.grey[100],
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="15px"
                >
                  <Typography variant="h3" color={colors.grey[100]}>
                    MENU
                  </Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>
  
            {!isCollapsed && (
              <Box mb="25px">
                <Box textAlign="center">
                  <Typography
                    variant="h2"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                    Search Algorithm Visualizer
                  </Typography>
                  <Typography variant="h5" color={colors.greenAccent[500]}>
                    Will Parrish
                  </Typography>
                </Box>
              </Box>
            )}
  
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Item
                title="Portfolio"
                to="/"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                //onClick={() => handlePortfolioClick()}
              />
  
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Mode
              </Typography>
              <Item
                title="Terrain"
                to="/team"
                icon={<SailingIcon />}
                selected={selected}
                setSelected={setSelected}
                onClick={() => toggleTerrainMode()}
              />
              <Item
                title="Grid"
                to="/contacts"
                icon={<GridOnIcon />}
                selected={selected}
                setSelected={setSelected}
                onClick={() => toggleGridMode()}
              />
  
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 8px" }}
              >
                Algorithms
              </Typography>
              <Item
                title="Dijkstra's"
                to="/form"
                icon={<TravelExploreIcon />}
                selected={selected}
                setSelected={setSelected}
                onClick={() => handleDijkstraClick()}
              />
              <Item
                title="A*"
                to="/calendar"
                icon={<TravelExploreIcon />}
                selected={selected}
                setSelected={setSelected}
                onClick={() => handleAstarClick()}
              />
              <Item
                title="BFS"
                to="/faq"
                icon={<TravelExploreIcon />}
                selected={selected}
                setSelected={setSelected}
                onClick={() => handleBFSClick()}
              />
              <Item
                title="DFS"
                to="/bar"
                icon={<TravelExploreIcon />}
                selected={selected}
                setSelected={setSelected}
                onClick={() => handleDFSClick()}
              />
            </Box>
          </Menu>
        </ProSidebar>
      </Box>
    );
  };
  
  export default Sidebar;