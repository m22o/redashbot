export type Engine = 'chromium' | 'firefox' | 'webkit' | 'lambda-chromium'
type Hosts = {
  [host: string]: {
    alias: string
    key: string
    basicPassword: string
    basicUser: string
  }
}
export type Config = {
  port: number
  token: string
  signingSecret: string,
  hosts: Hosts
  browser: Engine
  sleep: number
  browserTimeout: number
  basicPassword: string
  basicUser: string
}

let hosts: Hosts
if (process.env.REDASH_HOST) {
  if (process.env.REDASH_HOST_ALIAS) {
    hosts = {
      [process.env.REDASH_HOST!]: {
        alias: process.env.REDASH_HOST_ALIAS!,
        key: process.env.REDASH_API_KEY!,
        basicPassword: process.env.REDASH_BASIC_PASSWORD!,
        basicUser:  process.env.REDASH_BASIC_USER!,
      },
    }
  } else {
    hosts = {
      [process.env.REDASH_HOST!]: {
        alias: process.env.REDASH_HOST!,
        key: process.env.REDASH_API_KEY!,
        basicPassword: process.env.REDASH_BASIC_PASSWORD!,
        basicUser:  process.env.REDASH_BASIC_USER!,
      },
    }
  }
} else {
  hosts = (process.env.REDASH_HOSTS_AND_API_KEYS || '')
    .split(',')
    .reduce((m, host_and_key) => {
      let [host, alias, key,basicPassword ,basicUser] = host_and_key.split(';')
      if (!key) {
        key = alias
        alias = host
        basicPassword = basicPassword
        basicUser = basicUser

      }
      m[host] = { alias, key,basicPassword,basicUser  }
      return m
    }, {} as Record<string, { alias: string; key: string ,basicPassword:string ,basicUser:string }>)
}

export const config: Config = {
  token: process.env.SLACK_BOT_TOKEN!,
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  browser: (process.env.BROWSER || 'chromium') as Engine,
  sleep: process.env.SLEEP_TIME ? parseFloat(process.env.SLEEP_TIME) : 1000,
  browserTimeout: process.env.BROWSER_TIMEOUT
    ? parseFloat(process.env.BROWSER_TIMEOUT)
    : process.env.SLEEP_TIME
    ? parseFloat(process.env.SLEEP_TIME)
    : 10000,
  hosts,
  basicPassword: process.env.REDASH_BASIC_PASSWORD!,
  basicUser:  process.env.REDASH_BASIC_USER!,
}
