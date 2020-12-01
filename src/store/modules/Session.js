import Vue from 'vue';
import * as constants from '@/store/constants';

const state = {
  account: null,
  balance: null,
};

const actions = {
  [constants.SESSION_CONNECT_TO_WEB3]: ({ commit, dispatch }) => {
    Vue.web3.eth.getAccounts()
      .then(([account]) => {
        commit(constants.SESSION_SET_PROPERTY, { account });
        dispatch(constants.SESSION_GET_BALANCE);
        dispatch(constants.PIGGY_BANK_GET_BALANCE);
      });
  },
  // eslint-disable-next-line no-shadow
  [constants.SESSION_GET_BALANCE]: ({ commit, state }) => {
    Vue.web3.eth.getBalance(state.account)
      .then(Vue.web3.utils.fromWei)
      .then(Number)
      .then((balance) => balance.toFixed(4))
      .then((balance) => {
        commit(constants.SESSION_SET_PROPERTY, { balance });
      });
  },
};

const mutations = {
  // eslint-disable-next-line no-shadow
  [constants.SESSION_SET_PROPERTY]: (state, data) => {
    const [[property, value]] = Object.entries(data);
    state[property] = value;
  },
};

const getters = {
  // eslint-disable-next-line no-shadow
  [constants.SESSION_IS_LOGGED]: (state) => !!state.account,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
