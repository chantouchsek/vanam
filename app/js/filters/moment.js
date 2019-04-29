import moment from 'moment';

function momentFilter() {
    return function(date, format) {
        if (date == '') {
            return;
        }
        if (format) {
            return moment(new Date(date)).locale('fr').format(format);
        }
        return moment(new Date(date)).locale('fr').format('DD MMMM YYYY');
    }
}

export default {
    name: 'moment',
    fn: momentFilter
};
