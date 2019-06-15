export const isProduction = process.env.NODE_ENV === 'production'

export const CLIENT_ID = process.env.VUE_APP_CLIENT_ID

export const OAUTH_HOST = process.env.VUE_APP_OAUTH_HOST

export const BASE_URL = isProduction ? '/api' : '/api'

export const MIXIN_HOST = 'https://api.mixin.one'

export const EOS_ASSET_ID = '6cfe566e-4aad-470b-8c9a-2fd35b49c68d'