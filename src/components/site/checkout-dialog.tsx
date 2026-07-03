import { useState, useEffect } from 'react';  
import { useNavigate } from 'react-router-dom';  
import { CheckCircle2, CreditCard, Loader2, ShieldCheck, XCircle } from 'lucide-react';  
import { toast } from 'sonner';  
  
import {  
  Dialog,  
  DialogContent,  
  DialogDescription,  
  DialogHeader,  
  DialogTitle,  
} from '@/components/ui/dialog';  
import { Badge } from '@/components/ui/badge';  
import { Button } from '@/components/ui/button';  
import { Input } from '@/components/ui/input';  
import { Separator } from '@/components/ui/separator';  
import { Field, FieldLabel } from '@/components/ui/field';  
import { Progress } from '@/components/ui/progress';  
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';  
import { Label } from '@/components/ui/label';  
import { supabase } from '@/lib/client';  
  
export type CheckoutPlan = {  
  name: string;  
  planNameDb: string;  
  price: number;  
  period: string;  
};  
  
type CheckoutState = 'idle' | 'processing' | 'success' | 'error';  
  
const TEST_CARDS = {  
  approved: { label: 'Tarjeta aprobada', number: '4242 4242 4242 4242' },  
  declined: { label: 'Tarjeta rechazada', number: '4000 0000 0000 0003' },  
} as const;  
  
interface CheckoutDialogProps {  
  plan: CheckoutPlan | null;  
  open: boolean;  
  onOpenChange: (open: boolean) => void;  
}  
  
export function CheckoutDialog({ plan, open, onOpenChange }: CheckoutDialogProps) {  
  const navigate = useNavigate();  
  const [state, setState] = useState<CheckoutState>('idle');  
  const [progress, setProgress] = useState(0);  
  const [errorMessage, setErrorMessage] = useState('');  
  const [transactionId, setTransactionId] = useState('');  
  const [testCard, setTestCard] = useState<'approved' | 'declined'>('approved');  
  
  useEffect(() => {  
    if (!open) {  
      setState('idle');  
      setProgress(0);  
      setErrorMessage('');  
      setTransactionId('');  
      setTestCard('approved');  
    }  
  }, [open]);  
  
  useEffect(() => {  
    if (state !== 'processing') return;  
    setProgress(0);  
    const interval = window.setInterval(() => {  
      setProgress((p) => (p >= 95 ? p : p + 8));  
    }, 120);  
    return () => window.clearInterval(interval);  
  }, [state]);  
  
  const isProcessing = state === 'processing';  
  
  const handlePay = async () => {  
    if (!plan) return;  
  
    setState('processing');  
    setErrorMessage('');  
    await new Promise((r) => window.setTimeout(r, 1500));  
  
    if (testCard === 'declined') {  
      setProgress(100);  
      setState('error');  
      setErrorMessage('Pago rechazado por el emisor simulado. Probá con la tarjeta aprobada.');  
      toast.error('Pago rechazado', {  
        description: 'La tarjeta de prueba fue declinada. No se realizó ningún cobro.',  
      });  
      return;  
    }  
  
    try {  
      const { data: { session } } = await supabase.auth.getSession();  
      const token = session?.access_token;  
      if (!token) {  
        onOpenChange(false);  
        navigate('/ingresar');  
        return;  
      }  
  
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';  
      const response = await fetch(`${apiUrl}/api/subscriptions/checkout`, {  
        method: 'POST',  
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },  
        body: JSON.stringify({ planNameDb: plan.planNameDb, priceUyu: plan.price }),  
      });  
      const data = await response.json();  
      if (!response.ok) throw new Error(data.error || 'Error al procesar en el servidor');  
  
      setProgress(100);  
      setTransactionId(data.transaction_id || data.transactionId || 'SIM-TX-UNKNOWN');  
      setState('success');  
      toast.success('¡Pago simulado exitoso!', { description: `Plan ${plan.name} activado.` });  
    } catch (error) {  
      setProgress(100);  
      setState('error');  
      const message = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';  
      setErrorMessage(message);  
      toast.error('Error en el checkout', { description: message });  
    }  
  };  
  
  return (  
    <Dialog  
      open={open}  
      onOpenChange={(next) => {  
        if (isProcessing) return;  
        onOpenChange(next);  
      }}  
    >  
      <DialogContent  
        className="border-border/60 bg-background/90 backdrop-blur-sm sm:max-w-md"  
        showCloseButton={!isProcessing}  
      >  
        {plan && state === 'idle' && (  
          <>  
            <DialogHeader>  
              <div className="flex items-start justify-between gap-3">  
                <div className="flex flex-col gap-1">  
                  <DialogTitle>Checkout simulado</DialogTitle>  
                  <DialogDescription>  
                    Elegí una tarjeta de prueba para activar tu membresía.  
                  </DialogDescription>
                </div>  
              </div>  
            </DialogHeader>  
  

            <div className="flex items-baseline justify-between rounded-lg border border-border/60 bg-card/40 px-4 py-3">  
              <div className="flex flex-col">  
                <span className="text-sm font-medium">{plan.name}</span>  
                <span className="text-xs text-muted-foreground">Total mensual</span>  
              </div>  
              <span className="text-xl font-bold">  
                ${plan.price}  
                <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>  
              </span>  
            </div>  
  

            <Field>  
              <FieldLabel>Tarjeta de prueba</FieldLabel>  
              <RadioGroup  
                value={testCard}  
                onValueChange={(v) => setTestCard(v as 'approved' | 'declined')}  
                className="grid gap-2"  
              >  
                {(Object.entries(TEST_CARDS) as [keyof typeof TEST_CARDS, typeof TEST_CARDS.approved][]).map(  
                  ([key, card]) => (  
                    <div  
                      key={key}  
                      className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/30 px-3 py-2.5"  
                    >  
                      <RadioGroupItem value={key} id={`card-${key}`} />  
                      <Label htmlFor={`card-${key}`} className="flex flex-1 cursor-pointer flex-col gap-0.5 font-normal">  
                        <span className="text-sm font-medium">{card.label}</span>  
                        <span className="font-mono text-xs text-muted-foreground">{card.number}</span>  
                      </Label>  
                    </div>  
                  ),  
                )}  
              </RadioGroup>
            </Field>  
  
            <div className="flex items-center gap-2 text-xs text-muted-foreground">  
              <ShieldCheck className="size-4" />  
              <span>Entorno de demostración — no se procesan pagos reales.</span>  
            </div>  
  
            <Button className="w-full" onClick={handlePay}>  
              <CreditCard className="size-4" />  
              Pagar ${plan.price} (simulado)  
            </Button>  
          </>  
        )}  
  
        {plan && state === 'processing' && (  
          <div className="flex flex-col items-center gap-6 py-6">  
            <DialogHeader className="items-center text-center">  
              <DialogTitle>Procesando pago</DialogTitle>  
              <DialogDescription>Simulando autorización…</DialogDescription>  
            </DialogHeader>  
            <Loader2 className="size-10 animate-spin text-primary" />  
            <Progress value={progress} className="w-full" />  
          </div>  
        )}  
  
        {plan && state === 'success' && (  
          <div className="flex flex-col gap-5">  
            <DialogHeader className="items-center text-center">  
              <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-primary/10">  
                <CheckCircle2 className="size-8 text-primary" />  
              </div>  
              <DialogTitle>¡Pago confirmado!</DialogTitle>  
              <DialogDescription>Plan {plan.name} activado correctamente.</DialogDescription>  
            </DialogHeader>  
  
            <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-card/40 px-4 py-3 text-sm">  
              <div className="flex justify-between"><span className="text-muted-foreground">Monto</span><span className="font-medium">${plan.price} UYU{plan.period}</span></div>  
              <Separator />  
              <div className="flex flex-col gap-1">  
                <span className="text-muted-foreground">ID de transacción</span>  
                <span className="font-mono text-xs">{transactionId}</span>  
              </div>  
            </div>  
  
            <Button className="w-full" onClick={() => { onOpenChange(false); navigate('/dashboard'); }}>  
              Ir al dashboard  
            </Button>  
          </div>  
        )}  
  
        {plan && state === 'error' && (  
          <div className="flex flex-col gap-5">  
            <DialogHeader className="items-center text-center">  
              <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-destructive/10">  
                <XCircle className="size-8 text-destructive" />  
              </div>  
              <DialogTitle>No se pudo completar el pago</DialogTitle>  
              <DialogDescription>{errorMessage}</DialogDescription>  
            </DialogHeader>  
            <div className="flex flex-col gap-2 sm:flex-row">  
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancelar</Button>  
              <Button className="flex-1" onClick={() => { setState('idle'); setProgress(0); setErrorMessage(''); }}>Reintentar</Button>  
            </div>  
          </div>  
        )}  
      </DialogContent>  
    </Dialog>  
  );  
}