function OnConfig($stateProvider, $locationProvider, $urlRouterProvider, $compileProvider, $httpProvider, $provide) {
    'ngInject';

    if (process.env.NODE_ENV === 'production') {
        $compileProvider.debugInfoEnabled(false);
    }

    $locationProvider.html5Mode(true).hashPrefix('!');
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;


    $stateProvider
        .state('app', {
            abstract: true,
            templateUrl: 'layouts/default.html',
            controller: 'globalController as app'
        })
        .state('app.index', {
            url: '/',
            title: 'Accueil',
            templateUrl: 'modules/dashboard/index.html',
            // controller: 'homeController as vm'
        })
        .state('app.users', {
            abstract: true,
            url: '/users',
            template: '<div ui-view></div>',
            controller: 'usersController as vm'
        })
        .state('app.users.index', {
            url: '/',
            title: 'Utilisateurs',
            templateUrl: 'modules/utilisateurs/index.html',
            // controller: 'homeController as vm'
        })

        .state('app.clients', {
            abstract: true,
            url: '/clients',
            template: '<div ui-view></div>',
            controller: 'clientsController as vm'
        })
        .state('app.clients.index', {
            url: '/',
            title: 'Clients',
            templateUrl: 'modules/clients/index.html',
        })

        .state('app.categories', {
            abstract: true,
            url: '/categories',
            template: '<div ui-view></div>',
            controller: 'categoriesController as vm'
        })
        .state('app.categories.index', {
            url: '/',
            title: 'Catégories',
            templateUrl: 'modules/categories/index.html',
        })

        .state('app.marques', {
            abstract: true,
            url: '/marques',
            template: '<div ui-view></div>',
            controller: 'marquesController as vm'
        })
        .state('app.marques.index', {
            url: '/',
            title: 'Marques',
            templateUrl: 'modules/marques/index.html',
        })
        .state('app.gammes', {
            abstract: true,
            url: '/gammes',
            template: '<div ui-view></div>',
            controller: 'gammesController as vm'
        })
        .state('app.gammes.index', {
            url: '/',
            title: 'Gammes',
            templateUrl: 'modules/gammes/index.html',
        })
        .state('app.sports', {
            abstract: true,
            url: '/sports',
            template: '<div ui-view></div>',
            controller: 'sportsController as vm'
        })
        .state('app.sports.index', {
            url: '/',
            title: 'sports',
            templateUrl: 'modules/sport/index.html',
        })
        .state('app.zonages', {
            abstract: true,
            url: '/zonages',
            template: '<div ui-view></div>',
            controller: 'zonagesController as vm'
        })
        .state('app.zonages.index', {
            url: '/',
            title: 'Zonages',
            templateUrl: 'modules/zonages/index.html',
        })
        .state('app.genres', {
            abstract: true,
            url: '/genres',
            template: '<div ui-view></div>',
            controller: 'genresController as vm'
        })
        .state('app.genres.index', {
            url: '/',
            title: 'Genres',
            templateUrl: 'modules/genres/index.html',
        })
        .state('app.devises', {
            abstract: true,
            url: '/devises',
            template: '<div ui-view></div>',
            controller: 'devisesController as vm'
        })
        .state('app.devises.index', {
            url: '/',
            title: 'Devise',
            templateUrl: 'modules/devises/index.html',
        })
        .state('app.countries', {
            abstract: true,
            url: '/Pays',
            template: '<div ui-view></div>',
            controller: 'paysController as vm'
        })
        .state('app.countries.index', {
            url: '/',
            title: 'Pays',
            templateUrl: 'modules/pays/index.html',
        })
        
        .state('app.traitements', {
            abstract: true,
            url: '/produits',
            template: '<div ui-view></div>',
        })
        .state('app.traitements.mouvements', {
            abstract: true,
            url: '/mouvements',
            template: '<div ui-view></div>',
            controller: 'mouvementsController as vm'
        })
        .state('app.traitements.mouvements.index', {
            url: '/',
            title: 'Mouvement',
            templateUrl: 'modules/mouvements/index.html',
        })
        .state('app.traitements.mouvements.add', {
            url: '/ajouter',
            title: 'Ajouter mouvement',
            templateUrl: 'modules/mouvements/add.html',
        })
        .state('app.traitements.mouvements.details', {
            url: '/details/{id}',
            title: 'Détails mouvement',
            templateUrl: 'modules/mouvements/details.html',
        })
        .state('app.traitements.mouvements.importer', {
            url: '/importer',
            title: 'Importer mouvements',
            templateUrl: 'modules/mouvements/importer.html',
        })
        .state('app.traitements.mouvements.importer_images', {
            url: '/importer_images',
            title: 'Importer images',
            templateUrl: 'modules/mouvements/importer_images.html',
        })

        .state('app.produits', {
            abstract: true,
            url: '/produits',
            template: '<div ui-view></div>',
            controller: 'produitsController as vm'
        })
        .state('app.produits.index', {
            url: '/',
            title: 'Produits',
            templateUrl: 'modules/produits/index.html',
        })
        .state('app.produits.add', {
            url: '/ajouter',
            title: 'ajouter Produits',
            templateUrl: 'modules/produits/add.html',
        })
        .state('app.produits.details', {
            url: '/details/{id}/:tab?',
            title: 'details Produits',
            templateUrl: 'modules/produits/details.html',
        })

        .state('app.devis', {
            abstract: true,
            url: '/devis',
            template: '<div ui-view></div>',
            controller: 'devisController as vm'
        })
        .state('app.devis.index', {
            url: '/',
            title: 'devis',
            templateUrl: 'modules/devis/index.html',
        }) 
        .state('app.devis.add', {
            url: '/ajouter',
            title: 'ajouter devis',
            templateUrl: 'modules/devis/add.html',
        })
        .state('app.devis.details', {
            url: '/details/{id}',
            title: 'details devis',
            templateUrl: 'modules/devis/details.html',
        })
        .state('app.commande', {
            abstract: true,
            url: '/commande',
            template: '<div ui-view></div>',
            controller: 'commandeController as vm'
        })
        .state('app.commande.index', {
            url: '/',
            title: 'commande',
            templateUrl: 'modules/commandes/index.html',
        }) 
        .state('app.commande.add', {
            url: '/ajouter',
            title: 'ajouter commande',
            templateUrl: 'modules/commandes/add.html',
        })
        .state('app.commande.details', {
            url: '/details/{id}',
            title: 'details commande',
            templateUrl: 'modules/commandes/details.html',
        })


        .state('app.facture', {
            abstract: true,
            url: '/facture',
            template: '<div ui-view></div>',
            controller: 'factureController as vm'
        })
        .state('app.facture.index', {
            url: '/',
            title: 'facture',
            templateUrl: 'modules/factures/index.html',
        }) 
        .state('app.facture.add', {
            url: '/ajouter',
            title: 'ajouter facture',
            templateUrl: 'modules/factures/add.html',
        })
        .state('app.facture.details', {
            url: '/details/{id}',
            title: 'details facture',
            templateUrl: 'modules/factures/details.html',
        })



        .state('app.profile', {
            url: '/profile',
            title: 'Mon profile',
            templateUrl: 'modules/profile/index.html',
            controller: 'profileController as vm'
        })
        .state('access', {
            abstract: true,
            template: '<div ui-view></div>',
            controller: 'authController as vm'
        })
        .state('access.login', {
            url: '/login',
            title: 'Se connecter',
            templateUrl: 'modules/access/login.html'
        })

      
    $urlRouterProvider.otherwise('/');



        $provide.decorator('$locale', ['$delegate', function($delegate) {
          $delegate.NUMBER_FORMATS = {
            'CURRENCY_SYM': '\u20ac',
            'DECIMAL_SEP': ',',
            'GROUP_SEP': '\u00a0',
            'PATTERNS': [
              {
                'gSize'   : 3,
                'lgSize'  : 3,
                'maxFrac' : 2,
                'minFrac' : 0,
                'minInt'  : 1,
                'negPre'  : '-',
                'negSuf'  : '',
                'posPre'  : '',
                'posSuf'  : ''
              },
              {
                'gSize'  : 3,
                'lgSize'  : 3,
                'maxFrac' : 2,
                'minFrac' : 3,
                'minInt'  : 1,
                'negPre'  : '-',
                'negSuf'  : '\u00a0\u00a4',
                'posPre'  : '',
                'posSuf'  : '\u00a0\u00a4'
              }
            ]

          }
          return $delegate;
        }]);


}

export default OnConfig;
