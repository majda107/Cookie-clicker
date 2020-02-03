class Timer {
    constructor(delay) {
        this.delay = delay
        
        this.elapsed = 0
        this.now = 0
        this.last = 0
        this.detach = false

        this.tickListeners = []
        this.renderListeners = []
    }

    start() {
        this.now = Date.now()
        this.last = this.now
        this.callback()
    }

    stop() {
        this.detach = true
    }

    onTick(callback) {
        this.tickListeners.push(callback)
    }

    onFrame(callback) {
        this.renderListeners.push(callback)
    }

    blend() {
        return this.elapsed / this.delay
    }

    callback() {
        this.now = Date.now()

        let delta = (this.now - this.last)
        this.elapsed += delta

        if(this.elapsed >= this.delay) {
            this.tick()
            this.elapsed = 0
        }

        if(this.detach) return

        this.last = this.now

        this.renderListeners.forEach(listener => listener())
        requestAnimationFrame(() => { this.callback() })
    }

    tick() {
        //console.log(`Timer ticking! [${this.delay}ms]`)
        this.tickListeners.forEach(listener => listener())
    }
}

//let timer = new Timer()
//timer.start()