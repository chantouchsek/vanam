function globalController($localStorage, $state, WS, $scope, $rootScope,AppSettings) {
    'ngInject';
    const vm = this;
    vm.companies = [];
    vm.devis = [];
    vm.settings = AppSettings;
    vm.colors = {
        'RESERVED':'#b9e7ff',
        'TO_PREPARE':'#ffe1e1',
        'PREPARED':'#e6eaba',
        'READY_TO_SENT':'#ecf59b',
        'READY_NOT_TO_SENT':'#d7e4ea',
        'SENT':'#cddc39'
    };

    vm.getCompanies = function(){
        WS.get('company')
            .then(function(res) {
                if (res.error) {
                    vm.error = res.error;
                } else {
                    $localStorage.companies = res.data.compagnies;
                    vm.companies = res.data.compagnies;
                    $scope.$apply();
                }
                $('.loader').addClass('hidden');
            })
            .then(null, function(error) {
                $('.loader').addClass('hidden');
            });
    }

    if ($localStorage.data) {
        vm.data = $localStorage.data;
        // vm.data.user.role_id = 4;
        vm.getCompanies();
    }else{
        $state.go('access.login');   
    }
    if ($localStorage.companies) {
        vm.companies = $localStorage.companies;
    }

    if ($localStorage.devis) {
        vm.devis = $localStorage.devis;
    }else{
        $localStorage.$default({
            devis: []
        });
    }
    console.log('data : ', vm.data);

    vm.changeCompany = function(company){
        vm.data.user.company = company;
        $localStorage.data = vm.data;
        $state.go('app.index');
    }
    vm.deleteLigneDevis = function(i){
        vm.devis.splice(i, 1);
        $localStorage.devis=vm.devis;
    }
    vm.logout= function(){
        WS.post('logout', {})
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    $localStorage.data = {};
                    $localStorage.companies = [];
                    $state.go('access.login');
                }
            })
            .then(null, function(error) {
                
            });
        $state.go('access.login');
    }
    vm.ifSref = function(condition, url1, url2) {
        if (condition) {
            return url1;
        }
        return url2;
    }
    vm.getRole = function(role){
        var roles = {
            'SUPER_ADMIN': 'Super administrateur',
            'ADMIN':'Administrateur',
            'CLIENT':'Client',
            'AGENT':'Agent',
        };
        return roles[role];
    }
    vm.viderDevis = function(){
        swal({
            title              : 'Êtes-vous sûr?',
            text               : 'Vous ne pourrez pas revenir à cela!',
            type               : 'warning',
            showCancelButton   : true,
            confirmButtonColor : '#3085d6',
            cancelButtonColor  : '#d33',
            confirmButtonText  : 'Oui, videz-le!',
            cancelButtonText  : 'Annuler'
        }).then(function () {
            vm.devis.splice(i, vm.devis.length);
            $localStorage.devis=vm.devis;
            $scope.$apply();
        })
    }
    vm.transformerDevis = function(){
        $state.go('app.devis.add').then(function() {
            $rootScope.$broadcast('transformerDevis', vm.devis);
            swal({
                title              : 'voulez-vous vider le devis',
                type               : 'warning',
                showCancelButton   : true,
                confirmButtonColor : '#3085d6',
                cancelButtonColor  : '#d33',
                confirmButtonText  : 'Oui, videz-le!',
                cancelButtonText  : 'Non'
            }).then(function () {
                vm.devis.splice(i, vm.devis.length);
                $localStorage.devis=vm.devis;
                $scope.$apply();
            })
        });
    }
}
export default {
    name: 'globalController',
    fn: globalController
};
