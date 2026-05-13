import { treaty } from "@elysia/eden";
import ky from "ky";
import type { Options } from "ky";
import type { App } from "./elysia";

export interface ApiClientConfig {
  baseUrl: string;
  companyId?: string | number;
  kyOptions?: Options;
}

export const createClient = (config: ApiClientConfig) => {
  const { baseUrl, kyOptions } = config;

  const fetcher = ky.create({
    retry: 1,
    timeout: 30000,
    throwHttpErrors: false, // Let Eden Treaty handle errors
    hooks: {
      beforeRequest: [
        ({ request }) => {
          request.headers.set("X-Requested-With", "XMLHttpRequest");
        },
      ],
    },
    ...kyOptions,
  });

  return treaty<App>(baseUrl, { fetcher }).api;
};

export type ApiClient = ReturnType<typeof createClient>;
