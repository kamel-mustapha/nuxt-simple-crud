import type { Kid } from "./Kid";

export interface Creche {
  id: number;
  name: string;
  userId: number;
  kids: Kid[];
}
