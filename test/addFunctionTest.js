const {add, sub} = require ('../src/app.js')

const expect = require ('chai').expect

describe ('suit1', () =>{

    it('add (2,3 ) should return 5', () => {
        expect(add (2,3)).to.be.equal(5);

    })
});