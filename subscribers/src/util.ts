export const kebabize = (str) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())

export const objToCss = (obj: { [key: string]: string | number }) => Object.entries(obj).reduce((str, [key, value]) => str.concat(`${kebabize(key)}:${value.toString()};`), '')

export const removeInitialDollar = (s: string) => s.replace(/^\$/, '')

export const isNullish = (arg: any | null | undefined) => arg === null || arg === undefined

export const thunk = (arg: any, val?: any) => typeof arg === 'function' ? arg(val) : arg

export const when = (val: any) => ({
    then(x: any) { return when(thunk(x, val))},
    orElse(x: any) { return when(thunk(x, val))}
})