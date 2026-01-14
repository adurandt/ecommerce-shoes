# Instrucciones Rápidas - Ecommerce de Zapatos

## 🚀 Inicio Rápido (Sin PostgreSQL)

Si no tienes PostgreSQL instalado, usa **SQLite** (no requiere instalación):

### Paso 1: Cambiar a SQLite

1. Abre `prisma/schema.prisma`
2. Cambia la línea 9 de:
   ```prisma
   provider = "postgresql"
   ```
   a:
   ```prisma
   provider = "sqlite"
   ```

### Paso 2: Crear archivo .env

Crea un archivo `.env` en la raíz con:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="cambia-este-secret-por-uno-aleatorio"
NODE_ENV="development"
```

**Generar secret aleatorio:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Paso 3: Instalar y Configurar

```bash
# Instalar dependencias
npm install

# Generar cliente Prisma
npm run db:generate

# Crear base de datos y tablas
npm run db:push

# Poblar con datos de ejemplo
npm run db:seed
```

### Paso 4: Iniciar

```bash
npm run dev
```

Abre: http://localhost:3000

## 👤 Usuarios de Prueba

- **Admin**: `admin@example.com` / `admin123`
- **Usuario**: `user@example.com` / `user123`

## 📦 Guardar el Proyecto

El proyecto está listo para guardar. El archivo `.gitignore` ya excluye:
- `node_modules/`
- `.env` (no se sube por seguridad)
- Archivos de build

**Para versionar:**
```bash
git init
git add .
git commit -m "Proyecto ecommerce zapatos"
```

## 🔄 Cargar en Otro Equipo

1. Copia/clona el proyecto
2. `npm install`
3. Crea `.env` (ver arriba)
4. `npm run db:generate && npm run db:push && npm run db:seed`
5. `npm run dev`

## ☁️ Opción: PostgreSQL en la Nube (Gratis)

Si prefieres PostgreSQL sin instalarlo:

1. **Supabase** (https://supabase.com) - 500MB gratis
2. **Neon** (https://neon.tech) - 512MB gratis
3. **Railway** (https://railway.app) - 500MB gratis

Crea una base de datos, copia la URL y úsala en `.env`:
```env
DATABASE_URL="postgresql://usuario:password@host:5432/database"
```

**Importante:** Si usas PostgreSQL en la nube, NO cambies el schema a SQLite, déjalo como `postgresql`.

## 📚 Más Información

Ver `SETUP.md` para instrucciones detalladas.
