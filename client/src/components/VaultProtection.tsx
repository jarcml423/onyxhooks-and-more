import { ReactNode } from 'react';

interface VaultProtectionProps {
  children: ReactNode;
}

export default function VaultProtection({ children }: VaultProtectionProps) {
  // DEMO MODE: All security features disabled for testing
  return <>{children}</>;
}