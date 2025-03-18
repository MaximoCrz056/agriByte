import express from "express";
import cors from "cors";
import { config } from "dotenv";
import bcrypt from "bcryptjs";
import pg from "pg";
import jwt from "jsonwebtoken";

// Cargar variables de entorno
config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la conexión a PostgreSQL
const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Verificar conexión a la base de datos
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
  console.log("Recibiendo datos:", email);

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    console.log("Resultado de la consulta:", userResult.rows);

    if (userResult.rows.length === 0) {
      console.log("Usuario no encontrado");
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
    console.log("¿Contraseña válida?", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log("Token generado:", token);

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
    res.json(result.rows); // Devolver todos los usuarios
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

//Ruta oara crear un nuevo invernadero
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
    const result = await pool.query("SELECT * FROM Devices");
    res.json(result.rows); // Devolver todos los dispositivos
  } catch (error) {
    console.error("Error al obtener dispositivos:", error);
    res.status(500).json({ message: "Error al obtener dispositivos" });
  }
});

// Ruta para obtener dispositivos por invernadero
app.get("/api/greenhouses/:greenhouseId/devices", async (req, res) => {
  const { greenhouseId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Devices WHERE greenhouse_id = $1",
      [greenhouseId]
    );
    res.json(result.rows); // Devolver todos los dispositivos
  } catch (error) {
    console.error("Error al obtener dispositivos:", error);
    res.status(500).json({ message: "Error al obtener dispositivos" });
  }
});

// ESP32 API
app.post("/api/greenhouses/:greenhouseId/devices", async (req, res) => {
  const { sensor_type, location } = req.body;
  const { greenhouseId } = req.params;

  if (!sensor_type || !location) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const newDevice = await pool.query(
      "INSERT INTO Devices (sensor_type, location, greenhouse_id) VALUES ($1, $2, $3) RETURNING *",
      [sensor_type, location, greenhouseId]
    );

    res.status(201).json(newDevice.rows[0]);
  } catch (error) {
    console.error("Error al registrar el ESP32:", error);
    res.status(500).json({ message: "Error al registrar el ESP32" });
  }
});

// Datos de los sensores
app.post("/api/sensordata", async (req, res) => {
  const { temperature, humidity } = req.body;

  if (!temperature || !humidity) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  try {
    await pool.query(
      "INSERT INTO sensor_data (temperature, humidity, created_at) VALUES ($1, $2, NOW())",
      [temperature, humidity]
    );

    console.log(
      `📡 Datos recibidos: Temp: ${temperature}°C, Humedad: ${humidity}%`
    );
    res.json({ message: "Datos guardados correctamente" });
  } catch (error) {
    console.error("Error al guardar datos del sensor:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
