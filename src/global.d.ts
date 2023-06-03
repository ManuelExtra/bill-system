declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_NAME: string;
      SERVICE_NAME: string;
      DB_URL: string;
      DB_USER: string;
      DB_PASS: string;
      PORT: string;
      REDIS_URL: string;
      SMS_API_URL: string;
      SMS_APP_ID: string;
      SMS_APP_SECRET: string;
      MAILJET_PUBLIC_API_KEY: string;
      MAILJET_PRIVATE_API_KEY: string;
      SENDER_EMAIL: string;
      POSTMARK_API_KEY: string;
      ENCRYPTION_KEY: string;
      FLW_PUBLIC_KEY: string;
      FLW_SECRET_KEY: string;
      FLW_ENCRYPTION_KEY: string;
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
    }
  }
}

export {}
