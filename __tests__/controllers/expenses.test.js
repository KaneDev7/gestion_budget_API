// const {} = require('jest')
function sum(a, b) {
    return a + b;
}


describe('Operation', () => {
    test('add 1 + 2 to equal 3', () => {
        expect(sum(1, 2)).toBe(3);
    });

    test('add 5 + 2 to equal 7', () => {
        expect(sum(5, 2)).toBe(7);
    });
})