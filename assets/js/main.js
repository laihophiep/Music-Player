// Render song --> OK
// Play / pause / next / prev --> Ok
// song active --> OK
// scroll to make the disc smaller --> OK
// CD rotate --> OK
// slide music -> OK
// random without repeating old songs even if you move forward or backward -> OK
// repeat --> OK
// scroll to active song --> OK
// click to play song --> OK
// save settings to local storage 

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_Player'

const playlist = $('.playlist')
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const playBtn = $('.toggle-btn')
const nextBtn = $('.forward-btn')
const prevBtn = $('.prev-btn')
const shuffleBtn = $('.shuffle-btn')
const progress = $('.progress')
const player = $('.player')
const repeatBtn = $('.repeat-btn')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isShuffle: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))|| {},
    shuffleSongArray: [],
    songs: [
        {
            name: 'Anh Sẽ Về Sớm Thôi',
            singer: 'Isaac',
            path: './assets/music/Anh-Se-Ve-Som-Thoi-Isaac.mp3',
            image: './assets/img/anh-se-ve-som-thoi.jpeg'
        },
        {
            name: 'Em không thể',
            singer: 'Tiên Tiên',
            path: './assets/music/Em-Khong-The-Tien-Tien-Touliver.mp3',
            image: './assets/img/em-ko-the-tien-tien.jpeg'
        },
        {
            name: 'Nằm ngủ em ru',
            singer: 'Bích Phương',
            path: './assets/music/nam-ngu-emru-Bich-Phuong.mp3',
            image: './assets/img/nam-ngu-em-ru-bich-phuong.jpeg'
        },
        {
            name: 'Shay Nắng',
            singer: 'Amee',
            path: './assets/music/Shay-Nanggg-AMEE-Obito.mp3',
            image: './assets/img/shay-nang.jpeg'
        },
        {
            name: 'Sunkissed',
            singer: 'Chillies - Châu Bùi',
            path: './assets/music/Sunkissed-Chillies-Chau-Bui.mp3',
            image: './assets/img/sunkissed.jpeg'
        },
        {
            name: 'Tận cùng của nỗi nhớ',
            singer: 'Han Sara - Will',
            path: './assets/music/Tan-Cung-Noi-Nho-New-Version-Will-Han-Sara.mp3',
            image: './assets/img/tan-cung-cua-noi-nho.jpeg'
        },
        {
            name: 'Tìm X',
            singer: 'Min',
            path: './assets/music/Tim-X-MIN.mp3',
            image: './assets/img/tim-x-min.jpeg'
        },
        {
            name: 'Tôi đã quên thật rồi',
            singer: 'Isaac',
            path: './assets/music/Toi-Da-Quen-That-Roi-Isaac.mp3',
            image: './assets/img/toi-da-quen-that-roi.jpeg'
        },
        {
            name: 'Tuý Âm',
            singer: 'Masew',
            path: './assets/music/Tuy-Am-Xesi-Masew-Nhat-Nguyen.mp3',
            image: './assets/img/tuy am.jpeg'
        }],

    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong',{
            get: function() { return this.songs[this.currentIndex]}
        })
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
            <div class="thumb" style="background-image: url('${song.image}')"></div>
            
            <div class="body">
                <div class="title">${song.name}</div>
                <div class="singer">${song.singer}</div>
            </div>
            <div class="option">
                <i class="fa-solid fa-ellipsis option-icon"></i>
            </div>
        </div>`
        })
        playlist.innerHTML = htmls.join('')
    }, 
    loadCurrentSong: function () {
        $('header h2').innerText = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    loadConfig: function() {
        this.isShuffle = this.config.isShuffle
        this.isRepeat = this.config.isRepeat
    }
    ,
    playRandomSong: function() {
        if (this.shuffleSongArray.length === this.songs.length) {
            this.shuffleSongArray = []
        }
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (this.shuffleSongArray.includes(newIndex)) 
            
        this.shuffleSongArray.push(newIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
        
    },

    playPreviousSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        } 
        this.loadCurrentSong()  
    },

    scrollToActiveView: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        },300)
        
    },

    handleEvents: function() {
        const _this = this

        requestIdleCallback(function() {
            const cdWidth = cdThumb.offsetWidth
            document.onscroll = function() {
                
                let windowScroll = window.scrollY || document.documentElement.scrollTop

                let newWidth = cdWidth - windowScroll
                cd.style.width = newWidth > 0 ? newWidth + 'px' : 0
                cd.style.opacity = newWidth / cdWidth
            }
            
        })

        const cdThumbAnimate = cdThumb.animate({
            transform: 'rotate(360deg)'
        }, {
            duration: 10000,
            iterations: Infinity
        })

        cdThumbAnimate.pause()

        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
                cdThumbAnimate.pause()
            } else {
                audio.play()
                cdThumbAnimate.play()
            }
        }

        nextBtn.onclick = function() {
            if (_this.isShuffle) {
                _this.playRandomSong()
            } else {
                _this.currentIndex++
                if (_this.currentIndex >= _this.songs.length) {
                 _this.currentIndex = 0
                } 
                _this.loadCurrentSong()  
            }   
            _this.render()
            _this.scrollToActiveView()
            audio.play()
        }

        prevBtn.onclick = function() {
            if (_this.isShuffle) {
                switch (_this.shuffleSongArray.length ) {
                    case 0:
                        _this.currentIndex = _this.songs.length - 1
                        _this.loadCurrentSong() 
                        break   
                    case 1: 
                        _this.currentIndex = _this.shuffleSongArray[_this.shuffleSongArray.length - 1]  
                        _this.loadCurrentSong()
                        _this.shuffleSongArray.pop()
                        
                        break
                    default:
                        _this.currentIndex = _this.shuffleSongArray[_this.shuffleSongArray.length - 2]  
                        _this.loadCurrentSong()
                        _this.shuffleSongArray.pop()
                }
            } else {
                _this.playPreviousSong()
            }       
            _this.render()
            _this.scrollToActiveView()
            audio.play()
        }

        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            this.classList.toggle('active', _this.isRepeat)
        }

        shuffleBtn.onclick = function() {
            _this.isShuffle = !_this.isShuffle
            _this.setConfig('isShuffle', _this.isShuffle)
            this.classList.toggle('active', _this.isShuffle)
        }

        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
        }

        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
        }

        audio.ontimeupdate = function(e) {
            const value = (audio.currentTime /audio.duration) * 100
            progress.value = value
        }

        progress.onchange = function() {
            const time = (progress.value * audio.duration) / 100
            audio.currentTime = time
        }

        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }
    },

    start: function() {
        // Asign config to app
        this.loadConfig()

        // handle Events
        this.handleEvents()

        // define properties
        this.defineProperties()

        // load current song
        this.loadCurrentSong()

        // render song
        this.render()   

        shuffleBtn.classList.toggle('active', this.isShuffle)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start()