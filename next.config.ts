import type { NextConfig } from "next";
import os from "os";

function getLocalLanHosts(): string[] {
  const hosts = new Set<string>(["localhost", "127.0.0.1"]);
  try {
    const nets = os.networkInterfaces();
    for (const entries of Object.values(nets)) {
      for (const info of entries ?? []) {
        if (info.family === "IPv4" && !info.internal) {
          hosts.add(info.address);
        }
      }
    }
  } catch {}
  return Array.from(hosts);
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: getLocalLanHosts(),
};

export default nextConfig;
