var loader

document.addEventListener('DOMContentLoaded', () => {
    loader = document.querySelector('.loader-bar')
})

function next(min, max) {
    return (Math.random() * (max - min) ) + min;
}

Vue.component('clicker', {
    data: function() {
        return {
            times: 0,
            multipiler: 1,
            timer: new Timer(1000)
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
    data: function () {
        return {
            times: 0,
            multipiler: 1,
            progress: 0,
            timer: new Timer(1000)
        }
    },
    created: function() {
        this.timer.onTick(() => {
            this.times++
            this.$emit('clicked', this, this.multipiler)
        })
        this.timer.onFrame(() => {
            this.progress = this.timer.blend()
        })
        console.log(this.$refs)
    },
    methods: {
        clicked: function() {
            let clicker = this.$refs.clicker
            let rnd = next(-20, 20)
            clicker.style.transform = `rotateZ(${rnd}deg)`

            this.times++            
            this.$emit('clicked', this, this.multipiler)
        },
    },
    template: "<div class='container'>Multipiler: {{ multipiler }}<div class='clicker' ref='clicker' @click='clicked'></div><bar v-bind:progress='progress'></bar>Store:<store v-bind:clicker='this'></store></div>"
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

Vue.component('bar', {
    props: [
        'progress'
    ],
    template: "<div class='loader'><div v-bind:style='{ width: progress*100 + \"%\"}' class='loader-bar'></div></div>"
})


var app = new Vue({
    el: "#app",
    data: {
        score: 0
    },
    template: "<div>Score: {{ score }}<li class='clickers'><clicker2 v-on:clicked='onClicked'></clicker2><clicker2 v-on:clicked='onClicked'></clicker2><clicker2 v-on:clicked='onClicked'></clicker2></li></div>",
    methods: {
        onClicked: function(clicker, addition) {
            this.score += addition
        }
    }
})