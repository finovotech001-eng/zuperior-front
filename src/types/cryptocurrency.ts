// /types/cryptocurrency.ts

import { StaticImageData } from "next/image";

export interface Cryptocurrency {
  name: string;
  symbol: string;
  icon: StaticImageData;
  networks: string[];
}
