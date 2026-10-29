# Native Debugging

launch.json is the only ceremony. Walk the fields: type node, request launch, program pointing at src/index.ts, preLaunchTask building first, outFiles + sourceMaps so breakpoints land on the .ts. Then F5 — the debugger pauses exactly on the red dot.
