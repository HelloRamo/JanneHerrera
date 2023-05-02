let start = null;
let end = null;
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = [];
  let width = 10;

  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("id", i);
      square.setAttribute("class", "node");
      square.addEventListener("click", (e) => {
        console.log({ e });
        const nodoid = e.target.id;
        if (!start) {
          start = nodoid;
          e.target.style.backgroundColor = "white";
        } else if (start && !end) {
          end = nodoid;
          e.target.style.backgroundColor = "black";
        }
        if (start && end) {
          drawDijkstra();
        }
      });
      grid.appendChild(square);
      squares.push(square);
    }
  }
  createBoard();
});
const drawDijkstra = () => {
  let camino = graph.Dijkstra(start, end);
  console.log({ camino });

  camino.nodosVisitados.forEach((nodo, index) => {
    setTimeout(() => {
      if (nodo != start && nodo != end) {
        htmlnodo = document.getElementById(nodo);
        htmlnodo.style.backgroundColor = "yellow";
      }
    }, index * 50);
  });
  camino.mascorto.forEach((nodo, index) => {
    setTimeout(() => {
      htmlnodo = document.getElementById(nodo);
      htmlnodo.style.backgroundColor = "blue";
    }, 50 * camino.nodosVisitados.length + index * 50);
  });
};
class Node {
  constructor(val, priority) {
    this.val = val;
    this.priority = priority;
  }
}

class PriorityQueue {
  constructor() {
    this.values = [];
  }
  enqueue(val, priority) {
    let newNode = new Node(val, priority);
    this.values.push(newNode);
    this.bubbleUp();
  }
  bubbleUp() {
    let idx = this.values.length - 1;
    const element = this.values[idx];
    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      let parent = this.values[parentIdx];
      if (element.priority >= parent.priority) break;
      this.values[parentIdx] = element;
      this.values[idx] = parent;
      idx = parentIdx;
    }
  }
  dequeue() {
    const min = this.values[0];
    const end = this.values.pop();
    if (this.values.length > 0) {
      this.values[0] = end;
      this.sinkDown();
    }
    return min;
  }
  sinkDown() {
    let idx = 0;
    const length = this.values.length;
    const element = this.values[0];
    while (true) {
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIdx < length) {
        leftChild = this.values[leftChildIdx];
        if (leftChild.priority < element.priority) {
          swap = leftChildIdx;
        }
      }
      if (rightChildIdx < length) {
        rightChild = this.values[rightChildIdx];
        if (
          (swap === null && rightChild.priority < element.priority) ||
          (swap !== null && rightChild.priority < leftChild.priority)
        ) {
          swap = rightChildIdx;
        }
      }
      if (swap === null) break;
      this.values[idx] = this.values[swap];
      this.values[swap] = element;
      idx = swap;
    }
  }
}

//Dijkstra's algorithm only works on a weighted graph.

class WeightedGraph {
  constructor() {
    this.adjacencyList = {};
  }
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
  }
  addEdge(vertex1, vertex2, weight) {
    this.adjacencyList[vertex1].push({ node: vertex2, weight });
    //this.adjacencyList[vertex2].push({ node: vertex1, weight });
  }
  Dijkstra(start, finish) {
    const nodes = new PriorityQueue();
    const distances = {};
    const previous = {};
    let path = []; //to return at end
    let smallest;
    let nodosVisitados = [];

    //build up initial state
    for (let vertex in this.adjacencyList) {
      if (vertex === start) {
        distances[vertex] = 0;
        nodes.enqueue(vertex, 0);
      } else {
        distances[vertex] = Infinity;
        nodes.enqueue(vertex, Infinity);
      }
      previous[vertex] = null;
    }
    // as long as there is something to visit
    while (nodes.values.length) {
      smallest = nodes.dequeue().val;
      if (smallest === finish) {
        //WE ARE DONE
        //BUILD UP PATH TO RETURN AT END
        while (previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest];
        }
        break;
      }
      if (smallest || distances[smallest] !== Infinity) {
        for (let neighbor in this.adjacencyList[smallest]) {
          console.log("Visitado: ", smallest);
          nodosVisitados.push(smallest);
          //find neighboring node
          let nextNode = this.adjacencyList[smallest][neighbor];
          //calculate new distance to neighboring node
          let candidate = distances[smallest] + nextNode.weight;
          let nextNeighbor = nextNode.node;
          if (candidate < distances[nextNeighbor]) {
            //updating new smallest distance to neighbor
            distances[nextNeighbor] = candidate;
            //updating previous - How we got to neighbor
            previous[nextNeighbor] = smallest;
            //enqueue in priority queue with new priority
            nodes.enqueue(nextNeighbor, candidate);
          }
        }
      }
    }
    return { mascorto: path.concat(smallest).reverse(), nodosVisitados };
  }
}
var graph = new WeightedGraph();

for (let i = 0; i < 100; i++) {
  graph.addVertex(i.toString());
}

for (let i = 0; i < 100; i++) {
  if (i % 10 !== 0) {
    graph.addEdge(i.toString(), (i - 1).toString(), 1);
  }
  if (i % 10 !== 9) {
    graph.addEdge(i.toString(), (i + 1).toString(), 1);
  }
  if (i - 10 > 0) {
    graph.addEdge(i.toString(), (i - 10).toString(), 1);
  }
  if (i + 10 < 100) {
    graph.addEdge(i.toString(), (i + 10).toString(), 1);
  }
}
