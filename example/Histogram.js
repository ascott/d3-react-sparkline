const d3 = require('d3');
import React, { PropTypes } from 'React';
const ReactFauxDOM = require('react-faux-dom');

const propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

class Histogram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: props.width,
      height: props.height,
    }
  }

  handleResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  render() {
    var div = ReactFauxDOM.createElement('div');

    var data = d3.range(1000).map(d3.randomBates(10));

    var formatCount = d3.format(",.0f");

    var margin = {top: 40, right: 40, bottom: 40, left: 40};
    var width = this.state.width - margin.left - margin.right;
    var height = this.state.height - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .rangeRound([0, width]);

    var bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(20))
        (data);

    var y = d3.scaleLinear()
        .domain([0, d3.max(bins, function(d) { return d.length; })])
        .range([height, 0]);

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".bar")
        .data(bins)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
        .attr("height", function(d) { return height - y(d.length); });

    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", 6)
        .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.length); });

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    return div.toReact();
  }
};

Histogram.propTypes = propTypes;

export default Histogram;
