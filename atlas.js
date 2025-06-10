const continent = document.getElementById('continent');
const listCountries = document.getElementById('listCountries');
const modal = new bootstrap.Modal(document.getElementById('windowCountry'));
const modalBody = document.getElementById("modal-body-content");

async function getData(region) {
    const url = `https://restcountries.com/v3.1/region/${region}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Chyba ${response.status}`);
        const json = await response.json();

        let blocks = '';
        json.forEach((country) => {
            blocks += `
                <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-4">
                    <div class="card h-100 shadow-sm">
                        <img class="card-img-top" src="${country.flags.png}" alt="Vlajka ${country.name.common}">
                        <div class="card-body">
                            <h5 class="card-title">${country.name.common}</h5>
                            <p class="card-text">Počet obyvatel: ${country.population.toLocaleString()}</p>
                            <a href="#" class="btn btn-info w-100" data-name="${country.name.common}">Informace</a>
                        </div>
                    </div>
                </div>
            `;
        });

        listCountries.innerHTML = blocks;

        document.querySelectorAll('[data-name]').forEach(button => {
            button.addEventListener('click', () => {
                const countryName = button.getAttribute('data-name');
                modal.show();
                modalBody.innerHTML = "Načítání...";
                fetch(`https://restcountries.com/v3.1/name/${countryName}`)
                    .then(res => res.json())
                    .then(data => {
                        const country = data[0];
                        modalBody.innerHTML = `
                            <h4>${country.name.common}</h4>
                            <img src="${country.flags.png}" class="img-fluid mb-3" alt="Vlajka">
                            <p><strong>Hlavní město:</strong> ${country.capital?.[0] ?? 'Neznámé'}</p>
                            <p><strong>Počet obyvatel:</strong> ${country.population.toLocaleString()}</p>
                            <p><strong>Rozloha:</strong> ${country.area.toLocaleString()} km²</p>
                            <p><strong>Region:</strong> ${country.region} (${country.subregion})</p>
                            <p><strong>Měna:</strong> ${Object.values(country.currencies ?? {}).map(c => `${c.name} (${c.symbol})`).join(', ')}</p>
                            <p><strong>Jazyky:</strong> ${Object.values(country.languages ?? {}).join(', ')}</p>
                            <p><strong>Časová zóna:</strong> ${country.timezones?.join(', ')}</p>
                        `;
                    })
                    .catch(error => {
                        modalBody.innerHTML = `<p class="text-danger">Chyba při načítání informací.</p>`;
                        console.error(error);
                    });
            });
        });

    } catch (error) {
        listCountries.innerHTML = `<p class="text-danger">Nepodařilo se načíst data.</p>`;
        console.error(error.message);
    }
}

continent.addEventListener('change', () => {
    getData(continent.value);
});

getData('europe');
