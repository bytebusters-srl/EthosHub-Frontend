import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Button } from '@/shared/ui';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { EthosCoreLogo } from '@/components/brand/EthosCoreLogo';

export function PublicPortfolioLayout() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/70">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/">
            <EthosCoreLogo size="lg" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              to={isHome ? '/#caracteristicas' : '/'}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Características
            </Link>
            <Link
              to="/explorar"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Explorar Talento
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="sm" className="rounded-xl px-5">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="rounded-xl px-5">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="rounded-xl bg-[linear-gradient(135deg,#635bff_0%,#4f46e5_100%)] px-5">
                    Crear Cuenta
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-border bg-[#dcd8ff]/55 py-14 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
            <div>
              <Link to="/">
                <EthosCoreLogo size="lg" />
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
                La plataforma para profesionales tech que quieren destacar.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {['Bytebusters', '@bytebusters', '@bytebusters'].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/60 bg-white/80 px-4 py-2 text-sm text-foreground shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-lg font-semibold text-foreground">Producto</p>
              <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
                <Link to="/#caracteristicas" className="transition-colors hover:text-foreground">
                  Características
                </Link>
                <Link to="/explorar" className="transition-colors hover:text-foreground">
                  Explorar Talento
                </Link>
              </div>
            </div>

            <div>
              <p className="text-lg font-semibold text-foreground">Empresa</p>
              <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
                <span>Sobre Nosotros</span>
                <span>Blog</span>
                <span>Contacto</span>
              </div>
            </div>

            <div>
              <p className="text-lg font-semibold text-foreground">Legal</p>
              <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
                <span>Privacidad</span>
                <span>Términos</span>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/50 pt-8 text-sm text-muted-foreground dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <p>2026 EthosHub. Todos los derechos reservados.</p>
            <p>Hecho para la comunidad tech.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
