import axios from 'axios';
import { Platform } from 'react-native';

// Para o Expo Go em dispositivo real, você precisa usar o IP da sua máquina local na rede Wi-Fi.
// Exemplo: http://192.168.0.x:3001
// Se for Emulador Android: http://10.0.2.2:3001
// Se for Emulador iOS: http://localhost:3001

// Vamos usar o IP que extraímos do seu log anterior para facilitar:
export const API_URL = 'http://192.168.18.7:3001';

export const api = axios.create({
  baseURL: API_URL,
});
