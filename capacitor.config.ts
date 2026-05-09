import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'lumina.web',
  appName: 'Lumina LifeOS',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  backgroundColor: '#09090B',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#09090B',
      androidSplashResourceName: 'splash',
      showSpinner: false,
      splashImmersive: true
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: 'YOUR_WEB_CLIENT_ID', // Будет заменен пользователем
      forceCodeForRefreshToken: true,
    }
  },
  android: {
    buildOptions: {
      javaVersion: '17'
    }
  }
};

export default config;
