import axios from 'axios';

export default{
    namespaced: false,

	state: {
        countries: [],
        isLoaded: false
    },

	mutations: {
        // Set data in state
        setCountries(state, data){
            data.forEach(el => {
                state.countries.push(el);
            });
            state.isLoaded = true;
        }
    },

	actions: {
        // Fetch all countries
        async getCountries({commit}){
            return await axios.get('https://restcountries.eu/rest/v2/all').then(res => {
                const data = res.data.map(({name, alpha2Code, flag}) => ({name, alpha2Code, flag}));
                commit('setCountries', data);
                return res;
            });
        },
    },
    
    getters: {
        
    }
};