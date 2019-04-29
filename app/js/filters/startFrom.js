function startFrom() {

  	return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }

}

export default {
  name: 'startFrom',
  fn: startFrom
};