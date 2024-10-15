type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I
  : never

type LastOf<T> =
  UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R
  : never

export type ID<T> = T

export type Nilable<T> = T | null | undefined

export type UnionToTuple<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false,
> = true extends N ? [] : [...UnionToTuple<Exclude<T, L>>, L]

export type AsyncReturnType<T extends (...args: any) => Promise<any>> = Awaited<
  ReturnType<T>
>
