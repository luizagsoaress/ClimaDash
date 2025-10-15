'use strict'

   let nome;
   async function pegarLocalizacaoNome(latitude, longitude) {
    try {
        const response = await fetch(`https://server-js-9le5.onrender.com/api/weather?lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        nome = data.name;

        const titulo = document.querySelector('.chart-card-title');
        if (titulo) {
            titulo.textContent = nome;
        }

    } catch (error) {
        console.error("Erro ao pegar o nome da localização:", error);
        return null;
    }
   }


   function desenharGraficoTempUmi(labels, temperaturas, umidades){
    const ctx = document.getElementById('myChart').getContext('2d');
    chart = new Chart(ctx, {
     type: 'line',
       data: {
         labels: labels,
           datasets: [
           {
            label: 'Temperatura (°C)',
            data: temperaturas,
            backgroundColor: '#66bb6a',
            borderWidth: 3,
            borderColor: '#66bb6a',
            tension: 0.3,
            fill: false
      },
      {
            label: 'Umidade (%)',
            data: umidades,
            backgroundColor: '#f58f8d',
            borderWidth: 3,
            borderColor: '#f58f8d',
            tension: 0.3,
            fill: false
      }
      ]
      },
      options: {
            responsive: true,
            maintainAspectRatio: false,
        plugins: {
      },
       scales: {
         y: {
            beginAtZero: true
        }
      }
        }
   });
   }


   function desenharGraficoVento(labels, velocidade, graus, rajada){
    const ctx = document.getElementById('myChart2').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
         datasets: [
          {
             label: 'Velocidade (m/s)',
             data: velocidade,
             borderColor: '#1de9b6',
             backgroundColor: 'rgba(29, 233, 182, 0.4)',
             borderWidth: 2
          },
          {
             label: 'Direção (°)',
             data: graus,
             borderColor: '#e76f51',
             backgroundColor: 'rgba(231, 111, 81, 0.4)',
             borderWidth: 2
          },
          {
             label: 'Rajada (m/s)',
             data: rajada,
             borderColor: '#ffa726',
             backgroundColor: 'rgba(255, 167, 38, 0.4)',
             borderWidth: 2
          }
         ]
      },
      options: {
         responsive: true,
         maintainAspectRatio: false,
         plugins: {
            legend: {
               display: true
            }
         },
         scales: {
            y: {
              beginAtZero: true,
              grid: {
                  color: "rgba(0, 0, 0, 0)"
               },
               ticks: {
                  beginAtZero: true
               }
            },
            x: {
              display: true,
              grid: {
                  color: "rgba(0,0,0,0)"
               }
            }
         }
      }
   });
   }

   function desenharGraficoUvNuvens(labels, uv, nuvens){
    const ctx = document.getElementById('myChart3').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
         datasets: [
          {
             label: 'Ultravioleta ☀️',
             data: uv,
             borderColor: '#b18cd9',
             backgroundColor: 'rgba(177, 140, 217, 0.3)',
             borderWidth: 2
          },
          {
             label: 'Nuvens ☁️',
             data: nuvens,
              borderColor: '#87ceeb',
             backgroundColor: 'rgba(135, 206, 235, 0.3)',
             borderWidth: 2
          }
         ]
      },
      options: {
         responsive: true,
         maintainAspectRatio: false,
         plugins: {
            legend: {
               display: true
            }
         },
         scales: {
            y: {
              beginAtZero: true,
              grid: {
                  color: 'rgba(130, 82, 179, 1)'
               },
               ticks: {
                  beginAtZero: true
               }
            },
            x: {
              display: true,
              grid: {
                  color: 'rgba(135, 206, 235, 1)'
               }
            }
         }
      }
   });
   }


     async function chamadaApiTempUmi(latitude, longitude) {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m&timezone=auto`;
      const resposta = await fetch(url);
      const data = await resposta.json();

      const horas = data.hourly.time;
      const temperaturas = data.hourly.temperature_2m;
      const umidades = data.hourly.relative_humidity_2m;

      const agora = new Date();
      const horaAtual = agora.getHours();

      const labels = [];
      const dadosTemperatura = [];
      const dadosUmidade = [];
         
      for (let i = 0; i <= horaAtual; i++) {
        const hora = new Date(horas[i]);
        labels.push(`${hora.getHours()}h`);
        dadosTemperatura.push(temperaturas[i]);
        dadosUmidade.push(umidades[i]);
      }

      desenharGraficoTempUmi(labels, dadosTemperatura, dadosUmidade);
     }
      
    async function chamadaApiVento(latitude, longitude) {
      const url = `https://server-js-9le5.onrender.com/api/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=pt_br`;
      const resposta = await fetch(url);
      const data = await resposta.json();

      const agora = new Date();
      const horaAtual = agora.getHours();

      const labels = [`${horaAtual}h`];
      const dadosVelocidade = [data.wind.speed];
      const dadosGraus = [data.wind.deg];
      const dadosRajada = [data.wind.gust ?? 0];

      desenharGraficoVento(labels, dadosVelocidade, dadosGraus, dadosRajada);
     }

    async function chamadaApiUvNuvem(latitude, longitude){
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=uv_index,cloudcover&timezone=auto`;
      const resposta = await fetch(url);
      const data = await resposta.json();
      
      const horas = data.hourly.time;

      const agora = new Date();
      const horaAtual = agora.getHours();
      
      const uv = data.hourly.uv_index;
      const nuvens = data.hourly.cloudcover;

      const labels = [];
      const dadosUv = [];
      const dadosNuvens = [];

      for (let i = 0; i <= horaAtual; i++) {
         const hora = new Date(horas[i]);
         labels.push(`${hora.getHours()}h`);
         dadosUv.push(uv[i]);
         dadosNuvens.push(nuvens[i]);
      }
    
      desenharGraficoUvNuvens(labels, dadosUv, dadosNuvens);
    }

    async function chamadaApiSensPeriodo(latitude, longitude){
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=apparent_temperature,is_day,visibility,soil_temperature_0cm,soil_moisture_0_to_1cm,precipitation_probability,weathercode&timezone=America/Sao_Paulo&daily=sunset`;
      const resposta = await fetch(url);
      const data = await resposta.json();

      const horas = new Date();
      const horaAtual = horas.getHours();
      const diaAtual = horas.getDay();

      const codigoDia = {
         0: "☀️ Céu limpo",
         1: "⛅ Parcialmente nublado",
         2: "☁️ Nublado",
         3: "🌧️ Chuva",
         4: "❄️ Neve",
         5: "⛈️ Tempestade"
      };

      const codigoNoite = {
         0: "🌙 Céu limpo",
         1: "🌙☁️ Parcialmente nublado",
         2: "☁️ Nublado",
         3: "🌧️ Chuva",
         4: "❄️ Neve",
         5: "⛈️ Tempestade"
      };

      const codigo = data.hourly.weathercode[horaAtual];
      const periodo = data.hourly.is_day[horaAtual];
      const sensacao = data.hourly.apparent_temperature[horaAtual];
      const visibilidade = data.hourly.visibility[horaAtual];
      const temperaturaSolo = data.hourly.soil_temperature_0cm[horaAtual];
      const umidadeSolo = data.hourly.soil_moisture_0_to_1cm[horaAtual];
      const chuva = data.hourly.precipitation_probability[horaAtual];
      const porDoSol = data.daily.sunset[diaAtual];

      const porDoSol2 = new Date(porDoSol).toLocaleTimeString("pt-BR", {hour: "2-digit", minute: "2-digit"});

      const condicao = periodo === 1 ? codigoDia[codigo] : codigoNoite[codigo];

      const titulo = document.querySelector('.weather-title-hoje');
      titulo.textContent = condicao;

      const titulo2 = document.querySelector('.weather-title-sensacao');
      titulo2.textContent = "Sensação térmica atual 🌡️: " + sensacao;
      
      const titulo3 = document.querySelector('.weather-title-visibilidade');

      if(visibilidade < 1000){
         titulo3.textContent = "Visibilidade atual  ☁️: " + visibilidade + "m";
      }else if(visibilidade >= 1000){
         titulo3.textContent = "Visibilidade atual ☁️: " + (visibilidade/1000).toFixed(1) + " km";
      }
    
      const titulo4 = document.querySelector('.weather-title-temp-solo');
      titulo4.textContent = "Temperatura do solo 🌱: " + temperaturaSolo;

      const titulo5 = document.querySelector('.weather-title-umid-solo');
      titulo5.textContent = "Umidade do solo 💧: " + umidadeSolo;

      const titulo6 = document.querySelector('.weather-title-chuva');
      titulo6.textContent = "Chances de chuva 🌧️: " + chuva + "%";

      const titulo7 = document.querySelector('.weather-title-por-do-sol');
      titulo7.textContent = "Horário do pôr do sol ☀️: " + porDoSol2 + "h";
    }
   
   function desenharMapaMundi(latitude, longitude){
      var map = L.map('map').setView([latitude, longitude], 2);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
   }

   function desenharMapaCidade(latitude, longitude){
      var map = L.map('map2').setView([latitude, longitude], 10);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
   }
   
   function desenharMapaNuvens(latitude, longitude){
      var map = L.map('map3').setView([latitude, longitude], 3);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      L.tileLayer('https://server-js-9le5.onrender.com/api/map/clouds_new/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openweathermap.org/">OpenWeather</a>'
      }).addTo(map);
   }
   
   function desenharMapaPrecipitacao(latitude, longitude){
      var map = L.map('map4').setView([latitude, longitude], 1);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
      
      L.tileLayer('https://server-js-9le5.onrender.com/api/map/precipitation_new/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openweathermap.org/">OpenWeather</a>'
      }).addTo(map);
   }

   function desenharMapaTemperatura(latitude, longitude){
      var map = L.map('map5').setView([latitude, longitude], 3);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      L.tileLayer('https://server-js-9le5.onrender.com/api/map/temp_new/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openweathermap.org/">OpenWeather</a>'
      }).addTo(map);
   }

   function desenharMapaVento(latitude, longitude){
      var map = L.map('map6').setView([latitude, longitude], 6);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      L.tileLayer('https://server-js-9le5.onrender.com/api/map/wind_new/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openweathermap.org/">OpenWeather</a>'
      }).addTo(map);
   }

   function desenharMapaPressao(latitude, longitude){
      var map = L.map('map7').setView([latitude, longitude], 2);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      L.tileLayer('https://server-js-9le5.onrender.com/api/map/pressure_new/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openweathermap.org/">OpenWeather</a>'
      }).addTo(map);
   }


   function desenharGraficoAreaFlorestal(labels, dados){
   const ctx = document.getElementById('area-florestal-chart').getContext('2d');
   const gradient = ctx.createLinearGradient(0, 0, 0, 400);
   gradient.addColorStop(0, 'rgba(34, 139, 34, 1)'); 
   gradient.addColorStop(1, 'rgba(34, 139, 34, 0)');

   const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
         datasets: [
          {
             label: 'Área florestal (%)',
             data: dados,
             borderColor: 'rgba(2, 151, 27, 1)',
             backgroundColor: gradient,
             borderWidth: 2
          }
         ]
      },
      options: {
         responsive: true,
         maintainAspectRatio: false
      }
   });
   }

   function desenharGraficoAgriculturaArea(labels, dados){
   const ctx = document.getElementById('area-agricultura-chart').getContext('2d');

   const gradient = ctx.createLinearGradient(0, 0, 0, 400);
   gradient.addColorStop(0, 'rgba(253, 166, 5, 1)');
   gradient.addColorStop(1, 'rgba(253, 166, 5, 0)');

   const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
         datasets: [
          {
             label: 'Área Agricultura (%)',
             data: dados,
             borderColor: 'rgba(253, 166, 5, 1)',
             backgroundColor: gradient,
             borderWidth: 2,
             fill: true
          }
         ]
      },
      options: {
         responsive: true,
         maintainAspectRatio: false
      }
   });
   }

   function desenharGraficoPoluicaoFinas(labels, dados){
   const ctx = document.getElementById('poluicao-finas-chart').getContext('2d');

   const gradient = ctx.createLinearGradient(0, 0, 0, 400);
   gradient.addColorStop(0, 'rgba(253, 89, 61, 1)'); 
   gradient.addColorStop(1, 'rgba(255, 99, 71, 0)');

   const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
         datasets: [
          {
             label: 'Poluição Fina (PM2.5 - µg/m³)',
             data: dados,
             borderColor: 'rgba(253, 89, 61, 1)',
             backgroundColor: gradient,
             borderWidth: 2,
             fill: true
          }
         ]
      },
      options: {
         responsive: true,
         maintainAspectRatio: false
      }
   });
   }

   function desenharGraficoEnergiaConsumo(labels, dados){
   const ctx = document.getElementById('energia-chart').getContext('2d');

   const gradient = ctx.createLinearGradient(0, 0, 0, 400);
   gradient.addColorStop(0, 'rgba(70, 131, 180, 1)'); 
   gradient.addColorStop(1, 'rgba(70, 130, 180, 0)');

   const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
         datasets: [
          {
             label: 'Energia Renovável (%)',
             data: dados,
             borderColor: 'rgba(70, 131, 180, 1)',
             backgroundColor: gradient,
             borderWidth: 2,
             fill: true
          }
         ]
      },
      options: {
         responsive: true,
         maintainAspectRatio: false
      }
   });
   }

   async function chamadaApiMudancasClimaticas(){
      const url = `https://api.worldbank.org/v2/country/BRA/indicator/AG.LND.FRST.ZS?format=json&date=2018:2023`;
      const resposta = await fetch(url);
      const dados = await resposta.json();

      const registro = dados[1];

      let dadosCO2Anos = [];
      let dadosCO2Anual = [];

       for(let i = registro.length - 1; i >= 0; i--){
        const item = registro[i];
        if(item.date >= 2018 && item.date <= 2023 && item.value != null){
            dadosCO2Anos.push(item.date);
            dadosCO2Anual.push(item.value);
        }
      }

      desenharGraficoAreaFlorestal(dadosCO2Anos, dadosCO2Anual);

      const url2 = `https://api.worldbank.org/v2/country/BRA/indicator/AG.LND.AGRI.ZS?format=json&date=2018:2023`;
      const resposta2 = await fetch(url2);
      const dados2 = await resposta2.json();

      const registro2 = dados2[1];

      let dadosAgricAreaAnos = [];
      let dadosAgricAreaAnual = [];

       for(let i = registro2.length - 1; i >= 0; i--){
        const item = registro2[i];
        if(item.date >= 2018 && item.date <= 2023 && item.value != null){
            dadosAgricAreaAnos.push(item.date);
            dadosAgricAreaAnual.push(item.value);
        }
      }

      desenharGraficoAgriculturaArea(dadosAgricAreaAnos, dadosAgricAreaAnual);

      const url3 = `https://api.worldbank.org/v2/country/BRA/indicator/EN.ATM.PM25.MC.M3?format=json&date=2018:2023`;
      const resposta3 = await fetch(url3);
      const dados3 = await resposta3.json();

      const registro3 = dados3[1];

      let dadosPoluicaoAnos = [];
      let dadosPoluicaoAnual = [];

       for(let i = registro3.length - 1; i >= 0; i--){
        const item = registro3[i];
        if(item.date >= 2018 && item.date <= 2023 && item.value != null){
            dadosPoluicaoAnos.push(item.date);
            dadosPoluicaoAnual.push(item.value);
        }
      }

      desenharGraficoPoluicaoFinas(dadosPoluicaoAnos, dadosPoluicaoAnual);

      const url4 = `https://api.worldbank.org/v2/country/BRA/indicator/EG.FEC.RNEW.ZS?date=2018:2023&format=json`;
      const resposta4 = await fetch(url4);
      const dados4 = await resposta4.json();

      const registro4 = dados4[1];

      console.log(registro4);

      let dadosEnergiaAnos = [];
      let dadosEnergiaAnual = [];

       for(let i = registro4.length - 1; i >= 0; i--){
        const item = registro4[i];
        if(item.date >= 2018 && item.date <= 2023 && item.value != null){
            dadosEnergiaAnos.push(item.date);
            dadosEnergiaAnual.push(item.value);
        }
      }

      desenharGraficoEnergiaConsumo(dadosEnergiaAnos, dadosEnergiaAnual);
   }

   chamadaApiMudancasClimaticas();


   let verificador = false;

   document.addEventListener('DOMContentLoaded', () => {
   const fallbackLat = -15.7801;  
   const fallbackLon = -47.9292;

   function carregarTudo(latitude, longitude) {
      removerAlertaCarregando();
      pegarLocalizacaoNome(latitude, longitude);
      chamadaApiTempUmi(latitude, longitude);
      chamadaApiVento(latitude, longitude);
      chamadaApiUvNuvem(latitude, longitude);
      chamadaApiSensPeriodo(latitude, longitude);
      desenharMapaMundi(latitude, longitude);
      desenharMapaCidade(latitude, longitude);
      desenharMapaNuvens(latitude, longitude);
      desenharMapaPrecipitacao(latitude, longitude);
      desenharMapaTemperatura(latitude, longitude);
      desenharMapaVento(latitude, longitude);
      desenharMapaPressao(latitude, longitude);
   }

   function removerAlertaCarregando() {
      const el = document.getElementById('alerta-carregando');
      if (el) {
         el.remove(); 
      }
   }

   function desenharAlertaX(mensagem){
      Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: mensagem
      });
   }

   if (!("geolocation" in navigator)) {
      desenharAlertaX("Seu navegador não suporta geolocalização. Usando localização padrão (Brasília).");
      carregarTudo(fallbackLat, fallbackLon);
      return;
   }

   navigator.geolocation.getCurrentPosition(
      (position) => {
         const latitude = position.coords.latitude;
         const longitude = position.coords.longitude;
         carregarTudo(latitude, longitude);
      },
      (error) => {
         console.warn("Erro ao obter localização, usando padrão:", error);
         if (!localStorage.getItem("verificador")) {
            desenharAlertaX("Não foi possível obter sua localização. Mostrando dados de Brasília (padrão).");
            localStorage.setItem("verificador", "true");
         }
         carregarTudo(fallbackLat, fallbackLon);
      }
      
   );
   });




