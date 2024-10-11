import { Micro as M } from "effect"
import type { Micro } from "effect/Micro"
import type { Simplify } from "effect/Types"

type GetA<T> = T extends Micro<infer A, unknown, unknown> ? A : never
type GetE<T> = T extends Micro<unknown, infer E, unknown> ? E : never
type GetR<T> = T extends Micro<unknown, unknown, infer R> ? R : never

export const myM = {
  bind: M.bind as unknown as {
    <N extends string, A extends Record<string, any>, B, E2, R2>(
      name: N,
      f: (a: NoInfer<A>) => Micro<B, E2, R2>
    ): <E, R>(
      self: Micro<A, E, R>
    ) => Micro<Simplify<Omit<A, N> & { [K in N]: B }>, E | E2, R | R2>

    <A extends Record<string, any>, E, R, B, E2, R2, N extends string>(
      self: Micro<A, E, R>,
      name: N,
      f: (a: NoInfer<A>) => Micro<B, E2, R2>
    ): Micro<Simplify<Omit<A, N> & { [K in N]: B }>, E | E2, R | R2>
  },
  flatMap: M.flatMap as unknown as {
    <
      A,
      MB extends Micro<unknown, unknown, unknown>,
      B extends GetA<MB>,
      E2 extends GetE<MB>,
      R2 extends GetR<MB>,
    >(
      f: (a: A) => MB
    ): <E, R>(self: Micro<A, E, R>) => Micro<B, E | E2, R | R2>

    <
      A,
      E,
      R,
      MB extends Micro<unknown, unknown, unknown>,
      B extends GetA<MB>,
      E2 extends GetE<MB>,
      R2 extends GetR<MB>,
    >(
      self: Micro<A, E, R>,
      f: (a: A) => MB
    ): Micro<B, E | E2, R | R2>
  },
}
