/** Address Map */
export enum MAP {
  /** Bios start */ BIOS = 0x0000,
  /** Bios end */ BIOS_END = 0x00ff,
  /** Bank 1 ROM */ ROM = 0x0000,
  /** Bank 2 Switchable ROM*/ SROM = 0x4000,
  /** Video RAM */ VRAM = 0x8000,
  /** Switchable RAM */ SRAM = 0xa000,
  /** Internal RAM */ RAM = 0xc000,
  /** RAM end */ RAM_END = 0xdfff,
  // Unusable address space 0xE000 - 0xFDFF
  /** Sprite Attributes */ SA = 0xfe00,
  /** Sprite Attributes End */ SA_END = 0xfe9f,
  // Unusable address space 0xFEA0 - 0xFEFF
  /** IO */ IO = 0xff00,
  /** IO End */ IO_END = 0xff4b,
  // Unusable address space 0xFE4C - 0xFF7F
  /** High RAM */ HRAM = 0xff80,
  /** Interrupt Register */ IR = 0xffff,
}

export default class MMU {
  private inBios = true;
  /** bios */
  private bios: Uint8Array = new Uint8Array(0x00ff);
  /** static rom */
  private rom: Uint8Array = new Uint8Array(0x4000);
  /** switchable rom */
  private srom: Uint8Array = new Uint8Array(0x4000);
  /** video ram */
  private vram: Uint8Array = new Uint8Array(0x2000);
  /** switchable ram */
  private sram: Uint8Array = new Uint8Array(0x2000);
  /** internal ram */
  private ram: Uint8Array = new Uint8Array(0x2000);
  /** sprite attributes */
  private sa: Uint8Array = new Uint8Array(0x00a0);
  /** input/output */
  private io: Uint8Array = new Uint8Array(0x004c);
  /** high ram */
  private hram: Uint8Array = new Uint8Array(0x007f);
  /** interrupt register */
  private ir: Uint8Array = new Uint8Array(0x0001);

  public reset() {
    this.inBios = true;
    this.bios.fill(0);
    this.rom.fill(0);
    this.srom.fill(0);
    this.vram.fill(0);
    this.sram.fill(0);
    this.ram.fill(0);
    this.sa.fill(0);
    this.io.fill(0);
    this.hram.fill(0);
    this.ir[0] = 0;
  }

  public leaveBios() {
    this.inBios = false;
  }

  /** Read Byte (uint8)*/
  public rb(addr: number): number {
    // read from bios
    if (this.inBios && addr <= MAP.BIOS_END) return this.bios[addr];
    // read from rom bank
    if (addr < MAP.SROM) return this.rom[addr];
    // read from srom bank
    if (addr < MAP.VRAM) return this.srom[addr - MAP.SROM];
    // read from video ram
    if (addr < MAP.SRAM) return this.vram[addr - MAP.VRAM];
    // read from switchable ram
    if (addr < MAP.RAM) return this.sram[addr - MAP.SRAM];
    // read from internal ram
    if (addr < MAP.RAM_END) return this.ram[addr - MAP.RAM];
    // unusable address space 1
    if (addr < MAP.SA) return 0; // throw error?
    // read from sprite attributes
    if (addr < MAP.SA_END) return this.sa[addr - MAP.SA];
    // unusable address space 2
    if (addr < MAP.IO) return 0;
    // read from input/output
    if (addr < MAP.IO_END) return this.io[addr - MAP.IO];
    // unusable address space 3
    if (addr < MAP.HRAM) return 0;
    //read from high ram
    if (addr < MAP.IR) return this.hram[addr - MAP.HRAM];
    // read from interrupt register (move to top?)
    if (addr === MAP.IR) return this.ir[0];

    throw Error(`MMU Address out of range [${addr.toString(16)}]`);
  }

  /** Read Word (uint16) */
  public rw(addr: number): number {
    // little endian
    return this.rb(addr) + (this.rb(addr + 1) << 8);
  }

  public wb(value: number, addr: number) {
    // write to bios
    if (this.inBios && addr <= MAP.BIOS_END) {
      this.bios[addr] = value;
      return;
    }
    // write to rom bank
    if (addr < MAP.SROM) {
      this.rom[addr] = value;
      return;
    }
    // write to srom bank
    if (addr < MAP.VRAM) {
      this.srom[addr - MAP.SROM] = value;
      return;
    }
    // write to video ram
    if (addr < MAP.SRAM) {
      this.vram[addr - MAP.VRAM] = value;
      return;
    }
    // write to switchable ram
    if (addr < MAP.RAM) {
      this.sram[addr - MAP.SRAM] = value;
      return;
    }
    // write to internal ram
    if (addr < MAP.RAM_END) {
      this.ram[addr - MAP.RAM] = value;
      return;
    }
    // unusable address space 1
    if (addr < MAP.SA) return; // throw error?
    // write to sprite attributes
    if (addr < MAP.SA_END) {
      this.sa[addr - MAP.SA] = value;
      return;
    }
    // unusable address space 2
    if (addr < MAP.IO) return;
    // write to input/output
    if (addr < MAP.IO_END) {
      this.io[addr - MAP.IO] = value;
      return;
    }
    // unusable address space 3
    if (addr < MAP.HRAM) return;
    // write to high ram
    if (addr < MAP.IR) {
      this.hram[addr - MAP.HRAM] = value;
      return;
    }
    // write to interrupt register (move to top?)
    if (addr === MAP.IR) {
      this.ir[0] = value;
      return;
    }
    throw Error(`MMU Address out of range [${addr.toString(16)}]`);
  }

  /** Write Word (uint16) */
  public ww(value: number, addr: number) {
    this.wb(value & 0xff, addr);
    this.wb(value >> 8, addr + 1);
  }

  /** Assign rom data to static ROM bank*/
  public loadRom1(rom: Uint8Array) {
    if (rom.byteLength > MAP.SROM - MAP.ROM) {
      console.warn("ROM looks big - overflow");
    }
    /* @ts-ignore - Uint8array set seems to be defined wrong */
    this.rom.set(rom);
  }

  /**
   * Assign rom data to static ROM switchable rom bank
   * TODO: implement more than 1 rom bank for srom
   */
  public loadRom2(rom: Uint8Array) {
    if (rom.byteLength > MAP.SROM - MAP.ROM) {
      console.warn("ROM looks big - overflow");
    }
    /* @ts-ignore - Uint8array set seems to be defined wrong */
    this.srom.set(rom);
  }

  /** Assign blob to the ROM banks */
  public loadRom(rom: Uint8Array) {
    this.loadRom1(rom.slice(0, MAP.SROM - MAP.ROM));
    if (rom.byteLength > MAP.SROM - MAP.ROM) {
      this.loadRom2(rom.slice(MAP.SROM - MAP.ROM));
    }
  }
}
