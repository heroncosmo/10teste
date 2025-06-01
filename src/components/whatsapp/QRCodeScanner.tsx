import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { QRCodeScannerProps } from '@/types/whatsapp';

export function QRCodeScanner({ qrCode, isConnecting = false }: QRCodeScannerProps) {
  if (!qrCode && !isConnecting) return null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Conectar WhatsApp</CardTitle>
        <CardDescription>
          Escaneie o código QR com seu WhatsApp para conectar
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6">
        {isConnecting && !qrCode ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-500">Gerando código QR...</p>
          </div>
        ) : qrCode ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={`data:image/png;base64,${qrCode}`}
                alt="WhatsApp QR Code"
                className={`w-64 h-64 ${isConnecting ? 'opacity-50' : ''}`}
              />
              {isConnecting && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Abra o WhatsApp no seu celular e escaneie o código QR
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
