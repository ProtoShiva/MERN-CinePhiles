import axios from "axios"
const client = axios.create({
  baseURL: "https://mern-cine-philes-ap-is.vercel.app/api"
})

export default client
