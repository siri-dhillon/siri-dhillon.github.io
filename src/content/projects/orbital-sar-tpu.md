---
title: Orbital SAR processing on Trillium TPUs
slug: orbital-sar-tpu
summary: An open SAR processing stack built to run on a Google Trillium TPU in orbit, taking in raw radar echoes and sending out small, prioritized alerts.
industry: space & Earth observation (independent R&D)
category: Systems/Edge
year: 2026
role: Sole engineer
problem: Synthetic-aperture radar satellites collect far more raw data than they can downlink. Focusing and analysis happen on the ground, hours after capture, which is too slow for time-critical uses like maritime monitoring.
solution: A Python SAR pipeline designed to run onboard. A NumPy range-Doppler reference (range compression, RCMC, azimuth compression) is the ground truth, a JAX port targets Trillium TPU hardware, and a point-target simulator with quality metrics serves as the test oracle. Real-data foundations are in place too, with a Sentinel-1C stripmap scene over Galveston Bay, precise orbits, and NOAA AIS ship tracks for later detection and fusion.
stack: [Python, NumPy, JAX, Sentinel-1, AIS, pytest, uv, GitHub Actions]
outcome: Focused synthetic targets match theory. Range resolution measured 2.65 m against a theoretical 2.66 m, with −13.5 dB range PSLR, and quality is identical at near, mid, and far range. Next steps are focusing real Level-0 data, benchmarking CPU vs Trillium TPU, and ship detection.
featured: true
# Hidden until milestones M2/M2b are done — set draft: false to publish.
draft: true
order: 1
confidential: false
---

## How SAR focusing works

A SAR doesn't take pictures. It sends chirps and records echoes, and every point on the
ground is smeared in two directions:

- **Range:** across the chirp length. *Range compression* is a matched filter against the transmitted chirp.
- **Azimuth:** across every pulse while the target sits in the beam, with a Doppler history from the satellite's motion. *Azimuth compression* is a second matched filter.
- **Between them:** the target's range changes as the satellite passes, so its energy curves across range bins. *Range cell migration correction (RCMC)* straightens it. Skipping it here cost about 20% in azimuth resolution (6.0 m vs 5.0 m).

Each step is linear (FFTs and element-wise multiplies), which is why the whole chain maps
well onto matrix hardware like TPUs.

## Engineering approach

- **Reference first.** Every faster implementation is checked against the NumPy reference and the simulator's metrics.
- **Reproducible data.** Scene manifests pin URLs, sizes, and checksums, and downloads are verified and resumable.
- **Decisions on record.** Architecture decision records cover package structure, data and secrets handling, CI, and host-side filter precision.

## Roadmap

Real Sentinel-1 Level-0 focusing validated against ESA's SLC → IW/TOPS mode → CPU vs Trillium TPU
benchmark → maritime detection with AIS fusion → mission simulator (orbits, ground stations,
time-to-alert) → onboard artifact.
