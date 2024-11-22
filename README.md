# Senior frontend role

## Create a simple automation builder

The goal of that exercice is to create an automation builder containing nodes (that could be actions) and edges (to link nodes with each other) using the code in this repo.

This repo uses:

- [Next.js](https://nextjs.org/docs) (React, Typescript)
- [ReactFlow](https://reactflow.dev/learn)
- CSS (in order to keep it simple)

Overall feel free to use any libs you want but please explain your reasoning.

Spend the time you want/can allocate, if something isn't fully working/done, just explain what it should have been and how you would have done it.

### Exercice

- Create/Edit nodes
  - create a modal allowing the user to edit the node name: DONE
  - this modal should also opens when dropping a node to the builder: DONE
- Save feature
  - Using Next.js create an endpoint that allows to "save" the nodes/edges: DONE
    - don't bother saving it for real, just validate the data: DONE (including saving)
- Be creative

> Have fun!

### What we expect from you

We are not expecting from candidates to have the best automation builder tool as possible.
We only look at the code, and how you would work in an asynchronous work environment.

- Clean code
- Some unit tests
  - Don't write tests just for the sake of writing tests
  - If you don't have time to write them, list them and explain the strategy
- Some nice UI

## Getting Started

First, run the development server:

```bash
nvm use
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
