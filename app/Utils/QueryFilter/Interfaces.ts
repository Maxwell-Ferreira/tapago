interface RequestTable {
  joins?: Array<string>
  includes?: Array<string>
  excludes?: Array<string>
  filterFields?: Array<string>
  searchFields?: Array<string>
}

interface Filter {
  field: string
  type: string
  value: string | { min: any; max: any }
}

interface FilterNamespace {
  namespace: string
  filters: Filter[]
}

interface SearchNamespace {
  namespace: string
  fields: Array<string>
}

type VisibilityNamespace = SearchNamespace
