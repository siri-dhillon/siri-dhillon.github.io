---
title: FPGA graphics & Missile Command on Zynq
slug: fpga-graphics-zynq
summary: Custom hardware on a Xilinx Zynq-7000, including a double-buffered 1080p VGA core and a hardware version of Missile Command.
industry: embedded systems (SFU engineering)
category: Systems/Edge
year: 2021
role: Hardware & embedded software engineer
problem: Getting smooth, tear-free graphics and a playable game out of a ZedBoard means splitting the work between programmable logic and the processor, and moving pixel data through DDR memory efficiently.
solution: A VGA display core that keeps its frame buffers in Zedboard DDR memory and switches between two buffers (double buffering) to avoid screen tearing. On top of that, Atari's Missile Command re-implemented with custom VHDL hardware blocks and a MicroBlaze soft processor. Related work includes PWM and audio controllers, a hardware square-root accelerator, and a custom Vivado IP repository.
stack: [VHDL, C, Xilinx Vivado, Zynq-7000, MicroBlaze, AXI, VGA, DDR]
outcome: The VGA core displays up to 1920×1080 without tearing, and the game runs on custom hardware blocks.
featured: false
order: 6
links:
  repo: https://github.com/siri-dhillon/EmbeddedVGA_Zynq
confidential: false
---
