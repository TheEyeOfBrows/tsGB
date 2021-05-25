import * as mocha from "mocha";
import * as chai from "chai";

import MMU, { MAP } from "../../src/hardware/MMU";

const expect = chai.expect;
describe("MMU", () => {
  it("initializes", () => {
    let mmu = new MMU();
    mmu.wb(0xFF, MAP.RAM);
    mmu.reset();
    let actual = mmu.rb(MAP.RAM);
    expect(actual).to.equal(0);
  });

  it("writes words", () => {
    let mmuAddress =  MAP.RAM + 50;;
    let targetValue = 0xf0e0;
    let highExpected = 0xf0;
    let lowExpected = 0xe0;
    let mmu = new MMU();
    mmu.reset();
    mmu.ww(targetValue, mmuAddress);

    let lowActual = mmu.rb(mmuAddress);
    let highActual = mmu.rb(mmuAddress + 1);
    expect(lowActual).to.equal(lowExpected);
    expect(highActual).to.equal(highExpected);
  });

  it("reads words", () => {
    let mmuAddress = MAP.RAM + 50;
    let expected = 0xf0e0;
    let highActual = 0xf0;
    let lowActual = 0xe0;

    let mmu = new MMU();
    mmu.reset();
    mmu.wb(lowActual, mmuAddress);
    mmu.wb(highActual, mmuAddress + 1);

    let actual = mmu.rw(mmuAddress);

    expect(actual).to.equal(expected);
  });
});
