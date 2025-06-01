export interface WhatsappConnection {
  id: string;
  user_id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'connecting';
  instance_id?: string | null;
  created_at?: string;
  updated_at?: string;
  // ... existing code ...
}

export interface QRCodeScannerProps {
  qrCode: string;
  isConnecting?: boolean;
} 