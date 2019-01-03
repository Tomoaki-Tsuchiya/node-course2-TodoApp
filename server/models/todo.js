var mongoose = require('mongoose');

var todoModel = mongoose.model('Todos',{
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        required: () => {
            return this.completed
        } ,
        default: function(){
            if(this.completed){
                return new Date().getTime();
            }
            return null;
        }
    }
});

module.exports ={todoModel};