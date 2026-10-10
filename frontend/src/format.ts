const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function formatPrice(amount: number): string {
  return usd.format(amount)
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

/** Dish names are stored as "English · 中文"; show the two parts on separate lines. */
export function splitName(name: string): [string, string | null] {
  const i = name.lastIndexOf(' · ')
  return i === -1 ? [name, null] : [name.slice(0, i), name.slice(i + 3)]
}
