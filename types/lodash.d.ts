// lodash.d.ts
declare module "lodash" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function debounce<T extends Function>(
    func: T,
    wait?: number,
    options?: {
      leading?: boolean;
      trailing?: boolean;
      maxWait?: number;
    }
  ): T & {
    cancel(): void;
    flush(): ReturnType<T>;
  };
}
