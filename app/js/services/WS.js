function WS($http, AppSettings, $localStorage, $state) {
    'ngInject';

    const service = {};
    let token = '';
    let company_id = '';
    let headers = { 
        "Access-Control-Allow-Origin": "*",
        'Content-Type':'application/json'
    };

    let updateData = function(){
        $('.loader').removeClass('hidden');
        if ($localStorage.data) {
            let data      = $localStorage.data;
            token      = data.key;
            if(data.user &&  data.user.company){
                company_id = data.user.company.id;
            }
            // console.log( 'TOKEN', token, 'COMPANY_ID', company_id );
        }  
    }
    updateData();

    service.get = function(route, data, cache = false, withToken = true) {
        updateData();
        let url = AppSettings.apiUrl + route;
        if (data) {
            url += '?' + data;
        }
        if(company_id){
            if (data) {
                url += '&';
            }else{
                url += '?';
            }
            url += 'company_id='+company_id;
        }
        if (cache) {
            url += '?' + Date.now();
        }
        if(withToken){
            token ? headers.token = token : null;
        }else{
            delete headers.token;
        }
        return new Promise((resolve, reject) => {
            $http({
                  method: 'GET',
                  url: url,
                  headers:headers
            }).then(function (res){
                if( res.data.succes == 'false' ){
                    notif( res.data.msg );
                }
                resolve(res);
            }).catch(function (err){
                if(  err.status == 401 && err.data.err_code == 100){
                    notif( err.data.msg );
                    $state.go('access.login');
                }
                reject(err);
            });
        });
    };

    service.post = function(route, data, headerType) {
        updateData();
        let url = AppSettings.apiUrl + route;
        // url += '?' + Date.now();
        token ? headers.token = token : null;

        if(company_id){
            data.company_id = company_id;
        }

        if(headerType || headerType == undefined ){
            headers['Content-Type'] = headerType ;
        }
        return new Promise((resolve, reject) => {
            $http({
                method: 'POST',
                url: url,
                headers: headers,
                data: data
            }).then(function (res){
                if( res.data.succes == 'false' ){
                    notif( res.data.msg );
                }
                resolve(res);
                if(route== 'login'){
                    token = res.data.key;
                }
            }).catch(function (err){
                if(  err.status == 401 && err.data.err_code == 100){
                    notif( err.data.msg );
                    $state.go('access.login');
                }
                reject(err);
            });
        });
    };

    service.put = function(route, data) {
        updateData();
        let url = AppSettings.apiUrl + route;
        token ? headers.token = token : null;
        // if (data) {
        //     url += '/' + data._id;
        // }
        if(company_id){
            data.company_id = company_id;
        }
        return new Promise((resolve, reject) => {
            $http({
                method: 'PUT',
                url: url,
                headers: headers,
                data: data
            }).then(function (res){
                if( res.data.succes == 'false' ){
                    notif( res.data.msg );
                }
                resolve(res);

            }).catch(function (err){
                if(  err.status == 401 && err.data.err_code == 100){
                    notif( err.data.msg );
                    $state.go('access.login');
                }
                reject(err);
            });
        });
    };

    service.delete = function(route, data) {
        updateData();
        let url = AppSettings.apiUrl + route;
        token ? headers.token = token : null;
        // if (data) {
        //     url += '/' + data;
        // }
        if(company_id){
            if( !data ){
                data = {};
            }
            data.company_id = company_id;
        }
        return new Promise((resolve, reject) => {
            $http({
                method: 'DELETE',
                url: url,
                headers: headers,
                data: data
            }).then(function (res){
                if( res.data.succes == 'false' ){
                    notif( res.data.msg );
                }
                resolve(res);
            }).catch(function (err){
                if(  err.status == 401 && err.data.err_code == 100){
                    notif( err.data.msg );
                    $state.go('access.login');
                }
                reject(err);
            });

        });
    };
    return service;
}

export default {
    name: 'WS',
    fn: WS
};
