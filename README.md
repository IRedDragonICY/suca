# SUCA - Subnet Calculator

A modern, comprehensive subnet calculator built with React and Material You design system. SUCA provides all the tools you need for IPv4 and IPv6 subnet calculations, network planning, and IP address management.

## Features

### IPv4 Calculator
- **Input Methods**: CIDR notation or subnet mask
- **Comprehensive Information**:
  - Network address and broadcast address
  - First and last usable host addresses
  - Total and usable host count
  - IP class identification
  - Private/public IP detection
  - Wildcard mask calculation
- **Binary Representation**: View all addresses in binary format
- **Subnet Division**: Calculate subnet blocks for network segmentation
- **Copy to Clipboard**: Easy copying of all calculated values

### IPv6 Calculator
- **Full IPv6 Support**: Works with all valid IPv6 formats
- **Network Information**:
  - Network address (compressed and expanded)
  - First and last host addresses
  - Total hosts calculation
  - Private/public IPv6 detection
- **Binary Representation**: Full 128-bit binary view

### Network Tools
- **IP to Binary Converter**: Convert any IPv4 address to binary
- **Decimal to IP Converter**: Convert decimal numbers to IP addresses
- **CIDR to Subnet Mask**: Quick CIDR notation conversion
- **Subnet Mask to CIDR**: Reverse conversion
- **VLSM Calculator**: Variable Length Subnet Mask planning for efficient IP allocation

## Technology Stack

- **React 18** with TypeScript
- **Material UI v5** with Material You (Material 3) design
- **Modern UI/UX**: 
  - Responsive design for all devices
  - Dark/light theme support
  - Smooth animations and transitions
  - Intuitive user interface

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/suca.git
   cd suca
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Deployment

This application is ready for deployment on Vercel:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Deploy with one click

## Usage

### IPv4 Calculation
1. Enter an IP address (e.g., 192.168.1.0)
2. Enter CIDR prefix (e.g., 24) or subnet mask (e.g., 255.255.255.0)
3. Click Calculate to see all network information
4. Use the Subnet Division section to plan smaller subnets

### IPv6 Calculation
1. Enter an IPv6 address (e.g., 2001:db8::1)
2. Enter prefix length (e.g., 64)
3. View comprehensive network information

### Network Tools
- Use various converters for quick calculations
- Plan your network with VLSM calculator for efficient IP allocation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
