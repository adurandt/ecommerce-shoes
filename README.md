# Ecommerce de Zapatos

Un ecommerce completo para venta de zapatos construido con Next.js, Shadcn UI, Prisma y PostgreSQL.

## Características

- 🏠 **Landing Page** - Página de inicio atractiva con productos destacados
- 🛍️ **Catálogo de Productos** - Búsqueda, filtros y paginación
- 🛒 **Carrito de Compras** - Gestión completa del carrito
- 💳 **Checkout** - Proceso de compra completo
- 👤 **Autenticación** - Sistema de login y registro con NextAuth.js
- 📊 **Dashboard Administrativo** - Panel de control completo para administradores
  - Estadísticas generales
  - Gestión de productos (CRUD)
  - Gestión de órdenes
  - Analytics con gráficos

## Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Shadcn UI** - Componentes UI modernos
- **Prisma** - ORM para base de datos
- **PostgreSQL** - Base de datos relacional
- **NextAuth.js** - Autenticación
- **Recharts** - Gráficos para analytics
- **Tailwind CSS** - Estilos

## Configuración Rápida

### Opción A: SQLite (Sin Instalación de Base de Datos)

**Perfecto si no tienes PostgreSQL instalado:**

1. Cambia `provider = "postgresql"` a `provider = "sqlite"` en `prisma/schema.prisma`
2. Crea `.env` con:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="genera-un-secret-aleatorio"
   NODE_ENV="development"
   ```
3. Ejecuta:
   ```bash
   npm install
   npm run db:generate
   npm run db:push
   npm run db:seed
   npm run dev
   ```

### Opción B: PostgreSQL Local

**Requisitos:** PostgreSQL instalado

1. Crea `.env` con:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce_shoes?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="genera-un-secret-aleatorio"
   NODE_ENV="development"
   ```
2. Ejecuta:
   ```bash
   npm install
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

### Opción C: PostgreSQL en la Nube (Gratis)

**Servicios recomendados:** Supabase, Neon, Railway

1. Crea una base de datos en el servicio elegido
2. Copia la URL de conexión
3. Crea `.env` con la URL proporcionada
4. Ejecuta los mismos comandos que en Opción B

**📖 Para instrucciones detalladas, ver [SETUP.md](SETUP.md) o [INSTRUCCIONES_RAPIDAS.md](INSTRUCCIONES_RAPIDAS.md)**

## Usuarios de Prueba

Después de ejecutar el seed, puedes usar estas credenciales:

**Administrador:**
- Email: `admin@example.com`
- Password: `admin123`

**Usuario:**
- Email: `user@example.com`
- Password: `user123`

## Estructura del Proyecto

```
ecommerce-shoes/
├── prisma/
│   ├── schema.prisma      # Modelos de base de datos
│   └── seed.ts            # Datos de ejemplo
├── src/
│   ├── app/
│   │   ├── (auth)/        # Rutas de autenticación
│   │   ├── (public)/      # Rutas públicas
│   │   ├── (dashboard)/   # Dashboard admin
│   │   └── api/           # API routes
│   ├── components/
│   │   ├── ui/            # Componentes Shadcn
│   │   ├── layout/        # Header, Footer
│   │   └── product/       # Componentes de productos
│   ├── lib/
│   │   ├── prisma.ts      # Cliente Prisma
│   │   └── auth.ts        # Configuración NextAuth
│   └── types/             # Tipos TypeScript
└── public/                 # Assets estáticos
```

## Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run start` - Inicia servidor de producción
- `npm run db:generate` - Genera cliente Prisma
- `npm run db:migrate` - Ejecuta migraciones
- `npm run db:seed` - Pobla base de datos
- `npm run db:studio` - Abre Prisma Studio

## Licencia

MIT
