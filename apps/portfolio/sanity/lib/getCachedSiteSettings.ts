import { cache } from "react";
import { getSiteSettings } from "@/sanity/lib/getSiteSettings";

export const getCachedSiteSettings = cache(async () => getSiteSettings());
