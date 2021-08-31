export const initialState = {
    sidebarStatus: false,
    postModalStatus: false,
    isChangeAvatar: false,
    user: null,
}

export const actionTypes = {
    TOGGLE_SIDEBAR: "TOGGLE_SIDEBAR",
    TOGGLE_POSTMODAL: "TOGGLE_POSTMODAL",
    TOGGLE_CHANGE_AVATAR: "TOGGLE_CHANGE_AVATAR",
    CHANGE_AVATAR: "CHANGE_AVATAR",
    SET_USER: "SET_USER",
}

const reducer = (state, action) => {
    console.log(action);
    switch (action.type) {
        case actionTypes.TOGGLE_SIDEBAR:
            return {
                ...state,
                sidebarStatus: action.sidebarStatus,
            };
        case actionTypes.TOGGLE_POSTMODAL:
            return {
                ...state,
                postModalStatus: action.postModalStatus,
            };
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.user,
            };
        case actionTypes.TOGGLE_CHANGE_AVATAR:
            return {
                ...state,
                isChangeAvatar: action.isChangeAvatar,
            }
        default:
            return state;
    }
};

export default reducer