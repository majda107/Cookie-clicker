var loader

document.addEventListener('DOMContentLoaded', () => {
    loader = document.querySelector('.loader-bar')
})

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

// Vue.component('renderer', {
//     data: function() {
//         return {

//         }
//     },
//     methods: {
//         renderCallback: function() {
//             console.log('RENDERER CALLBACK!!! (LOL)')
//             requestAnimationFrame(this.renderCallback)
//         },

//         start: function() {
//             requestAnimationFrame(this.renderCallback)
//         }
//     },
//     template: "<div class='renderer'>Renderer<button @click='start()'>Start!</button></div>"
// })

var app = new Vue({
    el: "#app",
    template: "<div><clicker></clicker><hr><clicker></clicker></div>"
})