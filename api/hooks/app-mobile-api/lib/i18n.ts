import * as fs from "fs";
import * as path from "path";

const LOCALES_DIR = path.resolve(__dirname, "../locales");
const FALLBACK = "en";

/** Keys whose string values are translation keys of the hook's locales. */
const TRANSLATED_KEYS = new Set(["title", "category", "empty", "confirm", "section"]);

export class Translator {
  private readonly dictionaries = new Map<string, Record<string, string>>();

  constructor(dir: string = LOCALES_DIR) {
    for (const file of fs.readdirSync(dir).filter((name) => name.endsWith(".json"))) {
      this.dictionaries.set(path.basename(file, ".json"), JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")));
    }
  }

  /** Other modules registering apps add their own keys. */
  extend(lang: string, entries: Record<string, string>): void {
    this.dictionaries.set(lang, { ...(this.dictionaries.get(lang) ?? {}), ...entries });
  }

  languages(): string[] {
    return [...this.dictionaries.keys()];
  }

  /** `ru-RU,ru;q=0.9` / `ru_RU` / `RU` → a language we have, or null. */
  pick(...candidates: Array<string | null | undefined>): string | null {
    for (const candidate of candidates) {
      if (!candidate) continue;
      for (const tag of candidate.split(",")) {
        const base = tag.split(";")[0].trim().toLowerCase().replace("_", "-").split("-")[0];
        if (base && this.dictionaries.has(base)) return base;
      }
    }
    return null;
  }

  t(key: string, lang: string): string {
    return this.dictionaries.get(lang)?.[key] ?? this.dictionaries.get(FALLBACK)?.[key] ?? key;
  }

  /**
   * Translates a declaration fragment: values of title / category / empty / confirm / section and
   * every value of `x-titles` maps. Field names, method names and data are left alone.
   */
  localize<T>(value: T, lang: string): T {
    const walk = (node: any, translateValues: boolean): any => {
      if (Array.isArray(node)) return node.map((item) => walk(item, false));
      if (node === null || typeof node !== "object") return node;
      const result: Record<string, unknown> = {};
      for (const [key, child] of Object.entries(node)) {
        if (typeof child === "string" && (translateValues || TRANSLATED_KEYS.has(key))) result[key] = this.t(child, lang);
        else result[key] = walk(child, key === "x-titles");
      }
      return result;
    };
    return walk(value, false);
  }
}
