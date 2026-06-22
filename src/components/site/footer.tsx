import { Link } from 'react-router-dom';
import { Send, AtSign, Globe, Leaf } from 'lucide-react';
import { Logo } from './logo';

const columns = [
  {
    title: 'Producto',
    links: [
      { label: 'Cómo funciona', to: '/#como-funciona' },
      { label: 'Membresía', to: '/#membresia' },
      { label: 'Panel en vivo', to: '/dashboard' },
      { label: 'Preguntas', to: '/faq' },
    ],
  },
  {
    title: 'Compañía',
    links: [
      { label: 'Nosotros', to: '/nosotros' },
      { label: 'Sostenibilidad', to: '/#impacto' },
      { label: 'Contacto', to: '/contacto' },
    ],
  },
  {
    title: 'Cuenta',
    links: [
      { label: 'Ingresar', to: '/ingresar' },
      { label: 'Crear cuenta', to: '/registro' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Cultivo vertical inteligente. Tecnología y naturaleza creciendo
              juntas.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[Globe, AtSign, Send].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                  aria-label="Red social"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Raizal. Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Leaf className="h-3.5 w-3.5 text-primary" />
            Hecho con tecnología que crece contigo
          </p>
        </div>
      </div>
    </footer>
  );
}
