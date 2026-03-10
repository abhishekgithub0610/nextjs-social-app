"use client";

import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "react-toastify";

const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));

const agent = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

/**
 * Request interceptor
 */
agent.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Example if you later add token authentication
    // const token = localStorage.getItem("jwt");
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response interceptor
 */
agent.interceptors.response.use(
  async (response: AxiosResponse) => {
    if (process.env.NODE_ENV === "development") {
      await sleep(500);
    }
    return response;
  },
  async (error: AxiosError) => {
    if (process.env.NODE_ENV === "development") {
      await sleep(500);
    }

    if (!error.response) {
      toast.error("Network error");
      return Promise.reject(error);
    }

    const { status, data }: any = error.response;

    switch (status) {
      case 400:
        if (data?.errors) {
          const modelStateErrors: string[] = [];

          for (const key in data.errors) {
            if (data.errors[key]) {
              modelStateErrors.push(...data.errors[key]);
            }
          }

          throw modelStateErrors;
        }

        toast.error(data?.title || "Bad request");
        break;

      case 401:
        if (data?.detail === "NotAllowed") {
          throw new Error(data.detail);
        }

        toast.error("Unauthorized");
        break;

      case 403:
        toast.error("Forbidden");
        break;

      case 404:
        toast.error("Not found");
        break;

      case 500:
        toast.error("Server error");
        break;

      default:
        toast.error("Something went wrong");
        break;
    }

    return Promise.reject(error);
  },
);

/**
 * Generic request helpers
 */

const requests = {
  get: <T>(url: string, config?: any) =>
    agent.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, body?: any, config?: any) =>
    agent.post<T>(url, body, config).then((res) => res.data),

  put: <T>(url: string, body?: any) =>
    agent.put<T>(url, body).then((res) => res.data),

  del: <T>(url: string) => agent.delete<T>(url).then((res) => res.data),
};

export default requests;

// "use client";
// import axios, { InternalAxiosRequestConfig } from "axios";
// //import { store } from "../stores/store";
// import { toast } from "react-toastify";
// //import { router } from "../../app/router/routes";

// const sleep = (delay: number) => {
//   return new Promise((resolve) => {
//     setTimeout(resolve, delay);
//   });
// };

// const agent = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   //baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true,
// });

// agent.interceptors.request.use(
//   (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
//     // store.uiStore.isBusy(); // optional busy indicator
//     return config;
//   },
// );

// agent.interceptors.response.use(
//   async (response) => {
//     if (process.env.NODE_ENV === "development") await sleep(1000);
//     // if (import.meta.env.DEV) await sleep(1000);
//     //store.uiStore.isIdle();
//     return response;
//   },
//   async (error) => {
//     //if (import.meta.env.DEV) await sleep(1000);
//     if (process.env.NODE_ENV === "development") await sleep(1000);

//     //store.uiStore.isIdle(); // Ensure the busy state is reset on error
//     const { data, status } = error.response;
//     switch (status) {
//       case 400:
//         if (data.errors) {
//           const modalStateErrors = [];
//           for (const key in data.errors) {
//             if (data.errors[key]) {
//               modalStateErrors.push(data.errors[key]);
//             }
//           }
//           throw modalStateErrors.flat();
//         } else {
//           toast.error(data);
//         }
//         break;
//       case 401:
//         if (data.detail === "NotAllowed") {
//           throw new Error(data.detail);
//         } else {
//           toast.error("Unauthorised");
//         }
//         break;
//       case 403:
//         toast.error("Forbidden");
//         break;
//       case 404:
//         toast.error("Not found");
//         //await router.navigate("/not-found");
//         break;
//       case 500:
//         toast.error("Server error");
//         //router.navigate("/server-error", { state: { error: data } });
//         break;
//     }

//     return Promise.reject(error);
//   },
// );

// export default agent;
