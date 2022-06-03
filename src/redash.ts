import axios from 'axios'

type QueryResult = {
  query_result: {
    data: {
      rows: Record<string, any>[]
      columns: { friendly_name: string; type: string; name: string }[]
    }
  }
}
type Query = {
  visualizations: Visualization[]
  name: string
}
type Visualization = {
  id: number
  name: string
}
type Dashboard = {
  name: string
  public_url: string
}

export class Redash {
  host: string
  apiKey: string
  alias: string
  basicPassword: string
  basicUser: string
  constructor({
    host,
    apiKey,
    alias,
    basicPassword,
    basicUser
  }: {
    host: string
    apiKey: string
    alias: string
    basicPassword: string
    basicUser: string


  }) {
    this.alias = alias
    this.host = host
    this.apiKey = apiKey
    this.basicPassword = basicPassword
    this.basicUser = basicUser

  }

  async getQuery(id: string): Promise<Query> {
    const res = await axios.get(`${this.alias}/api/queries/${id}`, {
      params: {
        api_key: this.apiKey,
      },
      auth: {
        username: this.basicUser,
        password: this.basicPassword
      },

    })
    return res.data
  }

  async getQueryResult(id: string): Promise<QueryResult> {
    const res = await axios.get(
      `${this.alias}/api/queries/${id}/results.json`,
      {
        params: {
          api_key: this.apiKey,
        },
        auth: {
          username: this.basicUser,
          password: this.basicPassword
        },
      }
    )
    return res.data
  }

  async getDashboardLegacy(idOrSlug: string): Promise<Dashboard> {
    const res = await axios.get(`${this.alias}/api/dashboards/${idOrSlug}`, {
      params: {
        api_key: this.apiKey,
        legacy: true,
      },
    })
    return res.data
  }
  async getDashboard(id: string): Promise<Dashboard> {
    const res = await axios.get(`${this.alias}/api/dashboards/${id}`, {
      params: {
        api_key: this.apiKey,
      },
      auth: {
        username: this.basicUser,
        password: this.basicPassword
      },
    })
    return res.data
  }
}
