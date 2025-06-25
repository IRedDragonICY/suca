import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
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
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Calculate as CalculateIcon,
  ContentCopy as ContentCopyIcon,
  Info as InfoIcon,
  Router as RouterIcon,
} from '@mui/icons-material';
import {
  isValidIPv4,
  calculateIPv4Subnet,
  calculateSubnetBlocks,
  subnetMaskToCidr,
  IPv4SubnetInfo,
  SubnetBlock,
} from '../utils/subnet';

const IPv4Calculator: React.FC = () => {
  const [ipAddress, setIpAddress] = useState('192.168.1.0');
  const [subnetInput, setSubnetInput] = useState('24');
  const [inputMode, setInputMode] = useState<'cidr' | 'mask'>('cidr');
  const [subnetInfo, setSubnetInfo] = useState<IPv4SubnetInfo | null>(null);
  const [subnetBlocks, setSubnetBlocks] = useState<SubnetBlock[]>([]);
  const [newCidr, setNewCidr] = useState('25');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  useEffect(() => {
    if (isValidIPv4(ipAddress)) {
      calculateSubnet();
    }
  }, [ipAddress, subnetInput, inputMode]);

  const calculateSubnet = () => {
    if (!isValidIPv4(ipAddress)) {
      setError('Invalid IP address format');
      return;
    }

    let cidr: number;
    if (inputMode === 'cidr') {
      cidr = parseInt(subnetInput);
      if (isNaN(cidr) || cidr < 0 || cidr > 32) {
        setError('CIDR must be between 0 and 32');
        return;
      }
    } else {
      if (!isValidIPv4(subnetInput)) {
        setError('Invalid subnet mask format');
        return;
      }
      cidr = subnetMaskToCidr(subnetInput);
    }

    setError('');
    const info = calculateIPv4Subnet(ipAddress, cidr);
    setSubnetInfo(info);

    const newCidrNum = parseInt(newCidr);
    if (!isNaN(newCidrNum) && newCidrNum > cidr && newCidrNum <= 32) {
      const blocks = calculateSubnetBlocks(info.network, cidr, newCidrNum);
      setSubnetBlocks(blocks);
    } else {
      setSubnetBlocks([]);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const toggleInputMode = () => {
    if (inputMode === 'cidr' && subnetInfo) {
      setSubnetInput(subnetInfo.subnetMask);
      setInputMode('mask');
    } else if (inputMode === 'mask' && isValidIPv4(subnetInput)) {
      setSubnetInput(subnetMaskToCidr(subnetInput).toString());
      setInputMode('cidr');
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 3, overflow: 'visible' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RouterIcon color="primary" />
            IPv4 Subnet Calculator
          </Typography>
          
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
              <TextField
                fullWidth
                label="IP Address"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                error={!!error && error.includes('IP')}
                helperText={error && error.includes('IP') ? error : 'Enter IPv4 address (e.g., 192.168.1.0)'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RouterIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label={inputMode === 'cidr' ? 'CIDR Prefix' : 'Subnet Mask'}
                value={subnetInput}
                onChange={(e) => setSubnetInput(e.target.value)}
                error={!!error && (error.includes('CIDR') || error.includes('mask'))}
                helperText={
                  inputMode === 'cidr' 
                    ? 'Enter CIDR prefix (0-32)' 
                    : 'Enter subnet mask (e.g., 255.255.255.0)'
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={`Switch to ${inputMode === 'cidr' ? 'Subnet Mask' : 'CIDR'} input`}>
                        <IconButton onClick={toggleInputMode} size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Stack>

          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
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
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                  gap: 2 
                }}>
                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="caption" color="text.secondary">
                      Network Address
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {subnetInfo.network}/{subnetInfo.cidr}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleCopy(`${subnetInfo.network}/${subnetInfo.cidr}`, 'Network')}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>

                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="caption" color="text.secondary">
                      Broadcast Address
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {subnetInfo.broadcast}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleCopy(subnetInfo.broadcast, 'Broadcast')}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>

                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="caption" color="text.secondary">
                      Subnet Mask
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {subnetInfo.subnetMask}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleCopy(subnetInfo.subnetMask, 'Mask')}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>

                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="caption" color="text.secondary">
                      Wildcard Mask
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {subnetInfo.wildcardMask}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleCopy(subnetInfo.wildcardMask, 'Wildcard')}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>

                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="caption" color="text.secondary">
                      Total Hosts
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {subnetInfo.totalHosts.toLocaleString()}
                    </Typography>
                  </Paper>

                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="caption" color="text.secondary">
                      Usable Hosts
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {subnetInfo.usableHosts.toLocaleString()}
                    </Typography>
                  </Paper>
                </Box>

                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={`Class ${subnetInfo.ipClass}`} 
                    color="primary" 
                    variant="outlined"
                  />
                  <Chip 
                    label={subnetInfo.isPrivate ? 'Private IP' : 'Public IP'} 
                    color={subnetInfo.isPrivate ? 'success' : 'info'} 
                    variant="outlined"
                  />
                  <Chip 
                    label={`First Host: ${subnetInfo.firstHost}`} 
                    variant="outlined"
                  />
                  <Chip 
                    label={`Last Host: ${subnetInfo.lastHost}`} 
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Binary Representation</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Decimal</TableCell>
                        <TableCell>Binary</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>IP Address</TableCell>
                        <TableCell>{ipAddress}</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace' }}>
                          {subnetInfo.networkBinary}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Subnet Mask</TableCell>
                        <TableCell>{subnetInfo.subnetMask}</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace' }}>
                          {subnetInfo.subnetMaskBinary}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Wildcard Mask</TableCell>
                        <TableCell>{subnetInfo.wildcardMask}</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace' }}>
                          {subnetInfo.wildcardMaskBinary}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Network Address</TableCell>
                        <TableCell>{subnetInfo.network}</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace' }}>
                          {subnetInfo.networkBinary}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Broadcast Address</TableCell>
                        <TableCell>{subnetInfo.broadcast}</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace' }}>
                          {subnetInfo.broadcastBinary}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Subnet Division</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  label="New CIDR for Subnetting"
                  value={newCidr}
                  onChange={(e) => setNewCidr(e.target.value)}
                  type="number"
                  inputProps={{ min: subnetInfo.cidr + 1, max: 32 }}
                  helperText={`Enter CIDR between ${subnetInfo.cidr + 1} and 32`}
                  sx={{ mb: 2 }}
                />
                
                {subnetBlocks.length > 0 && (
                  <>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Showing {subnetBlocks.length} subnets out of {Math.pow(2, parseInt(newCidr) - subnetInfo.cidr)} total subnets
                    </Alert>
                    
                    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 600 }}>
                      <Table stickyHeader size="small" sx={{ minWidth: 700 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ 
                              bgcolor: 'primary.main', 
                              color: 'primary.contrastText',
                              fontWeight: 600,
                              fontSize: '0.875rem'
                            }}>
                              #
                            </TableCell>
                            <TableCell sx={{ 
                              bgcolor: 'primary.main', 
                              color: 'primary.contrastText',
                              fontWeight: 600,
                              fontSize: '0.875rem'
                            }}>
                              Network/CIDR
                            </TableCell>
                            <TableCell sx={{ 
                              bgcolor: 'primary.main', 
                              color: 'primary.contrastText',
                              fontWeight: 600,
                              fontSize: '0.875rem'
                            }}>
                              Broadcast
                            </TableCell>
                            <TableCell sx={{ 
                              bgcolor: 'primary.main', 
                              color: 'primary.contrastText',
                              fontWeight: 600,
                              fontSize: '0.875rem'
                            }}>
                              First Host
                            </TableCell>
                            <TableCell sx={{ 
                              bgcolor: 'primary.main', 
                              color: 'primary.contrastText',
                              fontWeight: 600,
                              fontSize: '0.875rem'
                            }}>
                              Last Host
                            </TableCell>
                            <TableCell align="right" sx={{ 
                              bgcolor: 'primary.main', 
                              color: 'primary.contrastText',
                              fontWeight: 600,
                              fontSize: '0.875rem'
                            }}>
                              Usable Hosts
                            </TableCell>
                            <TableCell align="center" sx={{ 
                              bgcolor: 'primary.main', 
                              color: 'primary.contrastText',
                              fontWeight: 600,
                              fontSize: '0.875rem'
                            }}>
                              Actions
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {subnetBlocks.map((block) => (
                            <TableRow 
                              key={block.index}
                              sx={{ 
                                '&:nth-of-type(odd)': { 
                                  bgcolor: 'action.hover' 
                                },
                                '&:hover': { 
                                  bgcolor: 'action.selected',
                                  transition: 'background-color 0.2s ease'
                                }
                              }}
                            >
                              <TableCell>
                                <Chip 
                                  label={block.index + 1} 
                                  color="primary" 
                                  size="small"
                                  sx={{ 
                                    minWidth: 40,
                                    height: 24,
                                    fontSize: '0.75rem',
                                    fontWeight: 600
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      fontFamily: 'monospace',
                                      fontWeight: 500,
                                      fontSize: '0.875rem'
                                    }}
                                  >
                                    {block.network}/{newCidr}
                                  </Typography>
                                  <Tooltip title="Copy Network">
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleCopy(`${block.network}/${newCidr}`, 'Network')}
                                      sx={{ 
                                        opacity: 0.7,
                                        '&:hover': { opacity: 1 }
                                      }}
                                    >
                                      <ContentCopyIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontFamily: 'monospace',
                                    fontSize: '0.875rem'
                                  }}
                                >
                                  {block.broadcast}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontFamily: 'monospace',
                                    fontSize: '0.875rem'
                                  }}
                                >
                                  {block.firstHost}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontFamily: 'monospace',
                                    fontSize: '0.875rem'
                                  }}
                                >
                                  {block.lastHost}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Chip 
                                  label={block.usableHosts.toLocaleString()} 
                                  color="success" 
                                  variant="outlined"
                                  size="small"
                                  sx={{ 
                                    fontWeight: 600,
                                    fontSize: '0.75rem'
                                  }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                  <Tooltip title="Copy Broadcast">
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleCopy(block.broadcast, 'Broadcast')}
                                      sx={{ fontSize: 16 }}
                                    >
                                      <ContentCopyIcon sx={{ fontSize: 14 }} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Copy First Host">
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleCopy(block.firstHost, 'First Host')}
                                      sx={{ fontSize: 16 }}
                                    >
                                      <ContentCopyIcon sx={{ fontSize: 14 }} />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
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
            zIndex: 1000 
          }}
        >
          {copied} copied to clipboard!
        </Alert>
      )}
    </Box>
  );
};

export default IPv4Calculator;
