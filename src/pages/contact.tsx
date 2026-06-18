import { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const contactInfo = [
  { icon: Mail, label: 'Correo', value: 'raizal@cultivo.com' },
  { icon: Phone, label: 'Teléfono', value: '+598 00 000 000' },
  { icon: MapPin, label: 'Ubicación', value: 'Montevideo, Uruguay' },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="text-sm font-semibold text-primary">Contacto</span>
          <h1 className="mt-3 text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Hablemos de tu huerto
          </h1>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            ¿Tienes preguntas sobre Raizal, las membresías o cómo empezar?
            Nuestro equipo está listo para ayudarte a echar raíces.
          </p>

          <div className="mt-10 flex flex-col gap-5">
            {contactInfo.map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 ring-1 ring-primary/25">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium text-foreground">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/30 p-7 backdrop-blur-sm sm:p-8">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-primary" />
              <h2 className="mt-4 text-xl font-semibold text-foreground">
                ¡Mensaje enviado!
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Gracias por escribirnos. Te responderemos muy pronto.
              </p>
              <Button
                className="mt-6"
                variant="outline"
                onClick={() => setSent(false)}
              >
                Enviar otro mensaje
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nombre" id="name" placeholder="Tu nombre" />
                <Field
                  label="Correo"
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                />
              </div>
              <Field
                label="Asunto"
                id="subject"
                placeholder="¿En qué te ayudamos?"
              />
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-foreground"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  placeholder="Cuéntanos más..."
                  className="resize-none rounded-lg border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <Button type="submit" size="lg">
                Enviar mensaje
                <Send className="h-4 w-4" />
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  id,
  type = 'text',
  placeholder,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        placeholder={placeholder}
        className="rounded-lg border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
