import * as fs from 'fs';
import * as path from 'path';

type PromptValues = Record<string, string | number | boolean | null | undefined>;

const PROMPT_DIR = path.join(__dirname, 'prompts');

function promptPath(name: string): string {
    return path.join(PROMPT_DIR, `${name}.txt`);
}

function readPromptFile(name: string): string {
    return fs.readFileSync(promptPath(name), 'utf8').trim();
}

function interpolate(template: string, values: PromptValues): string {
    return template
        .replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key: string) => {
            const value = values[key];
            return value === undefined || value === null ? '' : String(value);
        })
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

export function promptExists(name: string): boolean {
    return fs.existsSync(promptPath(name));
}

export function loadSystemPrompt(names: string | string[], values: PromptValues = {}): string {
    const parts = ['common', ...(Array.isArray(names) ? names : [names])];
    const template = parts
        .filter((name, index) => index === 0 || promptExists(name))
        .map((name) => readPromptFile(name))
        .join('\n\n');

    return interpolate(template, values);
}

export function normalizePromptKey(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
