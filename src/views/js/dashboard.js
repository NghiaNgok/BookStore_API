(function renderChart() {
  $.ajax({
    type: "GET",
    url: `/admin/dashboard/chart`,
    success: function (rs) {
      if (rs && rs.data) {
        let data = rs.data;

        const ctx = document.getElementById("myChart");
        if (ctx) {
          new Chart(ctx, {
            type: "bar",
            data: {
              labels: data.map((el) => el.time),
              datasets: [
                {
                  label: "Tổng doanh thu trong tháng",
                  data: data.map((el) => el.revenue),
                  borderWidth: 1,
                },
              ],
            },
          });
        } else {
          console.error("Canvas element with id 'myChart' not found.");
        }
      } else {
        console.error("Invalid data format:", rs);
      }
    },
    error: function(error) {
      console.error('Error fetching chart data:', error);
    }
  });
})();
