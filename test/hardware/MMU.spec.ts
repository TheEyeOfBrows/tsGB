import * as mocha from "mocha";
import * as chai from "chai";

import MMU from "../../src/hardware/MMU";

const expect = chai.expect;
describe("MMU", () => {
  it("initializes", () => {
    let mmu = new MMU();
    mmu.reset();
  });

  it("writes words", () => {
    let mmuAddress = 0xfe;
    let targetValue = 0xf0e0;
    let highExpected = 0xf0;
    let lowExpected = 0xe0;
    let mmu = new MMU();
    mmu.reset();
    mmu.ww(targetValue, mmuAddress);

    // expect(mmu.data[mmuAddress]).to.equal(lowExpected);
    // expect(mmu.data[mmuAddress + 1]).to.equal(highExpected);
  });

  it("reads words", () => {
    let mmuAddress = 0xfe;
    let expected = 0xf0e0;
    let highActual = 0xf0;
    let lowActual = 0xe0;

    let mmu = new MMU();
    // mmu.Initialize();
    // mmu.data[mmuAddress] = lowActual;
    // mmu.data[mmuAddress + 1] = highActual;

    // let actual = mmu.ReadWord(mmuAddress);

    // expect(actual).to.equal(expected);
    // expect(mmu.data[mmuAddress - 1]).to.equal(
    //   0,
    //   "mmuory before target has been modified"
    // );
    // expect(mmu.data[mmuAddress + 2]).to.equal(
    //   0,
    //   "mmuory after target has been modified"
    // );
  });
});
