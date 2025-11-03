let allData = []; 
let filteredData = []; 


document.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    
    document.getElementById('searchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        filterData();
    });
    
    document.getElementById('resetBtn').addEventListener('click', function() {
        document.getElementById('searchInput').value = '';
        document.getElementById('attributeSelect').value = 'all';
        filterData();
    });
    
    
    document.getElementById('downloadCsv').addEventListener('click', downloadFilteredCsv);
    document.getElementById('downloadJson').addEventListener('click', downloadFilteredJson);
});


async function loadData() {
    showLoading(true);
    
    try {
        const response = await fetch('/api/pjevaci');
        allData = await response.json();
        filteredData = [...allData];
        renderTable(filteredData);
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Greška pri učitavanju podataka');
    } finally {
        showLoading(false);
    }
}

function renderTable(data) {
    const container = document.getElementById('tableContainer');
    
    if (data.length === 0) {
        container.innerHTML = '<p>Nema podataka za prikaz.</p>';
        return;
    }
    
    let html = '<table><thead><tr>';
    
    
    const headers = [
        'Ime i prezime', 
        'Nadimak', 
        'Datum rođenja',
        'Mjesto rođenja',
        'Država', 
        'Žanr', 
        'Aktivan od',
        'Broj albuma',
        'Broj nagrada',
        'Najpoznatija pjesma',
        'Albumi (naziv)',
        'Godina izdanja',
        'Izdavačka kuća',
        'Trajanje (min)',
        'Broj pjesama'
    ];
    
    headers.forEach(header => {
        html += `<th>${header}</th>`;
    });
    
    html += '</tr></thead><tbody>';
    
    
    data.forEach(pjevac => {
    
        const datumRodjenja = pjevac.datum_rodjenja ? 
            new Date(pjevac.datum_rodjenja).toISOString().split('T')[0] : '';
        
        if (pjevac.albumi && pjevac.albumi.length > 0) {
            
            pjevac.albumi.forEach((album, index) => {
              
                const pjevacCells = index === 0 ? `
                    <td rowspan="${pjevac.albumi.length}">${pjevac.ime_prezime || ''}</td>
                    <td rowspan="${pjevac.albumi.length}">${pjevac.nadimak || ''}</td>
                    <td rowspan="${pjevac.albumi.length}">${datumRodjenja}</td>
                    <td rowspan="${pjevac.albumi.length}">${pjevac.mjesto_rodjenja || ''}</td>
                    <td rowspan="${pjevac.albumi.length}">${pjevac.drzava_podrijetla || ''}</td>
                    <td rowspan="${pjevac.albumi.length}">${pjevac.zanr || ''}</td>
                    <td rowspan="${pjevac.albumi.length}">${pjevac.aktivan_od || ''}</td>
                    <td rowspan="${pjevac.albumi.length}">${pjevac.broj_albuma || ''}</td>
                    <td rowspan="${pjevac.albumi.length}">${pjevac.broj_nagrada || ''}</td>
                    <td rowspan="${pjevac.albumi.length}">${pjevac.najpoznatije_pjesma || ''}</td>
                ` : '';
                
                html += `
                    <tr>
                        ${pjevacCells}
                        <td>${album.naziv_albuma || ''}</td>
                        <td>${album.godina_izdanja || ''}</td>
                        <td>${album.izdavacka_kuca || ''}</td>
                        <td>${album.trajanje_minuta || ''}</td>
                        <td>${album.broj_pjesama || ''}</td>
                    </tr>
                `;
            });
        } else {
           
            html += `
                <tr>
                    <td>${pjevac.ime_prezime || ''}</td>
                    <td>${pjevac.nadimak || ''}</td>
                    <td>${datumRodjenja}</td>
                    <td>${pjevac.mjesto_rodjenja || ''}</td>
                    <td>${pjevac.drzava_podrijetla || ''}</td>
                    <td>${pjevac.zanr || ''}</td>
                    <td>${pjevac.aktivan_od || ''}</td>
                    <td>${pjevac.broj_albuma || ''}</td>
                    <td>${pjevac.broj_nagrada || ''}</td>
                    <td>${pjevac.najpoznatije_pjesma || ''}</td>
                    <td colspan="5">Nema albuma</td>
                </tr>
            `;
        }
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}


function filterData() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const attribute = document.getElementById('attributeSelect').value;
    
    if (!searchText) {
        filteredData = [...allData];
    } else {
        filteredData = allData.filter(pjevac => {
            if (attribute === 'all') {
                
                const pjevacMatch = Object.values(pjevac).some(value => 
                    value && value.toString().toLowerCase().includes(searchText)
                );
                
                
                const albumiMatch = pjevac.albumi && pjevac.albumi.some(album => 
                    Object.values(album).some(albumValue => 
                        albumValue && albumValue.toString().toLowerCase().includes(searchText)
                    )
                );
                
                return pjevacMatch || albumiMatch;
                
            } else if (['naziv_albuma', 'godina_izdanja', 'izdavacka_kuca', 'trajanje_minuta', 'broj_pjesama'].includes(attribute)) {
                
                return pjevac.albumi && pjevac.albumi.some(album => {
                    if (attribute === 'godina_izdanja' || attribute === 'trajanje_minuta' || attribute === 'broj_pjesama') {
                       
                        return album[attribute] && album[attribute].toString().includes(searchText);
                    } else {
                        
                        return album[attribute] && album[attribute].toString().toLowerCase().includes(searchText);
                    }
                });
            } else {
              
                return pjevac[attribute] && pjevac[attribute].toString().toLowerCase().includes(searchText);
            }
        });
    }
    
    renderTable(filteredData);
}


function downloadFilteredJson() {
    if (filteredData.length === 0) {
        alert('Nema podataka za preuzimanje!');
        return;
    }
    
    const dataStr = JSON.stringify(filteredData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pjevaci_albumi_filtrirano.json';
    link.click();
    URL.revokeObjectURL(url);
}

function downloadFilteredCsv() {
    if (filteredData.length === 0) {
        alert('Nema podataka za preuzimanje!');
        return;
    }
    
    // NOVO ZAGLAVLJE - svi atributi pjevača + svi atributi albuma
    let csv = 'ImePrezime;Nadimak;DatumRodjenja;MjestoRodjenja;Drzava;Zanr;AktivanOd;BrojAlbuma;BrojNagrada;NajpoznatijaPjesma;' +
              'Album_Naziv;Album_Godina;Album_Izdavac;Album_Trajanje;Album_BrojPjesama\n';
    
    filteredData.forEach(pjevac => {
        const datumRodjenja = pjevac.datum_rodjenja ? 
            new Date(pjevac.datum_rodjenja).toISOString().split('T')[0] : '';
        
        const escapeCsv = (str) => {
            if (str === null || str === undefined) return '';
            const escaped = String(str).replace(/"/g, '""').replace(/\n/g, ' ');
            return escaped.includes(';') ? `"${escaped}"` : escaped;
        };
        
        // JEDAN RED PO ALBUMU (kao u tablici)
        if (pjevac.albumi && pjevac.albumi.length > 0) {
            pjevac.albumi.forEach(album => {
                let row = `${escapeCsv(pjevac.ime_prezime)};` +
                          `${escapeCsv(pjevac.nadimak)};` +
                          `${escapeCsv(datumRodjenja)};` +
                          `${escapeCsv(pjevac.mjesto_rodjenja)};` +
                          `${escapeCsv(pjevac.drzava_podrijetla)};` +
                          `${escapeCsv(pjevac.zanr)};` +
                          `${escapeCsv(pjevac.aktivan_od)};` +
                          `${escapeCsv(pjevac.broj_albuma)};` +
                          `${escapeCsv(pjevac.broj_nagrada)};` +
                          `${escapeCsv(pjevac.najpoznatije_pjesma)};` +
                          `${escapeCsv(album.naziv_albuma)};` +
                          `${escapeCsv(album.godina_izdanja)};` +
                          `${escapeCsv(album.izdavacka_kuca)};` +
                          `${escapeCsv(album.trajanje_minuta)};` +
                          `${escapeCsv(album.broj_pjesama)}\n`;
                
                csv += row;
            });
        } else {
            // Pjevač nema albume
            let row = `${escapeCsv(pjevac.ime_prezime)};` +
                      `${escapeCsv(pjevac.nadimak)};` +
                      `${escapeCsv(datumRodjenja)};` +
                      `${escapeCsv(pjevac.mjesto_rodjenja)};` +
                      `${escapeCsv(pjevac.drzava_podrijetla)};` +
                      `${escapeCsv(pjevac.zanr)};` +
                      `${escapeCsv(pjevac.aktivan_od)};` +
                      `${escapeCsv(pjevac.broj_albuma)};` +
                      `${escapeCsv(pjevac.broj_nagrada)};` +
                      `${escapeCsv(pjevac.najpoznatije_pjesma)};` +
                      `;;;;\n`;  // Prazni atributi albuma
            
            csv += row;
        }
    });
    
    // BOM za Excel
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csv;
    
    const dataBlob = new Blob([csvWithBOM], { type: 'text/csv; charset=utf-8' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pjevaci_albumi_filtrirano.csv';
    link.click();
    URL.revokeObjectURL(url);
}

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}