import 'dotenv/config';

const env = (process.env.NODE_ENV as 'development' | 'production') || 'development';

const config = {
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
    secretKey: process.env.SECRET_KEY,
    jwtExpiration: process.env.JWT_EXPIRATION,
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
    secretKey: process.env.SECRET_KEY,
    jwtExpiration: process.env.JWT_EXPIRATION,
    clientUrl: process.env.CLIENT_URL,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleSecretClient: process.env.GOOGLE_CLIENT_SECRET,
    encryptionKey: process.env.ENCRYPTION_KEY,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
    env,
  },
};

export default config[env];
