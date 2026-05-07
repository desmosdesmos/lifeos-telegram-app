import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lumina.lifeos',
  appName: 'Lumina LifeOS',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: ['lumina-server-one.vercel.app', '*.vercel.app'],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0B0B0F',
      showSpinner: false,
      splashImmersive: true
    }
  },
  android: {
    buildOptions: {
      javaVersion: '17'
    }
  }
};

export default config;
