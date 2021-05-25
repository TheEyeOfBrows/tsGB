import * as mocha from "mocha";
import * as chai from "chai";

import { Z80_GB, MMU } from "../../src/hardware";
import { F as FLAG } from "../../src/hardware/Z80_GB";
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

    it("INC_BC", () => {
      cpu.BC = 0x1234;
      cpu.INC_BC();
      expect(cpu.B).to.equal(0x35);
      expect(cpu.C).to.equal(0x12);
    });

    it("INC_B", () => {
      cpu.B = 0x00;
      cpu.F = FLAG.N;
      cpu.INC_B();
      expect(cpu.B).to.equal(0x01);
      expect(cpu.F & FLAG.N).to.equal(0);
      expect(cpu.F & FLAG.Z).to.equal(0);

      cpu.B = 0xff;
      cpu.F = FLAG.N;
      cpu.INC_B();
      expect(cpu.B).to.equal(0x00);
      expect(cpu.F & FLAG.N).to.equal(0);
      expect(cpu.F & FLAG.Z).to.equal(FLAG.Z);
    });

    it("DEC_B", () => {
      cpu.B = 0x00;
      cpu.F = FLAG.N;
      cpu.DEC_B();
      expect(cpu.B).to.equal(0xff);
      expect(cpu.F & FLAG.N).to.equal(0);
      expect(cpu.F & FLAG.Z).to.equal(0);

      cpu.B = 0x01;
      cpu.F = FLAG.N;
      cpu.DEC_B();
      expect(cpu.B).to.equal(0x00);
      expect(cpu.F & FLAG.N).to.equal(0);
      expect(cpu.F & FLAG.Z).to.equal(FLAG.Z);
    });

    it("LD_Bn", () => {
      mmu.wb(0x12, 0x0101);
      cpu.PC = 0x0101;
      cpu.LD_Bn();
      expect(cpu.B).to.equal(0x12);
    });

    it("RLCA", () => {
      cpu.A = 0b10101010;
      cpu.RLCA();
      expect(cpu.A).to.equal(0b01010101);
      cpu.RLCA();
      expect(cpu.A).to.equal(0b10101010);
    });
    it("RLC", () => {
      cpu.A = 0b01010101;
      cpu.RLA();
      expect(cpu.A).to.equal(0b10101010);
      expect(cpu.F).to.equal(0);

      cpu.RLA();
      expect(cpu.A).to.equal(0b01010100);
      expect(cpu.F).to.equal(FLAG.C);

      cpu.RLA();
      expect(cpu.A).to.equal(0b10101001);
      expect(cpu.F).to.equal(0);
    });


  });
});
