-- Migrations will appear here as you chat with AI
create table users (
    id bigint primary key generated always as identity,
    username text unique not null,
    password_hash text not null,
    role text check (role in ('admin', 'farmer', 'viewer')) default 'farmer',
    created_at timestamp default current_timestamp
);
create table greenhouses (
    id bigint primary key generated always as identity,
    user_id bigint not null,
    name text not null,
    location text,
    created_at timestamp default current_timestamp,
    foreign key (user_id) references users (id)
);
create table seeds (
    id bigint primary key generated always as identity,
    seed_name text not null,
    scientific_name text,
    description text,
    days_to_harvest int,
    created_at timestamp default current_timestamp
);
create table seedareas (
    id bigint primary key generated always as identity,
    greenhouse_id bigint not null,
    seed_id bigint not null,
    name text not null,
    created_at timestamp default current_timestamp,
    foreign key (greenhouse_id) references greenhouses (id),
    foreign key (seed_id) references seeds (id)
);
create table devices (
    id bigint primary key generated always as identity,
    sensor_type text check (sensor_type in ('suelo', 'ambiente')) not null,
    location text,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);
create table deviceassignments (
    id bigint primary key generated always as identity,
    seed_area_id bigint not null,
    sensor_id bigint not null,
    assigned_at timestamp default current_timestamp,
    foreign key (seed_area_id) references seedareas (id),
    foreign key (sensor_id) references devices (id)
);
create table devicedata (
    id bigint primary key generated always as identity,
    sensor_id bigint,
    "timestamp" timestamp default current_timestamp,
    soil_moisture numeric(5, 2),
    air_humidity numeric(5, 2),
    temperature numeric(5, 2),
    foreign key (sensor_id) references devices (id)
);
create table seedparameters (
    id bigint primary key generated always as identity,
    seed_id bigint not null,
    min_soil_moisture numeric(5, 2),
    max_soil_moisture numeric(5, 2),
    min_air_humidity numeric(5, 2),
    max_air_humidity numeric(5, 2),
    min_temperature numeric(5, 2),
    max_temperature numeric(5, 2),
    daily_water_ml int,
    sun_exposure_hours int,
    foreign key (seed_id) references seeds (id)
);
create table modes (
    id bigint primary key generated always as identity,
    mode_name text not null,
    description text,
    seed_id bigint not null,
    conditions json,
    created_at timestamp default current_timestamp,
    foreign key (seed_id) references seeds (id)
);
create table alerts (
    id bigint primary key generated always as identity,
    seed_area_id bigint not null,
    sensor_data_id bigint not null,
    message text,
    severity text check (severity in ('info', 'warning', 'critical')),
    resolved boolean default false,
    created_at timestamp default current_timestamp,
    foreign key (seed_area_id) references seedareas (id),
    foreign key (sensor_data_id) references devicedata (id)
);
create table irrigationschedule (
    id bigint primary key generated always as identity,
    seed_id bigint not null,
    start_time time,
    frequency_hours int,
    water_amount_ml int,
    enabled boolean default true,
    foreign key (seed_id) references seeds (id)
);