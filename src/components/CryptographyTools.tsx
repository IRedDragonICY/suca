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
  Chip,
} from '@mui/material';
import {
  Security as SecurityIcon,
  SwapHoriz as SwapHorizIcon,
  Calculate as CalculateIcon,
  ContentCopy as ContentCopyIcon,
  Transform as TransformIcon,
  VpnKey as VpnKeyIcon,
  Code as CodeIcon,
  Filter1 as DecimalIcon,
  DeveloperMode as BinaryIcon,
  Tag as HexIcon,
  Filter8 as OctalIcon,
  Numbers as NumbersIcon,
  TextFields as TextIcon,
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
  const [inputMode, setInputMode] = useState<'number' | 'text'>('number');
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

  // Base options for chip selector
  const baseOptions = [
    {
      value: 'decimal',
      label: 'DEC',
      description: 'Decimal (10)',
      icon: <DecimalIcon />,
      color: '#1976d2' as const,
    },
    {
      value: 'binary',
      label: 'BIN',
      description: 'Binary (2)',
      icon: <BinaryIcon />,
      color: '#2e7d32' as const,
    },
    {
      value: 'hexadecimal',
      label: 'HEX',
      description: 'Hexadecimal (16)',
      icon: <HexIcon />,
      color: '#ed6c02' as const,
    },
    {
      value: 'octal',
      label: 'OCT',
      description: 'Octal (8)',
      icon: <OctalIcon />,
      color: '#9c27b0' as const,
    },
  ];

  const handleBaseChange = (base: string) => {
    setInputBase(base);
  };

  const handleInputModeChange = (mode: 'number' | 'text') => {
    setInputMode(mode);
    // Clear input when switching modes
    setInputValue('');
    // Reset to decimal base when switching to text mode
    if (mode === 'text') {
      setInputBase('decimal');
    }
  };

  // Number Base Converter Functions
  const convertNumber = () => {
    try {
      if (inputMode === 'text') {
        // Convert text to ASCII values and then to different bases
        if (!inputValue) {
          setResults({
            decimal: '',
            binary: '',
            hexadecimal: '',
            octal: '',
            base64: '',
          });
          return;
        }

        // Get ASCII values for each character
        const asciiValues = inputValue.split('').map(char => char.charCodeAt(0));
        
        setResults({
          decimal: asciiValues.join(' '),
          binary: asciiValues.map(val => val.toString(2).padStart(8, '0')).join(' '),
          hexadecimal: asciiValues.map(val => val.toString(16).toUpperCase().padStart(2, '0')).join(' '),
          octal: asciiValues.map(val => val.toString(8).padStart(3, '0')).join(' '),
          base64: btoa(inputValue),
        });
      } else {
        // Original number conversion logic
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
      }
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
  }, [inputValue, inputBase, inputMode]);

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
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Number Mode:</strong> Convert numbers between different number systems (Decimal, Binary, Hexadecimal, Octal)
                </Typography>
                <Typography variant="body2">
                  <strong>Text Mode:</strong> Convert text to ASCII values displayed in different number bases
                </Typography>
              </Alert>
              
              <Card elevation={0} sx={{ bgcolor: 'background.default', borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Input
                  </Typography>
                  <Stack spacing={3}>
                    {/* Input Mode Selection */}
                    <Box>
                      <Typography variant="subtitle2" gutterBottom color="text.secondary" sx={{ mb: 2 }}>
                        Input Mode
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 1.5,
                        justifyContent: 'center',
                        mb: 2
                      }}>
                        <Chip
                          icon={<NumbersIcon />}
                          label="Number"
                          variant={inputMode === 'number' ? 'filled' : 'outlined'}
                          color={inputMode === 'number' ? 'primary' : 'default'}
                          onClick={() => handleInputModeChange('number')}
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
                          }}
                        />
                        <Chip
                          icon={<TextIcon />}
                          label="Text"
                          variant={inputMode === 'text' ? 'filled' : 'outlined'}
                          color={inputMode === 'text' ? 'primary' : 'default'}
                          onClick={() => handleInputModeChange('text')}
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
                          }}
                        />
                      </Box>
                    </Box>

                    <TextField
                      fullWidth
                      label={inputMode === 'number' ? 'Enter Number' : 'Enter Text'}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={inputMode === 'number' ? 'Enter number to convert' : 'Enter text to convert to ASCII numbers'}
                      multiline={inputMode === 'text'}
                      rows={inputMode === 'text' ? 2 : 1}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    
                    {/* Base Selection - Only show for number mode */}
                    {inputMode === 'number' && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom color="text.secondary" sx={{ mb: 2 }}>
                          Select Input Base
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap',
                          gap: 1.5,
                          justifyContent: 'center'
                        }}>
                          {baseOptions.map((option) => (
                            <Chip
                              key={option.value}
                              icon={option.icon}
                              label={option.label}
                              variant={inputBase === option.value ? 'filled' : 'outlined'}
                              color={inputBase === option.value ? 'primary' : 'default'}
                              onClick={() => handleBaseChange(option.value)}
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
                                ...(inputBase === option.value && {
                                  bgcolor: option.color,
                                  color: 'white',
                                  '& .MuiChip-icon': {
                                    color: 'white',
                                  },
                                  '&:hover': {
                                    bgcolor: option.color,
                                    opacity: 0.9,
                                  }
                                }),
                                ...(inputBase !== option.value && {
                                  '&:hover': {
                                    bgcolor: `${option.color}15`,
                                    borderColor: option.color,
                                    '& .MuiChip-icon': {
                                      color: option.color,
                                    }
                                  }
                                })
                              }}
                            />
                          ))}
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                          {baseOptions.find(opt => opt.value === inputBase)?.description}
                        </Typography>
                      </Box>
                    )}

                    {/* Text mode explanation */}
                    {inputMode === 'text' && (
                      <Alert severity="info" sx={{ borderRadius: 2 }}>
                        <Typography variant="body2">
                          Text mode converts each character to its ASCII value and displays it in different number bases.
                        </Typography>
                      </Alert>
                    )}

                    <Button
                      fullWidth
                      variant="contained"
                      onClick={convertNumber}
                      startIcon={<SwapHorizIcon />}
                      sx={{ 
                        height: '48px', 
                        borderRadius: 3,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                      }}
                    >
                      {inputMode === 'number' ? 'Convert Number' : 'Convert Text to ASCII'}
                    </Button>
                  </Stack>
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
                        {key} {inputMode === 'text' && key !== 'base64' ? `(ASCII)` : ''}
                      </Typography>
                      <Tooltip title="Copy to clipboard">
                        <IconButton size="small" onClick={() => copyToClipboard(value)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {value || (inputMode === 'number' ? 'Enter a number to convert' : 'Enter text to convert to ASCII')}
                    </Typography>
                    {inputMode === 'text' && value && key !== 'base64' && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {key === 'decimal' && 'ASCII values separated by spaces'}
                        {key === 'binary' && '8-bit binary representation of each character'}
                        {key === 'hexadecimal' && 'Hexadecimal ASCII values (2 digits each)'}
                        {key === 'octal' && 'Octal ASCII values (3 digits each)'}
                      </Typography>
                    )}
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