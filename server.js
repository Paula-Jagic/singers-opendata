const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.static(__dirname));


const pool = new Pool({
  user: 'postgres',          
  host: 'localhost',
  database: 'Singers',  
  password: 'bazepodataka',   
  port: 5433,
});




app.get('/api/pjevaci', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*,
        json_agg(
          json_build_object(
            'id', a.id,
            'naziv_albuma', a.naziv_albuma,
            'godina_izdanja', a.godina_izdanja,
            'izdavacka_kuca', a.izdavacka_kuca,
            'trajanje_minuta', a.trajanje_minuta,
            'broj_pjesama', a.broj_pjesama
          )
        ) as albumi
      FROM pjevaci p
      LEFT JOIN albumi a ON p.id = a.pjevac_id
      GROUP BY p.id
      ORDER BY p.ime_prezime
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/datatable', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'datatable.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});