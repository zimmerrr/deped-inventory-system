export function useConfig() {
  return {
    ...process.env,
    API_HOST: process.env.API_HOST,
    API_URL: process.env.APP_URL,
  }
}
