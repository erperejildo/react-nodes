import { initialEdges, initialNodes } from '@/app/Constants';
import { NextRequest } from 'next/server';

export async function GET(request: Request) {
  return new Response(
    JSON.stringify({
      nodes: initialNodes || [],
      edges: initialEdges || [],
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export async function PUT(request: NextRequest) {
  try {
    const { nodes, edges } = await request.json();

    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid data format: nodes and edges must be arrays.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Data received successfully.',
        nodes,
        edges,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON input.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
