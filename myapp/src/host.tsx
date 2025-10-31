// src/config/port.tsx
const PORTS = {
  development: "https://kcpwebapi2-chc2athyb9ambchz.southeastasia-01.azurewebsites.net",
  staging: "https://staging.api.yourdomain.com",
  production: "https://api.yourdomain.com",
};

// Tự động chọn base URL theo môi trường
const env = import.meta.env.MODE || "development";

export const BASE_URL =
  env === "production"
    ? PORTS.production
    : env === "staging"
    ? PORTS.staging
    : PORTS.development;

// ✅ Export thêm PORTS để dùng thủ công ở nơi khác
export { PORTS };

export default BASE_URL;
