import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets Petar open the dev server on his phone over the local network.
  allowedDevOrigins: ["172.20.10.4"],
  // The dev badge sits on top of the hero button on a phone.
  devIndicators: false,
};

export default nextConfig;
