test('Devo conhecer o jest', ()=>{

    let number = null;
    expect(number).toBeNull(); //Teste para receber a variavel number null
    number= 10;
    expect(number).not.toBeNull(); //Teste para receber a variavel não null
    expect(number).toBe(10); //Teste para receber a variavel se recebe 10
    expect(number).toEqual(10); //Teste para receber a variavel igual a 10 
    expect(number).toBeGreaterThan(9); //Teste para receber a variavel se é maior que 9
    expect(number).toBeLessThan(11); //Teste para receber a variavel se é menor que 11

});

test('Devo saber trabalhar com objeto', ()=>{
    const obj = {
        name:'john',
        email:'john@email.com'
    };
    expect(obj).toHaveProperty('name'); //Verifica se o objeto contém o atributo nome
    expect(obj).toHaveProperty('name', 'john'); //Verifica se o objeto contém o atributo nome e se o nome é john
    expect(obj.name).toBe('john'); //Verifica se o objeto contém o atributo nome e se o nome é john


    const obj2 = {
        name:'john',
        email:'john@email.com'
    };
    expect(obj).toEqual(obj2); //Verifica se o objeto contém o atributo nome e se o nome é john
    expect(obj.name).toBe('john');
    expect(obj).toBe(obj);
});