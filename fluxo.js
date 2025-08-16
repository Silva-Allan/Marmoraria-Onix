// Salvar dados iniciais no armazenamento local 
if (!localStorage.getItem("db_items")) { 
    localStorage.setItem("db_items", JSON.stringify(initialData)); 
  }
  
  const tbody = document.querySelector("tbody");
  const descItem = document.querySelector("#desc");
  const amount = document.querySelector("#amount");
  const type = document.querySelector("#type"); 
  const btnNew = document.querySelector("#btnNew");
  const monthSelect = document.querySelector("#monthSelect");
  const incomes = document.querySelector(".incomes");
  const expenses = document.querySelector(".expenses");
  const total = document.querySelector(".total");
  
  let db_items = JSON.parse(localStorage.getItem("db_items")) || [];
  let currentMonth = new Date().getMonth() + 1; // 1-12 para Janeiro-Dezembro
  let currentYear = new Date().getFullYear();
  let editingIndex = null; // Para saber qual item está sendo editado

  // Função para formatar a data no formato YYYY-MM-DD, ajustando para o fuso horário local

  // Função para calcular receitas e despesas totais
  function updateSummary() {
    const filteredItems = db_items.filter(item => {
        const itemDate = new Date(item.date);
        return (
            itemDate.getMonth() === currentMonth - 1 && // Subtraímos 1 para corrigir o mês
            itemDate.getFullYear() === currentYear
        );
    });
    
    let totalIncome = 0;
    let totalExpense = 0;

    filteredItems.forEach(item => {
        if (item.type === "Entrada") {
            totalIncome += parseFloat(item.amount);
        } else {
            totalExpense += parseFloat(item.amount);
        }
    });

    incomes.innerText = totalIncome.toFixed(2);
    expenses.innerText = totalExpense.toFixed(2);
    total.innerText = (totalIncome - totalExpense).toFixed(2);
}


// Exibir os itens da tabela
function displayItems() {
    tbody.innerHTML = ""; // Limpa a tabela
  
    db_items
        .filter(item => {
            const itemDate = new Date(item.date);
            // A comparação deve considerar apenas o ano e o mês, sem levar em conta a hora e o dia exato
            return (
                itemDate.getMonth() + 1 === currentMonth && // Mês atual (sem subtrair 1)
                itemDate.getFullYear() === currentYear // Verifica o ano corretamente
            );
        })
        .forEach((item, index) => {
            insertItem(item, index); // Insere os itens filtrados na tabela
        });
}

  
  function insertItem(item, index) {
    let tr = document.createElement("tr");
  
    tr.innerHTML = `
      <td>${item.desc}</td>
      <td>R$ ${item.amount}</td>
      <td class="columnType">${
        item.type === "Entrada"
          ? '<i class="bx bxs-chevron-up-circle"></i>'
          : '<i class="bx bxs-chevron-down-circle"></i>'
      }</td>
      <td class="columnDate">${item.date || "Data não informada"}</td>
      <td class="columnAction">
        <button onclick="editItem(${index})"><i class="bx bx-edit"></i></button>
        <button onclick="deleteItem(${index})"><i class="bx bx-trash"></i></button>
      </td>
    `;
  
    tbody.appendChild(tr);
  }
  

// Função para formatar a data no formato YYYY-MM-DD
// Função para formatar a data no formato YYYY-MM-DD
function formatDateToISOString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Aumenta 1 para corrigir o mês
    const day = String(date.getDate()).padStart(2, '0');  // Garante que o dia seja no formato correto
    return `${year}-${month}-${day}`;
}

// Ao adicionar um novo item
btnNew.addEventListener("click", () => {
    if (!descItem.value || !amount.value) {
        alert("Preencha todos os campos!");
        return;
    }

    const selectedDateInput = document.querySelector("#itemDate").value;

    if (!selectedDateInput || isNaN(Date.parse(selectedDateInput))) {
        alert("Por favor, selecione uma data válida!");
        return;
    }

    // Criar a data corretamente sem ajustes de fuso horário (tratamento UTC)
    const selectedDate = new Date(selectedDateInput + "T00:00:00"); 
    const formattedDate = formatDateToISOString(selectedDate); // Agora usa a função formatDateToISOString

    if (isNaN(parseFloat(amount.value)) || parseFloat(amount.value) <= 0) {
        alert("Por favor, insira um valor numérico positivo para o valor!");
        return;
    }

    const newItem = {
        desc: descItem.value.trim(),
        amount: parseFloat(amount.value).toFixed(2),
        type: type.value,
        date: formattedDate, // Salvar a data formatada corretamente
    };

    db_items.push(newItem);
    localStorage.setItem("db_items", JSON.stringify(db_items));

    initialize();
    descItem.value = "";
    amount.value = "";
    document.querySelector("#itemDate").value = "";
});

  
  // Função para editar um item
  function editItem(index) {
    const filteredItems = db_items.filter(item => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getMonth() + 1 === currentMonth &&
        itemDate.getFullYear() === currentYear
      );
    });
  
    const realItemIndex = db_items.indexOf(filteredItems[index]);
    if (realItemIndex === -1) {
      alert("Item não encontrado para edição.");
      return;
    }
  
    editingIndex = realItemIndex;
  
    const item = db_items[editingIndex];
    document.querySelector("#editDesc").value = item.desc;
    document.querySelector("#editAmount").value = item.amount;
    document.querySelector("#editType").value = item.type;
    document.querySelector("#editDate").value = item.date;
  
    document.querySelector("#editCard").classList.remove("hidden");
  }  
  
  // Salvar alterações do modal
  document.querySelector("#editForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    if (editingIndex === null) {
      alert("Nenhum item selecionado para edição.");
      return;
    }
  
    const updatedDesc = document.querySelector("#editDesc").value.trim();
    const updatedAmount = parseFloat(document.querySelector("#editAmount").value);
    const updatedDate = document.querySelector("#editDate").value;
  
    if (!updatedDesc || !updatedDate || isNaN(Date.parse(updatedDate))) {
      alert("Por favor, preencha todos os campos corretamente!");
      return;
    }
  
    if (isNaN(updatedAmount) || updatedAmount <= 0) {
      alert("Por favor, insira um valor numérico positivo para o valor!");
      return;
    }
  
    const updatedItem = {
      desc: updatedDesc,
      amount: updatedAmount.toFixed(2),
      type: document.querySelector("#editType").value,
      date: updatedDate, // Mantém a data exatamente como está
    };
  
    db_items[editingIndex] = updatedItem;
    localStorage.setItem("db_items", JSON.stringify(db_items));
  
    closeEditCard();
    initialize();

  }); 
  
  // Função para fechar o card de edição
  function closeEditCard() {
    document.querySelector("#editCard").classList.add("hidden");
    editingIndex = null;
  }
  
  // Função para excluir um item
  function deleteItem(index) {
    const filteredItems = db_items.filter(item => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getMonth() + 1 === currentMonth &&
        itemDate.getFullYear() === currentYear
      );
    });
  
    const realItemIndex = db_items.indexOf(filteredItems[index]);
  
    if (realItemIndex !== -1 && confirm("Deseja excluir este item?")) {
      db_items.splice(realItemIndex, 1);
      localStorage.setItem("db_items", JSON.stringify(db_items));
      initialize();
    }
  }  
  
  // Função para gerar os últimos 10 meses
  function generateLast10Months() {
    const currentDate = new Date();
    const months = [];
    for (let i = 0; i < 12; i++) {
      const tempDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthName = tempDate.toLocaleString("pt-BR", { month: "long" });
      const year = tempDate.getFullYear();
      months.push({ label: `${monthName}/${year}`, value: tempDate });
    }
    return months.reverse();
  }
  
  // Popular o dropdown de meses
  function populateMonthSelect() {
    const months = generateLast10Months();
    monthSelect.innerHTML = "";
  
    months.forEach(month => {
      const option = document.createElement("option");
      option.value = `${month.value.getFullYear()}-${month.value.getMonth() + 1}`;
      option.textContent = month.label;
      if (
        month.value.getMonth() + 1 === currentMonth &&
        month.value.getFullYear() === currentYear
      ) {
        option.selected = true;
      }
      monthSelect.appendChild(option);
    });
  }  
  
  // Alterar o mês e ano selecionados
  monthSelect.addEventListener("change", () => {
    const [year, month] = monthSelect.value.split("-");
    currentMonth = parseInt(month);
    currentYear = parseInt(year);
  
    displayItems();
    updateSummary();
  });
  
  // Função para calcular o saldo total da empresa
  function calculateGlobalTotal() {
      const globalTotalValue = db_items.reduce((acc, item) => {
          return item.type === "Entrada"
              ? acc + parseFloat(item.amount)
              : acc - parseFloat(item.amount);
      }, 0);
  
      const globalTotal = document.querySelector(".globalTotal");
      const companyBalance = document.querySelector(".companyBalance");
  
      if (globalTotal) {
          globalTotal.innerText = globalTotalValue.toFixed(2);
      }
  
      if (companyBalance) {
          // Alterar a cor de fundo baseado no valor do saldo
          if (globalTotalValue >= 0) {
              companyBalance.style.backgroundColor = "#00C9A7"; // Verde
          } else {
              companyBalance.style.backgroundColor = "#D83121"; // Vermelho
          }
      }
  }
  
  // Atualizar a cor do total
  function updateTotalColor() {
    const totalElement = document.querySelector(".total");
    const totalValue = parseFloat(totalElement.innerText);
  
    if (totalValue >= 0) {
      totalElement.style.color = "#00C9A7"; // Verde
    } else {
      totalElement.style.color = "#D83121"; // Vermelho
    }
  }
  
  // Atualizar o gráfico de barras
  let summaryChart; // Variável global para armazenar o gráfico
  
  function updateChart() {
    const chartCanvasElement = document.getElementById("summaryChart");
    if (!chartCanvasElement) {
      console.error("Elemento <canvas> com id 'summaryChart' não encontrado!");
      return;
    }
  
    const chartCanvas = chartCanvasElement.getContext("2d");
  
    // Destruir gráfico anterior, se existir
    if (summaryChart) {
      summaryChart.destroy();
    }
  
    // Calcular receitas e despesas para os últimos 10 meses
    const months = generateLast10Months();
    const incomesData = [];
    const expensesData = [];
  
    months.forEach(({ value }) => {
      const month = value.getMonth() + 1;
      const year = value.getFullYear();
  
      let monthIncome = 0;
      let monthExpense = 0;
  
      db_items.forEach(item => {
        const itemDate = new Date(item.date);
        if (
          itemDate.getMonth() + 1 === month &&
          itemDate.getFullYear() === year
        ) {
          if (item.type === "Entrada") {
            monthIncome += parseFloat(item.amount);
          } else {
            monthExpense += parseFloat(item.amount);
          }
        }
      });
  
      incomesData.push(monthIncome);
      expensesData.push(monthExpense);
    });
  
    // Criar o gráfico
    summaryChart = new Chart(chartCanvas, {
      type: "bar",
      data: {
        labels: months.map(month => month.label),
        datasets: [
          {
            label: "Receitas",
            data: incomesData,
            backgroundColor: "#00C9A7",
          },
          {
            label: "Despesas",
            data: expensesData,
            backgroundColor: "#D83121",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }  
  
  // Inicializar tudo
  function initialize() {
    displayItems();
    updateSummary();
    updateChart();
    populateMonthSelect();
    calculateGlobalTotal();
    updateTotalColor();
  }
  
  // Inicializar no carregamento da página
  document.addEventListener("DOMContentLoaded", () => {
    initialize();
  });
  
  