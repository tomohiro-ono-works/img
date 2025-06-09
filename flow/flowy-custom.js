import { showSettingsModal } from './modal-manager.js';

let blockId = 1;

function drawLine(fromNode, toNode) {
  const svg = document.getElementById("svg-lines");
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  const x1 = fromNode.offsetLeft + fromNode.offsetWidth;
  const y1 = fromNode.offsetTop + fromNode.offsetHeight / 2;
  const x2 = toNode.offsetLeft;
  const y2 = toNode.offsetTop + toNode.offsetHeight / 2;

  line.setAttribute("x1", x1 - 220);
  line.setAttribute("y1", y1 - 62);
  line.setAttribute("x2", x2 - 220);
  line.setAttribute("y2", y2 - 62);
  line.setAttribute("stroke", "#999");
  line.setAttribute("stroke-width", "2");
  svg.appendChild(line);
}

function createNode() {
  const block = document.createElement("div");
  block.className = "create-block";
  block.style.left = "300px";
  block.style.top = "100px";
  block.setAttribute("data-block-id", blockId++);

  const content = document.createElement("div");
  content.className = "block-content";
  content.innerText = "クリックして設定";
  block.appendChild(content);

  const addButton = document.createElement("button");
  addButton.className = "add-button";
  addButton.textContent = "+";
  block.appendChild(addButton);

  content.addEventListener("click", () => {
    showSettingsModal(block);
  });

  addButton.addEventListener("click", () => {
    const newNode = createNode();
    const x = block.offsetLeft + 300;
    const y = block.offsetTop;
    newNode.style.left = `${x}px`;
    newNode.style.top = `${y}px`;
    document.getElementById("canvas").appendChild(newNode);
    drawLine(block, newNode);
  });

  document.getElementById("canvas").appendChild(block);
  return block;
}

window.onload = () => {
  flowy(document.getElementById("canvas"), { drag: false });
  createNode();
};
