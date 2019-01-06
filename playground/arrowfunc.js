const myObj = {
    greeting: "Hello",
    people: ["Adam", "Mike", "Andrew"],
    sayHello: function () {
        const that = this // You need this line in order to access 'this' in the inner function.
        this.people.forEach(function (person) {
            console.log(that.greeting + " " + person)
        })
    }
};

console.log('myObj1(function)');
myObj.sayHello();

const myObj2 = {
    greeting: "Hello",
    people: ["Adam", "Mike", "Andrew"],
    sayHello: function () {
        this.people.forEach(person => console.log(this.greeting + " " + person))
    }
};

console.log('myObj2(arrow + function)');
myObj2.sayHello();

const myObj3 = {
    greeting: "Hello",
    people: ["Adam", "Mike", "Andrew"],
    sayHello: () => {
        this.people.forEach(person => console.log(this.greeting + " " + person))
    }
};

console.log('myObj3(ony arrow)');
myObj.sayHello();