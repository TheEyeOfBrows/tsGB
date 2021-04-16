import * as mocha from "mocha";
import * as chai from "chai";

import { Z80_GB, MMU } from "../../src/hardware";
const expect = chai.expect;

describe("Z80", () => {
  let cpu: Z80_GB;
  let mmu: MMU;

  beforeEach(() => {
    mmu = new MMU();
    cpu = new Z80_GB(mmu);
  });

  it("uses views into array buffer", () => {
    cpu.BC = 0x1234;
    expect(cpu.B).to.equal(0x34);
    expect(cpu.C).to.equal(0x12);
    cpu.E = 0x12;
    cpu.D = 0x34;
    expect(cpu.DE).to.equal(0x1234);
  });
  it("uses unsigned integers as registers", () => {
    cpu.B = 0xFF;
    cpu.B++;
    expect(cpu.B).to.equal(0x00);
    expect(cpu.BC).to.equal(0x00);
    expect(cpu.AF).to.equal(0x00);

    cpu.HL = 0xFFFF;
    expect(cpu.L).to.equal(0xFF);
    expect(cpu.H).to.equal(0xFF);
    cpu.HL++;
    expect(cpu.L).to.equal(0x00);
    expect(cpu.H).to.equal(0x00);
  });

  describe("Ops", () => {
    it("NOP", () => {
      cpu.NOP();
      expect(cpu.LastCycles).to.equal(1);
    });

    it("LD_BCnn", () => {
      mmu.ww(0x1234, 0x0101);
      cpu.PC = 0x0101;
      cpu.LD_BCnn();
      expect(cpu.BC).to.equal(0x1234);
    });

    it("LD_BCmA", () => {
      cpu.A = 0x0F;
      cpu.BC = 0x30FE;
      cpu.LD_BCmA();
      expect(mmu.rb(0x30FE)).to.equal(0x0F);
    });
  });
});