-- Tabla de Usuarios
CREATE TABLE Users (
    id bigint primary key generated always as identity,
    username text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    role text CHECK (role IN ('admin', 'farmer', 'viewer')) DEFAULT 'farmer',
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);
-- Tabla de Invernaderos
CREATE TABLE Greenhouses (
    id bigint primary key generated always as identity,
    user_id bigint NOT NULL,
    name text NOT NULL,
    location text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);
-- Tabla de Semillas
CREATE TABLE Seeds (
    id bigint primary key generated always as identity,
    seed_name text NOT NULL,
    scientific_name text,
    description text,
    days_to_harvest int,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);
-- Tabla de Áreas de Semilla
CREATE TABLE SeedAreas (
    id bigint primary key generated always as identity,
    greenhouse_id bigint NOT NULL,
    seed_id bigint NOT NULL,
    name text NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (greenhouse_id) REFERENCES Greenhouses(id),
    FOREIGN KEY (seed_id) REFERENCES Seeds(id)
);
-- Tabla de Dispositivos
CREATE TABLE Devices (
    id bigint primary key generated always as identity,
    sensor_type text CHECK (sensor_type IN ('suelo', 'ambiente')) NOT NULL,
    location text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);
-- Tabla de Asignaciones de Dispositivos
CREATE TABLE DeviceAssignments (
    id bigint primary key generated always as identity,
    seed_area_id bigint NOT NULL,
    sensor_id bigint NOT NULL,
    assigned_at timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seed_area_id) REFERENCES SeedAreas(id),
    FOREIGN KEY (sensor_id) REFERENCES Devices(id)
);
-- Tabla de Datos de Dispositivos
CREATE TABLE DeviceData (
    id bigint primary key generated always as identity,
    sensor_id bigint,
    timestamp timestamp DEFAULT CURRENT_TIMESTAMP,
    soil_moisture decimal(5, 2),
    air_humidity decimal(5, 2),
    temperature decimal(5, 2),
    FOREIGN KEY (sensor_id) REFERENCES Devices(id)
);
-- Tabla de Parámetros Ideales por Semilla
CREATE TABLE SeedParameters (
    id bigint primary key generated always as identity,
    seed_id bigint NOT NULL,
    min_soil_moisture decimal(5, 2),
    max_soil_moisture decimal(5, 2),
    min_air_humidity decimal(5, 2),
    max_air_humidity decimal(5, 2),
    min_temperature decimal(5, 2),
    max_temperature decimal(5, 2),
    daily_water_ml int,
    sun_exposure_hours int,
    FOREIGN KEY (seed_id) REFERENCES Seeds(id)
);
-- Tabla de Modos de Operación
CREATE TABLE Modes (
    id bigint primary key generated always as identity,
    mode_name text NOT NULL,
    description text,
    seed_id bigint NOT NULL,
    conditions json,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seed_id) REFERENCES Seeds(id)
);
-- Tabla de Alertas
CREATE TABLE Alerts (
    id bigint primary key generated always as identity,
    seed_area_id bigint NOT NULL,
    sensor_data_id bigint NOT NULL,
    message text,
    severity text CHECK (severity IN ('info', 'warning', 'critical')),
    resolved boolean DEFAULT FALSE,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seed_area_id) REFERENCES SeedAreas(id),
    FOREIGN KEY (sensor_data_id) REFERENCES DeviceData(id)
);
-- Tabla de Riego Programado
CREATE TABLE IrrigationSchedule (
    id bigint primary key generated always as identity,
    seed_id bigint NOT NULL,
    start_time time,
    frequency_hours int,
    water_amount_ml int,
    enabled boolean DEFAULT TRUE,
    FOREIGN KEY (seed_id) REFERENCES Seeds(id)
);