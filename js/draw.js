function draw(){

  var width = 4800;
  var lineScale = d3.scale.linear()
    .range([0, width - 10]);


  function drawLine (diff, line, reason) {

    var lineClass = '.line-' + line;

    function color(reason) {     
      var thisColor;
      var colors =  { 
          'interest': '163, 71%, 47%, ',
          'recommended': '208, 66%, 50%, ',
          'gift': '283, 51%, 50%, ',
          'fascination': '1, 100%, 67%, ',
          'existential crisis': '241, 12%, 50%, ',
          'comfort': '13, 82%, 61%, ',
          'consolation': '13, 82%, 61%, ',
        }
      thisColor = colors[reason] || '334, 82%, 47%, ';
      return thisColor;
    }

    function boxHeightGenerator (index) {
      if (index % 50 === 0){
        var base = 13 - (i/800);
            plusOrMinus = Math.random() > .5 ? 1 : -1 ;
            adjustment = plusOrMinus * 5 * (i/width) * Math.random(),
            boxHeight = Math.max(0, Math.min((base + adjustment), 10));
        return boxHeight;
      } else {
        return 10;
      }
    } 

    function opacityGenerator (index) {
      var base = (250/(i + 1)) + .2,
          plusOrMinus  = Math.random() > .5 ? 1 : -1 ;
          adjustment = plusOrMinus * (i/width) * Math.random(),
          opacity = Math.max(.1, Math.min((base + adjustment), .7));
      return opacity;
    }

    for (var i = 0; i < diff; i+=10) {
      d3.select(lineClass)
        .append('rect')
          .attr('x', i)
          .attr('y', (line * 30) + 15)
          .attr('width', 10)
          .attr('height', boxHeightGenerator(i))
          .attr('fill', 'hsla(' + color(reason) + opacityGenerator(i) +')');
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
      element.reason = element['reason'].toLowerCase();
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
          .attr('class', function(d, i){ return 'line-' + i;})
        .on('mouseover', function(d, i){
          
          var xPosition = event.clientX + scrollX < width - 450 ? event.clientX + scrollX + 14 : event.clientX + scrollX - 450,
              yPosition = event.clientY + scrollY + 100 > height ? event.clientY + scrollY - 5 : event.clientY + scrollY + 14;

          console.log(height);

          d3.select(this)
          .append('text')
          .attr('id', 'tooltip')
          .attr('x', xPosition)
          .attr('y', yPosition)
          .text(function(d){
            return '' + d.title + ' by ' + d.author + ', ' + d.length + ' pages';
          });
        })

        .on('mouseout', function(){
          d3.select("#tooltip").remove();
        });
        

    data.forEach(function(element, index){
      drawLine(element.diff, index, element.reason);
    });
        
    }
  )
}


document.onreadystatechange = function() {
  if (document.readyState == 'complete'){
    draw();
  }
}