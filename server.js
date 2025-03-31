import express from "express";
import cors from "cors";
import { config } from "dotenv";
import bcrypt from "bcryptjs";
import pg from "pg";
import jwt from "jsonwebtoken";

config();

const app = express();
const PORT = process.env.PORT || 5000;

function authenticateJWT(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Acceso denegado. No se proporcionó el token." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }
    req.user = user;
    next();
  });
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error al conectar a PostgreSQL:", err);
  } else {
    console.log("Conexión a PostgreSQL establecida:", res.rows[0]);
  }
});

// Rutas de autenticación
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      // Usuario no encontrado
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const user = userResult.rows[0];

    if (!user.password_hash || !user.password_hash.startsWith("$2")) {
      console.error("Formato de hash inválido:", user.password_hash);
      return res
        .status(500)
        .json({ message: "Error en la configuración de contraseñas" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    // Verificación de contraseña

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    // Token generado correctamente

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Middleware para verificar autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No autorizado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }

    req.user = user;
    next();
  });
};

// Ruta protegida para obtener datos del usuario
app.get("/api/auth/profile", authenticateToken, (req, res) => {
  res.json(req.user);
});

// Ruta para obtener usuarios
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

// Ruta para crear un usuario
app.post("/api/users", async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUserResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUserResult.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "El usuario ya existe con ese correo electrónico" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar nuevo usuario en la base de datos
    const insertUserResult = await pool.query(
      "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, role]
    );

    const newUser = insertUserResult.rows[0];

    // Generar un token JWT para el nuevo usuario
    const token = jwt.sign(
      {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Responder con el usuario y el token
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res.status(500).json({ message: "Error al crear el usuario" });
  }
});

// Ruta para obtener invernaderos
app.get("/api/greenhouses", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM greenhouses");
    res.json(result.rows); // Devolver todos los invernaderos
  } catch (error) {
    console.error("Error al obtener invernaderos:", error);
    res.status(500).json({ message: "Error al obtener invernaderos" });
  }
});

// Ruta para obtener un invernadero específico por ID
app.get("/api/greenhouses/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      "SELECT * FROM greenhouses WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Invernadero no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener el invernadero:", error);
    res.status(500).json({ message: "Error al obtener el invernadero" });
  }
});

app.get("/api/greenhouse", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "SELECT * FROM greenhouses WHERE user_id = $1 LIMIT 1", // Asegúrate de que tengas la relación entre usuario e invernadero en tu base de datos
      [userId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró un invernadero para este usuario." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener el invernadero:", error);
    res.status(500).json({ message: "Error al obtener el invernadero." });
  }
});

// Ruta para crear un nuevo invernadero
app.post("/api/greenhouses", async (req, res) => {
  const { name, location, user_id } = req.body;

  if (!name || !location || !user_id) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const newGreenhouse = await pool.query(
      "INSERT INTO greenhouses (name, location, user_id) VALUES ($1, $2, $3) RETURNING *",
      [name, location, user_id]
    );

    res.json(newGreenhouse.rows[0]);
  } catch (error) {
    console.error("Error al crear el invernadero:", error);
    res.status(500).json({ message: "Error al crear el invernadero" });
  }
});

// Ruta para obtener dispositivos
app.get("/api/devices", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, sensor_type, location, created_at, updated_at FROM devices");
    res.json(result.rows); // Devolver todos los dispositivos
  } catch (error) {
    console.error("Error al obtener dispositivos:", error);
    res.status(500).json({ message: "Error al obtener dispositivos" });
  }
});

// Ruta para controlar dispositivos
app.post("/api/control/:greenhouseId", async (req, res) => {
  const { greenhouseId } = req.params;
  const { action } = req.body; // Acciones como "encender", "apagar", etc.

  if (!action) {
    return res.status(400).json({ message: "Acción no proporcionada" });
  }

  try {
    // Aquí debes manejar la lógica para controlar el dispositivo
    // Esto depende de cómo estés controlando los dispositivos en tu aplicación
    console.log(
      `Controlando dispositivo en invernadero ${greenhouseId} con acción: ${action}`
    );

    // Simulamos el control exitoso de la acción
    // Puedes reemplazar este código con lógica real para encender o apagar dispositivos
    res.json({ message: `Acción ${action} realizada con éxito` });
  } catch (error) {
    console.error("Error al controlar dispositivo:", error);
    res.status(500).json({ message: "Error al controlar dispositivo" });
  }
});

// Ruta para obtener dispositivos por invernadero
app.get("/api/greenhouses/:greenhouseId/devices", async (req, res) => {
  const { greenhouseId } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, sensor_type, location, created_at, updated_at FROM devices WHERE greenhouse_id = $1",
      [greenhouseId]
    );
    res.json(result.rows); // Devolver todos los dispositivos del invernadero específico
  } catch (error) {
    console.error("Error al obtener dispositivos del invernadero:", error);
    res
      .status(500)
      .json({ message: "Error al obtener dispositivos del invernadero" });
  }
});

// Ruta para crear un dispositivo
app.post("/api/devices", async (req, res) => {
  const { sensor_type, location, greenhouse_id } = req.body;

  if (!sensor_type || !location || !greenhouse_id) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const newDevice = await pool.query(
      "INSERT INTO devices (sensor_type, location, greenhouse_id) VALUES ($1, $2, $3) RETURNING *",
      [sensor_type, location, greenhouse_id]
    );

    res.json(newDevice.rows[0]);
  } catch (error) {
    console.error("Error al crear el dispositivo:", error);
    res.status(500).json({ message: "Error al crear el dispositivo" });
  }
});

// Ruta para asignar dispositivos a áreas de semillas
app.post("/api/device-assignments", async (req, res) => {
  const { seed_area_id, sensor_id } = req.body;

  if (!seed_area_id || !sensor_id) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    // Verificar si el dispositivo existe
    const deviceCheck = await pool.query("SELECT id, sensor_type, location, created_at, updated_at FROM devices WHERE id = $1", [sensor_id]);
    if (deviceCheck.rows.length === 0) {
      return res.status(404).json({ message: "Dispositivo no encontrado" });
    }

    // Verificar si el área de semilla existe
    const seedAreaCheck = await pool.query("SELECT * FROM seed_areas WHERE id = $1", [seed_area_id]);
    if (seedAreaCheck.rows.length === 0) {
      return res.status(404).json({ message: "Área de semilla no encontrada" });
    }

    // Verificar asignación existente
    const existingAssignment = await pool.query(
      "SELECT * FROM device_assignments WHERE sensor_id = $1",
      [sensor_id]
    );
    if (existingAssignment.rows.length > 0) {
      return res.status(400).json({ message: "El dispositivo ya está asignado a un área" });
    }

    const newAssignment = await pool.query(
      "INSERT INTO device_assignments (seed_area_id, sensor_id) VALUES ($1, $2) RETURNING *",
      [seed_area_id, sensor_id]
    );

    res.status(201).json(newAssignment.rows[0]);
  } catch (error) {
    console.error("Error al asignar el dispositivo:", error);
    res.status(500).json({ message: "Error al asignar el dispositivo" });
  }
});

// Ruta para obtener datos de sensores
app.get("/api/sensordata", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sensor_data ORDER BY created_at DESC LIMIT 10"
    );
    res.json(result.rows); // Devolver los últimos datos de los sensores
  } catch (error) {
    console.error("Error al obtener datos de sensores:", error);
    res.status(500).json({ message: "Error al obtener datos de los sensores" });
  }
});

// Ruta para guardar los datos de los sensores
app.post("/api/sensordata", async (req, res) => {
  const { temperature, humidity, device_id } = req.body;

  if (!temperature || !humidity || !device_id) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  try {
    const newSensorData = await pool.query(
      "INSERT INTO sensor_data (temperature, humidity, device_id, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [temperature, humidity, device_id]
    );

    console.log(
      `📡 Datos recibidos: Temp: ${temperature}°C, Humedad: ${humidity}%`
    );
    res.json({
      message: "Datos guardados correctamente",
      data: newSensorData.rows[0],
    });
  } catch (error) {
    console.error("Error al guardar datos del sensor:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
