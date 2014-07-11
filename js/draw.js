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


  var svg = d3.select(".chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  d3.csv("js/timeline.csv", function(error, data){

    data.forEach(function(element, index){
      data[index].periodical = +data[index].periodical;
      data[index]['diff'] = Math.floor(Math.random() * (1000 - 5) + 5);
    }); 

    console.log(data);

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