import 'dotenv/config';

type AppConfig = {
  serverPort: string | undefined;
  serverUrl: string | undefined;
  db: {
    host: string | undefined;
    port: string | undefined;
    username: string | undefined;
    password: string | undefined;
    database: string | undefined;
    dialect: 'postgres';
    ssl: string | undefined;
    dbUrl: string | undefined;
  };
  secretKey: string;
  jwtExpiration: string | number;
  clientUrl: string | undefined;
  googleClientId: string | undefined;
  googleSecretClient: string | undefined;
  encryptionKey: string | undefined;
  redirectUri: string | undefined;
  env: 'development' | 'production';
};

const env = (process.env.NODE_ENV as 'development' | 'production') || 'development';

const baseConfig: Record<'development' | 'production', AppConfig> = {
  development: {
    serverPort: process.env.SERVER_PORT,
    serverUrl: process.env.SERVER_URL,
    db: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
      dialect: 'postgres',
      ssl: process.env.SSL_REQUIRED,
      dbUrl: process.env.DB_URL,
    },
    secretKey: process.env.SECRET_KEY || '', // fallback so TS doesn't complain
    jwtExpiration: process.env.JWT_EXPIRATION || '1d',
    clientUrl: process.env.CLIENT_URL,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleSecretClient: process.env.GOOGLE_CLIENT_SECRET,
    encryptionKey: process.env.ENCRYPTION_KEY,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
    env,
  },
  production: {
    serverPort: process.env.SERVER_PORT,
    serverUrl: process.env.SERVER_URL,
    db: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
      dialect: 'postgres',
      ssl: process.env.SSL_REQUIRED,
      dbUrl: process.env.DB_URL,
    },
    secretKey: process.env.SECRET_KEY || '',
    jwtExpiration: process.env.JWT_EXPIRATION || '1d',
    clientUrl: process.env.CLIENT_URL,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleSecretClient: process.env.GOOGLE_CLIENT_SECRET,
    encryptionKey: process.env.ENCRYPTION_KEY,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
    env,
  },
};

const config = baseConfig[env];

// if (!config.secretKey || !config.jwtExpiration) {
//   throw new Error('Missing SECRET_KEY in environment variables');
// }

export default config;
