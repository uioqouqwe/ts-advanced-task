import { call } from './call';

(async () => {
    const obj = {
        a(a: string) { return `${a}a`; },
        b: {
            a() { /* do nothing */ },
            b: {
                a: (p: Promise<string>) => p.then(s => `resolved with ${s}`),
                b: 'resolved'
            }
        },
        c: 100500
    };
    const result = await call(obj, {
        a: ['a'],
        b: {
            a: [],
            b: {
                a: [Promise.resolve('value')]
            }
        }
    });
    console.log(result);// { a: 'aa', b: { a: undefined, b: { a: 'resolved with value', b: 'resolved' } }, c: 100500 }
})();




(async () => {
    const s = Symbol('s');
    const obj = {
        [s]() { return '[obj]' as const; },
        a(a: string) { return `${a}a`; },
        b: {
            a() { /* do nothing */ },
            b: {
                a: (p: Promise<string>) => p.then(s => `resolved with ${s}`),
                b: 'resolved'
            },
            c: {
                a: null
            },
            d: {
                a: {
                    a: null as any as never
                }
            },
            e: {
                a: {},
                b: undefined as any as never
            },
            f: {
                a: {
                    a: {
                        a: {
                            a(...args: [name: string, ...numbers: number[]]) {
                                const [name, ...numbers] = args;
                                return numbers.reverse();
                            }
                        }
                    }
                }
            }
        },
        c: 100500
    };

    const result = await call(obj, {
        [s]: [],
        a: [''],
        b: {
            a: [],
            b: {
                a: [Promise.resolve('sss')]
            },
            f: {
                a: {
                    a: {
                        a: {
                            a: ['go', 1]
                        }
                    }
                }
            }
        }
    });

    console.log(result);
    // const r_s = result[s]; // "[obj]"
    // const r_a = result.a; // string
    // const r_b_a = result.b.a; // void
    // const r_b_b_a = result.b.b.a; // string
    // const r_b_b_b = result.b.b.b; // string
    // const r_b_c_a = result.b.c.a; // null
    // const r_b_d_a_a = result.b.d.a.a; // unknown
    // const r_b_e_a = result.b.e.a; // {}
    // const r_b_e_b = result.b.e.b; // unknown
    // const r_b_f_a_a_a_a = result.b.f.a.a.a.a; // number[]
    // const r_b_f_a_a_a_a_0 = result.b.f.a.a.a.a[0]; // number
    // const r_c = result.c; // number
    // const r_d = result.d; // Property 'd' does not exist on type...
    // const r_b_g = result.b.g; // Property 'g' does not exist on type...
})();
