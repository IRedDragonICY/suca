import React, { useState, useMemo, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tabs,
  Tab,
  useMediaQuery,
  Fade,
  Stack,
  Divider,
} from '@mui/material';
import {
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Router as RouterIcon,
  GitHub as GitHubIcon,
  AccountTree as AccountTreeIcon,
  Security as SecurityIcon,
  Build as BuildIcon,
  Minimize as MinimizeIcon,
  CropSquare as MaximizeIcon,
  Close as CloseIcon,
  FilterNone as RestoreIcon,
  NetworkCheck as NetworkCheckIcon,
} from '@mui/icons-material';
import { theme, darkTheme } from './theme';
import SubnetDivision from './components/SubnetDivision';
import CryptographyTools from './components/CryptographyTools';
import IPCalculator from './components/IPCalculator';
import NetworkTools from './components/NetworkTools';
import './App.css';

// Declare electron API types
declare global {
  interface Window {
    electronAPI?: {
      minimizeWindow: () => Promise<void>;
      maximizeWindow: () => Promise<void>;
      closeWindow: () => Promise<void>;
      isMaximized: () => Promise<boolean>;
      platform: string;
      getVersion: () => { node: string; chrome: string; electron: string };
    };
  }
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={true} timeout={300}>
          <Box sx={{ height: '100%' }}>
            {children}
          </Box>
        </Fade>
      )}
    </div>
  );
}

// Custom Title Bar Component for Electron
function CustomTitleBar({ darkMode, onToggleDarkMode }: { darkMode: boolean; onToggleDarkMode: () => void }) {
  const [isMaximized, setIsMaximized] = useState(false);
  const isElectron = window.electronAPI !== undefined;

  useEffect(() => {
    if (isElectron) {
      window.electronAPI?.isMaximized().then(setIsMaximized);
    }
  }, [isElectron]);

  const handleMinimize = () => {
    window.electronAPI?.minimizeWindow();
  };

  const handleMaximize = () => {
    window.electronAPI?.maximizeWindow().then(() => {
      window.electronAPI?.isMaximized().then(setIsMaximized);
    });
  };

  const handleClose = () => {
    window.electronAPI?.closeWindow();
  };

  if (!isElectron) return null;

  return (
    <Box
      sx={{
        height: 40,
        background: theme => theme.palette.mode === 'dark' 
          ? 'rgba(28, 27, 31, 0.95)' 
          : 'rgba(254, 247, 255, 0.95)',
        backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: theme => `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        WebkitAppRegion: 'drag',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
      }}
    >
      {/* Left side - App info */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0, overflow: 'hidden' }}>
        <RouterIcon sx={{ color: 'primary.main', fontSize: 20, flexShrink: 0 }} />
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            fontSize: '0.875rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          SUCA - Subnet Calculator
        </Typography>
      </Stack>

      {/* Center - Drag area */}
      <Box sx={{ flex: 1, minWidth: 20 }} />

      {/* Right side - Controls */}
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ WebkitAppRegion: 'no-drag', flexShrink: 0 }}>
        <IconButton
          size="small"
          onClick={onToggleDarkMode}
          sx={{
            color: theme => theme.palette.mode === 'dark' ? 'text.secondary' : 'text.primary',
            width: 32,
            height: 32,
            borderRadius: '8px',
            '&:hover': {
              bgcolor: 'action.hover',
              color: 'primary.main',
            },
            transition: 'all 0.2s ease'
          }}
        >
          {darkMode ? <Brightness7Icon sx={{ fontSize: 18 }} /> : <Brightness4Icon sx={{ fontSize: 18 }} />}
        </IconButton>
        
        <IconButton
          size="small"
          onClick={() => window.open('https://github.com/yourusername/suca', '_blank')}
          sx={{
            color: theme => theme.palette.mode === 'dark' ? 'text.secondary' : 'text.primary',
            width: 32,
            height: 32,
            borderRadius: '8px',
            '&:hover': {
              bgcolor: 'action.hover',
              color: 'primary.main',
            },
            transition: 'all 0.2s ease'
          }}
        >
          <GitHubIcon sx={{ fontSize: 18 }} />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: 'center' }} />

        <IconButton
          size="small"
          onClick={handleMinimize}
          sx={{
            color: theme => theme.palette.mode === 'dark' ? 'text.secondary' : 'text.primary',
            width: 32,
            height: 32,
            borderRadius: '8px',
            '&:hover': {
              bgcolor: 'warning.light',
              color: 'warning.main',
            },
            transition: 'all 0.2s ease'
          }}
        >
          <MinimizeIcon sx={{ fontSize: 18 }} />
        </IconButton>

        <IconButton
          size="small"
          onClick={handleMaximize}
          sx={{
            color: theme => theme.palette.mode === 'dark' ? 'text.secondary' : 'text.primary',
            width: 32,
            height: 32,
            borderRadius: '8px',
            '&:hover': {
              bgcolor: 'success.light',
              color: 'success.main',
            },
            transition: 'all 0.2s ease'
          }}
        >
          {isMaximized ? <RestoreIcon sx={{ fontSize: 18 }} /> : <MaximizeIcon sx={{ fontSize: 18 }} />}
        </IconButton>

        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            color: theme => theme.palette.mode === 'dark' ? 'text.secondary' : 'text.primary',
            width: 32,
            height: 32,
            borderRadius: '8px',
            '&:hover': {
              bgcolor: 'error.light',
              color: 'error.main',
            },
            transition: 'all 0.2s ease'
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Stack>
    </Box>
  );
}

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const [tabValue, setTabValue] = useState(0);
  const isElectron = window.electronAPI !== undefined;

  const currentTheme = useMemo(() => darkMode ? darkTheme : theme, [darkMode]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const tabs = [
    {
      label: 'IP Calculator',
      icon: <NetworkCheckIcon />,
      component: <IPCalculator />
    },
    {
      label: 'Subnet Division',
      icon: <AccountTreeIcon />,
      component: <SubnetDivision />
    },
    {
      label: 'Cryptography',
      icon: <SecurityIcon />,
      component: <CryptographyTools />
    },
    {
      label: 'Network Tools',
      icon: <BuildIcon />,
      component: <NetworkTools />
    }
  ];

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Box sx={{ 
        flexGrow: 1, 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        pt: isElectron ? '40px' : 0,
      }}>
        {/* Custom Title Bar for Electron */}
        <CustomTitleBar darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />
        
        {/* Main App Bar - Only show if not in Electron or want additional bar */}
        {!isElectron && (
          <AppBar 
            position="static" 
            elevation={0} 
            sx={{ 
              bgcolor: 'background.paper',
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <Toolbar>
              <RouterIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'text.primary' }}>
                SUCA - Subnet Calculator & Cryptography Tools
              </Typography>
              <IconButton
                sx={{ 
                  ml: 1,
                  color: 'text.primary',
                }}
                onClick={() => window.open('https://github.com/yourusername/suca', '_blank')}
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                sx={{ 
                  ml: 1,
                  color: 'text.primary',
                }}
                onClick={handleToggleDarkMode}
              >
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Toolbar>
          </AppBar>
        )}

        {/* Tab Bar */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
            position: 'sticky',
            top: isElectron ? '40px' : 0,
            zIndex: 1100,
            boxShadow: theme => theme.palette.mode === 'dark' 
              ? '0 2px 8px rgba(0,0,0,0.3)' 
              : '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <Container maxWidth="xl">
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                minHeight: 56,
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                  background: theme => theme.palette.mode === 'dark'
                    ? 'linear-gradient(90deg, #D0BCFF 0%, #CCC2DC 100%)'
                    : 'linear-gradient(90deg, #6750A4 0%, #625B71 100%)',
                },
                '& .MuiTab-root': {
                  minHeight: 56,
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  minWidth: { xs: 100, sm: 120, md: 140 },
                  px: { xs: 2, sm: 2.5, md: 3 },
                  mx: 0.5,
                  borderRadius: '12px 12px 0 0',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    color: 'text.primary',
                  },
                  '&.Mui-selected': {
                    color: 'primary.main',
                    fontWeight: 600,
                    bgcolor: theme => theme.palette.mode === 'dark' 
                      ? 'rgba(208, 188, 255, 0.08)' 
                      : 'rgba(103, 80, 164, 0.08)',
                  }
                },
                '& .MuiTab-iconWrapper': {
                  mb: 0.5,
                }
              }}
            >
              {tabs.map((tab, index) => (
                <Tab 
                  key={index}
                  icon={tab.icon} 
                  label={tab.label}
                  iconPosition="top"
                  sx={{
                    '& .MuiSvgIcon-root': {
                      fontSize: 20,
                    }
                  }}
                />
              ))}
            </Tabs>
          </Container>
        </Box>

        {/* Content Area */}
        <Box sx={{ 
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Container 
            maxWidth="xl" 
            sx={{ 
              flex: 1,
              py: 3,
              px: { xs: 2, sm: 3, md: 4 },
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: 8,
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                bgcolor: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: 'action.disabled',
                borderRadius: 4,
                '&:hover': {
                  bgcolor: 'action.selected',
                },
              },
            }}
          >
            {tabs.map((tab, index) => (
              <TabPanel key={index} value={tabValue} index={index}>
                {tab.component}
              </TabPanel>
            ))}
          </Container>
        </Box>

        {!isElectron && (
          <Box sx={{ 
            py: 2, 
            textAlign: 'center',
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}>
            <Typography variant="body2" color="text.secondary">
              © 2024 SUCA - Professional Subnet Calculator & Cryptography Tools
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Built with React & Material You Design | Modern Network Administration Tools
            </Typography>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
