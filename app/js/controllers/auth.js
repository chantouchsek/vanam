function authController($scope, $rootScope, $state, WS, $localStorage) {
    'ngInject';
    const vm = this;
    vm.error = '';
    $localStorage.data = {};
    $localStorage.companies = {};

    $rootScope.$on('$stateChangeSuccess', () => {
        vm.error = '';
        vm.user = {};
    })

    vm.user = {
    	mail : 'loic@vanam.fr',
    	passwd : 'loic13$$'
    }

    // vm.user = {
    //     mail : 'gwendoline@vanam.fr',
    //     passwd : 'gwendoline'
    // }

    vm.login = function() {
        WS.post('login',vm.user)
            .then(function(data) {
                if (data.error) {
                    vm.error = data.error;
                    $scope.$apply();
                } else {
                    $localStorage.data = data.data;
                    $state.go('app.index', {}, {
                        reload: true
                    });
                }
            })
            .then( function(error) {
                console.error(error);
                vm.error = 'Un problème est survenu. Merci de contacter l’administrateur.';
                $scope.$apply();
            });
    }
    vm.forgotPassword = function() {
        WS.forgot({ email: vm.email })
            .then(function(data) {
                if (data.error) {
                    vm.error = data.error;
                    $scope.$apply();
                } else {
                    notif('success', 'Vérifier votre boite mail');
                }
            })
            .then(null, function(error) {
                console.log(error);
            });
    }
}

export default {
    name: 'authController',
    fn: authController
};
