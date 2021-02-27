import axios from 'axios';
import moment from 'moment'

// The openweathermap API does not offer the ability to run 10 days free so I took advantage of another weatherbit service
const key = 'ac5c27d9eca64b668f2dc94f73a57124';

export default{
    namespaced: false,

	state: {
        city: '',
        code: '',
        tenDays: [],
        loader: false,
        noResult: false,
        used: false
    },

	mutations: {
        // Set data in state
        setWeather(state, data){
            if (state.city !== data.city) {
                state.city = data.city;
                state.code = data.code;

                if (data.tenDays.length) {
                    state.tenDays = [];
                }

                data.tenDays.forEach(el => {
                    state.tenDays.push(el);
                });
                state.noResult = false;
                state.used = true;
            }
        },

        setLoader(state) {
            state.loader = true;
        },

        removeLoader(state) {
            state.loader = false;
        },

        noResult(state) {
            state.noResult = true;

            // Turn off error msg after 2s
            setTimeout(() => {
                state.noResult = false;
            }, 2000);
        }
    },

	actions: {
        // Fetch data for desired city
        async getWeather({commit, dispatch}, city){
            return await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}&days=10`).then(res => {
                if (res.status === 200) {
                    const data = res.data.data.map(day => {
                        return {
                            minTemp: Math.round(day.min_temp),
                            maxTemp: Math.round(day.max_temp),
                            avgTemp: Math.round((day.min_temp + day.max_temp) / 2),
                            date: day.datetime,
                            icon: `https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png`
                        }
                    });
                    commit('setWeather', {tenDays: data, city: res.data.city_name, code: res.data.country_code});
                    dispatch('delLoader');
                } else {
                    dispatch('noResults');
                }
            });
        },

        // Add loader
        addLoader({commit}) {
            commit('setLoader');
        },

        // Remove loader
        delLoader({commit}) {
            commit('removeLoader');
        },

        // Show error msg
        noResults({commit, dispatch}) {
            commit('noResult');
            dispatch('delLoader');
        }
    },
    
    getters: {
        // Get average temperature for 10 days
        getAvgTenDays(state) {
            if (state.tenDays.length) {
                return Math.round(state.tenDays.map(day => day.avgTemp).reduce((prev, curr) => (curr += prev)) / 10);
            }
        },

        // Get 7 days from the existed array with 10 days
        getAvgSevenDays(state) {
            if (state.tenDays.length) {
                return state.tenDays.slice(0, 7);
            }
        },

        // Get range for days (1 - 7)
        getSevenDaysRange(state) {
            if (state.tenDays.length) {
                const sevenDays = state.tenDays.slice(0, 7);
    
                const allMonths = sevenDays.map(day => {
                    return moment(day.date).format('MMM');
                });

                const allYear = sevenDays.map(day => {
                    return moment(day.date).format('YYYY');
                })

                let range;

                // Check if it goes from month to month or from year to year in those 7 days
                if (allMonths[0] === allMonths[6]) {
                    if (allYear[0] === allYear[6]) {
                        range = `${allMonths[0]} ${moment(sevenDays[0].date).format('D')} - ${moment(sevenDays[6].date).format('D')} ${allYear[0]}`
                    } else {
                        range = `${allMonths[0]} ${moment(sevenDays[0].date).format('D')} ${allYear[0]} - ${moment(sevenDays[6].date).format('D')} ${allYear[6]}`
                    }
                } else {
                    if (allYear[0] === allYear[6]) {
                        range = `${allMonths[0]} ${moment(sevenDays[0].date).format('D')} - ${allMonths[6]} ${moment(sevenDays[6].date).format('D')} ${allYear[0]}`
                    } else {
                        range = `${allMonths[0]} ${moment(sevenDays[0].date).format('D')} ${allYear[0]} - ${allMonths[6]} ${moment(sevenDays[6].date).format('D')}  ${allYear[6]}`
                    }
                }

                return `${range}`
            }
        },

        // Color change based on temperature
        getTempBackground(state, getters) {
            const colors = {
                '-40': '#102F7E',
                '-30': '#0C8DD6',
                '-20': '#1AA0EC',
                '-10': '#60C6FF',
                '0': '#9bdbff',
                '10': '#b4deda',
                '20': '#ffd66b',
                '30': '#ffc178',
                '40': '#fe9255'
            }

            if (state.tenDays.length) {
                const aroundTemp = (Math.round(getters.getAvgTenDays / 10) * 10);
                return `linear-gradient(145.74deg,#0c8dd6 -33.02%,#b4deda 22.01%,${colors[aroundTemp]} 137.04%)`
            }
        }
    }
};