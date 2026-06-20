const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/solve', (req, res) => {
    const { cost, supply, demand } = req.body;
    
    
    let input = '';
    cost.forEach(row => input += row.join(' ') + ' ');
    input += '\n' + supply.join(' ') + '\n' + demand.join(' ') + '\n';

    
    const child = spawn('../solver.exe');
    let out = '';

    
    child.stdout.on('data', (data) => {
        out += data.toString();
    });

    
    child.on('close', () => {
        let parts = out.trim().split('\n');
        let ans = parseInt(parts[0]);
        let matrix = parts.slice(1).map(row => row.trim().split(' ').map(Number));
        
        res.json({ ans, matrix });
    });

    
    child.stdin.write(input);
    child.stdin.end();
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});