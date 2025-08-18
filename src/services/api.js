import axios from 'axios'
import { getToken } from './auth'

export const baseURL = 'https://m01e6ieryh.execute-api.us-east-1.amazonaws.com/prod/api/v1'

//export const baseURL='http://localhost:3333/api/v1'

export const defaultSucursal = '96a8fb4d-39ae-4049-810c-83c5f2fa0ed2'

const api = axios.create({
  // baseURL: 'https://m01e6ieryh.execute-api.us-east-1.amazonaws.com/prod/api/v1',
  baseURL: 'http://localhost:3333/api/v1',
})

export default api
