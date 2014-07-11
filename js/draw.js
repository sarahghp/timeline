function draw(){
  var width = 1200,
    height = 600;

  function drawLine (diff, line) {
    var lineClass = '.line-' + line; 
    for (var i = 0; i < diff; i++) {
      d3.select(lineClass)
        .append('rect')
          .attr('x', i)
          .attr('y', (line * 15) + 5)
          .attr('width', 1)
          .attr('height', 10)
          .attr('fill', 'hsla(283, 100%, 50%, .2)');
    }
  }

  function setDiff (possession, index) {
    var today = new Date(),
        earliest = new Date(2010, 0, 1),
        possession = possession,
        diff = 0;

        console.log(possession);
    
    if (possession === ''){
      var max = Date.parse(today);
      var min = Date.parse(earliest);
      possession = Math.floor(Math.random() * (max - min) + min)
    } else {
      possession = possession.split('-');
      possession = new Date(possession[0], possession[1], possession[2]);
      possession = Date.parse(possession); 
    }

    console.log(possession);

    diff = max - possession;

    return diff;

  }


  var svg = d3.select('.chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  d3.csv('js/timeline.csv', function(error, data){

    data.forEach(function(element, index){
      data[index].periodical = +data[index].periodical;
      data[index]['diff'] = setDiff(element.possession, index);
      console.log(element.diff);
    }); 

    // console.log(data[1].possession);

    svg.selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('class', function(d, i){ return 'line-' + i;});

    data.forEach(function(element, index){
      drawLine(element.diff, index);
    });
        
    }
  )
}


document.onreadystatechange = function() {
  if (document.readyState == 'complete'){
    draw();
  }
}