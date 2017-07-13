import { isValidEmail, isValidPassword } from '../lib/generic/validation'


describe('test validation functions', () => {
    it('expect foo@bar not to be valid email', () => {
        const isValid = isValidEmail('foo@bar')
        expect(isValid).toBe(false)
    })

    it('expect foo@bar.com to be valid email', () => {
        const isValid = isValidEmail('foo@bar.com')
        expect(isValid).toBe(true)
    })

    it('expect 12345 not to be valid password', () => {
        const isValid = isValidPassword('1234')
        expect(isValid).toBe(false)
    })

    it('expect 1aA1234 to be valid password', () => {
        const isValid = isValidPassword('1aA1234')
        expect(isValid).toBe(true)
    })
})
