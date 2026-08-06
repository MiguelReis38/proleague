import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.miguelreis.proleague',
  appName: 'ProLeague',
  webDir: 'app-shell',
  server: {
    // Aponta para o seu site na Vercel — qualquer atualização no site
    // reflete automaticamente no app sem precisar publicar nova versão
    url: 'https://proleague-kappa.vercel.app',
    cleartext: false,
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#09090b', // zinc-950 — igual ao fundo do site
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#09090b',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#09090b',
    },
  },
};

export default config;
