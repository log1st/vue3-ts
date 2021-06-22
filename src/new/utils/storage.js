export const storage = {
  get(key, defaultValue = null) {
    return JSON.parse(localStorage.getItem(key || ''))
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}
