# 📦 Cómo Guardar y Cargar el Proyecto

## ✅ El Proyecto Está Listo para Guardar

Todos los archivos necesarios están creados. El archivo `.gitignore` ya está configurado para excluir archivos sensibles.

## 🔐 Archivos que NO se Guardan (Por Seguridad)

- `.env` - Contiene credenciales de base de datos
- `node_modules/` - Dependencias (se reinstalan)
- `.next/` - Archivos de build

## 📝 Pasos para Guardar el Proyecto

### Opción 1: Usando Git (Recomendado)

```bash
# Inicializar repositorio Git
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Proyecto ecommerce zapatos completo"

# (Opcional) Subir a GitHub/GitLab
git remote add origin https://github.com/tu-usuario/ecommerce-shoes.git
git push -u origin main
```

### Opción 2: Copiar Carpeta Manualmente

1. Copia toda la carpeta `ecommerce-shoes` a:
   - USB
   - Disco externo
   - Servicio en la nube (Google Drive, Dropbox, OneDrive)
   - Otro equipo por red

2. **IMPORTANTE:** No olvides crear el archivo `.env` en el nuevo equipo

## 🚀 Cargar el Proyecto en Otro Equipo

### Paso 1: Obtener el Proyecto

- Si usaste Git: `git clone <url-del-repositorio>`
- Si copiaste manualmente: Copia la carpeta al nuevo equipo

### Paso 2: Instalar Dependencias

```bash
cd ecommerce-shoes
npm install
```

### Paso 3: Configurar Base de Datos

**Elige una opción:**

#### A) SQLite (Más Fácil - Sin Instalación)

1. Edita `prisma/schema.prisma`:
   - Cambia `provider = "postgresql"` a `provider = "sqlite"`

2. Crea `.env`:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="genera-un-secret-aleatorio"
   NODE_ENV="development"
   ```

3. Ejecuta:
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

#### B) PostgreSQL Local

1. Instala PostgreSQL
2. Crea base de datos: `CREATE DATABASE ecommerce_shoes;`
3. Crea `.env` con tus credenciales
4. Ejecuta: `npm run db:generate && npm run db:migrate && npm run db:seed`

#### C) PostgreSQL en la Nube (Gratis)

1. Crea cuenta en Supabase/Neon/Railway
2. Crea base de datos
3. Copia URL de conexión
4. Crea `.env` con la URL
5. Ejecuta: `npm run db:generate && npm run db:push && npm run db:seed`

### Paso 4: Iniciar

```bash
npm run dev
```

## 📋 Checklist Antes de Guardar

- [x] Todos los archivos de código están creados
- [x] `.gitignore` está configurado
- [x] `package.json` tiene todas las dependencias
- [x] `prisma/schema.prisma` está completo
- [x] Archivos de documentación creados (README, SETUP, etc.)
- [ ] **TÚ:** Crear `.env` en el nuevo equipo (no se guarda por seguridad)

## 🔑 Generar NEXTAUTH_SECRET

En el nuevo equipo, genera un secret aleatorio:

**Windows:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

## 📚 Documentación Incluida

- `README.md` - Información general del proyecto
- `SETUP.md` - Guía detallada de configuración
- `INSTRUCCIONES_RAPIDAS.md` - Inicio rápido
- `COMO_GUARDAR_PROYECTO.md` - Este archivo

## ⚠️ Recordatorios Importantes

1. **NUNCA** subas el archivo `.env` a un repositorio público
2. **SIEMPRE** crea un nuevo `.env` en cada equipo
3. Si usas SQLite, el archivo `dev.db` se creará automáticamente
4. Si usas PostgreSQL en la nube, guarda la URL de conexión de forma segura

## 🆘 Problemas Comunes

**"No se encuentra el módulo"**
→ Ejecuta `npm install`

**"Can't reach database server"**
→ Verifica `.env` y que la base de datos esté corriendo

**"Environment variable not found"**
→ Asegúrate de que `.env` existe en la raíz del proyecto
