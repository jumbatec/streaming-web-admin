export const TOKEN_KEY = 'NMCTOKEN2019@123'
export const USER_KEY = 'userData'
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const defaultPassword = 'nacoes2019'

export const login = (token) => {
  localStorage.setItem(TOKEN_KEY, token)
}
export const getUserDetails = () => localStorage.getItem(USER_KEY)
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
