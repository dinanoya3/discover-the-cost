// EVENT TRIGGERS:
// 1. on page load
// 2. on any change of any select box
// all of them run the same code

const svg = d3.select("svg");

svg.attr("viewBox", "0 0 960 720");

// set up axes, scales, text element
const axisXGroup = svg
  .append("g")
  .attr("class", "x-axis")
  .attr("transform", "translate(0,620)");

const axisYGroup = svg
  .append("g")
  .attr("class", "y-axis")
  .attr("transform", "translate(100,0)");

//   axis labels
const axisXText = svg
  .append("text")
  .attr("class", "x-axis")
  //   100 + 860 = 960 / 2 = 480
  .attr("transform", "translate(480,670)")
  .text("x axis");

const axisYText = svg
  .append("text")
  .attr("class", "y-axis")
  .attr("transform", "translate(30,350) rotate(-90)")
  .text("y axis");

const placeCities = function () {
  // updates
  let inputX = document.querySelector("select[name=valueX]");
  let inputY = document.querySelector("select[name=valueY]");

  console.log(inputX.value);

  let valueX = inputX.value;
  let valueY = inputY.value;

  //   get inner html text
  let textX = inputX.options[inputX.selectedIndex].innerHTML;
  let textY = inputY.options[inputY.selectedIndex].innerHTML;

  //   change text
  axisXText.text(textX);
  axisYText.text(textY);

  // calculate maxValue of data (for scales)
  let maxValueX = d3.max(data, (d, i) => {
    return d[valueX];
  });
  let maxValueY = d3.max(data, (d, i) => {
    return d[valueY];
  });
  let maxValueR = d3.max(data, (d, i) => {
    return d.population;
  });

  //   SCALES
  //   for x-axis
  const scaleX = d3.scaleLinear().domain([0, maxValueX]).range([100, 860]);

  // for y-axis
  const scaleY = d3.scaleLinear().domain([0, maxValueY]).range([620, 100]);

  //   for radius
  const scaleR = d3.scaleSqrt().domain([0, maxValueR]).range([0, 30]);

  //   for axes (line)
  const axisX = d3
    .axisBottom(scaleX)
    .tickSizeInner(-520)
    .tickSizeOuter(0)
    .tickPadding(10)
    .ticks(10, "$,f");

  const axisY = d3
    .axisLeft(scaleY)
    .tickSizeInner(-720)
    .tickSizeOuter(0)
    .tickPadding(10)
    .ticks(10, "$,f");

  axisXGroup.call(axisX);
  axisYGroup.call(axisY);

  // cities data
  const cities = svg
    .selectAll("g.city")
    .data(data, (d, i) => {
      return d.city;
    })
    .enter()
    .append("g")
    .attr("class", "city")
    .attr("transform", (d, i) => {
      const x = scaleX(d[valueX]);
      const y = scaleY(d[valueY]);
      return `translate(${x}, ${y})`;
    });

  // cities group
  cities
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 0)
    .transition()
    // radius based on population size
    .attr("r", (d, i) => {
      return scaleR(d.population);
    });

  // city name boxes
  cities
    .append("rect")
    .attr("x", -60)
    .attr("y", (d, i) => {
      return -1 * scaleR(d.population) - 35;
    })
    .attr("width", 120)
    .attr("height", 30);

  // city texts
  cities
    .append("text")
    .attr("x", 0)
    .attr("y", (d, i) => {
      return -1 * scaleR(d.population) - 15;
    })
    .text((d, i) => {
      return d.city;
    });

  // when city group needs to be updated, transform
  svg
    .selectAll("g.city")
    .transition()
    .duration(500)
    .attr("transform", (d, i) => {
      const x = scaleX(d[valueX]);
      const y = scaleY(d[valueY]);
      return `translate(${x}, ${y})`;
    });

  // event listener on group
  svg.selectAll("g.city").on("mouseover", function () {
    // select element that's hovered over
    d3.select(this).raise();
  });
};

// on page load
placeCities();

// on change (select boxes)
const selectTags = document.querySelectorAll("select");

selectTags.forEach((selectTag) => {
  selectTag.addEventListener("change", function () {
    placeCities();
  });
});
