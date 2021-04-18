import * as mocha from "mocha";
import * as chai from "chai";

const expect = chai.expect;
describe("Map access test", () => {
  describe("builds", () => {
    let size = 1000000;
    it('Array', () => {
      let dummy = () => true;
      let ar = [];
      let start = Date.now();
      for(let i = 0; i <= size; i++)
        ar[i] = dummy;
      let end = Date.now();
      console.log(`Build Array: ${end - start}ms`);
    });
    it('Map', () => {
      let dummy = () => true;
      let map = new Map<number, Function>();
      let start = Date.now();
      for(let i = 0; i <= size; i++)
        map.set(i, dummy);
      let end = Date.now();
      console.log(`Build Map: ${end - start}ms`);
    });
    it('Obj', () => {
      let dummy = () => true;
      let obj: {[key:number]: Function} = {};
      let start = Date.now();
      for(let i = 0; i <= size; i++)
        obj[i] = dummy;
      let end = Date.now();
      console.log(`Build Obj: ${end - start}ms`);
    });
  });

  describe("get", () => {
    let size = 1000000;
    it('Array', () => {
      let dummy = () => true;
      let ar = [];
      for(let i = 0; i <= size; i++)
        ar[i] = dummy;

      let start = Date.now();
      for(let i = 0; i <= size; i++)
        ar[i]();
      let end = Date.now();
      console.log(`get Array: ${end - start}ms`);
    });

    it('Map', () => {
      let dummy = () => true;
      let map = new Map<number, Function>();
      for(let i = 0; i <= size; i++)
        map.set(i, dummy);

      let start = Date.now();
      for(let i = 0; i <= size; i++)
      {
        // @ts-ignore
        map.get(i)();
      }
      let end = Date.now();
      console.log(`get Map: ${end - start}ms`);
    });

    it('Obj', () => {
      let dummy = () => true;
      let obj: {[key:number]: Function} = {};
      for(let i = 0; i <= size; i++)
        obj[i] =  dummy;

      let start = Date.now();
      for(let i = 0; i <= size; i++)
      {
        // @ts-ignore
        obj[i]();
      }
      let end = Date.now();
      console.log(`get Obj: ${end - start}ms`);
    });
  });
});