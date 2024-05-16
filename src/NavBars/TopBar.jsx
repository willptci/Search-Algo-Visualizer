import { Box, IconButton, useTheme, Button } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PathfindingVisualizer from '../PathfindingVisualizer/PathfindingVisualizer'

const Topbar = ({searchAlgoCaller, clearGrid, clearAnimation}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);

    return (<Box display="flex" justifyContent="space-between" p={2} style={{ backgroundColor: colors.greenAccent[400]}}>
        <Box display="flex">
            <IconButton onClick={ () => clearAnimation() }>
                Clear Animation
                <RestartAltIcon></RestartAltIcon>
            </IconButton>
        </Box>
        <Box style={{ margin: 'auto' }} >
            <Button variant="contained"
            style={{ marginLeft: "-12px",
            backgroundColor: colors.blueAccent[400], 
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.h4.fontSize}}
            onClick={ () => searchAlgoCaller() }>
                Run Search Algorithm
            </Button>
        </Box>
        <Box display="flex">
            <IconButton onClick={ () => clearGrid() }>
                Reset Grid
                <RestartAltIcon></RestartAltIcon>
            </IconButton>
        </Box>
        <Box display="flex">
            <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === 'dark' ? (
                    <DarkModeOutlinedIcon />
                ) : <LightModeOutlinedIcon />
                }
            </IconButton>
        </Box>
    </Box>)
}

export default Topbar;