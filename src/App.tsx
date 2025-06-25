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
  Paper,
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
  Language as LanguageIcon,
  RouterOutlined as RouterOutlinedIcon,
  Build as BuildIcon,
  Minimize as MinimizeIcon,
  CropSquare as MaximizeIcon,
  Close as CloseIcon,
  FilterNone as RestoreIcon,
} from '@mui/icons-material';
import { theme, darkTheme } from './theme';
import SubnetDivision from './components/SubnetDivision';
import CryptographyTools from './components/CryptographyTools';
import IPv4Calculator from './components/IPv4Calculator';
import IPv6Calculator from './components/IPv6Calculator';
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
        <Fade in={true} timeout={500}>
          <Box sx={{ py: 3 }}>
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
        height: 48,
        background: 'linear-gradient(135deg, rgba(103, 80, 164, 0.1) 0%, rgba(98, 91, 113, 0.05) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: 1,
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        WebkitAppRegion: 'drag',
        position: 'relative',
        zIndex: 1000,
      }}
    >
      {/* Left side - App info */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 0, overflow: 'hidden' }}>
        <RouterIcon sx={{ color: 'primary.main', fontSize: 24, flexShrink: 0 }} />
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            fontSize: '0.925rem',
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
      <Stack direction="row" alignItems="center" spacing={1} sx={{ WebkitAppRegion: 'no-drag', flexShrink: 0 }}>
        <IconButton
          size="small"
          onClick={onToggleDarkMode}
          sx={{
            color: 'text.secondary',
            width: 36,
            height: 36,
            borderRadius: 2,
            '&:hover': {
              bgcolor: 'action.hover',
              color: 'primary.main',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease'
          }}
        >
          {darkMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
        </IconButton>
        
        <IconButton
          size="small"
          onClick={() => window.open('https://github.com/yourusername/suca', '_blank')}
          sx={{
            color: 'text.secondary',
            width: 36,
            height: 36,
            borderRadius: 2,
            '&:hover': {
              bgcolor: 'action.hover',
              color: 'primary.main',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease'
          }}
        >
          <GitHubIcon fontSize="small" />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: 'center' }} />

        <IconButton
          size="small"
          onClick={handleMinimize}
          sx={{
            color: 'text.secondary',
            width: 36,
            height: 36,
            borderRadius: 2,
            '&:hover': {
              bgcolor: 'warning.light',
              color: 'warning.main',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease'
          }}
        >
          <MinimizeIcon fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          onClick={handleMaximize}
          sx={{
            color: 'text.secondary',
            width: 36,
            height: 36,
            borderRadius: 2,
            '&:hover': {
              bgcolor: 'success.light',
              color: 'success.main',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease'
          }}
        >
          {isMaximized ? <RestoreIcon fontSize="small" /> : <MaximizeIcon fontSize="small" />}
        </IconButton>

        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            color: 'text.secondary',
            width: 36,
            height: 36,
            borderRadius: 2,
            '&:hover': {
              bgcolor: 'error.light',
              color: 'error.main',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease'
          }}
        >
          <CloseIcon fontSize="small" />
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
      label: 'IPv4 Calculator',
      icon: <RouterOutlinedIcon />,
      component: <IPv4Calculator />
    },
    {
      label: 'IPv6 Calculator',
      icon: <LanguageIcon />,
      component: <IPv6Calculator />
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
        overflow: 'hidden'
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
                sx={{ ml: 1 }}
                onClick={() => window.open('https://github.com/yourusername/suca', '_blank')}
                color="inherit"
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                sx={{ ml: 1 }}
                onClick={handleToggleDarkMode}
                color="inherit"
              >
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Toolbar>
          </AppBar>
        )}

        <Container 
          maxWidth="lg" 
          sx={{ 
            mt: isElectron ? 2 : 4, 
            mb: 4,
            height: isElectron ? 'calc(100vh - 96px)' : 'auto',
            overflow: 'auto',
            px: { xs: 2, sm: 3, md: 4 }
          }}
        >
          <Paper 
            elevation={0} 
            sx={{ 
              bgcolor: 'background.paper',
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: darkMode 
                ? '0px 8px 32px rgba(0, 0, 0, 0.3)' 
                : '0px 8px 32px rgba(103, 80, 164, 0.1)',
              border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(103, 80, 164, 0.1)',
              height: isElectron ? '100%' : 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                background: darkMode 
                  ? 'linear-gradient(135deg, rgba(208, 188, 255, 0.05) 0%, rgba(204, 194, 220, 0.02) 100%)'
                  : 'linear-gradient(135deg, rgba(103, 80, 164, 0.05) 0%, rgba(98, 91, 113, 0.02) 100%)',
                '& .MuiTab-root': {
                  minHeight: 64,
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  minWidth: { xs: 120, sm: 140, md: 160 },
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    borderRadius: '12px 12px 0 0',
                    transform: 'translateY(-1px)',
                  },
                  '&.Mui-selected': {
                    background: darkMode 
                      ? 'linear-gradient(135deg, rgba(208, 188, 255, 0.1) 0%, rgba(204, 194, 220, 0.05) 100%)'
                      : 'linear-gradient(135deg, rgba(103, 80, 164, 0.1) 0%, rgba(98, 91, 113, 0.05) 100%)',
                  }
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                  background: darkMode
                    ? 'linear-gradient(90deg, #D0BCFF 0%, #CCC2DC 100%)'
                    : 'linear-gradient(90deg, #6750A4 0%, #625B71 100%)',
                }
              }}
            >
              {tabs.map((tab, index) => (
                <Tab 
                  key={index}
                  icon={tab.icon} 
                  label={tab.label}
                  iconPosition="start"
                  sx={{
                    gap: 1,
                    '& .MuiTab-iconWrapper': {
                      marginBottom: '0 !important'
                    }
                  }}
                />
              ))}
            </Tabs>

            <Box sx={{ 
              p: { xs: 2, sm: 3, md: 4 }, 
              flex: 1,
              overflow: 'auto'
            }}>
              {tabs.map((tab, index) => (
                <TabPanel key={index} value={tabValue} index={index}>
                  {tab.component}
                </TabPanel>
              ))}
            </Box>
          </Paper>

          {!isElectron && (
            <Box sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                © 2024 SUCA - Professional Subnet Calculator & Cryptography Tools
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Built with React & Material You Design | Modern Network Administration Tools
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
