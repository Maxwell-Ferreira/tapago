import { HttpContext } from '@adonisjs/core/build/standalone'
import { BaseModel, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

export default class QueryFilter {
  private perPage: number = 20
  private page: number = 1
  private filtersNamespaces: Array<FilterNamespace> = []
  private search?: string = ''
  private searchNamespaces: Array<SearchNamespace> = []
  private includeNamespaces: VisibilityNamespace[] = []
  private $query: ModelQueryBuilderContract<typeof BaseModel> | undefined
  private requestTable: RequestTable

  constructor(
    query: ModelQueryBuilderContract<typeof BaseModel> | undefined,
    requestTable: RequestTable
  ) {
    const ctx = HttpContext.get()
    const params = ctx?.request?.qs()

    this.requestTable = requestTable
    this.$query = query

    const perPage = parseInt(params?.perPage)
    if (perPage && perPage < 100 && perPage > 1) {
      this.perPage = perPage
    }

    const page = parseInt(params?.page)
    if (page && page > 1) {
      this.page = page
    }

    let filters: any = null
    try {
      filters = JSON.parse(params?.filters)
    } catch (err) {
      this.filtersNamespaces = []
    }
    if (filters) {
      Object.entries(filters).forEach(([key, value]: any) => {
        if (this.requestTable.filterFields?.find((ff) => ff === key)) {
          let type = 'unique'
          if (Array.isArray(value)) {
            type = 'multiple'
          } else if (value?.min || value?.max) {
            type = 'range'
          }

          const parts = key.split('.')
          const field: string = parts[parts.length - 1]
          parts.pop()
          const namespace: string = parts.join('.')

          const index = this.filtersNamespaces.findIndex((filter) => filter.namespace === namespace)

          if (index !== -1) {
            this.filtersNamespaces[index].filters.push({
              field,
              type,
              value: value,
            })
          } else {
            this.filtersNamespaces.push({
              namespace,
              filters: [{ field, type, value: value }],
            })
          }
        }
      })
    }

    if (typeof params?.search === 'string') {
      this.search = params?.search
      this.requestTable.searchFields?.forEach((searchField) => {
        const parts = searchField.split('.')
        const field: string = parts[parts.length - 1]
        parts.pop()
        const namespace: string = parts.join('.')

        const index = this.searchNamespaces.findIndex(
          (searchNamespace) => searchNamespace.namespace === namespace
        )

        if (index !== -1) {
          this.searchNamespaces[index].fields.push(field)
        } else {
          this.searchNamespaces.push({ namespace, fields: [field] })
        }
      })
    }

    if (this.requestTable.includes?.length) {
      this.requestTable.includes.forEach((include) => {
        const parts = include.split('.')
        const field = parts[parts.length - 1]
        parts.pop()
        const namespace = parts.join('.')

        const currentNamespace = this.includeNamespaces.find((item) => item.namespace === namespace)
        if (currentNamespace) {
          currentNamespace.fields.push(field)
        } else {
          this.includeNamespaces.push({ namespace, fields: [field] })
        }
      })
    }
  }

  private setJoins() {
    this.requestTable.joins?.forEach((join: any) => {
      this.$query?.preload(join)
    })
  }

  private setFilter(builder: ModelQueryBuilderContract<typeof BaseModel>, filter: Filter) {
    if (filter.type === 'unique') builder.where(filter.field, filter.value.toString())
    else if (filter.type === 'multiple' && Array.isArray(filter.value))
      builder.whereIn(filter.field, filter.value)
    else if (filter.type === 'range' && typeof filter.value === 'object')
      builder
        .where(filter.field, '>=', filter.value.min)
        .where(filter.field, '<=', filter.value.max)
  }

  private setFilters() {
    this.filtersNamespaces.forEach((filter) => {
      if (filter.namespace === '') {
        this.$query?.where((builder) => {
          filter.filters.forEach((filter) => {
            this.setFilter(builder, filter)
          })
        })
      } else {
        this.$query?.whereHas(filter.namespace as any, (builder) => {
          filter.filters.forEach((filter) => {
            this.setFilter(builder, filter)
          })
        })
      }
    })
  }

  private setSearch() {
    this.$query?.where((builder) => {
      this.searchNamespaces.forEach((searchnamespace) => {
        if (searchnamespace.namespace === '') {
          searchnamespace.fields.forEach((field) => {
            builder.orWhereILike(field, `%${this.search}%`)
          })
        } else {
          builder.orWhereHas(searchnamespace.namespace as any, (builder) => {
            searchnamespace.fields.forEach((field) => {
              builder.orWhereILike(field, `%${this.search}%`)
            })
          })
        }
      })
    })
  }

  public async execute(paginate = true, json = false) {
    this.setJoins()
    this.setFilters()
    this.setSearch()

    if (paginate) {
      const result = await this.$query?.paginate(this.page, this.perPage)
      return json ? result?.toJSON() : result
    }

    return this.$query
  }
}
