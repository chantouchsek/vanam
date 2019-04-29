function summernoteDirective(WS) {
	'ngInject';

  return {
    restrict: 'C',
    scope: {
      ngModel: '='
    },
    link: function (scope, element, attrs) {
      $(element).summernote({
        focus: true,
        minHeight: 200,
        toolbar: [
          ['style',    ['bold', 'italic', 'underline', 'clear']],
          ['font',     ['strikethrough', 'superscript', 'subscript']],
          ['fontsize', ['fontsize']],
          ['color',    ['color']],
          ['para',     ['ul', 'ol', 'paragraph']],
          ['height',   ['height']],
          ['Misc',     ['fullscreen']]
        ],
        change: function(e) {
          console.log(222);
          scope.ngModel = $(element).summernote('code');
          console.log($(element).summernote('code'));
        }
      });
    }
  };
}

export default {
  name: 'summernote',
  fn: summernoteDirective
};
