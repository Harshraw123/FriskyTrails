import axios from "axios";


const axiosInstance = axios.create({
  baseURL:
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_URL_PROD
    : import.meta.env.VITE_API_URL_LOCAL,
  timeout: 30000,
  withCredentials: true,
  headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
  }
});


// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    
    return Promise.reject(error);
  }
);

// Response Interceptor
let isRedirecting = false;
let redirectTimeout = null;

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    // Don't redirect for /api/v1/user/me calls (auth check) - these are expected to fail if not logged in
    const isAuthCheck = error.config?.url?.includes('/api/v1/user/me');
    
    if (error.response?.status === 401 && !isRedirecting && !isAuthCheck) {
      // Clear any existing timeout
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
      
      isRedirecting = true;
      localStorage.removeItem("token");
      
      // Only redirect if we're not already on the home page
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
      
      // Reset flag after a delay to allow for future redirects if needed
      redirectTimeout = setTimeout(() => {
        isRedirecting = false;
        redirectTimeout = null;
      }, 2000);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;


