import { CropSlots } from '@/components/dashboard/crop-slots';  
  
export function CropsPage() {  
  return (  
    <main className="flex-1 space-y-6 p-4 lg:p-8">  
      <section>  
        <div className="mb-4 flex items-center justify-between">  
          <h2 className="font-heading text-sm font-semibold tracking-wide text-muted-foreground">  
            MIS CULTIVOS  
          </h2>  
        </div>  
        <div>  
          <CropSlots />  
        </div>  
      </section>  
    </main>  
  );  
}