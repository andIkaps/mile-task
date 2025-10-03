import axios from "axios";
import { toast } from "vue-sonner";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        toast.error(
            error.response.data.message
                ? error.response.data.message
                : "Request Failed!"
        );

        return Promise.reject(error);
    }
);
