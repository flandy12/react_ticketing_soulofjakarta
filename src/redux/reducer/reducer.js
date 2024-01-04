const voting = {
    peserta1: 0,
    peserta2: 0,
    peserta3: 0,
  };
  
  const VotingReducer = (state = voting, action) => {
    switch (action.type) {
      case "PESERTA_1":
        return {
          ...state,
          peserta1: state.peserta1 + 1,
          peserta2: state.peserta2,
          peserta3: state.peserta3,
        };
      case "PESERTA_2":
        return {
          ...state,
          peserta1: state.peserta1,
          peserta2: state.peserta2 + 1,
          peserta3: state.peserta3,
        };
      case "PESERTA_3":
        return {
          ...state,
          peserta1: state.peserta1,
          peserta2: state.peserta2,
          peserta3: state.peserta3 + 1,
        };
  
      default:
        return state;
    }
  };
  
  export default VotingReducer;