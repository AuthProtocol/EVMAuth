export function cn(...inputs: string[]) {
  return inputs.filter(Boolean).join(" ");
}

export function truncateAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatBNB(amount: string): string {
  const num = parseFloat(amount);
  if (num < 0.001) return `${num.toFixed(6)} BNB`;
  if (num < 1) return `${num.toFixed(4)} BNB`;
  return `${num.toFixed(2)} BNB`;
}

export function generateDID(address: string): string {
  return `did:ethr:${address}`;
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function generateRandomAddress(): string {
  const chars = "0123456789abcdef";
  let address = "0x";
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
