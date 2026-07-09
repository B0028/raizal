import { useState } from 'react';  
import { Crown, Check } from 'lucide-react';  
import { cn } from '@/lib/utils';  
import { Button } from '@/components/ui/button';  
import { Badge } from '@/components/ui/badge';  
import { Progress } from '@/components/ui/progress';  
import { Separator } from '@/components/ui/separator';  
import {  
  Card,  
  CardHeader,  
  CardTitle,  
  CardDescription,  
  CardContent,  
  CardFooter,  
} from '@/components/ui/card';  
import {  
  CheckoutDialog,  
  type CheckoutPlan,  
} from '@/components/site/checkout-dialog';  
import { useUserSubscription } from '@/hooks/use-user-subscription';  
import { plans } from '@/lib/plans';  
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
  
export function DashboardMembershipPage() {  
  const { slotsTotal, slotsUsed, endDate, planName, loading } =  
    useUserSubscription();  
  const [checkoutOpen, setCheckoutOpen] = useState(false);  
  const [selectedPlan, setSelectedPlan] = useState<CheckoutPlan | null>(null);  
  
  const slotPct = slotsTotal > 0 ? (slotsUsed / slotsTotal) * 100 : 0;  
  const currentPlan = plans.find((p) => p.planNameDb === planName);  
  
  const handleOpenCheckout = (plan: CheckoutPlan) => {  
    setSelectedPlan(plan);  
    setCheckoutOpen(true);  
  };  
  
  return (  
    <main className="flex-1 space-y-6 p-4 lg:p-8">  
      <section>  
        <div className="mb-4 flex items-center justify-between">  
          <h2 className="font-heading text-sm font-semibold tracking-wide text-muted-foreground">  
            TU MEMBRESÍA  
          </h2>  
        </div>  
  
        <Card className="glass-strong">  
          <CardHeader>  
            <div className="flex items-start justify-between gap-3">  
              <div className="flex items-center gap-2.5">  
                <span className="flex size-9 items-center justify-center rounded-xl bg-amber/15">  
                  <Crown className="size-4.5 text-amber" />  
                </span>  
                <div>  
                  <CardTitle>  
                    {loading  
                      ? 'Cargando…'  
                      : currentPlan?.name ?? 'Sin plan activo'}  
                  </CardTitle>  
                  <CardDescription>  
                    {endDate ? `Renueva el ${endDate}` : 'No tienes una suscripción activa'}  
                  </CardDescription>  
                </div>  
              </div>  
              {planName && <Badge variant="default">ACTIVA</Badge>}  
            </div>  
          </CardHeader>  
  
          <CardContent className="space-y-5">  
            {currentPlan && (  
              <p className="text-sm text-muted-foreground">{currentPlan.desc}</p>  
            )}  
  
            <div>  
              <div className="flex items-center justify-between text-sm">  
                <span className="text-muted-foreground">Slots utilizados</span>  
                <span className="font-mono font-medium">  
                  {slotsUsed} / {slotsTotal}  
                </span>  
              </div>  
              <Progress value={slotPct} className="mt-2" />  
              <p className="mt-2 text-xs text-muted-foreground">  
                Te quedan {Math.max(slotsTotal - slotsUsed, 0)} slots disponibles  
                para nuevos cultivos.  
              </p>  
            </div>  
  
            {currentPlan && (  
              <>  
                <Separator />  
                <ul className="grid gap-3 sm:grid-cols-2">  
                  {currentPlan.features.map((f) => (  
                    <li  
                      key={f}  
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"  
                    >  
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />  
                      {f}  
                    </li>  
                  ))}  
                </ul>  
              </>  
            )}  
          </CardContent>  
        </Card>  
      </section>  
  

        <section>  
        <div className="mb-4 flex items-center justify-between">  
            <h2 className="font-heading text-sm font-semibold tracking-wide text-muted-foreground">  
            CAMBIAR DE PLAN  
            </h2>  
        </div>  
        
        <Tabs defaultValue={planName ?? plans[0].planNameDb} className="w-full">  
            <TabsList className="grid w-full grid-cols-3">  
            {plans.map((plan) => (  
                <TabsTrigger key={plan.planNameDb} value={plan.planNameDb}>  
                {plan.name.split(' ')[0]}  
                </TabsTrigger>  
            ))}  
            </TabsList>  
        
            {plans.map((plan) => {  
            const isCurrent = plan.planNameDb === planName;  
            return (  
                <TabsContent key={plan.planNameDb} value={plan.planNameDb}>  
                <Card  
                    className={cn(  
                    'glass-strong relative',  
                    plan.featured && 'ring-2 ring-primary/30',  
                    isCurrent && 'border-primary/60',  
                    )}  
                >  
                    <CardHeader>  
                    <div className="flex items-start justify-between gap-3">  
                        <div>  
                        <div className="flex items-center gap-2">  
                            <CardTitle>{plan.name}</CardTitle>  
                            {plan.featured && <Badge>Más popular</Badge>}  
                            {isCurrent && <Badge variant="secondary">Tu plan</Badge>}  
                        </div>  
                        <CardDescription className="mt-1">{plan.desc}</CardDescription>  
                        </div>  
                        <div className="flex items-baseline gap-1 whitespace-nowrap">  
                        <span className="text-3xl font-bold text-foreground">  
                            ${plan.price}  
                        </span>  
                        <span className="text-sm text-muted-foreground">  
                            {plan.period}  
                        </span>  
                        </div>  
                    </div>  
                    </CardHeader>  
        
                    <CardContent>  
                    <Separator className="mb-5" />  
                    <ul className="grid gap-3 sm:grid-cols-2">  
                        {plan.features.map((f) => (  
                        <li  
                            key={f}  
                            className="flex items-start gap-2.5 text-sm text-muted-foreground"  
                        >  
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />  
                            {f}  
                        </li>  
                        ))}  
                    </ul>  
                    </CardContent>  
        
                    <CardFooter>  
                    <Button  
                        className="w-full cursor-pointer"  
                        variant={plan.featured ? 'default' : 'outline'}  
                        disabled={isCurrent}  
                        onClick={() =>  
                        handleOpenCheckout({  
                            name: plan.name,  
                            planNameDb: plan.planNameDb,  
                            price: plan.price,  
                            period: plan.period,  
                        })  
                        }  
                    >  
                        {isCurrent ? 'Plan actual' : `Cambiar a ${plan.name}`}  
                    </Button>  
                    </CardFooter>  
                </Card>  
                </TabsContent>  
            );  
            })}  
        </Tabs>  
        </section>
  
      <CheckoutDialog  
        plan={selectedPlan}  
        open={checkoutOpen}  
        onOpenChange={setCheckoutOpen}  
      />  
    </main>  
  );  
}