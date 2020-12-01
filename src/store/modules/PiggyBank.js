import Vue from 'vue';
import PiggyBankCompiledContract from '@/contracts/PiggyBank.json';
import * as constants from '@/store/constants';

const address = '0xe80d764da4AC5e5Cbcb37A92421d7794993E8f2e';

const state = {
  balance: null,
  isOwner: false,
  message: null,
  transactionHash: null,
};

const actions = {
  [constants.PIGGY_BANK_GET_BALANCE]: ({ commit }) => {
    Vue.web3.eth.getBalance(address)
      .then(Vue.web3.utils.fromWei)
      .then(Number)
      .then((balance) => balance.toFixed(4))
      .then((balance) => {
        commit(constants.PIGGY_BANK_SET_PROPERTY, { balance });
      });
  },
  [constants.PIGGY_BANK_GET_OWNER]: ({ commit, rootState }) => {
    const from = rootState.Session.account;
    const piggyBank = new Vue.web3.eth.Contract(PiggyBankCompiledContract.abi, address);
    piggyBank.methods.owner()
      .call()
      .then((owner) => from === owner)
      .then((isOwner) => {
        commit(constants.PIGGY_BANK_SET_PROPERTY, { isOwner });
      });
  },
  [constants.PIGGY_BANK_WITHDRAW]: ({ commit, dispatch, rootState }) => {
    const from = rootState.Session.account;
    const piggyBank = new Vue.web3.eth.Contract(PiggyBankCompiledContract.abi, address);
    const withdraw = piggyBank.methods.withdraw();
    withdraw
      .estimateGas({ from })
      .then((gas) => withdraw.send({
        from,
        gas,
      }))
      .then(({ transactionHash }) => {
        dispatch(constants.PIGGY_BANK_GET_BALANCE);
        dispatch(constants.SESSION_GET_BALANCE);
        commit(constants.PIGGY_BANK_SET_PROPERTY, { transactionHash });
        commit(constants.PIGGY_BANK_SET_PROPERTY, { message: null });
      })
      .catch(({ message }) => {
        commit(constants.PIGGY_BANK_SET_PROPERTY, { transactionHash: null });
        commit(constants.PIGGY_BANK_SET_PROPERTY, { message });
      });
  },
  [constants.PIGGY_BANK_DEPOSIT]: ({ commit, dispatch, rootState }, { amount, msg }) => {
    const from = rootState.Session.account;
    const value = Vue.web3.utils.toWei(amount);
    const piggyBank = new Vue.web3.eth.Contract(PiggyBankCompiledContract.abi, address);
    const deposit = piggyBank.methods.deposit(msg);
    deposit
      .estimateGas({
        from,
        value,
      })
      .then((gas) => deposit.send({
        from,
        value,
        gas,
      }))
      .then(({ transactionHash }) => {
        dispatch(constants.PIGGY_BANK_GET_BALANCE);
        dispatch(constants.SESSION_GET_BALANCE);
        commit(constants.PIGGY_BANK_SET_PROPERTY, { transactionHash });
        commit(constants.PIGGY_BANK_SET_PROPERTY, { message: null });
      })
      .catch(({ message }) => {
        commit(constants.PIGGY_BANK_SET_PROPERTY, { transactionHash: null });
        commit(constants.PIGGY_BANK_SET_PROPERTY, { message });
      });
  },
};

const mutations = {
  // eslint-disable-next-line no-shadow
  [constants.PIGGY_BANK_SET_PROPERTY]: (state, data) => {
    const [[property, value]] = Object.entries(data);
    state[property] = value;
  },
};

const getters = {};

export default {
  state,
  actions,
  mutations,
  getters,
};
