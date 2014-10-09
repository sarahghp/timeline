var DRAWINGSPACE =  (function(){

  var globalData,
      filteredData,
      reasonArray = [];

  // Canvas variables

  var width = 4800,
    axisHeight = 60;

  // Scale variables

  var lineScale = d3.scale.linear()
    .range([0, width - 10]),
    startScale = d3.time.scale()
    .range([0, width - 10]);
  
  var today = new Date(),
      earliest = new Date(2010, 0, 1),
      maxDate = Date.parse(today),
      minDate = Date.parse(earliest);

  // Clean data

  function cleanData(data) {

    function setPossession (possession) {

      var maxPossession = Date.parse(new Date(2013, 7, 1)),
          minPossession = Date.parse(new Date(2010, 1, 1));

      if (possession === ''){
        possession = Math.floor(Math.random() * (maxPossession - minPossession) + minPossession);
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

    data.forEach(function(element, index){
      element.periodical = +element.periodical;
      element.reason = element['reason'].toLowerCase();
      if (element.reason === 'existential crisis') { element.reason = 'existential-crisis'}; 
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
  }

  // Generators

  function colorGenerator(reason) {     
      var thisColor;
      var colors =  { 
          'interest': '163, 71%, 47%, ',
          'recommended': '208, 66%, 50%, ',
          'gift': '283, 51%, 50%, ',
          'fascination': '355, 100%, 67%, ',
          'existential-crisis': '241, 12%, 50%, ',
          'comfort': '13, 82%, 61%, ',
          'consolation': '13, 82%, 61%, ',
        }
      thisColor = colors[reason] || '334, 82%, 47%, ';
      return thisColor;
  }  

  function boxHeightGenerator (index) {
    if (index % 20 === 0){
      var base = 13 - (index/800);
          plusOrMinus = Math.random() > .5 ? 1 : -1 ;
          adjustment = plusOrMinus * 5 * (index/width) * Math.random(),
          boxHeight = Math.max(0, Math.min((base + adjustment), 10));
      return boxHeight;
    } else {
      return 10;
    }
  } 

  function opacityGenerator (index) {
    var base = (250/(index + 1)) + .2;
        plusOrMinus  = Math.random() > .5 ? 1 : -1 ;
        adjustment = plusOrMinus * (index/(width * 2.8)) * Math.random(),
        opacity = Math.max(.1, Math.min((base + adjustment), .7));
    return opacity;
  }

  function drawLine (diff, line, reason, startDiff) {

    var lineClass = '.line-' + line;

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

  function redrawLine (diff, line, reason, startDiff) {

    var lineClass = '.line-' + line;

    for (var i = 0; i < diff; i+=10) {
      d3.selectAll(lineClass)
        .append('rect')
          .attr('x', i + startDiff)
          .attr('y', (line * 30) + 15)
          .attr('width', 10)
          .attr('height', boxHeightGenerator(i))
          .attr('fill', 'hsla(' + colorGenerator(reason) + opacityGenerator(i) +')');
    }
  }

  function filterData(toFilter, reasons) {
      if (!this.clearMe && !this.other){
        reasons.forEach(function (element){
          reasonArray.push(toFilter.filter(function(datum){
            return datum.reason === element;
          }));
        });
        return reasonArray = [].concat.apply([], reasonArray);
      } else if (this.other) { 
        // return an array of things that *don't match reasons not other
      } else {
        selectionArr.length = 0;
        return globalData;
      }     
  }

  return {
    clearMe: false,
    other: false,
    
    draw: function(initData){
      d3.csv('js/timeline.csv', function(error, data){

        // Prep data

        cleanData(data); 

        // Save for redraw access

        globalData = data;

        // Prep drawing

        height = data.length * 30;

        var svg = d3.select('.chart')
          .append('svg')
          .attr('width', width)
          .attr('height', height);

        // Draw wrapper

        svg.selectAll('g')
            .data(data)
          .enter()
            .append('g')
              .attr('class', function(d, i){ return 'line-' + i + ' ' + d.reason;})
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
            

        // Add lines

        data.forEach(function(element, index){
          drawLine(element.diff, index, element.reason, element.startDiff);
        });

        // Add axis
        
        var axisSvg = d3.select('#axis')
          .append('svg')
          .attr('width', width)
          .attr('height', axisHeight);

        axisSvg.selectAll('circle')
          .data(data)
        .enter()
          .append('circle')
          .attr('cx', function(d){return d.startDiff;})
          .attr('cy', 30)
          .attr('r', 6)
          .attr('fill', function(d) {
            var thisReason = d.reason;
            var reasonColor = colorGenerator(thisReason);
            return 'hsla(' + reasonColor + '.5)'
          })
          .attr('class', function(d, i){ return d.reason;});
        }
      )
    },

    redraw: function(selectedReason) {
      var dataView = filterData(globalData, selectedReason);

      var bars = d3.selectAll('g')
                      .data(dataView),
          circles = d3.selectAll('circle')
                      .data(dataView);

          console.log(dataView);

          bars.exit()
              .transition()
              .delay(500)
              .duration(2000)
              .style('opacity', 0)
              .remove();
              
          circles.exit()
              .transition()
              .delay(500)
              .duration(2000)
              .attr('cx', 0)
              .remove();

          bars.transition()
              .attr('class', function(d, i){ return 'line-' + i + ' ' + d.reason;});
          d3.selectAll('rect').remove();
          dataView.forEach(function(element, index){
            redrawLine(element.diff, index, element.reason, element.startDiff);
          });

          circles.transition()
            .attr('fill', function(d) {
              var thisReason = d.reason;
              var reasonColor = colorGenerator(thisReason);
              return 'hsla(' + reasonColor + '.5)'
            })
            .attr('class', function(d, i){ return d.reason;});

    }
  };
})();


$(document).on('ready', function(){

  DRAWINGSPACE.draw();

  var header = $('#intro-header'),
      axis = $('#axis'),
      chart = $('#chart')
      introPara = $('#intro-para'),
      closeButton = $('.close'),
      selectionArr = [];

  function setHeights() {
    var headerHeight = header.outerHeight();
    axis.css('top', headerHeight + 40 + 'px');
    chart.css('margin-top', headerHeight + 140 + 'px');
  };
  setHeights();
  
  $('h1').on('click', 'i', function(){
    introPara.slideToggle('.3s');
    $('i').toggleClass('more close');
    window.setTimeout(setHeights, 300);
  });

  $(window).on('scroll', function(){
    axis.css('left', -(window.scrollX) + 'px');
  });

  // $.fn.filterfy = function() {
  //   this.each(function(){
  //     var filter = $(this);
  //     filter.on('click.filterfy', function(){
  //       var type = filter.data('filter');
  //       $('.highlight').removeClass('highlight');
  //       filter.addClass('highlight');
  //       d3.selectAll('.hidden:not(#tooltip)').classed('hidden', false);
  //       if (type === 'clear'){
  //         d3.selectAll('g.hidden').classed('hidden', false);
  //         d3.selectAll(filter).classed('hidden', true);
  //       } else if (type === 'other') {
  //         var feels = ['gift', 'interest', 'recommended', 'fascination', 'existential-crisis', 'comfort', 'consolation'];
  //         feels.forEach(function(element){
  //           console.log(d3.selectAll('.' + element + ''));
  //           d3.selectAll('.' + element + '').classed('hidden', true);
  //         })
  //       } else {
  //         d3.selectAll('g:not(.' + type + ')').classed('hidden', true);
  //         d3.selectAll('circle:not(.' + type + ')').classed('hidden', true);
  //       }
  //     })
  //   })
  // };

  $.fn.filterfy = function() {
    this.each(function(){
      var filter = $(this);
      filter.on('click.filterfy', function(){
        var type = filter.data('filter');
        if (type === 'clear'){ 
          DRAWINGSPACE.clearMe = true;
        } else if (type === 'other') {
          DRAWINGSPACE.other = true;
        } else {
          selectionArr.push(type);
        }
        DRAWINGSPACE.redraw(selectionArr);
      })
    })
  };


  $('.filter').filterfy();

})
