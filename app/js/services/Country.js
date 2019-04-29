function Countries(WS) {
    'ngInject';
    const service = {};
    let countries = [];

    let getCountries = function(){
        WS.get('country')
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    countries = res.data.countries;
                    $('.loader').addClass('hidden');
                }
            })
            .then(null, function(error) {
                swal( 'Erreur!',  error.msg , 'error' );
                $('.loader').addClass('hidden');
                console.log( error);
            });
    }
    getCountries();

    service.get = function() {
        return countries;
    };

    
    return service;
}

export default {
    name: 'Countries',
    fn: Countries
};
