# Guía de Despliegue en Producción

Este documento proporciona instrucciones para desplegar la aplicación AgriByte en un entorno de producción.

## Requisitos Previos

- Node.js (versión 16 o superior)
- NPM (versión 8 o superior)
- PostgreSQL (configurado según las variables de entorno)

## Configuración del Entorno

1. Asegúrate de que el archivo `.env.production` esté correctamente configurado con las variables de entorno para producción:

```
# Variables de entorno para producción
PORT=5000
NODE_ENV=production

# Configuración de la base de datos PostgreSQL
DB_USER=usuario_produccion
DB_HOST=host_produccion
DB_NAME=nombre_bd_produccion
DB_PASSWORD=contraseña_produccion
DB_PORT=5432

# Configuración de JWT
JWT_SECRET=clave_secreta_produccion
```

2. Asegúrate de que la URL de la API en `src/lib/config.js` esté configurada correctamente para tu entorno de producción.

## Pasos para el Despliegue

### Método 1: Usando el Script de Despliegue

```bash
npm run deploy
```

Este comando ejecutará el script de despliegue que realizará los siguientes pasos automáticamente:
- Verificar la configuración de producción
- Instalar dependencias
- Construir la aplicación
- Iniciar el servidor en modo producción

### Método 2: Despliegue Manual

1. Instalar dependencias:

```bash
npm install --production
```

2. Construir la aplicación para producción:

```bash
npm run build:prod
```

3. Iniciar el servidor en modo producción:

```bash
npm run server:prod
```

O simplemente:

```bash
npm start
```

## Verificación del Despliegue

Una vez desplegada la aplicación, puedes verificar que está funcionando correctamente accediendo a:

- Frontend: `http://tu-dominio:5000`
- API: `http://tu-dominio:5000/api`

## Solución de Problemas

Si encuentras problemas durante el despliegue:

1. Verifica los logs del servidor
2. Asegúrate de que todas las variables de entorno estén correctamente configuradas
3. Verifica la conectividad con la base de datos
4. Comprueba que los puertos necesarios estén abiertos en tu firewall

## Mantenimiento

Para actualizar la aplicación en producción:

1. Detén el servidor actual
2. Obtén los últimos cambios del repositorio
3. Ejecuta `npm run deploy` o sigue los pasos del despliegue manual

## Seguridad

Recuerda que en producción:

- Todas las claves secretas deben ser fuertes y únicas
- La base de datos debe estar protegida con contraseñas seguras
- Considera usar HTTPS para proteger las comunicaciones
- Configura correctamente los permisos de archivos y directorios