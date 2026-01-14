import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">ShoesStore</h3>
            <p className="text-sm text-muted-foreground">
              Tu tienda de zapatos de confianza. Encuentra el par perfecto para cada ocasión.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold">Categorías</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=deportivos" className="text-muted-foreground hover:text-foreground">
                  Deportivos
                </Link>
              </li>
              <li>
                <Link href="/products?category=casuales" className="text-muted-foreground hover:text-foreground">
                  Casuales
                </Link>
              </li>
              <li>
                <Link href="/products?category=formales" className="text-muted-foreground hover:text-foreground">
                  Formales
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold">Contacto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: info@shoesstore.com</li>
              <li>Teléfono: +34 123 456 789</li>
              <li>Dirección: Calle Principal 123</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ShoesStore. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
