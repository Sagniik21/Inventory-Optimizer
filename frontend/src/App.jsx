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
    const newCost = [...cost];
    newCost[i][j] = Number(val) || 0;
    setCost(newCost);
  };

  const handleSupplyChange = (i, val) => {
    const newSupply = [...supply];
    newSupply[i] = Number(val) || 0;
    setSupply(newSupply);
  };

  const handleDemandChange = (i, val) => {
    const newDemand = [...demand];
    newDemand[i] = Number(val) || 0;
    setDemand(newDemand);
  };

  const handleSolve = async () => {
    setAns(null); 
    setRes(null);
    
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
      alert("Could not connect to the engine. Is your Node server running?");
    }
  }
  const inputStyle = { width: '50px', padding: '5px', textAlign: 'center' };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Inventory Optimization Engine</h1>
      <p style={{ color: '#555', marginBottom: '2rem' }}>
        Edit the supply, demand, and shipping costs below to recalculate the optimal route.
      </p>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div>
          <h3>Shipping Cost Matrix</h3>
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
                        style={inputStyle}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3>Warehouse Supply</h3>
          <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              {supply.map((val, i) => (
                <tr key={i}>
                  <td>
                    <input 
                      type="number" 
                      value={val} 
                      onChange={(e) => handleSupplyChange(i, e.target.value)}
                      style={inputStyle}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3>Store Demand</h3>
          <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                {demand.map((val, i) => (
                  <td key={i}>
                    <input 
                      type="number" 
                      value={val} 
                      onChange={(e) => handleDemandChange(i, e.target.value)}
                      style={inputStyle}
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
        style={{ marginTop: '2rem', padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Calculate Optimal Route
      </button>

      {/* 5. The Results Panel */}
      {ans !== null && res !== null && (
        <div style={{ marginTop: '3rem', padding: '2rem', border: '3px solid #28a745', borderRadius: '8px', display: 'inline-block' }}>
          <h2 style={{ color: '#28a745', marginTop: 0 }}>Optimization Complete</h2>
          <p style={{ fontSize: '1.5rem' }}><strong>Absolute Minimum Cost:</strong> ${ans}</p>
          
          <h3>Optimal Route Allocation</h3>
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