module.exports = {
    getMember: function(message, toFind = '') {
       
        let target = message.mentions.members.first() || message.member;
    
        return target;
    },

    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-US').format(date)
    }
}