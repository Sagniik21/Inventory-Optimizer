#include <bits/stdc++.h>
using namespace std;

int cost[3][3] = {
    {2, 3, 1},
    {5, 4, 8},
    {5, 6, 8}
};
int supply[3] = {20, 30, 50};
int demand[3] = {30, 40, 30};

int ans = 1e9;
int cur[3][3];
int res[3][3];

void solve(int r, int c, int tot) {
    if (r == 3) {
        for (int i = 0; i < 3; i++) {
            if (demand[i] != 0) return;
        }
        for (int i = 0; i < 3; i++) {
            if (supply[i] != 0) return;
        }
        if (tot < ans) {
            ans = tot;
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    res[i][j] = cur[i][j];
                }
            }
        }
        return;
    }
    if (c == 3) {
        if (supply[r] == 0) {
            solve(r + 1, 0, tot);
        }
        return;
    }
    
    int mx = min(supply[r], demand[c]);
    for (int i = 0; i <= mx; i++) {
        cur[r][c] = i;
        supply[r] -= i;
        demand[c] -= i;
        solve(r, c + 1, tot + i * cost[r][c]);
        supply[r] += i;
        demand[c] += i;
        cur[r][c] = 0;
    }
}

int main() {
    solve(0, 0, 0);
    cout << "Min Cost: " << ans << "\n";
    cout << "Allocation Matrix:\n";
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            cout << res[i][j] << " ";
        }
        cout <<endl;
    }
}