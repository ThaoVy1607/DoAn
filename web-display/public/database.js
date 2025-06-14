async function fetchData() {
  try {
    const res = await fetch("/api/data");
    const data = await res.json();
    const list = document.getElementById("dataList");
    list.innerHTML = ""; // Clear old data

    data.forEach((item) => {
      const dateStr = item.date || item._id;
      let formattedDate;

      try {
        // Parse the date string (format: YYYY-MM-DD)
        const [year, month, day] = dateStr.split("-");
        const dateObj = new Date(year, month - 1, day);
        formattedDate = dateObj.toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      } catch (error) {
        formattedDate = dateStr; // Fallback to original string
      }

      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${formattedDate}</td>
      <td>Tổng ngày</td>
      <td>${item.totalValue || 0}</td>
    `;
      list.appendChild(row);
    });
  } catch (err) {
    document.getElementById("dataList").innerHTML = `
      <tr><td colspan="3">Lỗi kết nối server!</td></tr>
    `;
    console.error(err);
  }
}

fetchData();
setInterval(fetchData, 3000);
