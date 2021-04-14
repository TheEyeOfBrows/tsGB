import { Z80_GB, MMU } from "./hardware";

let currentFile: File;

let cpu: Z80_GB;
let mmu: MMU;

async function main() {
  addDom();
  mmu = new MMU();
  cpu = new Z80_GB(mmu);
}

function addDom() {
  {
    let fileSelect = document.createElement("input");
    fileSelect.type = "file";
    fileSelect.id = "file";
    fileSelect.name = "file";
    fileSelect.addEventListener("change", loadFile);
    document.body.appendChild(fileSelect);
  }
  {
    let run = document.createElement("button");
    run.textContent = "Run";
    run.addEventListener("click", onRunFile);
    document.body.appendChild(run);
  }
  {
    let stop = document.createElement("button");
    stop.textContent = "Stop";
    stop.addEventListener("click", onStop);
    document.body.appendChild(stop);
  }
}

async function loadFile(event: Event) {
  const element = event.currentTarget as HTMLInputElement;
  if (element.files && element.files.length > 0) {
    currentFile = element.files[0];
  }
}

async function onRunFile() {
  let buf = new Uint8Array(await currentFile.arrayBuffer());
  cpu.reset();
  mmu.loadRom(buf);
  cpu.exec(16);
}

function onStop() {
  cpu.stop();
}

main();
