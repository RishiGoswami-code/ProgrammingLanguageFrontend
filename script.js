const backendUrl = "https://stackprograminglanguagebackend.onrender.com"; 

async function populateLanguages() {
  const res = await fetch(`${backendUrl}/languages`);
  const languages = await res.json();
  const select = document.getElementById('languageSelect');

  languages.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang;
    option.textContent = lang;
    select.appendChild(option);
  });
}

async function fetchTrendData(selectedLanguage = "") {
  const response = await fetch(`${backendUrl}/trend`);
  const data = await response.json();

  const grouped = {};

  data.forEach(item => {
    const year = item.Year;
    const lang = item.Language;
    const count = item.Count;

    if (selectedLanguage && lang.toLowerCase() !== selectedLanguage.toLowerCase()) return;

    if (!grouped[lang]) grouped[lang] = {};
    grouped[lang][year] = count;
  });

  const years = [...new Set(data.map(d => d.Year))].sort();

  const datasets = Object.entries(grouped).map(([lang, yearData]) => ({
    label: lang,
    data: years.map(y => yearData[y] || 0),
    fill: false,
    borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
    tension: 0.1
  }));

  renderChart(years, datasets);
}

let chart;

function renderChart(labels, datasets) {
  const ctx = document.getElementById('trendChart').getContext('2d');
  if (chart) chart.destroy(); 
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Programming Language Trend Over Years'
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#ffffff'
          }
        },
        y: {
          ticks: {
            color: '#ffffff'
          }
        }
      }
    }
  });
}

document.getElementById('languageSelect').addEventListener('change', (e) => {
  fetchTrendData(e.target.value);
});

populateLanguages();
fetchTrendData();
