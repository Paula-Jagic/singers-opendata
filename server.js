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



//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/api/v1/pjevaci', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', a.id,
              'naziv_albuma', a.naziv_albuma,
              'godina_izdanja', a.godina_izdanja,
              'izdavacka_kuca', a.izdavacka_kuca,
              'trajanje_minuta', a.trajanje_minuta,
              'broj_pjesama', a.broj_pjesama
            )
          ) FILTER (WHERE a.id IS NOT NULL), '[]'
        ) AS albumi
      FROM pjevaci p
      LEFT JOIN albumi a ON p.id = a.pjevac_id
      GROUP BY p.id
      ORDER BY p.ime_prezime;
    `;

    const result = await pool.query(query);

    res.status(200).json({
      status: "OK",
      message: "Fetched all singers",
      response: result.rows
    });
  } catch (error) {
    console.error('Error fetching singers:', error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error while fetching singers",
      response: null
    });
  }
});
//----------------------------------------------------------------------------------------------------------------------------------------------------------
//GET pojedinacni pjevac po ID-u
app.get('/api/v1/pjevaci/:id', async (req, res) => {
  const { id } = req.params;

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
      ) AS albumi
      FROM pjevaci p
      LEFT JOIN albumi a ON p.id = a.pjevac_id
      WHERE p.id = $1
      GROUP BY p.id
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: "Singer not found",
        response: null
      });
    }

    res.status(200).json({
      status: "OK",
      message: "Fetched singer",
      response: result.rows[0]
    });

  } catch (error) {
    console.error('Error fetching singer:', error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
      response: null
    });
  }
});

//----------------------------------------------------------------------------------------------------------------------------------------
// GET Dohvaćanje pjevača po žanru
app.get('/api/v1/pjevaci/zanr/:zanr', async (req, res) => {
  const { zanr } = req.params;
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
      ) AS albumi
      FROM pjevaci p
      LEFT JOIN albumi a ON p.id = a.pjevac_id
      WHERE LOWER(p.zanr) = LOWER($1)
      GROUP BY p.id
      ORDER BY p.ime_prezime
    `;
    const result = await pool.query(query, [zanr]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: `No singers found for genre: ${zanr}`,
        response: null
      });
    }

    res.status(200).json({
      status: "OK",
      message: `Fetched singers by genre: ${zanr}`,
      response: result.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
      response: null
    });
  }
});

// GET  Dohvaćanje albuma po godini izdanja
app.get('/api/v1/albumi/godina/:godina', async (req, res) => {
  const { godina } = req.params;
  try {
    const query = `
      SELECT 
        a.*,
        p.ime_prezime AS pjevac
      FROM albumi a
      LEFT JOIN pjevaci p ON a.pjevac_id = p.id
      WHERE a.godina_izdanja = $1
      ORDER BY a.naziv_albuma
    `;
    const result = await pool.query(query, [godina]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: `No albums found from year: ${godina}`,
        response: null
      });
    }

    res.status(200).json({
      status: "OK",
      message: `Fetched albums from year: ${godina}`,
      response: result.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
      response: null
    });
  }
});

// GET  Dohvaćanje pjevača aktivnih od određene godine
app.get('/api/v1/pjevaci/aktivni_od/:godina', async (req, res) => {
  const { godina } = req.params;
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
      ) AS albumi
      FROM pjevaci p
      LEFT JOIN albumi a ON p.id = a.pjevac_id
      WHERE p.aktivan_od >= $1
      GROUP BY p.id
      ORDER BY p.ime_prezime
    `;
    const result = await pool.query(query, [godina]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: `No singers found active from year: ${godina}`,
        response: null
      });
    }

    res.status(200).json({
      status: "OK",
      message: `Fetched singers active from year: ${godina}`,
      response: result.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
      response: null
    });
  }
});


//----------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.post('/api/v1/pjevaci', async (req, res) => {
  const {
    ime_prezime,
    nadimak,
    datum_rodjenja,
    mjesto_rodjenja,
    zanr,
    aktivan_od,
    broj_nagrada,
    broj_albuma,
    najpoznatije_pjesma,
    drzava_podrijetla
  } = req.body;

  try {
    //provjera obaveznih polja
    if (!ime_prezime || ime_prezime.trim() === "") {
      return res.status(400).json({
        status: "Error",
        message: "Obavezno je polje ime_prezime",
        response: null
      });
    }

    if (!zanr || zanr.trim() === "") {
      return res.status(400).json({
        status: "Error",
        message: "Obavezno je polje zanr",
        response: null
      });
    }

    // provjera postoji li već pjevač s istim imenom
    const checkQuery = `SELECT * FROM pjevaci WHERE LOWER(ime_prezime) = LOWER($1)`;
    const checkResult = await pool.query(checkQuery, [ime_prezime]);

    if (checkResult.rows.length > 0) {
      return res.status(409).json({
        status: "Error",
        message: `Singer '${ime_prezime}' already exists`,
        response: null
      });
    }

    // ako ne postoji, ubacujemo novog pjevača
    const insertQuery = `
      INSERT INTO pjevaci 
        (ime_prezime, nadimak, datum_rodjenja, mjesto_rodjenja, zanr, aktivan_od, broj_nagrada, broj_albuma, najpoznatije_pjesma, drzava_podrijetla)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `;
    const result = await pool.query(insertQuery, [
      ime_prezime,
      nadimak || null,
      datum_rodjenja || null,
      mjesto_rodjenja || null,
      zanr,
      aktivan_od || null,
      broj_nagrada || 0,
      broj_albuma || 0,
      najpoznatije_pjesma || null,
      drzava_podrijetla || null
    ]);

    res.status(201).json({
      status: "OK",
      message: "Singer created successfully",
      response: result.rows[0]
    });

  } catch (error) {
    console.error('Error creating singer:', error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
      response: null
    });
  }
});

//-----------------------------------------------------------------------------------------------------------------------------------------------------------
// PUT Ažuriranje pjevača po ID-u
app.put('/api/v1/pjevaci/:id', async (req, res) => {
  const { id } = req.params;
  const {
    ime_prezime,
    nadimak,
    datum_rodjenja,
    mjesto_rodjenja,
    zanr,
    aktivan_od,
    broj_nagrada,
    broj_albuma,
    najpoznatije_pjesma,
    drzava_podrijetla
  } = req.body;

  //provjera obaveznih polja
  if (!ime_prezime || !zanr) {
    return res.status(400).json({
      status: "Error",
      message: "Missing required fields: ime_prezime and zanr are required",
      response: null
    });
  }

  try {
    //provjera postoji li pjevač s tim ID-em
    const checkQuery = 'SELECT * FROM pjevaci WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: `Singer with ID ${id} not found`,
        response: null
      });
    }

    //update pjevača
    const updateQuery = `
      UPDATE pjevaci
      SET
        ime_prezime = $1,
        nadimak = $2,
        datum_rodjenja = $3,
        mjesto_rodjenja = $4,
        zanr = $5,
        aktivan_od = $6,
        broj_nagrada = $7,
        broj_albuma = $8,
        najpoznatije_pjesma = $9,
        drzava_podrijetla = $10
      WHERE id = $11
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      ime_prezime,
      nadimak || null,
      datum_rodjenja || null,
      mjesto_rodjenja || null,
      zanr,
      aktivan_od || null,
      broj_nagrada || 0,
      broj_albuma || 0,
      najpoznatije_pjesma || null,
      drzava_podrijetla || null,
      id
    ]);

    res.status(200).json({
      status: "OK",
      message: `Singer with ID ${id} updated successfully`,
      response: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating singer:', error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
      response: null
    });
  }
});
//------------------------------------------------------------------------------------------------------------------------------------------------------------------
// DELETE briSANJE pjevača po ID-u
app.delete('/api/v1/pjevaci/:id', async (req, res) => {
  const { id } = req.params;

  try {
    //provjera postoji li pjevač s tim ID-em
    const checkQuery = 'SELECT * FROM pjevaci WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: `Singer with ID ${id} not found`,
        response: null
      });
    }

    //brisanje pjevača
    const deleteQuery = 'DELETE FROM pjevaci WHERE id = $1 RETURNING *';
    const result = await pool.query(deleteQuery, [id]);

    res.status(200).json({
      status: "OK",
      message: `Singer with ID ${id} deleted successfully`,
      response: result.rows[0]
    });

  } catch (error) {
    console.error('Error deleting singer:', error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
      response: null
    });
  }
});
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/datatable', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'datatable.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
