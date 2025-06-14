// Initialize chart
const ctx = document.getElementById("pulseChart").getContext("2d");

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        borderColor: "#ff6384",
        backgroundColor: "rgba(255,99,132,0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        type: "time",
        time: { unit: "minute", displayFormats: { minute: "HH:mm" } },
        ticks: { maxTicksLimit: 8, color: "#666" },
        grid: { color: "rgba(0,0,0,0.1)" },
      },
      y: {
        beginAtZero: true,
        ticks: {
          maxTicksLimit: 6,
          color: "#666",
          callback: (v) => v + "L",
        },
        grid: { color: "rgba(0,0,0,0.1)" },
      },
    },
  },
});

// Load initial chart data
async function loadData() {
  try {
    const res = await fetch("/api/chart-data");
    const data = await res.json();
    chart.data.labels = data.map((d) => new Date(d.time));
    chart.data.datasets[0].data = data.map((d) => d.value);
    chart.update("none");
  } catch (e) {
    console.error("Load error:", e);
  }
}

// Update chart with new data point
async function updateData() {
  try {
    const res = await fetch("/api/latest");
    const latest = await res.json();
    if (latest?.time && latest?.value !== undefined) {
      const newTime = new Date(latest.time);
      const lastTime = chart.data.labels[chart.data.labels.length - 1];

      if (!lastTime || newTime.getTime() !== lastTime.getTime()) {
        chart.data.labels.push(newTime);
        chart.data.datasets[0].data.push(latest.value);

        if (chart.data.labels.length > 30) {
          chart.data.labels.shift();
          chart.data.datasets[0].data.shift();
        }

        chart.update("none");
      }
    }
  } catch (e) {
    console.error("Update error:", e);
  }
}

loadData();
setInterval(updateData, 15000);
