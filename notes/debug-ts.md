# Debugging TypeScript

Runtime only ever sees JavaScript. Follow the flow: you write index.ts, tsc emits JS plus a .js.map, Node runs the JS, and VS Code uses the map to pause on your original .ts line. If breakpoints stay grey — sourceMap is the first suspect (see the pitfalls slide).
