var loader
var oof = new Audio('res/oof.mp3')

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
        neeeded: 2000,
        cost: 400,
        type: 'boost',
        name: 'Ro-boost!',
        value: 4
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
    },
    {
        needed: 300,
        cost: 400,
        type: 'ups',
        value: 5,
        name: 'PP big?'
    },
    {
        needed: 300,
        cost: 1000,
        type: 'ups',
        value: 10,
        name: 'Robloxian high school'
    }
]

// Vue.component('clicker', {
//     data: function() {
//         return {
//             times: 0,
//             multipiler: 1,
//             timer: new Timer(2000)
//         }
//     },
//     methods: {
//         clicked: function() {
//             this.times += this.multipiler
//             console.log("Clicked...", this.times, this.multipiler)
//         },

//         multipy: function() {
//             this.multipiler++;
//             this.timer.delay /= 2
//             console.log("Multipying...")
//         },

//         startTimer: function () {
//             this.timer.onTick(() => console.log('test lmao'))
//             this.timer.onFrame(() => {
//                 loader.style.width = `${this.timer.blend() * 100}%`
//                 //console.log(this.timer.blend())
//                 //loader.style.width = "100%"
//             })
//             this.timer.start()
//         }
//     },
//     template: "<div>Clicked: {{ times }} </br> Multipiler: {{ multipiler }}<button @click='clicked()'>Click me! (clicker)</button><button @click='multipy()'>Multipy!</button><button @click='startTimer()'>Start timer...</button></div>"
// })

Vue.component('clicker2', {
    props: [
        'score',
        'model'
    ],
    data: function () {
        return {
            times: 0,
            multipiler: 1,
            oofps: 0,
            progress: 0,
            timer: new Timer(1000),
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
            let rnd = next(-100, 100)

            clicker.style.transform = `rotateZ(${rnd}deg)`
            oof.currentTime = 0
            oof.play()

            this.times++            
            this.$emit('clicked', this, this.multipiler)
        },

        boost: function(mult) {
            this.timer.delay /= mult
            setTimeout(() => {
                this.timer.delay *= mult
            }, 10000) // POLISH
        },

        onBought: function(product) {
            this.$emit('bought', product)
        }
    },
    template: "<div class='container'><span class='multipiler'>Multipiler: {{ multipiler }}</span><span class='oofps'>Oofs per second (oofps): {{ oofps }}</span><div class='clicker' ref='clicker' @click='clicked' v-bind:style='\"background-image: url(\" + model.image + \")\"'></div><bar class='bar' v-bind:progress='progress'></bar><div class='clicker-store'>Store:<store2 v-bind:clicker='this' v-bind:model='model.store' v-bind:score='score' v-on:bought='onBought'></store2></div></div>"
})

// Vue.component('store', {
//     props: [
//         'clicker',
//     ],
//     methods: {
//         upgrade: function() {
//             this.clicker.multipiler *= 2
//         },

//         autoClick: function() {
//             this.clicker.timer.start()
//         },
//         speed: function() {
//             this.clicker.timer.delay /= 2
//         }
//     },
//     template: "<div class='store'><button @click='upgrade()'>Upgrade! [2x]</button><button @click='autoClick()'>Auto-click [buy]</button><button @click='speed()'>Speed [2x]</button></div>"
// })

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
                //alert("U don't have enough oofs!")
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
                case 'boost':
                    this.clicker.boost(product.value)
                    break
            }

            this.$emit('bought', product)
        }
    },
    template: "<ul class='store'> <li v-for='product in model' class='product'> <button @click='buy(product)'>{{ product.name }} [{{ product.cost }}]</button> </li> </ul>"
})


Vue.component('bar', {
    props: [
        'progress'
    ],
    template: "<div class='loader'><div v-bind:style='{ width: progress*100 + \"%\"}' class='loader-bar'></div></div>"
})

Vue.component('message', {
    data: function() {
        return {
            active: false,
            message: '',
        }
    },
    methods: {
        show: function(message, timeout) {
            this.message = message
            this.active = true
            setTimeout(() => {
                this.active = false
            }, timeout)
        }
    },
    template: "<div><div v-bind:class='[ active ? \"active-message\" : \"\" ]' class='message'><div class='message-inner'>{{ message }}</div></div></div>"
})


var app = new Vue({
    el: "#app",
    data: {
        score: 0,
        nextStoreValue: 0,
        clickers: [
            {
                store: storeModel1,
                active: true,
                cost: 0,
                image: 'res/roblox.jpg'
            },
            {
                store: storeModel1,
                active: false,
                cost: 1000,
                image: 'https://pbs.twimg.com/profile_images/927250297759690753/q51pRtu2_400x400.jpg'
            }
        ],
        saveTimer: new Timer(20000)
    },
    template: "<div><message ref='message'></message><h2>Score: {{ score }}</h2><button @click='nextStore()'>Next store [{{ nextStoreValue }}]</button><button @click='save()'>Save</button><li class='clickers'><clicker2 v-for='clicker in clickers' v-if='clicker.active' ref='clicker' v-on:clicked='onClicked' v-on:bought='onBought' v-bind:score='score' v-bind:model='clicker'></clicker2></li></div>",
    methods: {
        onClicked: function(clicker, addition) {
            this.score += addition 
        }, 
        onBought: function(product) {
            this.score -= product.cost
        },

        nextStore: function() {
            for(let clicker of this.clickers) {
                if(!clicker.active && this.score >= clicker.cost) {
                    this.score -= clicker.cost
                    clicker.active = true
                    return
                }
            }
        },

        nextStoreCost: function() {
            for(let clicker of this.clickers) {
                if(!clicker.active) {
                    this.nextStoreValue = clicker.cost
                    return
                }
            }
            this.nextStoreValue = -1
        },

        save: function() {
            this.$refs.message.show('Progress saved...!', 3000)
            localStorage.setItem("score", this.score)
        },

        load: function() {
            let loaded = localStorage.getItem("score")
            if(loaded != undefined) {
                this.score = parseInt(loaded)
            }
        }
    },
    created: function() {
        this.load()

        this.saveTimer.onTick(() => {
            this.save()
        })
        this.saveTimer.start()

        this.nextStoreCost()
    }
})