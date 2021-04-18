enum OPCODES {
  NOP = 0x00,
  LD_BCnn = 0x01,
  LD_BCmA = 0x02,
  INC_BC = 0x03,
  INC_B = 0x04,
  DEC_B = 0x05,
  LD_Bn = 0x06,
  RLCA = 0x07,

  RLA = 0x17,

  HALT = 0x76,
}

export default OPCODES;
