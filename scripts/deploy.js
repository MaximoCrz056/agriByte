// Script de despliegue para entorno de producción
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

// Configuración
const config = {
  envFile: '.env.production',
  buildCommand: 'npm run build',
  serverStartCommand: 'node server.js',
  distFolder: 'dist',
};

// Función para ejecutar comandos
const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    console.log(`Ejecutando: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
      resolve(stdout);
    });
  });
};

// Función principal de despliegue
const deploy = async () => {
  try {
    // 1. Verificar que existe el archivo .env.production
    if (!fs.existsSync(path.resolve(config.envFile))) {
      throw new Error(`El archivo ${config.envFile} no existe. Crea este archivo antes de continuar.`);
    }

    // 2. Copiar .env.production a .env para el despliegue
    fs.copyFileSync(path.resolve(config.envFile), path.resolve('.env'));
    console.log('Variables de entorno de producción configuradas correctamente.');

    // 3. Instalar dependencias
    await runCommand('npm install --production');
    console.log('Dependencias instaladas correctamente.');

    // 4. Construir la aplicación
    await runCommand(config.buildCommand);
    console.log('Aplicación construida correctamente.');

    // 5. Verificar que la carpeta dist existe
    if (!fs.existsSync(path.resolve(config.distFolder))) {
      throw new Error(`La carpeta ${config.distFolder} no existe después de la construcción.`);
    }

    // 6. Iniciar el servidor
    console.log('Iniciando el servidor en modo producción...');
    await runCommand(config.serverStartCommand);
  } catch (error) {
    console.error('Error durante el despliegue:', error);
    process.exit(1);
  }
};

// Ejecutar el despliegue
deploy();