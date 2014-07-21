function draw(){
  var width = 4800,
    height = 600;

  function drawLine (diff, line) {
    var lineClass = '.line-' + line; 
    for (var i = 0; i < diff; i+=10) {
      d3.select(lineClass)
        .append('rect')
          .attr('x', i)
          .attr('y', (line * 25) + 15)
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', 'hsla(283, 100%, 50%, .2)');
    }
  }

  function setDiff (possession) {
    var today = new Date(),
        earliest = new Date(2010, 0, 1),
        possession = possession,
        diff = 0;

    var max = Date.parse(today),
        min = Date.parse(earliest);
    
    if (possession === ''){
      possession = Math.floor(Math.random() * (max - min) + min)
    } else {
      possession = possession.split('-');
      possession = new Date(possession[0], possession[1], possession[2]);
      possession = Date.parse(possession); 
    }

    diff = max - possession;

    return diff;
  }

  var svg = d3.select('.chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);


  var lineScale = d3.scale.linear().range([0, width - 10]);

  d3.csv('js/timeline.csv', function(error, data){


    data.forEach(function(element, index){
      data[index].periodical = +data[index].periodical;
      data[index]['diff'] = setDiff(element.possession);
    }); 

    var diffMax = d3.max(data, function(d){ return d.diff });
    console.log(diffMax); 
    lineScale.domain([0, diffMax]);

    data.forEach(function(element, index){
      console.log(element.diff);
      element.diff = lineScale(element.diff);
      console.log(element.diff);
    }); 

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