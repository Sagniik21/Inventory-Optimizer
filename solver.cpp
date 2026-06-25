#include <bits/stdc++.h>
using namespace std;

struct Edge {
    int to, cap, flow, cost, rev;
};

int main() {
    int M, N;
    if (!(cin >> M >> N)) return 0;
    
    vector<vector<int>> cost(M, vector<int>(N));
    for(int i=0; i<M; ++i)
        for(int j=0; j<N; ++j)
            cin >> cost[i][j];
            
    vector<int> supply(M), demand(N);
    for(int i=0; i<M; ++i) cin >> supply[i];
    for(int j=0; j<N; ++j) cin >> demand[j];
    
    int S = 0, T = M + N + 1;
    vector<vector<Edge>> adj(T + 1);
    
    auto addEdge = [&](int from, int to, int cap, int cst) {
        adj[from].push_back({to, cap, 0, cst, (int)adj[to].size()});
        adj[to].push_back({from, 0, 0, -cst, (int)adj[from].size() - 1});
    };
    
    for(int i=0; i<M; ++i) addEdge(S, i + 1, supply[i], 0);
    for(int j=0; j<N; ++j) addEdge(M + 1 + j, T, demand[j], 0);
    for(int i=0; i<M; ++i)
        for(int j=0; j<N; ++j)
            addEdge(i + 1, M + 1 + j, 1e9, cost[i][j]);
            
    int ans = 0;
    vector<vector<int>> res(M, vector<int>(N, 0));
    
    while(true) {
        vector<int> dist(T + 1, 1e9);
        vector<int> parent_edge(T + 1, -1);
        vector<int> parent_node(T + 1, -1);
        vector<bool> flag(T + 1, false);
        queue<int> q;
        
        dist[S] = 0;
        q.push(S);
        flag[S] = true;
        
        while(!q.empty()) {
            int u = q.front(); 
            q.pop();
            flag[u] = false;
            
            for(int i=0; i<adj[u].size(); ++i) {
                Edge& e = adj[u][i];
                if(e.cap - e.flow > 0 && dist[e.to] > dist[u] + e.cost) {
                    dist[e.to] = dist[u] + e.cost;
                    parent_node[e.to] = u;
                    parent_edge[e.to] = i;
                    if(!flag[e.to]) {
                        q.push(e.to);
                        flag[e.to] = true;
                    }
                }
            }
        }
        
        if(dist[T] == 1e9) break;
        
        int cur = 1e9;
        for(int u = T; u != S; u = parent_node[u]) {
            int p = parent_node[u];
            int idx = parent_edge[u];
            cur = min(cur, adj[p][idx].cap - adj[p][idx].flow);
        }
        
        for(int u = T; u != S; u = parent_node[u]) {
            int p = parent_node[u];
            int idx = parent_edge[u];
            int rev_idx = adj[p][idx].rev;
            adj[p][idx].flow += cur;
            adj[u][rev_idx].flow -= cur;
            ans += cur * adj[p][idx].cost;
        }
    }
    
    cout << ans << "\n";
    
    for(int i=0; i<M; ++i) {
        for(Edge& e : adj[i+1]) {
            if(e.to >= M + 1 && e.to <= M + N) {
                res[i][e.to - M - 1] = e.flow;
            }
        }
    }
    
    for(int i=0; i<M; ++i) {
        for(int j=0; j<N; ++j) {
            cout << res[i][j] << " ";
        }
        cout << "\n";
    }
    
    return 0;
}