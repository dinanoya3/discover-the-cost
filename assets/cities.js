// EVENT TRIGGERS:
// 1. on page load
// 2. on any change of any select box
// all of them run the same code

const svg = d3.select("svg");

svg.attr("width", 960).attr("height", 720);

// set up axes, scales, text element

const placeCities = function () {
  // updates
  let valueX = "singlePerson";
  let valueY = "apartment";

  // cities data
  const cities = svg
    .selectAll("g.city")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "city")
    .attr("transform", (d, i) => {
      return `translate(${i * 50}, 0)`;
    });

  cities.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 15);
};

// on page load

// on change (select boxes)
const selectTags = document.querySelectorAll("select");

selectTags.forEach((selectTag) => {
  selectTag.addEventListener("change", function () {
    placeCities();
  });
});
