# Guía de Configuración del Proyecto

## Opciones de Base de Datos

Este proyecto puede funcionar con diferentes bases de datos. Elige la opción que mejor se adapte a tu situación:

### Opción 1: PostgreSQL Local (Recomendado para Producción)

**Requisitos:**
- PostgreSQL instalado en tu equipo
- Puerto 5432 disponible

**Configuración:**
1. Instala PostgreSQL desde: https://www.postgresql.org/download/
2. Crea una base de datos:
   ```sql
   CREATE DATABASE ecommerce_shoes;
   ```
3. En tu archivo `.env`:
   ```env
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/ecommerce_shoes?schema=public"
   ```

### Opción 2: PostgreSQL en la Nube (Recomendado para Desarrollo)

**Servicios gratuitos disponibles:**
- **Supabase**: https://supabase.com (500MB gratis)
- **Neon**: https://neon.tech (512MB gratis)
- **Railway**: https://railway.app (500MB gratis)
- **Render**: https://render.com (90 días gratis)

**Pasos:**
1. Crea una cuenta en cualquiera de estos servicios
2. Crea una nueva base de datos PostgreSQL
3. Copia la URL de conexión que te proporcionan
4. En tu archivo `.env`:
   ```env
   DATABASE_URL="postgresql://usuario:contraseña@host:5432/database?schema=public"
   ```

### Opción 3: SQLite (Más Fácil, Sin Instalación)

**Ventajas:**
- No requiere instalación de servidor de base de datos
- Perfecto para desarrollo y pruebas
- Archivo de base de datos local

**Pasos:**
1. Cambia el `provider` en `prisma/schema.prisma` de `postgresql` a `sqlite`
2. En tu archivo `.env`:
   ```env
   DATABASE_URL="file:./dev.db"
   ```

**Nota:** SQLite tiene algunas limitaciones comparado con PostgreSQL, pero funciona perfectamente para desarrollo.

## Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Crear Archivo .env

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Base de datos (elige una de las opciones arriba)
DATABASE_URL="tu-url-de-base-de-datos"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genera-un-secret-aleatorio-aqui"

# App
NODE_ENV="development"
```

**Para generar NEXTAUTH_SECRET:**
- En Linux/Mac: `openssl rand -base64 32`
- En Windows: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

### 3. Configurar Base de Datos

```bash
# Generar cliente Prisma
npm run db:generate

# Crear tablas en la base de datos
npm run db:push

# O usar migraciones (recomendado para PostgreSQL)
npm run db:migrate

# Poblar con datos de ejemplo
npm run db:seed
```

### 4. Iniciar Servidor

```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:3000

## Usuarios de Prueba

Después de ejecutar `npm run db:seed`, puedes usar:

**Administrador:**
- Email: `admin@example.com`
- Password: `admin123`

**Usuario:**
- Email: `user@example.com`
- Password: `user123`

## Solución de Problemas

### Error: "Can't reach database server"
- Verifica que PostgreSQL esté corriendo
- Verifica la URL en `.env`
- Verifica credenciales de usuario

### Error: "P1001: Can't reach database server"
- Si usas PostgreSQL en la nube, verifica que la IP esté permitida
- Algunos servicios requieren habilitar conexiones externas

### Error: "Environment variable not found: DATABASE_URL"
- Asegúrate de que el archivo `.env` existe en la raíz del proyecto
- Verifica que no tenga espacios extra o comillas incorrectas

## Guardar y Cargar el Proyecto

### Para Guardar (Git)

El proyecto ya está configurado con `.gitignore` que excluye:
- `node_modules/`
- `.env` (archivos sensibles)
- `.next/` (build files)

**Pasos para versionar:**
```bash
git init
git add .
git commit -m "Initial commit"
```

### Para Cargar en Otro Equipo

1. Clona o copia el proyecto
2. Instala dependencias: `npm install`
3. Crea archivo `.env` con tus credenciales
4. Ejecuta: `npm run db:generate && npm run db:push && npm run db:seed`
5. Inicia: `npm run dev`

## Migrar de SQLite a PostgreSQL

Si empezaste con SQLite y quieres migrar a PostgreSQL:

1. Cambia `provider` en `schema.prisma` a `postgresql`
2. Actualiza `DATABASE_URL` en `.env`
3. Ejecuta: `npm run db:generate && npm run db:push`
4. (Opcional) Exporta datos de SQLite e impórtalos a PostgreSQL
