import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from '@mui/material';
import {
  Build as BuildIcon,
  SwapHoriz as SwapHorizIcon,
  ExpandMore as ExpandMoreIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material';
import {
  ipv4ToBinary,
  ipv4ToLong,
  longToIpv4,
  isValidIPv4,
  cidrToSubnetMask,
  subnetMaskToCidr,
} from '../utils/subnet';

const NetworkTools: React.FC = () => {
  // IP to Binary converter
  const [ipForBinary, setIpForBinary] = useState('192.168.1.1');
  const [binaryResult, setBinaryResult] = useState('');
  
  // Decimal to IP converter
  const [decimalValue, setDecimalValue] = useState('3232235777');
  const [ipFromDecimal, setIpFromDecimal] = useState('');
  
  // CIDR to Subnet Mask converter
  const [cidrValue, setCidrValue] = useState('24');
  const [maskFromCidr, setMaskFromCidr] = useState('');
  
  // Subnet Mask to CIDR converter
  const [maskValue, setMaskValue] = useState('255.255.255.0');
  const [cidrFromMask, setCidrFromMask] = useState('');

  // VLSM Calculator
  const [baseNetwork, setBaseNetwork] = useState('192.168.1.0');
  const [baseCidr, setBaseCidr] = useState('24');
  const [vlsmRequirements, setVlsmRequirements] = useState('50,30,20,10');
  const [vlsmResults, setVlsmResults] = useState<any[]>([]);

  const convertIpToBinary = () => {
    if (isValidIPv4(ipForBinary)) {
      setBinaryResult(ipv4ToBinary(ipForBinary));
    } else {
      setBinaryResult('Invalid IP address');
    }
  };

  const convertDecimalToIp = () => {
    const decimal = parseInt(decimalValue);
    if (!isNaN(decimal) && decimal >= 0 && decimal <= 4294967295) {
      setIpFromDecimal(longToIpv4(decimal));
    } else {
      setIpFromDecimal('Invalid decimal value');
    }
  };

  const convertCidrToMask = () => {
    const cidr = parseInt(cidrValue);
    if (!isNaN(cidr) && cidr >= 0 && cidr <= 32) {
      setMaskFromCidr(cidrToSubnetMask(cidr));
    } else {
      setMaskFromCidr('Invalid CIDR value');
    }
  };

  const convertMaskToCidr = () => {
    if (isValidIPv4(maskValue)) {
      setCidrFromMask(subnetMaskToCidr(maskValue).toString());
    } else {
      setCidrFromMask('Invalid subnet mask');
    }
  };

  const calculateVLSM = () => {
    const requirements = vlsmRequirements.split(',').map(r => parseInt(r.trim())).filter(r => !isNaN(r));
    if (requirements.length === 0 || !isValidIPv4(baseNetwork)) {
      setVlsmResults([]);
      return;
    }

    // Sort requirements in descending order
    requirements.sort((a, b) => b - a);

    const results = [];
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

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <BuildIcon color="primary" />
        Network Tools
      </Typography>

      {/* IP to Binary Converter */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">IP to Binary Converter</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
              <TextField
                fullWidth
                label="IP Address"
                value={ipForBinary}
                onChange={(e) => setIpForBinary(e.target.value)}
                helperText="Enter an IPv4 address"
                sx={{ flex: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={convertIpToBinary}
                startIcon={<SwapHorizIcon />}
                sx={{ height: '56px', flex: 1 }}
              >
                Convert
              </Button>
            </Box>
            {binaryResult && (
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="caption" color="text.secondary">Binary Result</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  {binaryResult}
                </Typography>
              </Paper>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Decimal to IP Converter */}
      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Decimal to IP Converter</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
              <TextField
                fullWidth
                label="Decimal Value"
                value={decimalValue}
                onChange={(e) => setDecimalValue(e.target.value)}
                helperText="Enter a decimal value (0-4294967295)"
                type="number"
                sx={{ flex: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={convertDecimalToIp}
                startIcon={<SwapHorizIcon />}
                sx={{ height: '56px', flex: 1 }}
              >
                Convert
              </Button>
            </Box>
            {ipFromDecimal && (
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="caption" color="text.secondary">IP Address</Typography>
                <Typography variant="body1">
                  {ipFromDecimal}
                </Typography>
              </Paper>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* CIDR to Subnet Mask */}
      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">CIDR to Subnet Mask</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
              <TextField
                fullWidth
                label="CIDR Notation"
                value={cidrValue}
                onChange={(e) => setCidrValue(e.target.value)}
                helperText="Enter CIDR value (0-32)"
                type="number"
                inputProps={{ min: 0, max: 32 }}
                sx={{ flex: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={convertCidrToMask}
                startIcon={<SwapHorizIcon />}
                sx={{ height: '56px', flex: 1 }}
              >
                Convert
              </Button>
            </Box>
            {maskFromCidr && (
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="caption" color="text.secondary">Subnet Mask</Typography>
                <Typography variant="body1">
                  {maskFromCidr}
                </Typography>
              </Paper>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Subnet Mask to CIDR */}
      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Subnet Mask to CIDR</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
              <TextField
                fullWidth
                label="Subnet Mask"
                value={maskValue}
                onChange={(e) => setMaskValue(e.target.value)}
                helperText="Enter subnet mask (e.g., 255.255.255.0)"
                sx={{ flex: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={convertMaskToCidr}
                startIcon={<SwapHorizIcon />}
                sx={{ height: '56px', flex: 1 }}
              >
                Convert
              </Button>
            </Box>
            {cidrFromMask && (
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="caption" color="text.secondary">CIDR Notation</Typography>
                <Typography variant="body1">
                  /{cidrFromMask}
                </Typography>
              </Paper>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* VLSM Calculator */}
      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">VLSM Calculator</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
              <TextField
                fullWidth
                label="Base Network"
                value={baseNetwork}
                onChange={(e) => setBaseNetwork(e.target.value)}
                helperText="Starting network address"
                sx={{ flex: 1 }}
              />
              <TextField
                fullWidth
                label="Base CIDR"
                value={baseCidr}
                onChange={(e) => setBaseCidr(e.target.value)}
                helperText="Base network CIDR"
                type="number"
                inputProps={{ min: 0, max: 32 }}
                sx={{ flex: 1 }}
              />
            </Box>
            <TextField
              fullWidth
              label="Host Requirements"
              value={vlsmRequirements}
              onChange={(e) => setVlsmRequirements(e.target.value)}
              helperText="Enter comma-separated host requirements (e.g., 50,30,20,10)"
            />
            <Button
              variant="contained"
              onClick={calculateVLSM}
              startIcon={<CalculateIcon />}
            >
              Calculate VLSM
            </Button>
          </Stack>

          {vlsmResults.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                VLSM Allocation Results
              </Typography>
              <Stack spacing={2}>
                {vlsmResults.map((subnet, index) => (
                  <Paper sx={{ p: 2 }} key={index}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Subnet {subnet.index} - {subnet.hostsNeeded} hosts required
                    </Typography>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr' },
                      gap: 1 
                    }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Network</Typography>
                        <Typography variant="body2">{subnet.network}/{subnet.cidr}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Subnet Mask</Typography>
                        <Typography variant="body2">{subnet.subnetMask}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Broadcast</Typography>
                        <Typography variant="body2">{subnet.broadcast}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">First Host</Typography>
                        <Typography variant="body2">{subnet.firstHost}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Last Host</Typography>
                        <Typography variant="body2">{subnet.lastHost}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Usable Hosts</Typography>
                        <Typography variant="body2">{subnet.usableHosts}</Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default NetworkTools;
