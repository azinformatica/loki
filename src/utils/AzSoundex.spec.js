import azSoundex from './AzSoundex'

describe('AzSoundex.spec.js', () => {
    it('Deve retornar o código soundex para a string', () => {
        expect(azSoundex.gerarSoundex('str')).toBeDefined()
    })

    it('Deve ordenar as strings por ordem de similaridade', () => {
        const fruits = ['strawberry', 'apple', 'banana', 'pineapple']
        const chosenFruit = 'raspberry'
        const result = azSoundex.selecionarMaisParecido(fruits, chosenFruit)
        expect(result.bestMatch.target).toEqual('strawberry')
    })
})
