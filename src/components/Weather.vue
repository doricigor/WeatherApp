<template>
    <div class="weather">
        <div class="weather__search-wrap">
            <div class="weather__search-img-wrap">
                <img class="weather__search-img" src="../assets/images/cloud.png" alt="cloud">
            </div>
            <div class="weather__search-select">
                <cool-select
                    v-model="countryName"
                    :items="countries"
                    :placeholder="countryName ? '': 'Country'"
                    item-value="name"
                    item-text="name"
                    >
                    <template slot="item" slot-scope="{ item: country }">
                        <div class="weather__search-select-item">
                            <img class="weather__search-select-item-img" :src="country.flag" />
                            <div>
                                <p class="weather__search-select-item-code">{{ country.alpha2Code }}</p>
                            </div>
                        </div>
                    </template>
                    <template slot="selection" slot-scope="{ item: country }">
                        <img class="weather__search-select-item-img" :src="country.flag" />
                        <div class="weather__search-select-item">
                            <p class="weather__search-select-item-code">{{ country.alpha2Code }}</p>
                            <img class="weather__search-select-item-icon" src="../assets/images/arrow-down.png" />
                        </div>
                    </template>
                </cool-select>
            </div>
            <form class="weather__search-form" @submit.prevent="search">
                <div class="weather__search">
                    <input class="weather__search-input" type="text" placeholder="Please enter your location..." required="required" v-model="city">
                    <img class="weather__search-icon" src="../assets/images/search.png" alt="search" @click="search" v-if="!loader">
                    <img class="weather__search-icon weather__search-icon--loader" src="../assets/images/loader.png" alt="loader" v-else>
                </div>
            </form>
        </div>
        <transition name="fade-in">
            <div class="weather__results-wrap" v-if="avgTenDays">
                <div class="weather__results-top">
                    <span class="weather__results-top-date">{{SevenDaysRange}}</span>
                    <p class="weather__results-top-temp" v-if="avgTenDays">{{avgTenDays}} <sup>°C</sup></p>
                </div>
                <div class="weather__results-bottom">
                    <div class="weather__results-bottom-day" v-for="(day, index) in AvgSevenDays" :key="index">
                        <span class="weather__results-bottom-day-title" v-if="!mobileVersion">{{day.date | moment('dddd')}}</span>
                        <span class="weather__results-bottom-day-title" v-else>{{day.date | moment('ddd')}}</span>
                        <img class="weather__results-bottom-day-icon" :src="day.icon" alt="icon">
                        <p class="weather__results-bottom-day-temp">{{day.avgTemp}} <sup>°C</sup></p>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { CoolSelect } from 'vue-cool-select';
    import 'vue-cool-select/dist/themes/bootstrap.css';

    export default {
        data() {
            return {
                city: '',
                countryName: '',
                loading: false,
                innerWidth: 0,
                mobileVersion: false,
            }
        },

        components: {
            CoolSelect
        },

        methods: {
            search() {
                if (this.city.toLowerCase() != this.curCity.toLowerCase()) {
                    this.$store.dispatch('getWeather', this.city);
                    this.$store.dispatch('addLoader');
                }
            },

            handleResize() {
                this.innerWidth = window.innerWidth;
            },
        },

        computed:{
            ...mapState({
                countries: state => state.Countries.countries,
                loader: state => state.Weather.loader,
                curCity: state => state.Weather.city,
            }),

            avgTenDays() {
                return this.$store.getters.getAvgTenDays;
            },

            AvgSevenDays() {
                return this.$store.getters.getAvgSevenDays;
            },

            SevenDaysRange() {
                return this.$store.getters.getSevenDaysRange;
            }
        },

        watch: {
            innerWidth(newWidth) {
                this.mobileVersion = newWidth < 700;
            },
        },

        beforeMount() {
            window.addEventListener('resize', this.handleResize);

            this.handleResize();
        },

        destroyed() {
            window.removeEventListener('resize', this.handleResize);
        }
    }
</script>

<style lang="scss" scoped>
    .weather {
        max-width: 1100px;
        width: 100%;
        padding: 15px;
    }

    .weather__search-wrap {
        display: flex;
        align-items: center;
        background-color: #fff;
        box-shadow: 0px 6px 12px rgba(14, 32, 86, .15);
        border-radius: 15px;
        padding: 20px;
        max-width: 620px;
        margin: 0 auto;

        @media screen and (max-width: 700px) {
            max-width: 500px;
        };

        @media screen and (max-width: 550px) {
            flex-wrap: wrap;
        };
    }

    .weather__search-img-wrap {
        max-width: 50px;
        max-height: 50px;
        width: 100%;
        height: 100%;
        margin-right: 10px;
    }

    .weather__search-img {
        max-height: 100%;
        max-width: 100%;
        width: 100%;
    }

    .weather__search-select {
        max-width: 95px;
        position: relative;
        max-height: 50px;
        margin-right: 10px;
        width: 100%;

        @media screen and (max-width: 550px) {
            max-width: calc(100% - 60px);
            margin-right: 0;
        };
    }

    .weather__search-select-item {
        display: flex; 
        align-items: center;
        position: relative;
    }

    .weather__search-select-item-img {
        width: 18px;
        height: 14px;
        border-radius: 3px;
        margin-right: 10px;
        border: 1px solid #000;
    }

    .weather__search-select-item-code {
        font-size: 14px;
        font-weight: 600;
        color: #08153e;
        margin: 0;
    }

    .weather__search-select-item-icon {
        width: 25px;
        height: 25px;
        position: absolute;
        right: -26px;
        top: 50%;
        transform: translateY(-50%);
    }

    .weather__search-form {
        @media screen and (max-width: 550px) {
            max-width: 100%;
            width: 100%;
            margin-top: 20px;
        };
    }

    .weather__search {
        width: 415px;
        min-height: 50px;
        background-color: #fff;
        border: 1px solid rgba(13, 29, 80, 0.05);
        border-radius: 6px;
        position: relative;
        transition: 350ms ease;

        &:hover {
            border: 1px solid #acc0fa;
        }

        &:focus-within {
            border: 1px solid #acc0fa;

            .weather__search-icon {
                opacity: 1;
            }
        }

        &:focus {
            outline: none;
            border: 1px solid #acc0fa;

            .weather__search-input {
                color: #0d1d53;
            }

            .weather__search-icon {
                opacity: 1;
            }
        }

        @media screen and (max-width: 700px) {
            width: 290px;
        };

        @media screen and (max-width: 550px) {
            width: 100%;
            max-width: 100%;
        };
    }

    .weather__search-input {
        max-width: 100%;
        width: 100%;
        min-height: 50px;
        max-height: 100%;
        border: none;
        border-radius: 6px;
        padding-right: 50px;
        padding-left: 20px;
        font-size: 15px;

        &::placeholder {
            color: rgba(gray, .6);
        }

        &:focus {
            outline: none;
        }

        @media screen and (max-width: 550px) {
            padding-left: 15px;
        };
    }

    .weather__search-icon {
        position: absolute;
        right: 10px;
        top: 14px;
        width: 25px;
        height: 25px;
        opacity: .6;
        transition: 350ms ease;
        cursor: pointer;
    }

    .weather__search-icon--loader {
        animation: 2s linear infinite spiner;
    }

    .weather__results-wrap {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 262px;
    }

    .weather__results-top {
        margin-top: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;

        @media screen and (max-width: 550px) {
            margin: 30px 0;
        };
    }

    .weather__results-top-date {
        font-size: 13px;
        text-transform: uppercase;
        color: rgba(8, 21, 62, 0.6);
        font-weight: 600;
    }

    .weather__results-top-temp {
        color: #fff;
        font-size: 120px;
        font-weight: 600;
        position: relative;
        margin: 0;

        sup {
            color: #fff;
            font-size: 25px;
            position: absolute;
            right: -28px;
            top: 28px;

            @media screen and (max-width: 550px) {
                right: -35px;
            };
        }

        @media screen and (max-width: 550px) {
            font-size: 100px;
        };
    }

    .weather__results-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 627px;
        width: 100%;
        margin: 0 auto;

        @media screen and (max-width: 700px) {
            max-width: 75%;
            flex-wrap: wrap;
        };

        @media screen and (max-width: 550px) {
            max-width: 90%;
        };

        @media screen and (max-width: 400px) {
            max-width: 95%;
        };

        @media screen and (max-width: 370px) {
            max-width: 100%;
        };
    }

    .weather__results-bottom-day {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .weather__results-bottom-day-title {
        font-size: 12px;
        text-transform: uppercase;
        color: rgba(8, 21, 62, 0.6);
        line-height: 1;
        letter-spacing: .7px;
        font-weight: 600;
        margin-bottom: 10px;
    }

    .weather__results-bottom-day-icon {
        height: 50px;
        width: 50px;

        @media screen and (max-width: 700px) {
            height: 25px;
            width: 25px;
        };
    }

    .weather__results-bottom-day-temp {
        font-size: 23px;
        font-weight: 600;
        color: #fff;
        position: relative;
        margin: 0;
        padding-right: 12px;

        sup {
            font-size: 13px;
            position: absolute;
            right: -4px;
            top: 4px;

            @media screen and (max-width: 700px) {
                right: -17px;
            };

            @media screen and (max-width: 550px) {
                font-size: 11px;
            };

            @media screen and (max-width: 370px) {
                right: -12px;
                top: 2px;
            };
        }

        @media screen and (max-width: 700px) {
            padding: 0;
        };

        @media screen and (max-width: 370px) {
            font-size: 17px;
        };
    }

    // Loader animation
    @keyframes spiner {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    // Fade in animation
    @keyframes fade-in {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    .fade-in-enter-active {
        animation: fade-in 1.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
    }

    .fade-in-leave-to {
        animation: fade-in 0.3s ease alternate-reverse;
    }
</style>

<style lang='scss'>
    // Style for cool select
    .IZ-select__input.IZ-select__input--focused {
        border: 1px solid rgba(13, 29, 80, 0.05);
        border-radius: 6px;
        outline: none;
        box-shadow: none;
    }

    .IZ-select__input {
        border: 1px solid rgba(13, 29, 80, 0.05);
        border-radius: 6px;
        min-height: 50px;

        input {
            &::placeholder {
                font-size: 15px;
                color: rgba(gray, .6);;
            }
        }

        @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
            padding-top: 9px;
        }
    }
</style>