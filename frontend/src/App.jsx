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

  const handleSolve = async () => {
    console.log("Solve button clicked")
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Inventory Optimization Engine</h1>
      
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div>
          <h3>Shipping Cost Matrix</h3>
          <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              {cost.map((row, i) => (
                <tr key={i}>
                  {row.map((val, j) => (
                    <td key={j}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3>Warehouse Supply</h3>
          <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              {supply.map((val, i) => (
                <tr key={i}><td>{val}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3>Store Demand</h3>
          <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                {demand.map((val, i) => (
                  <td key={i}>{val}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <button 
        onClick={handleSolve} 
        style={{ marginTop: '2rem', padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer' }}
      >
        Calculate Optimal Route
      </button>
    </div>
  )
}

export default App