export async function call<T extends objType>(obj: T, structedArgs: nonEmptyObjects<structedArgsType<T>>): Promise<returnCallType<T>> {
    const newObj: {[key in string | number | symbol]: any} = {};
    for(const objKey of Reflect.ownKeys(obj)) {
        if(typeof obj[objKey as any] === 'function') {
            const func = obj[objKey as any] as (...args: any[]) => any;
            newObj[objKey as any] = await func(...structedArgs[objKey as keyof nonEmptyObjects<structedArgsType<T>>] as any[]);
        } else if(typeof obj[objKey as any] === 'object') {
            if(structedArgs[objKey as keyof nonEmptyObjects<structedArgsType<T>>] === undefined) {
                newObj[objKey as any] = obj[objKey as any];
            } else {
                newObj[objKey as any] = await call(obj[objKey as any] as objType, structedArgs[objKey as keyof nonEmptyObjects<structedArgsType<T>>]);
            }
        } else {
            newObj[objKey as any] = obj[objKey as any];
        }
    }

    return newObj as returnCallType<T>;
}

export type objType = {
    [key in string | number | symbol]: string | boolean | number | symbol | null | undefined | ((...args: any[]) => any) | objType
};

export type structedArgsType<T extends objType> = {
    [key in keyof T as T[key] extends Function ? key : T[key] extends objType ? key : never]:
        (T[key] extends ((...args: infer U) => any) ? U[number][] : T[key] extends objType ? structedArgsType<T[key]> : never)
};

export type nonEmptyObjects<T extends any> = {
    [key in keyof T as keyof T[key] extends never ? never : keyof nonEmptyObjects<T[key]> extends never ? never : T[key] extends unknown[] ? never : key]: T[key]
};

export type returnCallType<T extends objType> = {
    [key in keyof T]: 
        T[key] extends ((...args: any[]) => infer U) ?
            (U extends Promise<infer W> ? W : U) :
            (T[key] extends objType ? returnCallType<T[key]> : T[key])
};
