export type AppTab = 'today' | 'year' | 'week' | 'profile'

export interface NavItem {
  label: string
  to: string
  tab?: AppTab
}
