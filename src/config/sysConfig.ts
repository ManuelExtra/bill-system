export default {
  APP_NAME: '',
  APP_DESCRIPTION: '',
  APP_LOGO: '',
  HTTP_TIMEOUT: 5000,
  FLW_BASE_URL: 'https://api.flutterwave.com/v3',
  // FLW_SECRET_KEY: '',
  // FLW_BASE_URL: 'https://api.flutterwave.com/v3',
  FLW_PUBLIC_KEY: 'FLWPUBK_TEST-58249b920ffb53f48c8855cc96c32e80-X',
  // FLW_PUBLIC_KEY:"FLWPUBK-83f7d4b1928d46c5e8e3766e310fea4b-X",
  FLW_SECRET_KEY: 'FLWSECK_TEST-555922541cf4f50eaf1db24f3882263d-X',
  // FLW_SECRET_KEY:"FLWSECK-a54844e1aad845b60a65b74def506511-X",
  // FLW_ENCRYPTION_KEY:"a54844e1aad8936af467d873",
  FLW_ENCRYPTION_KEY: 'FLWSECK_TESTb3a6111b9e62',
  AUTH_SERVICE_URL: 'http://127.0.0.1:3000/auth-service',
  // AUTH_SERVICE_URL: 'https://stashbox-auth.victornwadinobi.com/',
  ENTITY_CODE_LENGTH: 5,
  MAXIMUM_NUMBER_OF_IMAGES_TO_UPLOAD: 5,
  VALID_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'pdf'],
  MAX_UPLOAD_IMAGE_SIZE: 50 * 1024 * 1024, // Bytes
  // User Types and their roles with scopes
  product: {
    core: 'STBOX-CORE',
    admin: 'STBOX-ADMIN',
  },
};
