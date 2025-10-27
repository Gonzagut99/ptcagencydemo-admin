import createClient from "openapi-fetch";
import type { paths } from "./api"
const backendBaseUrl = "http://localhost:8090/ptc/api/"
export const fetchClient = createClient<paths>({ baseUrl: backendBaseUrl });