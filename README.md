# Enterprise Inventory Logistics Optimizer 

A high-performance, full-stack supply chain routing engine designed to solve the classical Transportation Problem at an enterprise scale. 

This application calculates the absolute minimum freight cost required to fulfill retail demand from multiple distribution warehouses. It bypasses the combinatorial explosion of naive backtracking by utilizing a **Min-Cost Max-Flow (MCMF)** graph algorithm written in C++, bridged to a React.js analytics dashboard via a Node.js gateway.

## 🚀 Key Features

* **Dynamic Matrix Scaling:** Dynamically add or remove an $M \times N$ number of warehouses and retail locations on the fly.
* **Algorithmic Graph Engine:** Replaces exponential-time backtracking ($O(N!)$) with a polynomial-time MCMF algorithm using the Shortest Path Faster Algorithm (SPFA) over a bipartite graph, reducing compute time from hours to milliseconds.
* **Business Intelligence Dashboard:** Automatically calculates a naive "Greedy Baseline" routing cost and compares it against the graph-optimized cost to display real-time capital savings and active freight lane metrics.
* **Full-Stack IPC Bridge:** Utilizes Node.js child processes to seamlessly stream JSON payloads into standard C++ I/O streams and parse the matrix results back to the client.

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, CSS
* **Backend Gateway:** Node.js, Express.js, CORS
* **Algorithmic Core:** C++17 (compiled via `g++` with `-O3` optimization)

## ⚙️ Local Installation & Setup

To run this application locally, you must have [Node.js](https://nodejs.org/) and a C++ compiler (like MinGW/GCC) installed.

### 1. Compile the C++ Engine
Navigate to the root directory and compile the solver with optimization flags:
```powershell
g++ -O3 solver.cpp -o solver
