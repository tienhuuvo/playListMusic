
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const app = {
    currentIndex: 1,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Cơn mưa băng giá',
            singer: 'Noo Phước Thịnh',
            image: './asset/img/song1.jpg',
            path: './asset/music/song1.mp3'
        },
        {
            name: 'id 072019',
            singer: 'W/N',
            image: './asset/img/song2.jpg',
            path: './asset/music/song2.mp3'
        },
        {
            name: 'Ngồi nhìn em khóc',
            singer: 'Sáo',
            image: './asset/img/song3.jpg',
            path: './asset/music/song3.mp3'
        },
        {
            name: 'Reeves',
            singer: 'KNG,MANBO,HIEUTHUHAI',
            image: './asset/img/song4.jpg',
            path: './asset/music/song4.mp3'
        },
        {
            name: 'Thằng điên',
            singer: 'JustaTee,Phương Ly',
            image: './asset/img/song5.jpg',
            path: './asset/music/song5.mp3'
        },
        {
            name: 'Thôi em đừng đi',
            singer: 'MCK',
            image: './asset/img/song6.jpg',
            path: './asset/music/song6.mp3'
        },
        {
            name: 'Mot Nguoi Vi Em',
            singer: 'WEAN',
            image: './asset/img/song7.jpg',
            path: './asset/music/song7.mp3'
        },
        {
            name: 'Querry',
            singer: 'QNT,Trung Trần,MCK',
            image: './asset/img/song8.jpg',
            path: './asset/music/song8.mp3'
        },
        {
            name: 'vaicaunoicokhiennguoithaydoi',
            singer: 'GREY D',
            image: './asset/img/song9.jpg',
            path: './asset/music/song9.mp3'
        },
        {
            name: 'Ghé qua',
            singer: 'Bạn có tài mà',
            image: './asset/img/song10.jpg',
            path: './asset/music/song10.mp3'
        }
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playList.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const cdWidth = cd.offsetWidth
        const _this = this

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Xử lý phóng to thu nhỏ cd
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0 
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lý khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }  
        }

        // Khi play bài hát
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi pause bài hát
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        progress.onchange = function(e) {
            const seektime = audio.duration / 100 * e.target.value
            audio.currentTime = seektime
        }

        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
        }
        prevBtn.onclick = function() {
            _this.prevSong()
            audio.play()
        }
        // Xử lý bật tắt random
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Xử lý lặp lại một bài hát
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lý next song khi audio ended
        audio.onended = function(e) {
            if(_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Lắng nghe hành vi click vào playlist
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')

            if(songNode || e.target.closest('.option')) {
                // Xử lí khi click vào song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index) 
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
        this.render()
        this.scrollToActiveSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
        this.render()
        this.scrollToActiveSong()
    },
    randomSong: function() {
        const numberOfSongs = this.songs.length;
        if(numberOfSongs === 0) {
            return;
        }

        const unplayedSongs = Array.from({ 
            length: numberOfSongs 
        }, (_, index) => index);
        unplayedSongs.splice(this.currentIndex, 1);

        if(unplayedSongs.length === 0) {
            return;
        }

        const randomIndex = Math.floor(Math.random() * unplayedSongs.length);
        this.currentIndex = unplayedSongs[randomIndex];
        this.loadCurrentSong();
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300) 
    },  

    start: function() { 
        // Định nghĩa các thuộc tính cho Project
        this.defineProperties()

        // Lắng nghe / xử lí các sự kiện (Dom events)
        this.handleEvents();

        this.loadCurrentSong();

        // Render Playlist
        this.render()
    }   
}

app.start()