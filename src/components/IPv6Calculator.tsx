import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Paper,
  Chip,
  Alert,
  IconButton,
  InputAdornment,
  Fade,
  Button,
  Stack,
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  Language as LanguageIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material';
import {
  isValidIPv6,
  calculateIPv6Subnet,
  IPv6SubnetInfo,
} from '../utils/subnet';

const IPv6Calculator: React.FC = () => {
  const [ipv6Address, setIpv6Address] = useState('2001:db8::1');
  const [prefixLength, setPrefixLength] = useState('64');
  const [subnetInfo, setSubnetInfo] = useState<IPv6SubnetInfo | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const calculateSubnet = () => {
    if (!isValidIPv6(ipv6Address)) {
      setError('Invalid IPv6 address format');
      setSubnetInfo(null);
      return;
    }

    const prefix = parseInt(prefixLength);
    if (isNaN(prefix) || prefix < 0 || prefix > 128) {
      setError('Prefix length must be between 0 and 128');
      setSubnetInfo(null);
      return;
    }

    setError('');
    const info = calculateIPv6Subnet(ipv6Address, prefix);
    setSubnetInfo(info);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LanguageIcon color="primary" />
            IPv6 Subnet Calculator
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' }, mt: 1 }}>
            <TextField
              fullWidth
              label="IPv6 Address"
              value={ipv6Address}
              onChange={(e) => setIpv6Address(e.target.value)}
              error={!!error && error.includes('IPv6')}
              helperText={error && error.includes('IPv6') ? error : 'Enter IPv6 address (e.g., 2001:db8::1)'}
              sx={{ flex: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LanguageIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Prefix Length"
              value={prefixLength}
              onChange={(e) => setPrefixLength(e.target.value)}
              error={!!error && error.includes('Prefix')}
              helperText="Enter prefix length (0-128)"
              type="number"
              sx={{ flex: 1 }}
              inputProps={{ min: 0, max: 128 }}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<CalculateIcon />}
              onClick={calculateSubnet}
              size="large"
            >
              Calculate
            </Button>
          </Box>
        </CardContent>
      </Card>

      {subnetInfo && (
        <Fade in={true}>
          <Box>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Network Information
                </Typography>
                
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                    <Paper sx={{ p: 2, bgcolor: 'background.default', flex: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Network Address
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" fontWeight="medium">
                          {subnetInfo.network}/{subnetInfo.prefixLength}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => handleCopy(`${subnetInfo.network}/${subnetInfo.prefixLength}`, 'Network')}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>

                    <Paper sx={{ p: 2, bgcolor: 'background.default', flex: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Total Hosts
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {subnetInfo.totalHosts}
                      </Typography>
                    </Paper>
                  </Box>

                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="caption" color="text.secondary">
                      Network (Expanded)
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {subnetInfo.networkExpanded}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleCopy(subnetInfo.networkExpanded, 'Expanded')}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>

                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="caption" color="text.secondary">
                      First Host
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {subnetInfo.firstHost}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleCopy(subnetInfo.firstHost, 'First Host')}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>

                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="caption" color="text.secondary">
                      Last Host
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {subnetInfo.lastHost}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleCopy(subnetInfo.lastHost, 'Last Host')}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>
                </Stack>

                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label={subnetInfo.isPrivate ? 'Private IPv6' : 'Public IPv6'} 
                    color={subnetInfo.isPrivate ? 'success' : 'info'} 
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom color="text.secondary">
                    Binary Representation
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'background.default', overflowX: 'auto' }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {subnetInfo.networkBinary}
                    </Typography>
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Fade>
      )}

      {copied && (
        <Alert 
          severity="success" 
          sx={{ 
            position: 'fixed', 
            bottom: 16, 
            right: 16, 
            zIndex: 1000 
          }}
        >
          {copied} copied to clipboard!
        </Alert>
      )}
    </Box>
  );
};

export default IPv6Calculator;
