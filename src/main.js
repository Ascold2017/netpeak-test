import Vue from 'vue'
import "./styles/main.pcss";
if (process.env.NODE_ENV === "development") {
  require("file-loader!./index.pug");
}


new Vue({
  data: {
    timerName: '',
    timers: []
  },
  mounted() {
    if (localStorage.getItem('timers')) {
      this.timers = JSON.parse(localStorage.getItem('timers'));
    }
    setInterval(() => {
      this.timers = this.timers.slice(0).map(timer => {
        if (!timer.isPaused) {
          timer.value = (Date.now() - timer.startsAt - timer.pausedTime);
        }
        return timer;
      });
    }, 900);
  },
  destroyed() {
    this.saveTimers();
  },
  filters: {
    formatTime(value) {
      const hours = Math.floor((value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((value % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((value % (1000 * 60)) / 1000);
      return `${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`;
    }
  },
  methods: {
    addTimer() {
      this.timers.push({
        startsAt: Date.now(),
        value: 0,
        name: this.timerName,
        pausedAt: null,
        pausedTime: 0,
        isPaused: false,
      });
      this.timerName = '';
      this.saveTimers();
    },
    toggleIsPaused(timer) {
      if (timer.isPaused) {
        timer.isPaused = false;
        timer.pausedTime += Date.now() - timer.pausedAt;
        this.saveTimers();
      } else {
        timer.isPaused = true;
        timer.pausedAt = Date.now();
        this.saveTimers();
      }
    },
    deleteTimer(timer) {
      this.timers = this.timers.filter(t => t.startsAt !== timer.startsAt);
      this.saveTimers();
    },
    saveTimers() {
      localStorage.setItem('timers', JSON.stringify(this.timers));
    }
  }
}).$mount('#timers')