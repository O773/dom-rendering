import {removeInitialDollar, kebabize, objToCss, thunk} from "../util";

describe('util', () => {
    describe('removeInitialDollar', () => {
        it('removes the initial $ sign from a string', () => {
            const result = removeInitialDollar('$foo')
            expect(result).toEqual('foo')
        })

        it('does nothing if the string does not begin with a $ sign', () => {
            const input = 'foo'
            const result = removeInitialDollar(input)
            expect(result).toEqual(input)
        })
    })

    describe('kebabize', () => {
        it('makes camelCased string kebab-cased', () => {
            const input = 'mixBlendMode'
            const result = kebabize(input)
            expect(result).toEqual('mix-blend-mode')
        })
    })

    describe('objToCss', () => {
        it('kebabizes the property keys of an object and stringifies the whole thing to a CSS string', () => {
            const input = { mixBlendMode: 'lighten' }
            const result = objToCss(input)
            expect(result).toEqual('mix-blend-mode:lighten;')
        })
    })

    describe('thunk', () => {
        it ('returns its argument if it is not a function', () => {
            const input = 'a string'
            const result = thunk(input)
            expect(result).toBe(input)
        })

        it('calls the argument function and returns its return value if its argument is a function', () => {
            const exptectedReturn = 'a string'
            const input = jest.fn().mockReturnValue('a string')
            const result = thunk(input)
            expect(input).toHaveBeenCalled()
            expect(result).toEqual(exptectedReturn)
        })
    })
})