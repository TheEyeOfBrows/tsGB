import MMU from "./MMU";
import OP from "./Z80_GB_OpCodes";

/** 16bit register names */
enum W {
  /** Program Counter */ pc,
  /** Stack pointer */ sp,
  /** Clock */ m,
  /** Clock */ t,
}

/** 8bit register names */
enum C {
  a,
  /** Flags */ f,
  b,
  c,
  d,
  e,
  h,
  l,
}

/** State flags for the 'f' char register */
enum FLAGS {
  /** Zero */ Z = 0b10000000,
  /** Negative */ N = 0b01000000,
  /** Half-carry */ H = 0b00100000,
  /** Carry */ C = 0b00010000,
}

export default class Z80_GB {
  /** 8bit registers */
  private r8: Uint8Array = new Uint8Array(8);
  /** 16bit registers */
  private r16: Uint16Array = new Uint16Array(8);
  /** machine cycles accrued (not t-cycles) */
  private c: number = 0;

  private shouldRun: boolean = true;
  public stop() {
    this.shouldRun = false;
  }

  constructor(private mmu: MMU) {}

  public reset() {
    this.c = 0;
    this.r8.fill(0);
    this.r16.fill(0);
    this.r16[W.pc] = 0x0100;
    this.mmu.reset();
    this.mmu.leaveBios();
  }

  public fetchOp(): number {
    return this.mmu.rb(this.r16[W.pc]++);
  }

  public exec(cycles = Number.MAX_SAFE_INTEGER) {
    this.shouldRun = true;
    let opCode: number;
    let op: Function | undefined;
    while (this.shouldRun && this.c < cycles) {
      opCode = this.fetchOp();
      op = this.opMap.get(opCode);
      if (op) op.call(this);
      else console.warn(`OpCode not implemented [${opCode.toString(16)}]`);
    }
  }

  NOP() {
    this.c++;
  }
  LD_BC() {
    this.r8[C.b] = this.r16[W.pc]++;
    this.r8[C.c] = this.r16[W.pc]++;
    this.c++;
  }

  private opMap: Map<number, Function> = new Map([
    [OP.NOP, this.NOP],
    [OP.LD_BC, this.LD_BC],
  ]);
}
