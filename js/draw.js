function draw(){

  var width = 4800;
  var lineScale = d3.scale.linear()
    .range([0, width - 10]);
  var startScale = d3.scale.linear()
    .range([0, width - 10]);
  var today = new Date(),
      earliest = new Date(2010, 0, 1),
      maxDate = Date.parse(today),
      minDate = Date.parse(earliest);


  function setPossession (possession) {

    var maxPossession = Date.parse(new Date(2013, 7, 1));

    if (possession === ''){
      possession = Math.floor(Math.random() * (maxPossession - minDate) + minDate);
    } else {
      possession = possession.split('-');
      possession = new Date(possession[0], possession[1], possession[2]);
      possession = Date.parse(possession); 
    }
    return possession;
  }

  function setDiffs (type, possession) {
    var diff = 0,
        startDiff = 0;

    diff = maxDate - possession;
    startDiff = possession - minDate;

    (type === 'diff') ? diff = diff : diff = startDiff;
    return diff;
  }


  function drawLine (diff, line, reason, startDiff) {

    var lineClass = '.line-' + line;

    function colorGenerator(reason) {     
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
          .attr('x', i + startDiff)
          .attr('y', (line * 30) + 15)
          .attr('width', 10)
          .attr('height', boxHeightGenerator(i))
          .attr('fill', 'hsla(' + colorGenerator(reason) + opacityGenerator(i) +')');
    }
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
      element.possession = setPossession(element.possession);
      element.diff = setDiffs('diff', element.possession);
      element.startDiff = setDiffs('startDiff', element.possession); 
    }); 

    var diffMax = d3.max(data, function(d){ return d.diff });
    lineScale.domain([0, diffMax]);
    var startDiffMax = d3.max(data, function(d){ return d.startDiff }); 
    startScale.domain([0, startDiffMax]);

    data.forEach(function(element, index){
      element.diff = Math.floor(lineScale(element.diff));
      element.startDiff = Math.floor(startScale(element.startDiff));
    }); 

    svg.selectAll('g')
        .data(data)
        .enter()
        .append('g')
          .attr('class', function(d, i){ return 'line-' + i;})
        .on('mouseover', function(d){
          
          var xPosition = event.clientX + scrollX < width - 450 ? event.clientX + scrollX : event.clientX + scrollX - 450,
              yPosition = event.clientY + scrollY + 100 > height ? event.clientY + scrollY - 25 : event.clientY + scrollY + 5,
              text = '' + d.title + ' by ' + d.author + ', ' + d.length + ' pages';


          d3.select('#tooltip')
            .style('left', xPosition + 'px')
            .style('top', yPosition + 'px')
            .select('#values')
            .text(text);

          d3.select('#tooltip').classed('hidden', false);

        })

        .on('mouseout', function(){
          d3.select('#tooltip').classed('hidden', true);
        });
        

    data.forEach(function(element, index){
      drawLine(element.diff, index, element.reason, element.startDiff);
    });
        
    }
  )
}


document.onreadystatechange = function() {
  if (document.readyState == 'complete'){
    draw();
  }
}