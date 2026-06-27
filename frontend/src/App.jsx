import { useState } from 'react'
import './App.css'

function App() {
  const [cost, setCost] = useState([
    [2, 4, 1, 5],
    [3, 1, 6, 2],
    [5, 3, 2, 4]
  ])
  const [supply, setSupply] = useState([20, 30, 40])
  const [demand, setDemand] = useState([15, 25, 20, 30])
  const [ans, setAns] = useState(null)
  const [res, setRes] = useState(null)
  const [baseline, setBaseline] = useState(null)

  const handleCostChange = (i, j, val) => {
    const newCost = cost.map((row, rIdx) => 
      row.map((col, cIdx) => (rIdx === i && cIdx === j ? (Number(val) || 0) : col))
    );
    setCost(newCost);
  };

  const addWarehouse = () => {
    const numStores = cost[0].length;
    setCost([...cost, Array(numStores).fill(0)]);
    setSupply([...supply, 0]);
    setAns(null); setRes(null); setBaseline(null);
  };

  const removeWarehouse = () => {
    if (cost.length > 1) {
      setCost(cost.slice(0, -1));
      setSupply(supply.slice(0, -1));
      setAns(null); setRes(null); setBaseline(null);
    }
  };

  const addStore = () => {
    setCost(cost.map(row => [...row, 0]));
    setDemand([...demand, 0]);
    setAns(null); setRes(null); setBaseline(null);
  };

  const removeStore = () => {
    if (cost[0].length > 1) {
      setCost(cost.map(row => row.slice(0, -1)));
      setDemand(demand.slice(0, -1));
      setAns(null); setRes(null); setBaseline(null);
    }
  };

  const calculateGreedyBaseline = () => {
    let sCopy = [...supply];
    let dCopy = [...demand];
    let cells = [];
    
    for (let i = 0; i < cost.length; i++) {
      for (let j = 0; j < cost[0].length; j++) {
        cells.push({ r: i, c: j, cst: cost[i][j] });
      }
    }
    cells.sort((a, b) => a.cst - b.cst);

    let baselineCost = 0;
    for (let cell of cells) {
      let allocation = Math.min(sCopy[cell.r], dCopy[cell.c]);
      baselineCost += allocation * cell.cst;
      sCopy[cell.r] -= allocation;
      dCopy[cell.c] -= allocation;
    }
    return baselineCost;
  };

  const handleSolve = async () => {
    const totalSupply = supply.reduce((a, b) => a + b, 0);
    const totalDemand = demand.reduce((a, b) => a + b, 0);

    if (totalSupply !== totalDemand) {
      alert(`CRITICAL ERROR: Matrix Imbalance!\n\nTotal Warehouse Supply: ${totalSupply}\nTotal Store Demand: ${totalDemand}\n\nYou must balance supply and demand metrics before execution.`);
      return;
    }

    setAns(null); setRes(null); setBaseline(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cost, supply, demand })
      });
      const data = await response.json();
      
      const baseCost = calculateGreedyBaseline();
      setBaseline(baseCost);
      setAns(data.ans);
      setRes(data.matrix);
    } catch (error) {
      console.error("API Error:", error);
      alert("Verification failed. Check local server routing.");
    }
  }
  const getActiveLanesCount = () => {
    if (!res) return 0;
    return res.reduce((acc, row) => acc + row.filter(val => val > 0).length, 0);
  };

  const btnStyle = { padding: '8px 14px', marginRight: '8px', cursor: 'pointer', fontWeight: 'bold', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f8f9fa' };
  const cardStyle = { padding: '1.5rem', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff', textAlign: 'center', minWidth: '160px', flex: 1 };

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      <h1 style={{ marginTop: 0, color: '#0f172a' }}>Enterprise Inventory Logistics Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Configure fleet routing options to calculate optimized graph-network allocations across distribution centers.</p>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <button onClick={addWarehouse} style={btnStyle}>+ Add Warehouse</button>
        <button onClick={removeWarehouse} style={btnStyle}>- Remove Warehouse</button>
        <button onClick={addStore} style={btnStyle}>+ Add Store</button>
        <button onClick={removeStore} style={btnStyle}>- Remove Store</button>
      </div>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginTop: 0, color: '#334155' }}>Routing Cost Grid</h3>
          <table border="0" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              {cost.map((row, i) => (
                <tr key={i}>
                  {row.map((val, j) => (
                    <td key={j} style={{ padding: '4px' }}>
                      <input 
                        type="number" 
                        value={val} 
                        onChange={(e) => handleCostChange(i, j, e.target.value)}
                        style={{ width: '55px', padding: '6px', textAlign: 'center', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginTop: 0, color: '#334155' }}>Warehouse Supply Cap</h3>
          <table border="0" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              {supply.map((val, i) => (
                <tr key={i}>
                  <td style={{ padding: '4px' }}>
                    <input 
                      type="number" 
                      value={val} 
                      onChange={(e) => {
                        const s = [...supply]; s[i] = Number(e.target.value) || 0; setSupply(s);
                      }}
                      style={{ width: '55px', padding: '6px', textAlign: 'center', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginTop: 0, color: '#334155' }}>Retail Location Demand</h3>
          <table border="0" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                {demand.map((val, i) => (
                  <td key={i} style={{ padding: '4px' }}>
                    <input 
                      type="number" 
                      value={val} 
                      onChange={(e) => {
                        const d = [...demand]; d[i] = Number(e.target.value) || 0; setDemand(d);
                      }}
                      style={{ width: '55px', padding: '6px', textAlign: 'center', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <button 
        onClick={handleSolve} 
        style={{ padding: '14px 28px', fontSize: '1.1rem', cursor: 'pointer', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
      >
        Execute Optimization Solver
      </button>

      {ans !== null && res !== null && baseline !== null && (
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ color: '#0f172a', marginBottom: '1.5rem' }}>Operational Performance Analytics</h2>
          
          {/* Executive KPI Grid */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <div style={{ ...cardStyle, borderLeft: '4px solid #2563eb' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Optimized Overhead</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#2563eb', marginTop: '0.5rem' }}>${ans}</div>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #64748b' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Greedy Baseline</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#64748b', marginTop: '0.5rem' }}>${baseline}</div>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #16a34a', backgroundColor: '#f0fdf4' }}>
              <div style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 'bold', textTransform: 'uppercase' }}>Capital Capital Saved</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#16a34a', marginTop: '0.5rem' }}>
                ${baseline - ans} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>({baseline > 0 ? Math.round(((baseline - ans) / baseline) * 100) : 0}%)</span>
              </div>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #4f46e5' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Active Freight Lanes</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#4f46e5', marginTop: '0.5rem' }}>{getActiveLanesCount()}</div>
            </div>
          </div>

          {/* Detailed Allocation Plan */}
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'inline-block', minWidth: '400px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.25rem', color: '#334155' }}>Optimal Route Load Allocation</h3>
            <table border="1" cellPadding="12" style={{ borderCollapse: 'collapse', borderColor: '#e2e8f0', textAlign: 'center', width: '100%' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  {res[0].map((_, idx) => <th key={idx} style={{ color: '#475569', fontSize: '0.9rem' }}>Store {idx + 1}</th>)}
                </tr>
              </thead>
              <tbody>
                {res.map((row, i) => (
                  <tr key={i}>
                    {row.map((val, j) => (
                      <td key={j} style={{ backgroundColor: val > 0 ? '#e2f5e9' : 'transparent', fontWeight: val > 0 ? 'bold' : 'normal', color: val > 0 ? '#15803d' : '#94a3b8', transition: 'background-color 0.2s' }}>
                        {val > 0 ? `${val} units` : '0'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default App