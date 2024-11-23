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

## DEV NOTES

- Used [material-ui](https://mui.com/material-ui) for components such as dialogs or buttons. I also created manual (and simple) buttons, just for demonstration.
- Completed tasks and also added SAVE and RESTART data.
- Created small and independent components with their unit tests.
- Default node names can be changed and again after dropping a new node. Added validation when changing name.
- Not sure what to do with EmailNode.tsx. The instructions don't mention anything about it.
- When covering accessibility, I tried to create a menu to add the nodes from mobile (I already made that responsive), but I looked into the ReactFlow properties and also in its repo to see if this was possible, and I didn't find a way. So this is something I'd like to have if I had more time to look into it.
- Follow instructions above to run the project and `npm run test` to run tests.
