import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Fade,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  ContentCopy as ContentCopyIcon,
  AccountTree as AccountTreeIcon,
  NetworkCheck as NetworkCheckIcon,
  Visibility as VisibilityIcon,
  GetApp as GetAppIcon,
} from '@mui/icons-material';
import {
  isValidIPv4,
  cidrToSubnetMask,
  ipv4ToLong,
  longToIpv4,
} from '../utils/subnet';

interface SubnetResult {
  index: number;
  hostsNeeded: number;
  network: string;
  cidr: number;
  subnetMask: string;
  broadcast: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
}

const SubnetDivision: React.FC = () => {
  // VLSM Calculator
  const [baseNetwork, setBaseNetwork] = useState('192.168.1.0');
  const [baseCidr, setBaseCidr] = useState('24');
  const [vlsmRequirements, setVlsmRequirements] = useState('50,30,20,10');
  const [vlsmResults, setVlsmResults] = useState<SubnetResult[]>([]);
  
  // Equal Subnet Division
  const [equalNetwork, setEqualNetwork] = useState('10.0.0.0');
  const [equalCidr, setEqualCidr] = useState('16');
  const [equalSubnets, setEqualSubnets] = useState('4');
  const [equalResults, setEqualResults] = useState<SubnetResult[]>([]);

  // Table pagination state
  const [vlsmPage, setVlsmPage] = useState(0);
  const [vlsmRowsPerPage, setVlsmRowsPerPage] = useState(10);
  const [equalPage, setEqualPage] = useState(0);
  const [equalRowsPerPage, setEqualRowsPerPage] = useState(10);

  const calculateVLSM = () => {
    const requirements = vlsmRequirements.split(',').map(r => parseInt(r.trim())).filter(r => !isNaN(r));
    if (requirements.length === 0 || !isValidIPv4(baseNetwork)) {
      setVlsmResults([]);
      return;
    }

    // Sort requirements in descending order
    requirements.sort((a, b) => b - a);

    const results: SubnetResult[] = [];
    let currentNetwork = ipv4ToLong(baseNetwork);
    const basePrefix = parseInt(baseCidr);

    for (let i = 0; i < requirements.length; i++) {
      const hostsNeeded = requirements[i];
      // Find the smallest subnet that can accommodate the hosts
      let subnetBits = 0;
      while (Math.pow(2, subnetBits) - 2 < hostsNeeded) {
        subnetBits++;
      }
      
      const subnetCidr = 32 - subnetBits;
      const subnetSize = Math.pow(2, subnetBits);
      
      // Check if we have enough space
      if (subnetCidr < basePrefix) {
        alert(`Not enough address space for ${hostsNeeded} hosts in /${basePrefix} network`);
        break;
      }
      
      results.push({
        index: i + 1,
        hostsNeeded,
        network: longToIpv4(currentNetwork),
        cidr: subnetCidr,
        subnetMask: cidrToSubnetMask(subnetCidr),
        broadcast: longToIpv4(currentNetwork + subnetSize - 1),
        firstHost: longToIpv4(currentNetwork + 1),
        lastHost: longToIpv4(currentNetwork + subnetSize - 2),
        totalHosts: subnetSize,
        usableHosts: subnetSize - 2,
      });

      currentNetwork += subnetSize;
    }

    setVlsmResults(results);
  };

  const calculateEqualSubnets = () => {
    if (!isValidIPv4(equalNetwork)) {
      setEqualResults([]);
      return;
    }

    const numSubnets = parseInt(equalSubnets);
    const basePrefix = parseInt(equalCidr);
    
    if (numSubnets <= 0 || basePrefix < 0 || basePrefix > 30) {
      setEqualResults([]);
      return;
    }

    // Calculate required bits for subnets
    const subnetBits = Math.ceil(Math.log2(numSubnets));
    const newCidr = basePrefix + subnetBits;
    
    if (newCidr > 30) {
      alert('Too many subnets requested for the given network size');
      return;
    }

    const subnetSize = Math.pow(2, 32 - newCidr);
    const results: SubnetResult[] = [];
    let currentNetwork = ipv4ToLong(equalNetwork);

    for (let i = 0; i < numSubnets; i++) {
      results.push({
        index: i + 1,
        hostsNeeded: subnetSize - 2,
        network: longToIpv4(currentNetwork),
        cidr: newCidr,
        subnetMask: cidrToSubnetMask(newCidr),
        broadcast: longToIpv4(currentNetwork + subnetSize - 1),
        firstHost: longToIpv4(currentNetwork + 1),
        lastHost: longToIpv4(currentNetwork + subnetSize - 2),
        totalHosts: subnetSize,
        usableHosts: subnetSize - 2,
      });

      currentNetwork += subnetSize;
    }

    setEqualResults(results);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportToCSV = (results: SubnetResult[], filename: string) => {
    const headers = ['Subnet #', 'Network/CIDR', 'Subnet Mask', 'Broadcast', 'First Host', 'Last Host', 'Usable Hosts'];
    const csvContent = [
      headers.join(','),
      ...results.map(subnet => [
        subnet.index,
        `${subnet.network}/${subnet.cidr}`,
        subnet.subnetMask,
        subnet.broadcast,
        subnet.firstHost,
        subnet.lastHost,
        subnet.usableHosts
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderSubnetResults = (results: SubnetResult[], title: string, page: number, rowsPerPage: number, onPageChange: (event: unknown, newPage: number) => void, onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void) => (
    <Fade in={true}>
      <Card elevation={0} sx={{ borderRadius: 4, bgcolor: 'background.paper', mt: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ 
            p: 3, 
            pb: 0,
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <NetworkCheckIcon />
              {title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                label={`${results.length} Subnets`} 
                color="primary" 
                variant="outlined"
                size="small"
                icon={<VisibilityIcon />}
              />
              <Tooltip title="Export to CSV">
                <IconButton 
                  size="small" 
                  onClick={() => exportToCSV(results, `${title.toLowerCase().replace(/\s+/g, '_')}.csv`)}
                  sx={{ 
                    bgcolor: 'action.hover',
                    '&:hover': { bgcolor: 'action.selected' }
                  }}
                >
                  <GetAppIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader size="small" sx={{ minWidth: 800 }}>
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
                    Subnet Mask
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
                {results
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((subnet, index) => (
                  <TableRow 
                    key={subnet.index}
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
                        label={subnet.index} 
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
                          {subnet.network}/{subnet.cidr}
                        </Typography>
                        <Tooltip title="Copy Network">
                          <IconButton 
                            size="small" 
                            onClick={() => copyToClipboard(`${subnet.network}/${subnet.cidr}`)}
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
                        {subnet.subnetMask}
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
                        {subnet.broadcast}
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
                        {subnet.firstHost}
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
                        {subnet.lastHost}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={subnet.usableHosts.toLocaleString()} 
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
                        <Tooltip title="Copy Subnet Mask">
                          <IconButton 
                            size="small" 
                            onClick={() => copyToClipboard(subnet.subnetMask)}
                            sx={{ fontSize: 16 }}
                          >
                            <ContentCopyIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Copy Broadcast">
                          <IconButton 
                            size="small" 
                            onClick={() => copyToClipboard(subnet.broadcast)}
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
          
          {results.length > 10 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={results.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onPageChange}
              onRowsPerPageChange={onRowsPerPageChange}
              sx={{
                borderTop: 1,
                borderColor: 'divider',
                bgcolor: 'background.default'
              }}
            />
          )}
        </CardContent>
      </Card>
    </Fade>
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <AccountTreeIcon color="primary" />
        Subnet Division & VLSM
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
        gap: 3 
      }}>
        {/* VLSM Calculator */}
        <Card elevation={0} sx={{ borderRadius: 4, bgcolor: 'background.paper', height: 'fit-content' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              color="primary" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                mb: 2,
                fontSize: '1.1rem',
                fontWeight: 600
              }}
            >
              <CalculateIcon sx={{ fontSize: 24 }} />
              VLSM Calculator
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2, py: 2 }}>
              <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                <strong>Variable Length Subnet Masking</strong> - Optimize address space by allocating subnets based on actual host requirements
              </Typography>
            </Alert>

            <Stack spacing={3}>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 2 
              }}>
                <TextField
                  fullWidth
                  label="Base Network"
                  value={baseNetwork}
                  onChange={(e) => setBaseNetwork(e.target.value)}
                  helperText="Starting network address"
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
                      height: 56
                    },
                    '& .MuiFormHelperText-root': {
                      fontSize: '0.75rem',
                      mt: 1
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Base CIDR"
                  value={baseCidr}
                  onChange={(e) => setBaseCidr(e.target.value)}
                  helperText="Base network prefix length"
                  type="number"
                  inputProps={{ min: 8, max: 30 }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
                      height: 56
                    },
                    '& .MuiFormHelperText-root': {
                      fontSize: '0.75rem',
                      mt: 1
                    }
                  }}
                />
              </Box>
                
              <TextField
                fullWidth
                label="Host Requirements"
                value={vlsmRequirements}
                onChange={(e) => setVlsmRequirements(e.target.value)}
                helperText="Enter comma-separated host requirements (e.g., 100,50,25,10)"
                placeholder="100,50,25,10"
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: 2,
                    height: 56
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: '0.75rem',
                    mt: 1
                  }
                }}
              />
              
              <Button
                fullWidth
                variant="contained"
                onClick={calculateVLSM}
                startIcon={<CalculateIcon />}
                sx={{ 
                  borderRadius: 3, 
                  py: 2, 
                  px: 3,
                  fontSize: '1rem',
                  fontWeight: 600,
                  height: 56,
                  '& .MuiButton-startIcon': {
                    marginRight: 2,
                  }
                }}
              >
                Calculate VLSM
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Equal Subnet Division */}
        <Card elevation={0} sx={{ borderRadius: 4, bgcolor: 'background.paper', height: 'fit-content' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              color="primary" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                mb: 2,
                fontSize: '1.1rem',
                fontWeight: 600
              }}
            >
              <NetworkCheckIcon sx={{ fontSize: 24 }} />
              Equal Subnet Division
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2, py: 2 }}>
              <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                <strong>Equal Subnet Division</strong> - Divide a network into equal-sized subnets with uniform host capacity
              </Typography>
            </Alert>

            <Stack spacing={3}>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 2 
              }}>
                <TextField
                  fullWidth
                  label="Network Address"
                  value={equalNetwork}
                  onChange={(e) => setEqualNetwork(e.target.value)}
                  helperText="Network to divide"
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
                      height: 56
                    },
                    '& .MuiFormHelperText-root': {
                      fontSize: '0.75rem',
                      mt: 1
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Original CIDR"
                  value={equalCidr}
                  onChange={(e) => setEqualCidr(e.target.value)}
                  helperText="Current prefix length"
                  type="number"
                  inputProps={{ min: 8, max: 30 }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
                      height: 56
                    },
                    '& .MuiFormHelperText-root': {
                      fontSize: '0.75rem',
                      mt: 1
                    }
                  }}
                />
              </Box>
              
              <TextField
                fullWidth
                label="Number of Subnets"
                value={equalSubnets}
                onChange={(e) => setEqualSubnets(e.target.value)}
                helperText="How many equal subnets to create"
                type="number"
                inputProps={{ min: 2, max: 1024 }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: 2,
                    height: 56
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: '0.75rem',
                    mt: 1
                  }
                }}
              />
              
              <Button
                fullWidth
                variant="contained"
                onClick={calculateEqualSubnets}
                startIcon={<CalculateIcon />}
                sx={{ 
                  borderRadius: 3, 
                  py: 2, 
                  px: 3,
                  fontSize: '1rem',
                  fontWeight: 600,
                  height: 56,
                  '& .MuiButton-startIcon': {
                    marginRight: 2,
                  }
                }}
              >
                Divide Network
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Results */}
      {vlsmResults.length > 0 && renderSubnetResults(
        vlsmResults, 
        'VLSM Allocation Results',
        vlsmPage,
        vlsmRowsPerPage,
        (event, newPage) => setVlsmPage(newPage),
        (event) => setVlsmRowsPerPage(parseInt(event.target.value, 10))
      )}
      {equalResults.length > 0 && renderSubnetResults(
        equalResults, 
        'Equal Subnet Division Results',
        equalPage,
        equalRowsPerPage,
        (event, newPage) => setEqualPage(newPage),
        (event) => setEqualRowsPerPage(parseInt(event.target.value, 10))
      )}
    </Box>
  );
};

export default SubnetDivision; 