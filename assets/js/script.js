
const form = document.querySelector("form")
const input = document.querySelector("#input")
const select = document.querySelector(".select")
const result = document.querySelector(".result")
const button = document.querySelector("#button")
const badgeChart = document.querySelector(".chart")
let myChart;

async function getCoinValues() {

    try{
    const response = await fetch("https://mindicador.cl/api/");
    const arrayCoin = await response.json();
    return arrayCoin;
    }
catch (e) {
    alert("UPS, algo anda mal, actualiza o vuelve a intentarlo más tarde")
}
  }
    
      

  async function conversor(multiplicador) {
    const data = await getCoinValues();
    let quantity = Number(input.value);
    let multiplication = (quantity * data[multiplicador].valor).toFixed(2);
    result.innerHTML = ` <h3>Resultado: $ ${multiplication} </h3>`;
  }
  
  async function getDailyCoin(currency) {
    try {
      const response = await fetch("https://mindicador.cl/api/" + currency);
      const arrayCoin = await response.json();
      const lastDays = arrayCoin.serie.slice(0, 20).reverse();
      const labels = lastDays.map((day) => {
        return day.fecha;
      });
      const divisa = lastDays.map((day) => {
        return day.valor;
      });
      const datasets = [
        {
          label: currency,
          borderColor: "rgb(255, 0, 149)",
          divisa,
        },
      ];
  
      return { labels, datasets };
    } catch (e) {
      alert("hay un error por ahi")
    }
  }

  async function renderChart (currency) {

    const response = await fetch(`https://mindicador.cl/api/${currency}`);
    const arrayCoin = await response.json();
    const config = {
        type: "line",
        data: {
          labels: arrayCoin.serie.map(s => s.fecha),
          datasets: [{
            label: 'Valores de ' + currency,
            data: arrayCoin.serie.map(s => s.valor),
            fill: false,
            borderColor: 'rgb(177, 0, 109)',
            tension: 0.1
          }]
        }
    };
    badgeChart.style.backgroundColor = "rgb(252, 226, 242)";
    var ctx = document.getElementById('myChart').getContext('2d');

    if (myChart) {
        console.log(myChart)
        myChart.destroy()
    }

    myChart = new Chart(ctx, config)

}

button.addEventListener("click", function () {
    if (input.value ==""){
        alert ("Ingresa el número de CLP que quieres consultar.")
    }
    
    if (input.value <0) {
        alert ("Intenta ingresando un valor positivo.")
    }

    let final = conversor (
        select.options[select.selectedIndex].value
    );

    renderChart(select.options[select.selectedIndex].value);
})

function renderGraphic(data) {
    const config = {
      type: "line",
      data: data,
    };
  
    if (myChart) {
      myChart.destroy();
    }
    myChart = new Chart(graph, config);
  }
  
  const stageData = (serie) => {
    const labels = serie.map(({ fecha }) => restartDate(fecha));
    console.log(labels);
    const amountData = serie.map(({ valor }) => valor);
    const datasets = [
      {
        label: selectCoin.value,
        borderColor: "rgb(28, 5, 238)",
        data: amountData,
      },
    ];
    return { labels, datasets };
  };
  
  const restartDate = (fecha) => {
    date = new Date(fecha);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${day} - ${month} - ${year}`;
  };