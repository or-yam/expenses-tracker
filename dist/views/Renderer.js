class Renderer {
  renderExpenses = (expensesData) => {};

  renderAdd = (expense) => {};
}


const ctx = $('#myChart');
const myChart = new Chart (ctx,{
  type:'bar',
  data:{
    labels:['food','banking','rent','fun'],
    datasets:[{
      label:'#of dogs',
      data:[23,47,30,10],
      
    }]
  }
})