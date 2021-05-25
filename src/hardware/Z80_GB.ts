import MMU from "./MMU";
import OP from "./Z80_GB_OpCodes";

/** Registers */
enum R {
/** 16 bit registers */
  af = 0,
  bc = 1,
  de = 2,
  hl = 3,
/** Program Counter */
  pc = 4,
/** Stack Pointer */
  sp = 5,

/** 8 bit registers */
  a = 0,
/** flags */
  f = 1,
  b = 2,
  c = 3,
  d = 4,
  e = 5,
  h = 6,
  l = 7,
}

/** State flags for the 'f' char register */
export enum F {
  /** Zero */ Z = 0b10000000,
  /** Negative */ N = 0b01000000,
  /** Half-carry */ H = 0b00100000,
  /** Carry */ C = 0b00010000,
}

export default class Z80_GB {

  private opMap: Array<Function> = [];

  /** Shared register buffer */
  private buffer: ArrayBuffer = new ArrayBuffer(12);
  /** 8bit registers view */
  private r8: Uint8Array;
  /** 16bit registers view */
  private r16: Uint16Array;

  /** Program Counter */
  get PC() { return this.r16[R.pc]; };
  /** Program Counter */
  set PC(value: number) { this.r16[R.pc] = value; };

  /** Stack Pointer */
  get SP() { return this.r16[R.sp]; };
  /** Stack Pointer */
  set SP(value: number) { this.r16[R.sp] = value; };


  get AF() { return this.r16[R.af]; }
  set AF(value: number) { this.r16[R.af] = value; };

  get BC() { return this.r16[R.bc]; }
  set BC(value: number) { this.r16[R.bc] = value; };

  get DE() { return this.r16[R.de]; }
  set DE(value: number) { this.r16[R.de] = value; };

  get HL() { return this.r16[R.hl]; }
  set HL(value: number) { this.r16[R.hl] = value; };

  get A() { return this.r8[R.a]; }
  set A(value: number) { this.r8[R.a] = value; };

  get F() { return this.r8[R.f]; }
  set F(value: number) { this.r8[R.f] = value; };

  get B() { return this.r8[R.b]; }
  set B(value: number) { this.r8[R.b] = value; };

  get C() { return this.r8[R.c]; }
  set C(value: number) { this.r8[R.c] = value; };

  get D() { return this.r8[R.d]; }
  set D(value: number) { this.r8[R.d] = value; };

  get E() { return this.r8[R.e]; }
  set E(value: number) { this.r8[R.e] = value; };

  get H() { return this.r8[R.h]; }
  set H(value: number) { this.r8[R.h] = value; };

  get L() { return this.r8[R.l]; }
  set L(value: number) { this.r8[R.l] = value; };

  /** machine cycles for last opcode */
  private c: number = 0;
  public get LastCycles() { return this.c; }
  /** machine cycles accrued (not t-cycles) */
  private ct: number = 0;
  public get TotalCycles() { return this.ct; }

  private shouldRun: boolean = true;
  public stop() {
    this.shouldRun = false;
  }

  constructor(private mmu: MMU) {
    this.r8 = new Uint8Array(this.buffer);
    this.r16 = new Uint16Array(this.buffer);
    this.makeOpMap();
  }

  public reset() {
    this.c = 0;
    this.r16.fill(0);
    this.r16[R.pc] = 0x0100;
    this.mmu.reset();
    this.mmu.leaveBios();
  }

  public fetchOp(): number {
    return this.mmu.rb(this.r16[R.pc]++);
  }

  public exec(cycles = Number.MAX_SAFE_INTEGER) {
    this.shouldRun = true;
    let opCode: number;
    let op: Function | undefined;
    while (this.shouldRun && this.ct < cycles) {
      opCode = this.fetchOp();
      op = this.opMap[opCode];
      if (op) {
        op.call(this);
        this.ct += this.c;
      } else console.warn(`OpCode not implemented [${opCode.toString(16)}]`);
    }
  }

  NOP() { this.c = 1; }
  LD_BCnn() { this.BC = this.mmu.rw(this.PC); this.PC += 2; this.c = 3; }
  LD_BCmA() { this.mmu.wb(this.A, this.BC); this.c = 2; }
  INC_BC() { this.BC++; this.c = 2; }
  INC_B() { this.B++; this.F &= ~F.N; this.F |= this.B ? 0 : F.Z; this.c = 1; }
  DEC_B() { this.B--; this.F &= ~F.N; this.F |= this.B ? 0 : F.Z; this.c = 1; }
  LD_Bn() { this.B = this.mmu.rb(this.PC++); this.c = 2; }

  RLCA() {
    let c = this.A >> 7;
    this.A = (this.A << 1) + c;
    this.c = 1;
  }

  RLA() {
    let c = ((this.F & F.C) === F.C) ? 1 : 0;
    this.F = (this.A & 0x80) ? F.C : 0;
    this.A = (this.A << 1) + c;
    this.c = 1;
  }


  private makeOpMap() {
    this.opMap[OP.NOP] = this.NOP;
    this.opMap[OP.LD_BCnn] = this.LD_BCnn;
    this.opMap[OP.LD_BCmA] = this.LD_BCmA;
    this.opMap[OP.INC_BC] = this.INC_BC;
    this.opMap[OP.INC_B] = this.INC_B;
    this.opMap[OP.DEC_B] = this.DEC_B;
    this.opMap[OP.LD_Bn] = this.LD_Bn;
    this.opMap[OP.RLCA] = this.RLCA;
  }
}
