import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Fade,
} from '@mui/material';
import {
  Router as IPv4Icon,
  Language as IPv6Icon,
  NetworkCheck as NetworkCheckIcon,
} from '@mui/icons-material';
import IPv4Calculator from './IPv4Calculator';
import IPv6Calculator from './IPv6Calculator';

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
      id={`ip-tabpanel-${index}`}
      aria-labelledby={`ip-tab-${index}`}
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

const IPCalculator: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      {/* Header */}
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          mb: 3,
          fontWeight: 600,
        }}
      >
        <NetworkCheckIcon color="primary" />
        IP Address Calculator
      </Typography>

      {/* Sub-tabs for IPv4 and IPv6 */}
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          border: theme => `1px solid ${theme.palette.divider}`,
          mb: 3,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.default',
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
              background: theme => theme.palette.mode === 'dark'
                ? 'linear-gradient(90deg, #D0BCFF 0%, #CCC2DC 100%)'
                : 'linear-gradient(90deg, #6750A4 0%, #625B71 100%)',
            },
            '& .MuiTab-root': {
              minHeight: 60,
              fontSize: '1rem',
              fontWeight: 500,
              textTransform: 'none',
              py: 2,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'action.hover',
                color: 'text.primary',
                transform: 'translateY(-1px)',
              },
              '&.Mui-selected': {
                color: 'primary.main',
                fontWeight: 600,
                bgcolor: theme => theme.palette.mode === 'dark' 
                  ? 'rgba(208, 188, 255, 0.08)' 
                  : 'rgba(103, 80, 164, 0.08)',
              }
            },
          }}
        >
          <Tab 
            icon={<IPv4Icon />} 
            label="IPv4 Calculator"
            iconPosition="start"
            sx={{
              gap: 1,
              '& .MuiSvgIcon-root': {
                fontSize: 22,
                color: tabValue === 0 ? 'primary.main' : 'inherit',
              }
            }}
          />
          <Tab 
            icon={<IPv6Icon />} 
            label="IPv6 Calculator"
            iconPosition="start"
            sx={{
              gap: 1,
              '& .MuiSvgIcon-root': {
                fontSize: 22,
                color: tabValue === 1 ? 'primary.main' : 'inherit',
              }
            }}
          />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ bgcolor: 'background.default' }}>
          <TabPanel value={tabValue} index={0}>
            <IPv4Calculator />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <IPv6Calculator />
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
};

export default IPCalculator; 