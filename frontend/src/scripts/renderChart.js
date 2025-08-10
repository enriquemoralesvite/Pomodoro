// Chart y plugin ya están disponibles globalmente
const Chart = window.Chart;
const ChartDataLabels = window.ChartDataLabels;

Chart.register(ChartDataLabels);

window.addEventListener("DOMContentLoaded", renderPomodoroHistory);
window.addEventListener("resize", renderPomodoroHistory);

async function renderPomodoroHistory() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("Usuario cargado desde localStorage:", user);
    if (!user.id) throw new Error("Usuario no autenticado");

    const response = await fetch(`/src/scripts/timerApi.js`)
      .then(() => import("./timerApi.js"))
      .then(mod => mod.getTimerStats(user.id));

    console.log("Datos recibidos:", response.data);
    if (!response.success) throw new Error(response.error);

    const countsByDate = response.data
      .filter(item => item.session_type === "work")
      .reduce((acc, { session_date, count }) => {
        const key = new Date(session_date).toISOString().split("T")[0];
        acc[key] = (acc[key] || 0) + Number(count);
        return acc;
      }, {});

    const labels = [];
    const data = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      labels.push(
        date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3)
      );

      const isoKey = date.toISOString().split("T")[0];
      data.push(countsByDate[isoKey] || 0);
    }

    const ctx = document.getElementById("history");
    if (!ctx) return;

    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          data,
          borderWidth: 0,
          backgroundColor: "#ffffff60",
          borderRadius: 5,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#ffffff90" }
          },
          y: {
            beginAtZero: true,
            min: 0,
            max: 20,
            ticks: {
              stepSize: 2,
              color: "#ffffff90"
            },
            title: {
              display: true,
              text: "Completed Tasks",
              padding: { top: 10 },
              color: "#ffffff"
            },
            grid: { display: false },
          },
        },
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: "end",
            align: "top",
            formatter: value => value || "",
            color: "#ffffff",
            font: {
              weight: "bold",
              size: 14
            },
            offset: 4
          },
        },
      },
    });

  } catch (error) {
    console.error("Error al renderizar gráfico:", error);
  }
}