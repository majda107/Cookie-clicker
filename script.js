var loader

document.addEventListener('DOMContentLoaded', () => {
    loader = document.querySelector('.loader-bar')
})

function next(min, max) {
    return (Math.random() * (max - min) ) + min;
}

var storeModel1 = [
    {
        needed: 10000,
        cost: 100,
        type: 'mult',
        name: 'Twice multipiler'
    },
    {
        needed: 500,
        cost: 200,
        type: 'start',
        name: 'Auto-clicker'
    },
    {
        needed: 0,
        cost: 50,
        type: 'ups',
        value: 1,
        name: 'Basic oof'
    },
    {
        needed: 300,
        cost: 100,
        type: 'ups',
        value: 2.5,
        name: 'Robloxian high school'
    }
]

Vue.component('clicker', {
    data: function() {
        return {
            times: 0,
            multipiler: 1,
            timer: new Timer(2000)
        }
    },
    methods: {
        clicked: function() {
            this.times += this.multipiler
            console.log("Clicked...", this.times, this.multipiler)
        },

        multipy: function() {
            this.multipiler++;
            this.timer.delay /= 2
            console.log("Multipying...")
        },

        startTimer: function () {
            this.timer.onTick(() => console.log('test lmao'))
            this.timer.onFrame(() => {
                loader.style.width = `${this.timer.blend() * 100}%`
                //console.log(this.timer.blend())
                //loader.style.width = "100%"
            })
            this.timer.start()
        }
    },
    template: "<div>Clicked: {{ times }} </br> Multipiler: {{ multipiler }}<button @click='clicked()'>Click me! (clicker)</button><button @click='multipy()'>Multipy!</button><button @click='startTimer()'>Start timer...</button></div>"
})

Vue.component('clicker2', {
    props: [
        'score'
    ],
    data: function () {
        return {
            times: 0,
            multipiler: 1,
            oofps: 0,
            progress: 0,
            timer: new Timer(1000),
            model: storeModel1
        }
    },
    created: function() {
        this.timer.onTick(() => {
            this.times++
            this.$emit('clicked', this, this.oofps)
        })

        this.timer.onFrame(() => {
            this.progress = this.timer.blend()
        })
    },
    methods: {
        clicked: function() {
            let clicker = this.$refs.clicker
            let rnd = next(-20, 20)
            clicker.style.transform = `rotateZ(${rnd}deg)`

            this.times++            
            this.$emit('clicked', this, this.multipiler)
        },
        onBought: function(product) {
            this.$emit('bought', product)
        }
    },
    template: "<div class='container'>Multipiler: {{ multipiler }} </br> Oofs per second (oofps): {{ oofps }}<div class='clicker' ref='clicker' @click='clicked'></div><bar v-bind:progress='progress'></bar>Store:<store2 v-bind:clicker='this' v-bind:model='model' v-bind:score='score' v-on:bought='onBought'></store2></div>"
})

Vue.component('store', {
    props: [
        'clicker'
    ],
    methods: {
        upgrade: function() {
            this.clicker.multipiler *= 2
        },

        autoClick: function() {
            this.clicker.timer.start()
        },
        speed: function() {
            this.clicker.timer.delay /= 2
        }
    },
    template: "<div class='store'><button @click='upgrade()'>Upgrade! [2x]</button><button @click='autoClick()'>Auto-click [buy]</button><button @click='speed()'>Speed [2x]</button></div>"
})

Vue.component('store2', {
    props: [
        'clicker',
        'model',
        'score'
    ],
    methods: {
        buy: function(product) {
            console.log(`Buying ${product.name} for ${product.cost}, actual score: ${this.score}`)
            if(product.cost > this.score) {
                alert("U don't have enough oofs!")
                return
            }

            switch(product.type) {
                case 'mult':
                    this.clicker.multipiler *= 2
                    console.log('bought multipiler!')
                    break
                case 'start':
                    this.clicker.timer.start()
                    break
                case 'ups':
                    this.clicker.oofps += product.value
                    break
            }

            this.$emit('bought', product)
        }
    },
    template: "<ul class='store'> <li v-for='product in model'> <button @click='buy(product)'>{{ product.name }} [{{ product.cost }}]</button> </li> </ul>"
})


Vue.component('bar', {
    props: [
        'progress'
    ],
    template: "<div class='loader'><div v-bind:style='{ width: progress*100 + \"%\"}' class='loader-bar'></div></div>"
})


var app = new Vue({
    el: "#app",
    data: {
        score: 0,
        clickers: [
            1, 2, 3
        ]
    },
    template: "<div>Score: {{ score }}<li class='clickers'><clicker2 v-for='clicker in clickers' v-on:clicked='onClicked' v-on:bought='onBought' v-bind:score='score'></clicker2></li></div>",
    methods: {
        onClicked: function(clicker, addition) {
            this.score += addition
        },
        
        onBought: function(product) {
            this.score -= product.cost
        }
    }
})