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
      serverClientId: '524253422941-f3glrvsqhn01uce91ku3lvv3e6abbvp4.apps.googleusercontent.com',
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
