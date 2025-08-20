import axios, { AxiosRequestConfig, Method } from "axios";

export const apiRequest = async <T>(
  method: Method,
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080";

    // Normalizar URLs
    const normalizedBase = baseUrl.replace(/\/+$/, ""); // quita / al final
    const normalizedPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const fullUrl = `${normalizedBase}${normalizedPath}`;

    // Detectar si es FormData
    const isFormData = data instanceof FormData;

    // Headers básicos
    const headers: Record<string, string> = {};

    if (token) headers["Authorization"] = `Bearer ${token}`;

    // Content-Type solo si no es FormData
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    // Combinar con headers adicionales
    if (config?.headers) {
      Object.entries(config.headers).forEach(([key, value]) => {
        headers[key] =
          typeof value === "string"
            ? value
            : Array.isArray(value)
            ? value.join(",")
            : value != null
            ? String(value)
            : "";
      });
    }

    const response = await axios({
      method,
      url: fullUrl,
      data,
      headers,
      ...config,
    });

    return response.data as T;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const requestUrl = error.config?.url;
      const requestMethod = error.config?.method?.toUpperCase();

      let message = "Error de servidor";

      if (status === 401) {
        message = "No autorizado - Token inválido o expirado";
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          window.location.href = "/sign-in";
        }
      } else if (status === 403) {
        message = "Acceso prohibido";
      } else if (status === 404) {
        message = `Recurso no encontrado - ${requestMethod} ${requestUrl}`;
      } else if (status === 500) {
        message = "Error interno del servidor";
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }

      console.error("❌ Error en petición API:", {
        status,
        message,
        requestUrl,
        requestMethod,
        errorData: error.response?.data,
      });

      throw new Error(message);
    }

    console.error("❌ Error inesperado:", { error, endpoint, method, data });
    throw new Error("Error inesperado en la solicitud");
  }
};
