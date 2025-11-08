export type RequiredField<T, K extends keyof T> = T & {
    [P in K]-?: T[P];
};
export type OptionalAll<T> = {
    [P in keyof T]?: T[P];
};
export type Diff<T, U> = T extends U ? never : T;
export type Filter<T, U> = T extends U ? T : never;
