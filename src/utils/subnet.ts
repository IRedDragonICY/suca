// Utility functions for subnet calculations

// IPv4 Functions
export const ipv4ToLong = (ip: string): number => {
  const parts = ip.split('.').map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
};

export const longToIpv4 = (long: number): string => {
  return [
    (long >>> 24) & 255,
    (long >>> 16) & 255,
    (long >>> 8) & 255,
    long & 255
  ].join('.');
};

export const ipv4ToBinary = (ip: string): string => {
  return ip.split('.').map(octet => 
    parseInt(octet).toString(2).padStart(8, '0')
  ).join('.');
};

// Additional utility functions for enhanced IPv4 information
export const ipv4ToBinaryID = (ip: string): string => {
  return ip.split('.').map(octet => 
    parseInt(octet).toString(2).padStart(8, '0')
  ).join('');
};

export const ipv4ToIntegerID = (ip: string): number => {
  return ipv4ToLong(ip);
};

export const ipv4ToHexID = (ip: string): string => {
  const long = ipv4ToLong(ip);
  return '0x' + long.toString(16).toLowerCase().padStart(8, '0');
};

export const ipv4ToInAddrArpa = (ip: string): string => {
  const parts = ip.split('.');
  return parts.reverse().join('.') + '.in-addr.arpa';
};

export const ipv4ToIPv4MappedAddress = (ip: string): string => {
  const hex = ipv4ToLong(ip).toString(16).padStart(8, '0');
  return `::ffff:${hex.substring(0, 4)}.${hex.substring(4, 8)}`;
};

export const ipv4To6to4Prefix = (ip: string): string => {
  const hex = ipv4ToLong(ip).toString(16).padStart(8, '0');
  return `2002:${hex.substring(0, 4)}.${hex.substring(4, 8)}::/48`;
};

export const getUsableHostRange = (network: string, cidr: number): string => {
  const networkLong = ipv4ToLong(network);
  const totalHosts = Math.pow(2, 32 - cidr);
  
  if (totalHosts <= 2) {
    return `${network} - ${network}`;
  }
  
  const firstHost = longToIpv4(networkLong + 1);
  const lastHost = longToIpv4(networkLong + totalHosts - 2);
  
  return `${firstHost} - ${lastHost}`;
};

export const getShortNotation = (ip: string, cidr: number): string => {
  return `${ip} /${cidr}`;
};

export const cidrToSubnetMask = (cidr: number): string => {
  const mask = (0xffffffff << (32 - cidr)) >>> 0;
  return longToIpv4(mask);
};

export const subnetMaskToCidr = (mask: string): number => {
  const maskLong = ipv4ToLong(mask);
  let cidr = 0;
  let m = maskLong;
  while (m) {
    cidr++;
    m = (m << 1) >>> 0;
  }
  return cidr;
};

export const getWildcardMask = (subnetMask: string): string => {
  const maskLong = ipv4ToLong(subnetMask);
  const wildcardLong = (~maskLong) >>> 0;
  return longToIpv4(wildcardLong);
};

export interface IPv4SubnetInfo {
  network: string;
  networkBinary: string;
  broadcast: string;
  broadcastBinary: string;
  firstHost: string;
  lastHost: string;
  subnetMask: string;
  subnetMaskBinary: string;
  wildcardMask: string;
  wildcardMaskBinary: string;
  cidr: number;
  totalHosts: number;
  usableHosts: number;
  ipClass: string;
  isPrivate: boolean;
  // Additional fields for enhanced information
  usableHostRange: string;
  shortNotation: string;
  binaryID: string;
  integerID: number;
  hexID: string;
  inAddrArpa: string;
  ipv4MappedAddress: string;
  sixToFourPrefix: string;
}

export const calculateIPv4Subnet = (ip: string, cidr: number): IPv4SubnetInfo => {
  const ipLong = ipv4ToLong(ip);
  const subnetMask = cidrToSubnetMask(cidr);
  const maskLong = ipv4ToLong(subnetMask);
  
  const network = longToIpv4(ipLong & maskLong);
  const broadcast = longToIpv4((ipLong & maskLong) | (~maskLong >>> 0));
  const firstHost = longToIpv4((ipLong & maskLong) + 1);
  const lastHost = longToIpv4(((ipLong & maskLong) | (~maskLong >>> 0)) - 1);
  
  const totalHosts = Math.pow(2, 32 - cidr);
  const usableHosts = totalHosts > 2 ? totalHosts - 2 : 0;
  
  // Determine IP class
  const firstOctet = parseInt(ip.split('.')[0]);
  let ipClass = 'Unknown';
  if (firstOctet >= 1 && firstOctet <= 126) ipClass = 'A';
  else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'B';
  else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'C';
  else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'D (Multicast)';
  else if (firstOctet >= 240 && firstOctet <= 255) ipClass = 'E (Reserved)';
  
  // Check if private
  const isPrivate = isPrivateIPv4(ip);
  
  return {
    network,
    networkBinary: ipv4ToBinary(network),
    broadcast,
    broadcastBinary: ipv4ToBinary(broadcast),
    firstHost,
    lastHost,
    subnetMask,
    subnetMaskBinary: ipv4ToBinary(subnetMask),
    wildcardMask: getWildcardMask(subnetMask),
    wildcardMaskBinary: ipv4ToBinary(getWildcardMask(subnetMask)),
    cidr,
    totalHosts,
    usableHosts,
    ipClass,
    isPrivate,
    // Additional enhanced fields
    usableHostRange: getUsableHostRange(network, cidr),
    shortNotation: getShortNotation(ip, cidr),
    binaryID: ipv4ToBinaryID(ip),
    integerID: ipv4ToIntegerID(ip),
    hexID: ipv4ToHexID(ip),
    inAddrArpa: ipv4ToInAddrArpa(ip),
    ipv4MappedAddress: ipv4ToIPv4MappedAddress(ip),
    sixToFourPrefix: ipv4To6to4Prefix(ip)
  };
};

export const isPrivateIPv4 = (ip: string): boolean => {
  const ipLong = ipv4ToLong(ip);
  const ranges = [
    { start: ipv4ToLong('10.0.0.0'), end: ipv4ToLong('10.255.255.255') },
    { start: ipv4ToLong('172.16.0.0'), end: ipv4ToLong('172.31.255.255') },
    { start: ipv4ToLong('192.168.0.0'), end: ipv4ToLong('192.168.255.255') }
  ];
  
  return ranges.some(range => ipLong >= range.start && ipLong <= range.end);
};

export interface SubnetBlock {
  index: number;
  network: string;
  broadcast: string;
  firstHost: string;
  lastHost: string;
  usableHosts: number;
}

export const calculateSubnetBlocks = (
  networkAddress: string, 
  originalCidr: number, 
  newCidr: number, 
  maxBlocks: number = 256
): SubnetBlock[] => {
  if (newCidr <= originalCidr) return [];
  
  const blocks: SubnetBlock[] = [];
  const blockSize = Math.pow(2, 32 - newCidr);
  const networkLong = ipv4ToLong(networkAddress);
  const totalBlocks = Math.pow(2, newCidr - originalCidr);
  const blocksToCalculate = Math.min(totalBlocks, maxBlocks);
  
  for (let i = 0; i < blocksToCalculate; i++) {
    const blockNetwork = networkLong + (i * blockSize);
    const blockBroadcast = blockNetwork + blockSize - 1;
    
    blocks.push({
      index: i,
      network: longToIpv4(blockNetwork),
      broadcast: longToIpv4(blockBroadcast),
      firstHost: blockSize > 2 ? longToIpv4(blockNetwork + 1) : longToIpv4(blockNetwork),
      lastHost: blockSize > 2 ? longToIpv4(blockBroadcast - 1) : longToIpv4(blockBroadcast),
      usableHosts: blockSize > 2 ? blockSize - 2 : blockSize
    });
  }
  
  return blocks;
};

// IPv6 Functions
export const ipv6ToBinary = (ipv6: string): string => {
  // Expand IPv6 address
  const expanded = expandIPv6(ipv6);
  const parts = expanded.split(':');
  
  return parts.map(part => 
    parseInt(part, 16).toString(2).padStart(16, '0')
  ).join(':');
};

export const expandIPv6 = (ipv6: string): string => {
  // Handle :: notation
  if (ipv6.includes('::')) {
    const parts = ipv6.split('::');
    const left = parts[0] ? parts[0].split(':') : [];
    const right = parts[1] ? parts[1].split(':') : [];
    const missing = 8 - left.length - right.length;
    const middle = new Array(missing).fill('0000');
    
    return [...left, ...middle, ...right]
      .map(part => part.padStart(4, '0'))
      .join(':');
  }
  
  return ipv6.split(':')
    .map(part => part.padStart(4, '0'))
    .join(':');
};

export const compressIPv6 = (ipv6: string): string => {
  const expanded = expandIPv6(ipv6);
  const parts = expanded.split(':');
  
  // Remove leading zeros
  const shortened = parts.map(part => part.replace(/^0+/, '') || '0');
  
  // Find longest sequence of zeros
  let maxZeroStart = -1;
  let maxZeroLength = 0;
  let currentZeroStart = -1;
  let currentZeroLength = 0;
  
  for (let i = 0; i < shortened.length; i++) {
    if (shortened[i] === '0') {
      if (currentZeroStart === -1) {
        currentZeroStart = i;
        currentZeroLength = 1;
      } else {
        currentZeroLength++;
      }
      
      if (currentZeroLength > maxZeroLength) {
        maxZeroStart = currentZeroStart;
        maxZeroLength = currentZeroLength;
      }
    } else {
      currentZeroStart = -1;
      currentZeroLength = 0;
    }
  }
  
  // Replace longest zero sequence with ::
  if (maxZeroLength > 1) {
    const before = shortened.slice(0, maxZeroStart);
    const after = shortened.slice(maxZeroStart + maxZeroLength);
    
    if (before.length === 0 && after.length === 0) {
      return '::';
    } else if (before.length === 0) {
      return '::' + after.join(':');
    } else if (after.length === 0) {
      return before.join(':') + '::';
    } else {
      return before.join(':') + '::' + after.join(':');
    }
  }
  
  return shortened.join(':');
};

export interface IPv6SubnetInfo {
  network: string;
  networkExpanded: string;
  networkBinary: string;
  firstHost: string;
  lastHost: string;
  prefixLength: number;
  totalHosts: string;
  isPrivate: boolean;
}

export const calculateIPv6Subnet = (ipv6: string, prefixLength: number): IPv6SubnetInfo => {
  const expanded = expandIPv6(ipv6);
  const parts = expanded.split(':').map(part => parseInt(part, 16));
  
  // Calculate network address
  const networkParts = [...parts];
  const fullBytes = Math.floor(prefixLength / 16);
  const remainingBits = prefixLength % 16;
  
  for (let i = fullBytes; i < 8; i++) {
    if (i === fullBytes && remainingBits > 0) {
      const mask = (0xffff << (16 - remainingBits)) & 0xffff;
      networkParts[i] = networkParts[i] & mask;
    } else {
      networkParts[i] = 0;
    }
  }
  
  const network = networkParts.map(part => part.toString(16).padStart(4, '0')).join(':');
  
  // Calculate first and last host
  const firstHostParts = [...networkParts];
  firstHostParts[7] = (firstHostParts[7] | 1) >>> 0;
  
  const lastHostParts = [...networkParts];
  for (let i = Math.ceil(prefixLength / 16); i < 8; i++) {
    if (i === Math.floor(prefixLength / 16) && prefixLength % 16 !== 0) {
      const hostBits = 16 - (prefixLength % 16);
      const mask = (1 << hostBits) - 1;
      lastHostParts[i] = (lastHostParts[i] | mask) >>> 0;
    } else {
      lastHostParts[i] = 0xffff;
    }
  }
  lastHostParts[7] = (lastHostParts[7] & 0xfffe) >>> 0;
  
  const firstHost = firstHostParts.map(part => part.toString(16).padStart(4, '0')).join(':');
  const lastHost = lastHostParts.map(part => part.toString(16).padStart(4, '0')).join(':');
  
  // Calculate total hosts (as string for large numbers)
  const hostBits = 128 - prefixLength;
  const totalHosts = hostBits <= 53 ? Math.pow(2, hostBits).toString() : `2^${hostBits}`;
  
  // Check if private
  const isPrivate = isPrivateIPv6(network);
  
  return {
    network: compressIPv6(network),
    networkExpanded: network,
    networkBinary: ipv6ToBinary(network),
    firstHost: compressIPv6(firstHost),
    lastHost: compressIPv6(lastHost),
    prefixLength,
    totalHosts,
    isPrivate
  };
};

export const isPrivateIPv6 = (ipv6: string): boolean => {
  const expanded = expandIPv6(ipv6);
  const firstPart = expanded.split(':')[0];
  
  // Check for private IPv6 ranges
  if (firstPart.startsWith('fc') || firstPart.startsWith('fd')) return true; // Unique Local
  if (firstPart.startsWith('fe8') || firstPart.startsWith('fe9') || 
      firstPart.startsWith('fea') || firstPart.startsWith('feb')) return true; // Link Local
  
  return false;
};

// Validation functions
export const isValidIPv4 = (ip: string): boolean => {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  
  return parts.every(part => {
    const num = parseInt(part);
    return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString();
  });
};

export const isValidIPv6 = (ip: string): boolean => {
  // Basic IPv6 regex pattern
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  
  return ipv6Regex.test(ip);
}; 