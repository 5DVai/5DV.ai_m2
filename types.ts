export interface Message {
    id: string;
    role: 'user' | 'model' | 'system';
    text: string;
    timestamp: number;
    isStreaming?: boolean;
}

export enum AppMode {
    HOME = 'HOME',
    CONSOLE = 'CONSOLE'
}

export interface ParticleConfig {
    count: number;
    gravityThreshold: number;
    attractionStrength: number;
    swirlStrength: number;
    baseSpeed: number;
}