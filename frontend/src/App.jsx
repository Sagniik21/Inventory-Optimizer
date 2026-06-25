import { useState } from 'react'
import './App.css'

function App() {
  const [cost, setCost] = useState([
    [2, 3, 1],
    [5, 4, 8],
    [5, 6, 8]
  ])
  const [supply, setSupply] = useState([20, 30, 50])
  const [demand, setDemand] = useState([30, 40, 30])
  const [ans, setAns] = useState(null)
  const [res, setRes] = useState(null)

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
    setAns(null); setRes(null);
  };

  const removeWarehouse = () => {
    if (cost.length > 1) {
      setCost(cost.slice(0, -1));
      setSupply(supply.slice(0, -1));
      setAns(null); setRes(null);
    }
  };

  const addStore = () => {
    setCost(cost.map(row => [...row, 0]));
    setDemand([...demand, 0]);
    setAns(null); setRes(null);
  };

  const removeStore = () => {
    if (cost[0].length > 1) {
      setCost(cost.map(row => row.slice(0, -1)));
      setDemand(demand.slice(0, -1));
      setAns(null); setRes(null);
    }
  };

  const handleSolve = async () => {
    setAns(null); setRes(null);
    try {
      const response = await fetch('http://localhost:5000/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cost, supply, demand })
      });
      const data = await response.json();
      setAns(data.ans);
      setRes(data.matrix);
    } catch (error) {
      console.error("API Error:", error);
      alert("Verification failed. Check local server routing.");
    }
  }

  const btnStyle = { padding: '6px 12px', marginRight: '8px', cursor: 'pointer', fontWeight: 'bold' };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Enterprise Inventory Optimizer (Dynamic Scale)</h1>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <button onClick={addWarehouse} style={btnStyle}>+ Add Warehouse</button>
        <button onClick={removeWarehouse} style={btnStyle}>- Remove Warehouse</button>
        <button onClick={addStore} style={btnStyle}>+ Add Store</button>
        <button onClick={removeStore} style={btnStyle}>- Remove Store</button>
      </div>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div>
          <h3>Routing Cost Grid</h3>
          <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              {cost.map((row, i) => (
                <tr key={i}>
                  {row.map((val, j) => (
                    <td key={j}>
                      <input 
                        type="number" 
                        value={val} 
                        onChange={(e) => handleCostChange(i, j, e.target.value)}
                        style={{ width: '50px', textAlign: 'center' }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3>Warehouse Supply Cap</h3>
          <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              {supply.map((val, i) => (
                <tr key={i}>
                  <td>
                    <input 
                      type="number" 
                      value={val} 
                      onChange={(e) => {
                        const s = [...supply]; s[i] = Number(e.target.value) || 0; setSupply(s);
                      }}
                      style={{ width: '50px', textAlign: 'center' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3>Retail Location Demand</h3>
          <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                {demand.map((val, i) => (
                  <td key={i}>
                    <input 
                      type="number" 
                      value={val} 
                      onChange={(e) => {
                        const d = [...demand]; d[i] = Number(e.target.value) || 0; setDemand(d);
                      }}
                      style={{ width: '50px', textAlign: 'center' }}
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
        style={{ marginTop: '2rem', padding: '12px 24px', fontSize: '1.2rem', cursor: 'pointer', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Execute Optimization Solver
      </button>

      {ans !== null && res !== null && (
        <div style={{ marginTop: '3rem', padding: '2rem', border: '3px solid #28a745', borderRadius: '8px', display: 'inline-block' }}>
          <h2 style={{ color: '#28a745', marginTop: 0 }}>Optimization Profile Loaded</h2>
          <p style={{ fontSize: '1.5rem' }}><strong>Targeted Minimum Overhead:</strong> ${ans}</p>
          <h3>Calculated Freight Matrix</h3>
          <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', textAlign: 'center' }}>
            <tbody>
              {res.map((row, i) => (
                <tr key={i}>
                  {row.map((val, j) => (
                    <td key={j} style={{ backgroundColor: val > 0 ? '#d4edda' : 'transparent', fontWeight: val > 0 ? 'bold' : 'normal' }}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default App