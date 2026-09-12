/** Enrutador peatonal en el cliente: red de calles del parque (OSM) + Dijkstra. */
import streets from '@/content/streets.json';
import { distanceM, type LatLng } from './geo';

interface Graph { nodes: LatLng[]; adj: Array<Array<[number, number]>> }
let graph: Graph | null = null;

function getGraph(): Graph {
  if (graph) return graph;
  const nodes: LatLng[] = (streets.n as number[][]).map(([la, ln]) => [la / 1e6, ln / 1e6]);
  const adj: Array<Array<[number, number]>> = nodes.map(() => []);
  for (const [a, b] of streets.e as number[][]) {
    const d = distanceM(nodes[a], nodes[b]);
    adj[a].push([b, d]); adj[b].push([a, d]);
  }
  graph = { nodes, adj };
  return graph;
}

function nearestNode(p: LatLng): { id: number; d: number } {
  const { nodes } = getGraph();
  let best = 0, bd = Infinity;
  // filtro rápido por caja antes de la distancia exacta
  for (let i = 0; i < nodes.length; i++) {
    const dl = Math.abs(nodes[i][0] - p[0]) * 111000, dg = Math.abs(nodes[i][1] - p[1]) * 84000;
    if (dl > bd || dg > bd) continue;
    const d = distanceM(nodes[i], p);
    if (d < bd) { bd = d; best = i; }
  }
  return { id: best, d: bd };
}

/** Cola de prioridad mínima sencilla (heap binario). */
class MinHeap {
  private a: Array<[number, number]> = [];
  push(item: [number, number]) { this.a.push(item); let i = this.a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (this.a[p][0] <= this.a[i][0]) break; [this.a[p], this.a[i]] = [this.a[i], this.a[p]]; i = p; } }
  pop(): [number, number] | undefined {
    if (!this.a.length) return undefined;
    const top = this.a[0], last = this.a.pop()!;
    if (this.a.length) { this.a[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < this.a.length && this.a[l][0] < this.a[m][0]) m = l; if (r < this.a.length && this.a[r][0] < this.a[m][0]) m = r; if (m === i) break; [this.a[m], this.a[i]] = [this.a[i], this.a[m]]; i = m; } }
    return top;
  }
  get size() { return this.a.length; }
}

export interface WalkRoute { path: LatLng[]; distance: number; offNetwork: boolean }

/**
 * Camino a pie de `from` a `to` por las calles del parque. Si alguno de los puntos está
 * lejos de la red (> maxSnap m), se devuelve una línea recta y offNetwork=true.
 */
export function walkRoute(from: LatLng, to: LatLng, maxSnap = 120): WalkRoute {
  const g = getGraph();
  const a = nearestNode(from), b = nearestNode(to);
  const straight = distanceM(from, to);
  if (a.d > maxSnap || b.d > maxSnap || straight < 15) return { path: [from, to], distance: straight, offNetwork: true };
  const dist = new Float64Array(g.nodes.length).fill(Infinity);
  const prev = new Int32Array(g.nodes.length).fill(-1);
  const heap = new MinHeap();
  dist[a.id] = 0; heap.push([0, a.id]);
  while (heap.size) {
    const [d, u] = heap.pop()!;
    if (u === b.id) break;
    if (d > dist[u]) continue;
    for (const [v, w] of g.adj[u]) { const nd = d + w; if (nd < dist[v]) { dist[v] = nd; prev[v] = u; heap.push([nd, v]); } }
  }
  if (!isFinite(dist[b.id])) return { path: [from, to], distance: straight, offNetwork: true };
  const ids: number[] = []; for (let u = b.id; u !== -1; u = prev[u]) ids.unshift(u);
  const path: LatLng[] = [from, ...ids.map(i => g.nodes[i]), to];
  return { path, distance: a.d + dist[b.id] + b.d, offNetwork: false };
}
