import axios from "axios";
import { API_URL } from "global/Global";


const instance = axios.create({
    baseURL: API_URL,
    headers: {
        "content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": 'XMLHttpRequest'
    },
});

export default {
    login: (data) =>
        instance({
        method: "POST",
        url: `${API_URL}/user-login`,
        data,
    }),
}