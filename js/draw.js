function draw(){

  var width = 4800;
  var lineScale = d3.scale.linear()
    .range([0, width - 10]);

  function drawLine (diff, line) {

    var lineClass = '.line-' + line;

    function heightGenerator (index) {
      if (index % 50 === 0){
        var base = 13 - (i/800);
            plusOrMinus  = Math.random() > .5 ? 1 : -1 ;
            adjustment = plusOrMinus * 5 * (i/width) * Math.random(),
            height = Math.max(0, Math.min((base + adjustment), 10));
        return height;
      } else {
        return 10;
      }
    } 

    function opacityGenerator (index) {
      var base = (250/(i + 1)) + .2,
          plusOrMinus  = Math.random() > .5 ? 1 : -1 ;
          adjustment = plusOrMinus * (i/width) * Math.random(),
          opacity = Math.max(0, Math.min((base + adjustment), .7));
      return opacity;
    }

    for (var i = 0; i < diff; i+=10) {
      d3.select(lineClass)
        .append('rect')
          .attr('x', i)
          .attr('y', (line * 30) + 15)
          .attr('width', 10)
          .attr('height', heightGenerator(i))
          .attr('fill', 'hsla(283, 100%, 50%,' + opacityGenerator(i) +')');
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

    diff = Math.floor(max - possession);

    return diff;
  }

  d3.csv('js/timeline.csv', function(error, data){

    height = data.length * 30;

    var svg = d3.select('.chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    data.forEach(function(element, index){
      element.periodical = +element.periodical;
      element.diff = setDiff(element.possession);
    }); 

    var diffMax = d3.max(data, function(d){ return d.diff });
    lineScale.domain([0, diffMax]);

    data.forEach(function(element, index){
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