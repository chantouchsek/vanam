function toArrayFilter() {
	return function(obj) {
    	if (!(obj instanceof Object)) return obj;
    	var t = [];
    	var i =0;
    	angular.forEach(obj, function(val, key) {
        	t.push({i: i++, key: key, value: val});
    	});
    	return t;
	}
}
export default {
    name: 'toArray',
    fn: toArrayFilter
};