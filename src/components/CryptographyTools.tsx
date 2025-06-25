import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Security as SecurityIcon,
  SwapHoriz as SwapHorizIcon,
  Calculate as CalculateIcon,
  ContentCopy as ContentCopyIcon,
  Transform as TransformIcon,
  VpnKey as VpnKeyIcon,
  Code as CodeIcon,
} from '@mui/icons-material';

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
      id={`crypto-tabpanel-${index}`}
      aria-labelledby={`crypto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CryptographyTools: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  
  // Number Base Converter
  const [inputValue, setInputValue] = useState('255');
  const [inputBase, setInputBase] = useState('decimal');
  const [results, setResults] = useState({
    decimal: '',
    binary: '',
    hexadecimal: '',
    octal: '',
    base64: '',
  });
  
  // Text Encoding
  const [textInput, setTextInput] = useState('Hello World');
  const [encodingResults, setEncodingResults] = useState({
    ascii: '',
    unicode: '',
    utf8: '',
    base64: '',
    url: '',
    html: '',
  });
  
  // Hash Generator
  const [hashInput, setHashInput] = useState('Hello World');
  const [hashResults, setHashResults] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    crc32: '',
  });
  
  // Binary Operations
  const [binaryA, setBinaryA] = useState('11011010');
  const [binaryB, setBinaryB] = useState('10101100');
  const [binaryResults, setBinaryResults] = useState({
    and: '',
    or: '',
    xor: '',
    not: '',
    leftShift: '',
    rightShift: '',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Number Base Converter Functions
  const convertNumber = () => {
    try {
      let decimalValue: number;
      
      // Parse input based on selected base
      switch (inputBase) {
        case 'decimal':
          decimalValue = parseInt(inputValue, 10);
          break;
        case 'binary':
          decimalValue = parseInt(inputValue, 2);
          break;
        case 'hexadecimal':
          decimalValue = parseInt(inputValue, 16);
          break;
        case 'octal':
          decimalValue = parseInt(inputValue, 8);
          break;
        default:
          decimalValue = parseInt(inputValue, 10);
      }

      if (isNaN(decimalValue)) {
        throw new Error('Invalid input');
      }

      setResults({
        decimal: decimalValue.toString(10),
        binary: decimalValue.toString(2),
        hexadecimal: decimalValue.toString(16).toUpperCase(),
        octal: decimalValue.toString(8),
        base64: btoa(decimalValue.toString()),
      });
    } catch (error) {
      setResults({
        decimal: 'Error',
        binary: 'Error',
        hexadecimal: 'Error',
        octal: 'Error',
        base64: 'Error',
      });
    }
  };

  // Text Encoding Functions
  const encodeText = () => {
    try {
      const encoder = new TextEncoder();
      const utf8Bytes = encoder.encode(textInput);
      
      setEncodingResults({
        ascii: textInput.split('').map(char => char.charCodeAt(0)).join(' '),
        unicode: textInput.split('').map(char => 'U+' + char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')).join(' '),
        utf8: Array.from(utf8Bytes).map(byte => byte.toString(16).toUpperCase().padStart(2, '0')).join(' '),
        base64: btoa(textInput),
        url: encodeURIComponent(textInput),
        html: textInput.replace(/[&<>"']/g, (match) => {
          const entities: { [key: string]: string } = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
          };
          return entities[match];
        }),
      });
    } catch (error) {
      console.error('Encoding error:', error);
    }
  };

  // Hash Generator Functions (Simplified)
  const generateHashes = async () => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(hashInput);
      
      // Simple CRC32 implementation
      const crc32 = (str: string) => {
        let crc = 0 ^ (-1);
        for (let i = 0; i < str.length; i++) {
          crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
        }
        return (crc ^ (-1)) >>> 0;
      };

      const crcTable = new Array(256);
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) {
          c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[i] = c;
      }

      setHashResults({
        md5: 'MD5 hash calculation requires external library',
        sha1: 'SHA1 hash calculation requires external library',
        sha256: 'SHA256 hash calculation requires external library',
        crc32: crc32(hashInput).toString(16).toUpperCase(),
      });
    } catch (error) {
      console.error('Hash error:', error);
    }
  };

  // Binary Operations Functions
  const calculateBinaryOperations = () => {
    try {
      const numA = parseInt(binaryA, 2);
      const numB = parseInt(binaryB, 2);
      
      if (isNaN(numA) || isNaN(numB)) {
        throw new Error('Invalid binary input');
      }

      setBinaryResults({
        and: (numA & numB).toString(2).padStart(8, '0'),
        or: (numA | numB).toString(2).padStart(8, '0'),
        xor: (numA ^ numB).toString(2).padStart(8, '0'),
        not: (~numA >>> 0).toString(2).slice(-8),
        leftShift: (numA << 1).toString(2).padStart(8, '0'),
        rightShift: (numA >> 1).toString(2).padStart(8, '0'),
      });
    } catch (error) {
      setBinaryResults({
        and: 'Error',
        or: 'Error',
        xor: 'Error',
        not: 'Error',
        leftShift: 'Error',
        rightShift: 'Error',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Auto-convert when input changes
  useEffect(() => {
    if (inputValue) convertNumber();
  }, [inputValue, inputBase, convertNumber]);

  useEffect(() => {
    if (textInput) encodeText();
  }, [textInput, encodeText]);

  useEffect(() => {
    if (hashInput) generateHashes();
  }, [hashInput, generateHashes]);

  useEffect(() => {
    if (binaryA && binaryB) calculateBinaryOperations();
  }, [binaryA, binaryB, calculateBinaryOperations]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <SecurityIcon color="primary" />
        Cryptography & Number Systems
      </Typography>

      <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: 'background.paper' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 56,
            }
          }}
        >
          <Tab icon={<TransformIcon />} label="Number Converter" />
          <Tab icon={<CodeIcon />} label="Text Encoding" />
          <Tab icon={<VpnKeyIcon />} label="Hash Generator" />
          <Tab icon={<CalculateIcon />} label="Binary Operations" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Number Base Converter */}
          <TabPanel value={tabValue} index={0}>
            <Stack spacing={3}>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                Convert numbers between different number systems: Decimal, Binary, Hexadecimal, Octal, and Base64
              </Alert>
              
              <Card elevation={0} sx={{ bgcolor: 'background.default', borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Input
                  </Typography>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 0.5fr' },
                    gap: 2,
                    alignItems: 'center'
                  }}>
                    <TextField
                      fullWidth
                      label="Enter Value"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter number to convert"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    <TextField
                      fullWidth
                      select
                      label="Input Base"
                      value={inputBase}
                      onChange={(e) => setInputBase(e.target.value)}
                      SelectProps={{ native: true }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      <option value="decimal">Decimal (10)</option>
                      <option value="binary">Binary (2)</option>
                      <option value="hexadecimal">Hexadecimal (16)</option>
                      <option value="octal">Octal (8)</option>
                    </TextField>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={convertNumber}
                      startIcon={<SwapHorizIcon />}
                      sx={{ height: '56px', borderRadius: 2 }}
                    >
                      Convert
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 2 
              }}>
                {Object.entries(results).map(([key, value]) => (
                  <Paper key={key} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" color="primary" textTransform="capitalize">
                        {key}
                      </Typography>
                      <Tooltip title="Copy to clipboard">
                        <IconButton size="small" onClick={() => copyToClipboard(value)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {value || 'Enter a value to convert'}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Stack>
          </TabPanel>

          {/* Text Encoding */}
          <TabPanel value={tabValue} index={1}>
            <Stack spacing={3}>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                Encode text in various formats: ASCII, Unicode, UTF-8, Base64, URL, and HTML
              </Alert>

              <Card elevation={0} sx={{ bgcolor: 'background.default', borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Text Input
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Enter Text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter text to encode"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </CardContent>
              </Card>

              <Stack spacing={2}>
                {Object.entries(encodingResults).map(([key, value]) => (
                  <Paper key={key} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" color="primary" textTransform="uppercase">
                        {key}
                      </Typography>
                      <Tooltip title="Copy to clipboard">
                        <IconButton size="small" onClick={() => copyToClipboard(value)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {value || 'Enter text to encode'}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Stack>
          </TabPanel>

          {/* Hash Generator */}
          <TabPanel value={tabValue} index={2}>
            <Stack spacing={3}>
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                Hash generation tools. Note: Some hash algorithms require additional libraries for full implementation.
              </Alert>

              <Card elevation={0} sx={{ bgcolor: 'background.default', borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Hash Input
                  </Typography>
                  <TextField
                    fullWidth
                    label="Enter Text"
                    value={hashInput}
                    onChange={(e) => setHashInput(e.target.value)}
                    placeholder="Enter text to hash"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </CardContent>
              </Card>

              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 2 
              }}>
                {Object.entries(hashResults).map(([key, value]) => (
                  <Paper key={key} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" color="primary" textTransform="uppercase">
                        {key}
                      </Typography>
                      <Tooltip title="Copy to clipboard">
                        <IconButton size="small" onClick={() => copyToClipboard(value)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {value || 'Enter text to generate hash'}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Stack>
          </TabPanel>

          {/* Binary Operations */}
          <TabPanel value={tabValue} index={3}>
            <Stack spacing={3}>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                Perform bitwise operations on binary numbers: AND, OR, XOR, NOT, Left Shift, Right Shift
              </Alert>

              <Card elevation={0} sx={{ bgcolor: 'background.default', borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Binary Inputs
                  </Typography>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                    gap: 2 
                  }}>
                    <TextField
                      fullWidth
                      label="Binary A"
                      value={binaryA}
                      onChange={(e) => setBinaryA(e.target.value)}
                      placeholder="11011010"
                      helperText="Enter 8-bit binary number"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    <TextField
                      fullWidth
                      label="Binary B"
                      value={binaryB}
                      onChange={(e) => setBinaryB(e.target.value)}
                      placeholder="10101100"
                      helperText="Enter 8-bit binary number"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Box>
                </CardContent>
              </Card>

              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 2 
              }}>
                {Object.entries(binaryResults).map(([key, value]) => (
                  <Paper key={key} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" color="primary" textTransform="uppercase">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Typography>
                      <Tooltip title="Copy to clipboard">
                        <IconButton size="small" onClick={() => copyToClipboard(value)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                      {value || 'Enter binary numbers'}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Stack>
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
};

export default CryptographyTools; 