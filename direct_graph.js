/**
 * Definition for the graph node.
 * function Node(val) {
 *    this.weight = val;
 *  }
 */

/**
 * @param {[Node]} nodes, {[[Node, Node],[Node,Node]]} paths, {Node} head
 * @return {number}
 */

function getMaxWeight(nodes, paths, head) {
  if (!nodes.length || !paths.length || !head) {
    return 0;
  }
  const edges = new Map();
  for (let i = 0; i < paths.length; i++) {
    if (!edges.has(paths[i][0])) {
      edges.set(paths[i][0], [paths[i][1]]);
    } else {
      edges.get(paths[i][0]).push(paths[i][1]);
    }
  }
  const max = [0], map = new Map();
  DFS1(head, edges, max, [],  map);
  // DFS(head, edges, max, [], 0, map);
  return max[0];
}

// method v_1: memorized dfs
function DFS(head, edges, max, visited, value, map) {
  if (!edges.has(head)) {
    max[0] = Math.max(max[0], value + head.weight);
    return;
  }
  if (map.has(head)) {
    max[0] = Math.max(max[0], map.get(head));
    return;
  }
  for (let i = 0; i < edges.get(head).length; i++) {
    if (!visited.includes(head)) {
      visited.push(head);
      DFS(edges.get(head)[i], edges, max, visited, value + head.weight, map);
      map.set(head, max[0]);
      visited.pop();
    }
  }
}

// method v_2: memorized dfs
function DFS1(head, edges, max, visited, map) {
  if (!edges.has(head)) {
    return head.weight;
  }
  if (map.has(head)) {
    return map.get(head);
  }
  let maxTemp = 0;
  for (let i = 0; i < edges.get(head).length; i++) {
    if (!visited.includes(head)) {
      visited.push(head);
      maxTemp = Math.max(DFS1(edges.get(head)[i], edges, max, visited, map), maxTemp);
      visited.pop();
    }
  }
  if (maxTemp + head.weight > max[0]) {
    max[0] = maxTemp + head.weight;
  }
  map.set(head, max[0]);
  return max[0];
}

// test input
const test = [];
const a = new Node(4), b = new Node(2), c = new Node(4), d = new Node(3), e = new Node(11);

test.push(a);
test.push(b);
test.push(c);
test.push(d);
test.push(e);

const paths = [[a, b],[a, c], [a, e], [b, c], [b,d], [b,a], [c,d]];
console.log(getMaxWeight(test, paths, a));
