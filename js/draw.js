function draw(){
  var width = 1200,
    height = 600;

  var data = [{
    title: 'test',
    reason: 'gift',
    diff: 422
  }]

  function drawLine (num) {
    for (var i = 0; i < num; i++) {
      d3.select('.line')
        .append('rect')
          .attr('x', i)
          .attr('y', height/7)
          .attr('width', 1)
          .attr('height', 10)
          .attr('fill', 'hsla(283, 100%, 50%, 1)');
    }
  }


  var svg = d3.select(".chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


  var line = svg.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'line')
    .call(drawLine(422));
}

//   d3.[filetype]("file", function(error, data){
//     var chart = svg.selectAll(" ")
//       .data(data)
//       .enter()
//       .append(" ")
//       .attr();

//   })
// }


document.onreadystatechange = function() {
  if (document.readyState == 'complete'){
    draw();
  }
}