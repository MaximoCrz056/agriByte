export interface User {
    id: number;
    username: string;
    role: string;
    created_at: string;
}

export interface Greenhouse {
    id: number;
    name: string;
    location: string;
    user_id: number;
    created_at: string;
}

export interface Device {
    id: number;
    sensor_type: string;
    location: string;
    greenhouse_id: number;
    created_at: string;
}