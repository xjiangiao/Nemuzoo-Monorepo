import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const requiredR2EnvNames = [
  "R2_FILE_URL",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_ENDPOINT",
  "R2_BUCKET",
]

const missingR2EnvNames = requiredR2EnvNames.filter((name) => !process.env[name])

if (process.env.NODE_ENV === "production" && missingR2EnvNames.length) {
  console.warn(
    `Missing R2 environment variables: ${missingR2EnvNames.join(", ")}. File uploads will fail until they are configured.`
  )
}

const getR2Env = (name: string) => {
  return process.env[name] || `missing-${name.toLowerCase()}`
}

const getR2Endpoint = () => {
  return process.env.R2_ENDPOINT || "https://example.com"
}

const getR2FileUrl = () => {
  const fileUrl = process.env.R2_FILE_URL

  if (!fileUrl) {
    return "https://example.com"
  }

  return /^https?:\/\//.test(fileUrl) ? fileUrl : `https://${fileUrl}`
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: [
    {
      resolve: "@medusajs/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-s3",
            id: "r2",
            options: {
              file_url: getR2FileUrl(),
              access_key_id: getR2Env("R2_ACCESS_KEY_ID"),
              secret_access_key: getR2Env("R2_SECRET_ACCESS_KEY"),
              endpoint: getR2Endpoint(),
              bucket: getR2Env("R2_BUCKET"),
              region: "auto",
              additional_client_config: {
                forcePathStyle: true,
              },
            }
          }
        ]
      }
    }
  ]
})
