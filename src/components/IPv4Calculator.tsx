import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fade,
  Tooltip,
  IconButton,
  InputAdornment,
  Stack,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Calculate as CalculateIcon,
  ContentCopy as ContentCopyIcon,
  Info as InfoIcon,
  Router as RouterIcon,
  NetworkCheck as NetworkCheckIcon,
  Tag as CidrIcon,
  Security as MaskIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  isValidIPv4,
  calculateIPv4Subnet,
  subnetMaskToCidr,
  IPv4SubnetInfo,
} from '../utils/subnet';

const IPv4Calculator: React.FC = () => {
  const [ipAddress, setIpAddress] = useState('192.168.1.0');
  const [subnetInput, setSubnetInput] = useState('24');
  const [inputMode, setInputMode] = useState<'cidr' | 'mask'>('cidr');
  const [subnetInfo, setSubnetInfo] = useState<IPv4SubnetInfo | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  // Auto-detect input format
  const detectInputFormat = (value: string) => {
    // If it's a number between 0-32, it's likely CIDR
    const num = parseInt(value);
    if (!isNaN(num) && num >= 0 && num <= 32 && value === num.toString()) {
      return 'cidr';
    }
    // If it looks like an IP address format, it's likely a subnet mask
    if (value.includes('.') && value.split('.').length === 4) {
      return 'mask';
    }
    return inputMode; // Keep current mode if unclear
  };

  const handleSubnetInputChange = (value: string) => {
    setSubnetInput(value);
    // Auto-detect and switch mode if clear
    const detectedMode = detectInputFormat(value);
    if (detectedMode !== inputMode && value.length > 0) {
      setInputMode(detectedMode);
    }
  };

  const handleModeChange = (mode: 'cidr' | 'mask') => {
    setInputMode(mode);
    // Clear input when switching modes for cleaner UX
    setSubnetInput('');
  };

  // Debounced calculation function
  const debouncedCalculateSubnet = useCallback(() => {
    if (!isValidIPv4(ipAddress)) {
      setError('Invalid IP address format');
      setSubnetInfo(null);
      return;
    }

    if (!subnetInput.trim()) {
      setSubnetInfo(null);
      setError('');
      return;
    }

    setIsCalculating(true);
    
    try {
      let cidr: number;
      if (inputMode === 'cidr') {
        cidr = parseInt(subnetInput);
        if (isNaN(cidr) || cidr < 0 || cidr > 32) {
          setError('CIDR must be between 0 and 32');
          setSubnetInfo(null);
          setIsCalculating(false);
          return;
        }
      } else {
        if (!isValidIPv4(subnetInput)) {
          setError('Invalid subnet mask format');
          setSubnetInfo(null);
          setIsCalculating(false);
          return;
        }
        cidr = subnetMaskToCidr(subnetInput);
      }

      setError('');
      const info = calculateIPv4Subnet(ipAddress, cidr);
      setSubnetInfo(info);
    } catch (err) {
      setError('Calculation error occurred');
      setSubnetInfo(null);
    }
    
    setIsCalculating(false);
  }, [ipAddress, subnetInput, inputMode]);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedCalculateSubnet();
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [debouncedCalculateSubnet]);

  const calculateSubnet = () => {
    // Direct calculation for button click (no debounce)
    debouncedCalculateSubnet();
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Input Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: 3,
          bgcolor: 'background.paper',
          border: theme => `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        <Typography 
          variant="h6" 
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
          IPv4 Network Calculator
        </Typography>

        {/* Info Alert */}
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>CIDR Notation:</strong> Use prefix length like <code>/24</code> or just <code>24</code>
          </Typography>
          <Typography variant="body2">
            <strong>Subnet Mask:</strong> Use dotted decimal format like <code>255.255.255.0</code>
          </Typography>
        </Alert>

        {/* Input Mode Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom color="text.secondary" sx={{ mb: 2 }}>
            Subnet Input Mode
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 1.5,
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Chip
              icon={<CidrIcon />}
              label="CIDR Notation"
              variant={inputMode === 'cidr' ? 'filled' : 'outlined'}
              color={inputMode === 'cidr' ? 'primary' : 'default'}
              onClick={() => handleModeChange('cidr')}
              sx={{
                height: 40,
                fontSize: '0.875rem',
                fontWeight: 600,
                borderRadius: 5,
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
                ...(inputMode === 'cidr' && {
                  bgcolor: '#1976d2',
                  color: 'white',
                  '& .MuiChip-icon': {
                    color: 'white',
                  },
                  '&:hover': {
                    bgcolor: '#1976d2',
                    opacity: 0.9,
                  }
                }),
              }}
            />
            <Chip
              icon={<MaskIcon />}
              label="Subnet Mask"
              variant={inputMode === 'mask' ? 'filled' : 'outlined'}
              color={inputMode === 'mask' ? 'primary' : 'default'}
              onClick={() => handleModeChange('mask')}
              sx={{
                height: 40,
                fontSize: '0.875rem',
                fontWeight: 600,
                borderRadius: 5,
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
                ...(inputMode === 'mask' && {
                  bgcolor: '#1976d2',
                  color: 'white',
                  '& .MuiChip-icon': {
                    color: 'white',
                  },
                  '&:hover': {
                    bgcolor: '#1976d2',
                    opacity: 0.9,
                  }
                }),
              }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
            {inputMode === 'cidr' ? 'Enter prefix length (e.g., 24 for /24)' : 'Enter dotted decimal mask (e.g., 255.255.255.0)'}
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: '1fr 1fr', 
            md: '2fr 1.5fr 1fr' 
          },
          gap: 2,
          alignItems: 'end'
        }}>
          <TextField
            label="IP Address"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            error={!!error && error.includes('IP')}
            helperText={error && error.includes('IP') ? error : 'Enter IPv4 address (e.g., 192.168.1.0)'}
            variant="outlined"
            disabled={isCalculating}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <RouterIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <TextField
            label={inputMode === 'cidr' ? 'CIDR Prefix' : 'Subnet Mask'}
            value={subnetInput}
            onChange={(e) => handleSubnetInputChange(e.target.value)}
            error={!!error && (error.includes('CIDR') || error.includes('mask'))}
            disabled={isCalculating}
            placeholder={
              inputMode === 'cidr' 
                ? '24'
                : '255.255.255.0'
            }
            helperText={
              error && (error.includes('CIDR') || error.includes('mask'))
                ? error
                : inputMode === 'cidr' 
                  ? 'Enter prefix length (0-32)' 
                  : 'Enter subnet mask in dotted decimal'
            }
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {inputMode === 'cidr' ? (
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      /
                    </Typography>
                  ) : (
                    <MaskIcon fontSize="small" color="action" />
                  )}
                </InputAdornment>
              ),
              endAdornment: isCalculating && (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <Button
            variant="contained"
            startIcon={isCalculating ? <RefreshIcon /> : <CalculateIcon />}
            onClick={calculateSubnet}
            disabled={isCalculating}
            size="large"
            sx={{ 
              height: '56px',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              minWidth: { xs: '100%', md: 'auto' },
            }}
          >
            {isCalculating ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Calculating...
              </>
            ) : (
              'Calculate'
            )}
          </Button>
        </Box>
      </Paper>

      {subnetInfo && (
        <Fade in={true}>
          <Box>
            {/* Network Information */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                mb: 3,
                bgcolor: 'background.paper',
                border: theme => `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
                Network Information
              </Typography>
              
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 2,
              }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.default', 
                  borderRadius: 2,
                  border: theme => `1px solid ${theme.palette.divider}`,
                }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    Network Address
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body1" fontWeight="medium">
                      {subnetInfo.network}/{subnetInfo.cidr}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopy(`${subnetInfo.network}/${subnetInfo.cidr}`, 'Network')}
                      sx={{ ml: 1 }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.default', 
                  borderRadius: 2,
                  border: theme => `1px solid ${theme.palette.divider}`,
                }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    Broadcast Address
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body1" fontWeight="medium">
                      {subnetInfo.broadcast}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopy(subnetInfo.broadcast, 'Broadcast')}
                      sx={{ ml: 1 }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.default', 
                  borderRadius: 2,
                  border: theme => `1px solid ${theme.palette.divider}`,
                }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    Subnet Mask
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body1" fontWeight="medium">
                      {subnetInfo.subnetMask}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopy(subnetInfo.subnetMask, 'Mask')}
                      sx={{ ml: 1 }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.default', 
                  borderRadius: 2,
                  border: theme => `1px solid ${theme.palette.divider}`,
                }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    Wildcard Mask
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body1" fontWeight="medium">
                      {subnetInfo.wildcardMask}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopy(subnetInfo.wildcardMask, 'Wildcard')}
                      sx={{ ml: 1 }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.default', 
                  borderRadius: 2,
                  border: theme => `1px solid ${theme.palette.divider}`,
                }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    Total Hosts
                  </Typography>
                  <Typography variant="h6" fontWeight="600" color="primary">
                    {subnetInfo.totalHosts.toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.default', 
                  borderRadius: 2,
                  border: theme => `1px solid ${theme.palette.divider}`,
                }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    Usable Hosts
                  </Typography>
                  <Typography variant="h6" fontWeight="600" color="success.main">
                    {subnetInfo.usableHosts.toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Chip 
                  label={`Class ${subnetInfo.ipClass}`} 
                  color="primary" 
                  size="small"
                  sx={{ borderRadius: 2 }}
                />
                <Chip 
                  label={subnetInfo.isPrivate ? 'Private IP' : 'Public IP'} 
                  color={subnetInfo.isPrivate ? 'success' : 'info'} 
                  size="small"
                  sx={{ borderRadius: 2 }}
                />
                <Chip 
                  label={`First Host: ${subnetInfo.firstHost}`} 
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: 2 }}
                />
                <Chip 
                  label={`Last Host: ${subnetInfo.lastHost}`} 
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: 2 }}
                />
              </Stack>
            </Paper>

            {/* Enhanced IP Information */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                mb: 3,
                bgcolor: 'background.paper',
                border: theme => `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
                Enhanced IP Information
              </Typography>
              
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 2,
              }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.default', 
                  borderRadius: 2,
                  border: theme => `1px solid ${theme.palette.divider}`,
                }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    Usable Host IP Range
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontFamily: 'monospace' }}>
                      {subnetInfo.usableHostRange}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopy(subnetInfo.usableHostRange, 'Usable Range')}
                      sx={{ ml: 1 }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.default', 
                  borderRadius: 2,
                  border: theme => `1px solid ${theme.palette.divider}`,
                }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    Short Notation
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontFamily: 'monospace' }}>
                      {subnetInfo.shortNotation}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopy(subnetInfo.shortNotation, 'Short')}
                      sx={{ ml: 1 }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.default', 
                  borderRadius: 2,
                  border: theme => `1px solid ${theme.palette.divider}`,
                }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    Binary ID
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {subnetInfo.binaryID}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopy(subnetInfo.binaryID, 'Binary ID')}
                      sx={{ ml: 1 }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.default', 
                  borderRadius: 2,
                  border: theme => `1px solid ${theme.palette.divider}`,
                }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    Integer ID
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontFamily: 'monospace' }}>
                      {subnetInfo.integerID.toLocaleString()}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopy(subnetInfo.integerID.toString(), 'Integer ID')}
                      sx={{ ml: 1 }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.default', 
                  borderRadius: 2,
                  border: theme => `1px solid ${theme.palette.divider}`,
                }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    Hex ID
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontFamily: 'monospace' }}>
                      {subnetInfo.hexID}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopy(subnetInfo.hexID, 'Hex ID')}
                      sx={{ ml: 1 }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.default', 
                  borderRadius: 2,
                  border: theme => `1px solid ${theme.palette.divider}`,
                }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    in-addr.arpa
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {subnetInfo.inAddrArpa}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopy(subnetInfo.inAddrArpa, 'in-addr.arpa')}
                      sx={{ ml: 1 }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.default', 
                  borderRadius: 2,
                  border: theme => `1px solid ${theme.palette.divider}`,
                }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    IPv4 Mapped Address
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {subnetInfo.ipv4MappedAddress}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopy(subnetInfo.ipv4MappedAddress, 'IPv4 Mapped')}
                      sx={{ ml: 1 }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.default', 
                  borderRadius: 2,
                  border: theme => `1px solid ${theme.palette.divider}`,
                }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    6to4 Prefix
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {subnetInfo.sixToFourPrefix}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopy(subnetInfo.sixToFourPrefix, '6to4 Prefix')}
                      sx={{ ml: 1 }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* Network Analysis */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                mb: 3,
                bgcolor: 'background.paper',
                border: theme => `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
                Network Analysis
              </Typography>
              
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 2,
              }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.default', 
                  borderRadius: 2,
                  border: theme => `1px solid ${theme.palette.divider}`,
                }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    IP Type Classification
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip 
                      label={subnetInfo.isPrivate ? 'Private' : 'Public'} 
                      color={subnetInfo.isPrivate ? 'success' : 'warning'} 
                      size="small"
                      sx={{ borderRadius: 2 }}
                    />
                    <Chip 
                      label={`Class ${subnetInfo.ipClass}`} 
                      color="primary" 
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: 2 }}
                    />
                    {subnetInfo.cidr >= 31 && (
                      <Chip 
                        label="Point-to-Point" 
                        color="info" 
                        variant="outlined"
                        size="small"
                        sx={{ borderRadius: 2 }}
                      />
                    )}
                  </Stack>
                </Box>

                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.default', 
                  borderRadius: 2,
                  border: theme => `1px solid ${theme.palette.divider}`,
                }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    Network Efficiency
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {subnetInfo.usableHosts === 0 ? 'Network/Broadcast Only' : 
                       subnetInfo.usableHosts === 2 ? 'Point-to-Point Link' :
                       subnetInfo.usableHosts < 16 ? 'Small Network' :
                       subnetInfo.usableHosts < 256 ? 'Medium Network' :
                       'Large Network'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {subnetInfo.usableHosts > 0 && 
                        `${((subnetInfo.usableHosts / subnetInfo.totalHosts) * 100).toFixed(1)}% efficiency`
                      }
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.default', 
                  borderRadius: 2,
                  border: theme => `1px solid ${theme.palette.divider}`,
                  gridColumn: { xs: '1', sm: '1 / -1' }
                }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    Recommended Use Cases
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {subnetInfo.cidr === 32 && (
                      <Typography variant="body2">Host route - Single device routing</Typography>
                    )}
                    {subnetInfo.cidr === 31 && (
                      <Typography variant="body2">Point-to-Point link - Router interconnection</Typography>
                    )}
                    {subnetInfo.cidr === 30 && (
                      <Typography variant="body2">Point-to-Point link with network/broadcast addresses</Typography>
                    )}
                    {subnetInfo.cidr >= 24 && subnetInfo.cidr <= 29 && (
                      <Typography variant="body2">Small to medium LANs, department networks</Typography>
                    )}
                    {subnetInfo.cidr >= 16 && subnetInfo.cidr <= 23 && (
                      <Typography variant="body2">Large enterprise networks, campus networks</Typography>
                    )}
                    {subnetInfo.cidr >= 8 && subnetInfo.cidr <= 15 && (
                      <Typography variant="body2">Very large networks, ISP allocations</Typography>
                    )}
                    {subnetInfo.cidr < 8 && (
                      <Typography variant="body2">Massive networks, Internet backbone</Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* Binary Representation */}
            <Accordion 
              defaultExpanded
              elevation={0}
              sx={{ 
                mb: 3,
                bgcolor: 'background.paper',
                border: theme => `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                '&:before': { display: 'none' },
                '&.Mui-expanded': { 
                  margin: 0,
                  mb: 3,
                }
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  borderRadius: 2,
                  '&.Mui-expanded': { 
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  }
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Binary Representation</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer 
                  component={Paper} 
                  variant="outlined" 
                  sx={{ 
                    borderRadius: 2,
                    border: theme => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Decimal</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Binary</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow hover>
                        <TableCell>IP Address</TableCell>
                        <TableCell>{ipAddress}</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                          {subnetInfo.networkBinary}
                        </TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell>Subnet Mask</TableCell>
                        <TableCell>{subnetInfo.subnetMask}</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                          {subnetInfo.subnetMaskBinary}
                        </TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell>Wildcard Mask</TableCell>
                        <TableCell>{subnetInfo.wildcardMask}</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                          {subnetInfo.wildcardMaskBinary}
                        </TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell>Network Address</TableCell>
                        <TableCell>{subnetInfo.network}</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                          {subnetInfo.networkBinary}
                        </TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell>Broadcast Address</TableCell>
                        <TableCell>{subnetInfo.broadcast}</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                          {subnetInfo.broadcastBinary}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>

            {/* Quick Actions */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                mb: 3,
                bgcolor: 'background.paper',
                border: theme => `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
                Quick Actions
              </Typography>
              
              <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => {
                    const fullInfo = [
                      `IP Address: ${ipAddress}`,
                      `Network Address: ${subnetInfo.network}`,
                      `Usable Host IP Range: ${subnetInfo.usableHostRange}`,
                      `Broadcast Address: ${subnetInfo.broadcast}`,
                      `Total Number of Hosts: ${subnetInfo.totalHosts}`,
                      `Number of Usable Hosts: ${subnetInfo.usableHosts}`,
                      `Subnet Mask: ${subnetInfo.subnetMask}`,
                      `Wildcard Mask: ${subnetInfo.wildcardMask}`,
                      `Binary Subnet Mask: ${subnetInfo.subnetMaskBinary}`,
                      `IP Class: ${subnetInfo.ipClass}`,
                      `CIDR Notation: /${subnetInfo.cidr}`,
                      `IP Type: ${subnetInfo.isPrivate ? 'Private' : 'Public'}`,
                      `Short: ${subnetInfo.shortNotation}`,
                      `Binary ID: ${subnetInfo.binaryID}`,
                      `Integer ID: ${subnetInfo.integerID}`,
                      `Hex ID: ${subnetInfo.hexID}`,
                      `in-addr.arpa: ${subnetInfo.inAddrArpa}`,
                      `IPv4 Mapped Address: ${subnetInfo.ipv4MappedAddress}`,
                      `6to4 Prefix: ${subnetInfo.sixToFourPrefix}`,
                    ].join('\n');
                    handleCopy(fullInfo, 'Complete Info');
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  Copy All Info
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => {
                    const csvData = [
                      'Property,Value',
                      `IP Address,${ipAddress}`,
                      `Network Address,${subnetInfo.network}`,
                      `Usable Host Range,"${subnetInfo.usableHostRange}"`,
                      `Broadcast Address,${subnetInfo.broadcast}`,
                      `Total Hosts,${subnetInfo.totalHosts}`,
                      `Usable Hosts,${subnetInfo.usableHosts}`,
                      `Subnet Mask,${subnetInfo.subnetMask}`,
                      `Wildcard Mask,${subnetInfo.wildcardMask}`,
                      `CIDR,/${subnetInfo.cidr}`,
                      `IP Class,${subnetInfo.ipClass}`,
                      `IP Type,${subnetInfo.isPrivate ? 'Private' : 'Public'}`,
                      `Binary ID,${subnetInfo.binaryID}`,
                      `Integer ID,${subnetInfo.integerID}`,
                      `Hex ID,${subnetInfo.hexID}`,
                      `in-addr.arpa,${subnetInfo.inAddrArpa}`,
                      `IPv4 Mapped,${subnetInfo.ipv4MappedAddress}`,
                      `6to4 Prefix,${subnetInfo.sixToFourPrefix}`,
                    ].join('\n');
                    
                    const blob = new Blob([csvData], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `subnet_info_${ipAddress.replace(/\./g, '_')}.csv`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  Export CSV
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => {
                    const command = `ping ${ipAddress}`;
                    handleCopy(command, 'Ping Command');
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  Copy Ping Command
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => {
                    const command = `nslookup ${ipAddress}`;
                    handleCopy(command, 'DNS Lookup Command');
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  Copy DNS Lookup
                </Button>
              </Stack>
            </Paper>

            {/* Subnet Networks */}
            <Accordion 
              defaultExpanded 
              elevation={0}
              sx={{ 
                bgcolor: 'background.paper',
                border: theme => `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                '&:before': { display: 'none' },
                '&.Mui-expanded': { 
                  margin: 0,
                }
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  borderRadius: 2,
                  '&.Mui-expanded': { 
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mr: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    All {Math.pow(2, subnetInfo.cidr)} of the Possible /{subnetInfo.cidr} Networks
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      const totalNetworks = Math.pow(2, subnetInfo.cidr);
                      const networkSize = Math.pow(2, 32 - subnetInfo.cidr);
                      const maxExport = Math.min(totalNetworks, 1000); // Export up to 1000 networks
                      
                      const csvData = ['Network Address,Usable Host Range,Broadcast Address'];
                      
                      for (let i = 0; i < maxExport; i++) {
                        const networkLong = i * networkSize;
                        const networkAddr = [
                          (networkLong >>> 24) & 255,
                          (networkLong >>> 16) & 255,
                          (networkLong >>> 8) & 255,
                          networkLong & 255
                        ].join('.');
                        
                        const broadcastLong = networkLong + networkSize - 1;
                        const broadcastAddr = [
                          (broadcastLong >>> 24) & 255,
                          (broadcastLong >>> 16) & 255,
                          (broadcastLong >>> 8) & 255,
                          broadcastLong & 255
                        ].join('.');
                        
                        const firstHostLong = networkLong + 1;
                        const lastHostLong = broadcastLong - 1;
                        
                        const firstHost = networkSize > 2 ? [
                          (firstHostLong >>> 24) & 255,
                          (firstHostLong >>> 16) & 255,
                          (firstHostLong >>> 8) & 255,
                          firstHostLong & 255
                        ].join('.') : networkAddr;
                        
                        const lastHost = networkSize > 2 ? [
                          (lastHostLong >>> 24) & 255,
                          (lastHostLong >>> 16) & 255,
                          (lastHostLong >>> 8) & 255,
                          lastHostLong & 255
                        ].join('.') : broadcastAddr;
                        
                        const hostRange = networkSize > 2 ? `${firstHost} - ${lastHost}` : 
                                        networkSize === 2 ? `${networkAddr} - ${broadcastAddr}` : 
                                        networkAddr;
                        
                        csvData.push(`${networkAddr},"${hostRange}",${broadcastAddr}`);
                      }
                      
                      const blob = new Blob([csvData.join('\n')], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `subnet_networks_${subnetInfo.cidr}.csv`;
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }}
                    sx={{ borderRadius: 2 }}
                  >
                    Export CSV
                  </Button>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Showing all possible networks for /{subnetInfo.cidr} subnet mask
                </Typography>
                
                <TableContainer 
                  component={Paper} 
                  variant="outlined" 
                  sx={{ 
                    maxHeight: 600,
                    borderRadius: 2,
                    border: theme => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Table stickyHeader size="small" sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ 
                          bgcolor: 'background.paper', 
                          fontWeight: 600,
                          borderBottom: theme => `2px solid ${theme.palette.primary.main}`,
                        }}>
                          Network Address
                        </TableCell>
                        <TableCell sx={{ 
                          bgcolor: 'background.paper', 
                          fontWeight: 600,
                          borderBottom: theme => `2px solid ${theme.palette.primary.main}`,
                        }}>
                          Usable Host Range
                        </TableCell>
                        <TableCell sx={{ 
                          bgcolor: 'background.paper', 
                          fontWeight: 600,
                          borderBottom: theme => `2px solid ${theme.palette.primary.main}`,
                        }}>
                          Broadcast Address
                        </TableCell>
                        <TableCell align="center" sx={{ 
                          bgcolor: 'background.paper', 
                          fontWeight: 600,
                          borderBottom: theme => `2px solid ${theme.palette.primary.main}`,
                        }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(() => {
                        const networks = [];
                        const totalNetworks = Math.pow(2, subnetInfo.cidr);
                        const networkSize = Math.pow(2, 32 - subnetInfo.cidr);
                        
                        // Limit display to reasonable number for performance
                        const maxDisplay = Math.min(totalNetworks, 256);
                        
                        for (let i = 0; i < maxDisplay; i++) {
                          const networkLong = i * networkSize;
                          const networkAddr = [
                            (networkLong >>> 24) & 255,
                            (networkLong >>> 16) & 255,
                            (networkLong >>> 8) & 255,
                            networkLong & 255
                          ].join('.');
                          
                          const broadcastLong = networkLong + networkSize - 1;
                          const broadcastAddr = [
                            (broadcastLong >>> 24) & 255,
                            (broadcastLong >>> 16) & 255,
                            (broadcastLong >>> 8) & 255,
                            broadcastLong & 255
                          ].join('.');
                          
                          const firstHostLong = networkLong + 1;
                          const lastHostLong = broadcastLong - 1;
                          
                          const firstHost = networkSize > 2 ? [
                            (firstHostLong >>> 24) & 255,
                            (firstHostLong >>> 16) & 255,
                            (firstHostLong >>> 8) & 255,
                            firstHostLong & 255
                          ].join('.') : networkAddr;
                          
                          const lastHost = networkSize > 2 ? [
                            (lastHostLong >>> 24) & 255,
                            (lastHostLong >>> 16) & 255,
                            (lastHostLong >>> 8) & 255,
                            lastHostLong & 255
                          ].join('.') : broadcastAddr;
                          
                          const hostRange = networkSize > 2 ? `${firstHost} - ${lastHost}` : 
                                          networkSize === 2 ? `${networkAddr} - ${broadcastAddr}` : 
                                          networkAddr;
                          
                          const isCurrentNetwork = networkAddr === subnetInfo.network;
                          
                          networks.push(
                            <TableRow 
                              key={i}
                              hover
                              sx={{ 
                                '&:nth-of-type(odd)': { 
                                  bgcolor: 'action.hover' 
                                },
                                ...(isCurrentNetwork && {
                                  bgcolor: 'primary.light',
                                  '&:hover': {
                                    bgcolor: 'primary.light',
                                  }
                                })
                              }}
                            >
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      fontFamily: 'monospace',
                                      fontWeight: isCurrentNetwork ? 600 : 400,
                                      color: isCurrentNetwork ? 'primary.main' : 'inherit'
                                    }}
                                  >
                                    {networkAddr}
                                  </Typography>
                                  {isCurrentNetwork && (
                                    <Chip 
                                      label="Current" 
                                      color="primary" 
                                      size="small"
                                      sx={{ height: 20, fontSize: '0.7rem' }}
                                    />
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontFamily: 'monospace',
                                    fontSize: '0.8rem'
                                  }}
                                >
                                  {hostRange}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontFamily: 'monospace',
                                    fontWeight: isCurrentNetwork ? 600 : 400,
                                    color: isCurrentNetwork ? 'primary.main' : 'inherit'
                                  }}
                                >
                                  {broadcastAddr}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Stack direction="row" spacing={0.5} justifyContent="center">
                                  <Tooltip title="Copy Network">
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleCopy(networkAddr, 'Network')}
                                    >
                                      <ContentCopyIcon sx={{ fontSize: 14 }} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Copy Range">
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleCopy(hostRange, 'Host Range')}
                                    >
                                      <ContentCopyIcon sx={{ fontSize: 14 }} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Copy Broadcast">
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleCopy(broadcastAddr, 'Broadcast')}
                                    >
                                      <ContentCopyIcon sx={{ fontSize: 14 }} />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          );
                        }
                        
                        return networks;
                      })()}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {Math.pow(2, subnetInfo.cidr) > 256 && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    Showing first 256 networks out of {Math.pow(2, subnetInfo.cidr).toLocaleString()} total networks for performance reasons.
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
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
            zIndex: 1000,
            borderRadius: 2,
          }}
        >
          {copied} copied to clipboard!
        </Alert>
      )}
    </Box>
  );
};

export default IPv4Calculator;
