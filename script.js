const backendURL = 'https://stackprograminglanguagebackend.onrender.com';

async function fetchTrendData() {
  const response = await fetch(`${backendURL}/trend`);
  const data = await response.json();

  const grouped = {};
  data.forEach(item => {
    const year = item.Year;
    const lang = item.Language;
    const count = item.Count;

    if (!grouped[lang]) grouped[lang] = {};
    grouped[lang][year] = count;
  });

  const years = [...new Set(data.map(d => d.Year))].sort();
  const datasets = Object.entries(grouped).map(([lang, yearData]) => ({
    label: lang,
    data: years.map(y => yearData[y] || 0),
    fill: false,
    borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
    tension: 0.3
  }));

  const ctx = document.getElementById('trendChart').getContext('2d');
  window.trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: datasets
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Programming Language Trend (Based on StackOverflow)',
          color: '#00ffcc',
          font: {
            size: 18
          }
        },
        legend: {
          labels: {
            color: '#fff'
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#ccc' },
          grid: { color: '#333' }
        },
        y: {
          ticks: { color: '#ccc' },
          grid: { color: '#333' }
        }
      }
    }
  });
}

fetchTrendData();
